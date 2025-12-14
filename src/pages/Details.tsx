import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Link as LinkIcon, Building, Download } from 'lucide-react';
import { JeuDeDonnees } from '@/store/donneesSlice';
import jsPDF from 'jspdf';

export default function DataDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<JeuDeDonnees | null>(null);
  const [loading, setLoading] = useState(true);
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`api/donnees/${id}/`);
        setData(response.data);
      } catch (error) {
        console.error("Erreur", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleExportPDF = async () => {
    if (!contentRef.current || !data) return;
    try {
      // Create a style element to override oklch colors with fallbacks
      const styleEl = document.createElement('style');
      styleEl.textContent = `
        * { 
          color: #1f2937 !important; 
          background-color: transparent !important;
          border-color: #e5e7eb !important;
        }
        body { background-color: #ffffff !important; }
      `;
      document.head.appendChild(styleEl);

      // Wrap content to prevent oklch() CSS parsing errors
      const wrapper = document.createElement('div');
      wrapper.style.backgroundColor = '#ffffff';
      wrapper.innerHTML = contentRef.current.innerHTML;
      
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
      document.head.removeChild(styleEl);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // En-tête
      pdf.setFontSize(16);
      pdf.text("Fiche Détail - Jeu de Données", 10, 15);
      pdf.setFontSize(10);
      pdf.text(`Exporté le ${new Date().toLocaleDateString()}`, 10, 22);
      pdf.line(10, 25, pdfWidth - 10, 25);

      // Contenu
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * (pdfWidth - 20)) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 10, 35, pdfWidth - 20, pdfHeight);
      
      pdf.save(`fiche_${data.id}.pdf`);
    } catch (error) {
      console.error('Erreur PDF', error);
      alert("Échec de l'export PDF. Consulte la console pour le détail.");
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;
  if (!data) return <div className="p-8">Donnée introuvable.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 pl-0 hover:bg-transparent">
            <ArrowLeft size={16} /> Retour
        </Button>
        <Button variant="outline" onClick={handleExportPDF} className="gap-2 cursor-pointer hover:cursor-pointer">
            <Download size={16} /> Exporter la fiche
        </Button>
      </div>

      <div ref={contentRef} className="p-2 bg-white">
        <Card className="border-none shadow-none">
            <CardHeader className="px-0">
            <CardTitle className="text-2xl">{data.titre}</CardTitle>
            <div className="flex items-center text-slate-500 gap-2 mt-2">
                <Building size={16} /> {data.organisation}
            </div>
            </CardHeader>
            <CardContent className="space-y-6 px-0">
            <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{data.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400"/>
                    <span>Créé le : {data.date_creation_source ? new Date(data.date_creation_source).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400"/>
                    <span>Modifié le : {data.date_modification_source ? new Date(data.date_modification_source).toLocaleDateString() : 'N/A'}</span>
                </div>
            </div>

            <div className="pt-4">
                <a href={data.url_source} target="_blank" rel="noopener noreferrer" className="no-print">
                    <Button variant="outline" className="gap-2 w-full sm:w-auto">
                        <LinkIcon size={16} /> Voir sur la source originale
                    </Button>
                </a>
            </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}