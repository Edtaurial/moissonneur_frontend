import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJeuxDeDonnees } from '@/store/donneesSlice';
import { RootState, AppDispatch } from '@/store/store';
import DataCharts from '@/components/DataCharts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // NOUVEAU
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // NOUVEAU
import { Download, Search, Filter } from 'lucide-react';
import jsPDF from 'jspdf';

export default function Stats() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.data);
  const statsRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // --- États pour les filtres (Identiques à DataList) ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('all');

  useEffect(() => {
    if (items.length === 0) dispatch(fetchJeuxDeDonnees());
  }, [dispatch, items.length]);

  // --- Logique de Filtrage ---
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const title = item.titre ? item.titre.toLowerCase() : '';
      const matchesSearch = title.includes(searchTerm.toLowerCase());
      const matchesOrg = selectedOrg === 'all' || item.organisation === selectedOrg;
      return matchesSearch && matchesOrg;
    });
  }, [items, searchTerm, selectedOrg]);

  // --- Liste Organisations ---
  const uniqueOrganisations = useMemo(() => {
    const orgs = items
      .map(item => item.organisation)
      .filter((org, index, self) => org && org !== 'Organisation non spécifiée' && self.indexOf(org) === index)
      .sort();
    return orgs;
  }, [items]);

  const handleExportPDF = async () => {
    if (!statsRef.current) return;
    setIsExporting(true);
    try {
      // Wrap content to prevent oklch() CSS parsing errors
      const wrapper = document.createElement('div');
      wrapper.style.backgroundColor = '#ffffff';
      wrapper.innerHTML = statsRef.current.innerHTML;
      
      // Temporarily append to DOM for html2canvas to render
      document.body.appendChild(wrapper);

      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(wrapper, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
      });

      document.body.removeChild(wrapper);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.setFontSize(18);
      pdf.text("Rapport Statistique - Plateforme de Données", 10, 15);
      pdf.setFontSize(10);
      pdf.text(`Généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}`, 10, 22);

      pdf.addImage(imgData, 'PNG', 0, 30, pdfWidth, pdfHeight);
      pdf.save('rapport-statistiques.pdf');
    } catch (error) {
      console.error('Erreur PDF', error);
      alert("Échec de l'export PDF. Consulte la console pour le détail.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Statistiques</h1>
            <p className="text-slate-500">Visualisation interactive des données</p>
        </div>
        <Button
          onClick={handleExportPDF}
          disabled={isExporting || loading}
          className="gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base px-6 py-3 rounded-lg border border-blue-900 shadow
           focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-150 cursor-pointer hover:cursor-pointer"
        >
          <Download size={18} /> {isExporting ? 'Génération...' : 'Exporter le rapport PDF'}
         </Button>
      </div>

      {/* Zone de Filtres */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4 text-slate-700 font-medium">
            <Filter size={20} /> Filtres appliqués aux graphiques
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Recherche */}
          <div className="relative col-span-1 md:col-span-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
                placeholder="Filtrer par mot-clé..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10"
            />
          </div>
          {/* Organisation */}
          <div style={{marginBottom: '100px' }}>
            <Select value={selectedOrg} onValueChange={setSelectedOrg}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Filtrer par Organisation" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                <SelectItem value="all">Toutes les organisations</SelectItem>
                {uniqueOrganisations.map(org => (
                    <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Info */}
          <div className="col-span-1 md:col-span-3 text-right text-sm text-slate-500">
            Base : {filteredItems.length} jeux de données
          </div>
        </div>
      </div>

      {/* Section Statistiques */}
      <div ref={statsRef} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        {loading ? (
            <div className="text-center py-20">Chargement des données...</div>
        ) : (
            // On passe les données filtrees aux graphiques
            <DataCharts data={filteredItems} />
        )}
      </div>
    </div>
  );
}