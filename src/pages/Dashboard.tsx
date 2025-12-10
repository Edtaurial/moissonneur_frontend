import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/authentificationSlice';
import { fetchJeuxDeDonnees } from '@/store/donneesSlice';
import { RootState, AppDispatch } from '@/store/store';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, User } from 'lucide-react'; // Import icône Download
import DataCharts from '@/components/DataCharts';

// Imports pour le PDF
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Référence pour capturer le contenu du dashboard
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { items, loading, error } = useSelector((state: RootState) => state.data);

  // --- États pour les filtres ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [isExporting, setIsExporting] = useState(false); // État pour le chargement du bouton export

  useEffect(() => {
    dispatch(fetchJeuxDeDonnees());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // --- Fonction d'Exportation PDF ---
  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);

    try {
      const element = dashboardRef.current;
      
      // Capture du DOM en image
      const canvas = await html2canvas(element, {
        scale: 2, // Meilleure résolution
        useCORS: true, // Pour gérer les images externes si besoin
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Création du PDF (A4, portrait)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calcul des dimensions pour que l'image tienne dans le PDF
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10; // Marge haute

      // Ajout de l'image au PDF
      // Note: Si le contenu est très long, il faudrait gérer plusieurs pages, 
      // mais pour ce TP, une capture simple "fit-to-page" suffit souvent.
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      pdf.save('rapport-dashboard.pdf');

    } catch (err) {
      console.error("Erreur lors de l'export PDF:", err);
      alert("Une erreur est survenue lors de l'exportation.");
    } finally {
      setIsExporting(false);
    }
  };

  // --- Logique de Filtrage (inchangée) ---
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const title = item.titre ? item.titre.toLowerCase() : '';
      const matchesSearch = title.includes(searchTerm.toLowerCase());
      const matchesOrg = selectedOrg === 'all' || item.organisation === selectedOrg;
      return matchesSearch && matchesOrg;
    });
  }, [items, searchTerm, selectedOrg]);

  const uniqueOrganisations = useMemo(() => {
    const orgs = items
      .map(item => item.organisation)
      .filter((org, index, self) => org && org !== 'Organisation non spécifiée' && self.indexOf(org) === index)
      .sort();
    return orgs;
  }, [items]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête avec Boutons */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Tableau de Bord</h1>
            <p className="text-slate-500 mt-1">Bienvenue, {user}</p>
          </div>
          <div className="flex gap-2">
            {/* Bouton Profil */}
            <Button 
                variant="secondary" 
                onClick={() => navigate('/profil')}
                className="gap-2"
            >
                <User size={16} /> {/* Importez User depuis 'lucide-react' */}
                Mon Profil
            </Button>
            
            {/* Bouton Export PDF */}
            <Button 
                variant="outline" 
                onClick={handleExportPDF} 
                disabled={isExporting || loading}
                className="gap-2"
            >
                <Download size={16} />
                {isExporting ? 'Génération...' : 'Exporter PDF'}
            </Button>
            
            <Button variant="destructive" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </header>

        {/* --- Contenu à capturer pour le PDF --- */}
        {/* On ajoute la ref ici pour capturer tout ce qui est en dessous du header */}
        <div ref={dashboardRef} className="bg-slate-50 p-1"> {/* p-1 pour éviter les marges coupées */}

            {loading && <div className="text-center py-8">Chargement des données...</div>}
            {error && <div className="text-center py-8 text-red-500">Erreur: {error}</div>}

            {!loading && !error && (
            <>
                {/* Filtres (On peut choisir de les masquer pour le PDF si on veut, mais ici on capture tout) */}
                {/* Pour éviter que les filtres apparaissent mochement sur le PDF, on pourrait utiliser une classe 'no-print' */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-slate-200">
                <h2 className="text-lg font-semibold mb-4 text-slate-700">Filtres</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Rechercher par titre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                    </div>
                    <div className="w-full md:w-1/3">
                    <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                        <SelectTrigger>
                        <SelectValue placeholder="Filtrer par Organisation" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">Toutes les organisations</SelectItem>
                        {uniqueOrganisations.map((org) => (
                            <SelectItem key={org} value={org}>
                            {org}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 ml-auto">
                    {filteredItems.length} résultat(s)
                    </div>
                </div>
                </div>

                {/* Graphiques */}
                <DataCharts data={filteredItems} />

                <h2 className="text-2xl font-bold text-slate-800 mb-4 mt-8">Liste des Données</h2>
                
                {/* Liste */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((jeu) => (
                    <Card key={jeu.id} className="hover:shadow-md transition-shadow h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg leading-tight line-clamp-2" title={jeu.titre}>
                        {jeu.titre}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-slate-600 mb-2">
                        <span className="font-semibold">Organisation:</span> {jeu.organisation || "Non spécifiée"}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-3">
                        {jeu.description || "Pas de description disponible."}
                        </p>
                    </CardContent>
                    </Card>
                ))}
                
                {filteredItems.length === 0 && (
                    <div className="col-span-full text-center text-slate-500 py-12 bg-white rounded-lg border border-dashed">
                        Aucun résultat ne correspond à vos filtres.
                    </div>
                )}
                </div>
            </>
            )}
        </div>
      </div>
    </div>
  );
}