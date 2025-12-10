import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJeuxDeDonnees } from '@/store/donneesSlice';
import { RootState, AppDispatch } from '@/store/store';
import DataCharts from '@/components/DataCharts';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Stats() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.data);
  const statsRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (items.length === 0) dispatch(fetchJeuxDeDonnees());
  }, [dispatch, items.length]);

  const handleExportPDF = async () => {
    if (!statsRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(statsRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save('rapport-statistiques.pdf');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Statistiques & Rapports</h1>
        <Button onClick={handleExportPDF} disabled={isExporting || loading} className="gap-2">
            <Download size={16} /> {isExporting ? 'Génération...' : 'Exporter PDF'}
        </Button>
      </div>

      <div ref={statsRef} className="bg-slate-50 p-4">
        {loading ? <div>Chargement...</div> : <DataCharts data={items} />}
      </div>
    </div>
  );
}