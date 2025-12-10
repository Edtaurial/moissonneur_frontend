import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Link as LinkIcon, Building } from 'lucide-react';
import { JeuDeDonnees } from '@/store/donneesSlice';

export default function DataDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<JeuDeDonnees | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-8">Chargement...</div>;
  if (!data) return <div className="p-8">Donnée introuvable.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2 pl-0 hover:bg-transparent">
        <ArrowLeft size={16} /> Retour
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{data.titre}</CardTitle>
          <div className="flex items-center text-slate-500 gap-2 mt-2">
            <Building size={16} /> {data.organisation}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{data.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-400"/>
                <span>Créé le : {data.date_creation_source ? new Date(data.date_creation_source).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-400"/>
                <span>Modifié le : {data.date_modification_source ? new Date(data.date_modification_source).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <a href={data.url_source} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <LinkIcon size={16} /> Voir sur la source originale ({data.source_catalogue})
                </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}