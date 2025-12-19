import React, { useState } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Code, Play } from 'lucide-react';

export default function GraphQLExplorer() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
 //requête par défaut 
  const [query, setQuery] = useState(`query {
  allJeuDonnees {
    id
    titre
    organisation
  }
}`);

  const handleFetchGraphQL = async () => {
    setLoading(true);
    setError('');
    setData([]);

    try {
      console.log("Envoi requête GraphQL...");
      
      
      const response = await api.post('graphql/', {
        query: query
      });

      console.log("Réponse GraphQL brute:", response.data);

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      if (response.data.data && response.data.data.allJeuDonnees) {
        setData(response.data.data.allJeuDonnees);
      } else {
        // Cas où la requête est valide mais ne demande pas 'allJeuDonnees'
        throw new Error("Aucune donnée 'allJeuDonnees' trouvée. Vérifiez votre requête.");
      }

    } catch (err: any) {
      console.error("Erreur GraphQL:", err);
      const message = err.response?.data?.error || err.message || "Erreur inconnue";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Explorateur GraphQL</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Colonne Gauche : La Requête */}
        <div className="space-y-4">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="text-purple-500" /> Requête
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* 3. Zone de texte modifiable */}
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-64 bg-slate-950 text-green-400 p-4 rounded-md font-mono text-sm border border-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                spellCheck="false"
              />
              <Button 
                onClick={handleFetchGraphQL} 
                disabled={loading} 
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
              >
                <Play size={16} className="mr-2" /> 
                {loading ? 'Exécution...' : 'Exécuter la requête'}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0" /> 
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* Colonne Droite : Les Résultats */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-slate-700 flex items-center gap-2">
            Résultats 
            {<span className="text-sm font-normal text-slate-500">({data.length} éléments)</span>}
          </h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-0 h-[500px] overflow-hidden flex flex-col">
            
            {data.length === 0 && !loading && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <Play size={48} className="mb-4 opacity-20" />
                <p>Modifiez la requête à gauche et cliquez sur "Exécuter".</p>
              </div>
            )}
            
            {loading && (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            )}

            {data.length > 0 && (
              <div className="overflow-y-auto flex-1 p-2">
                {/* Affichage JSON brut pour supporter n'importe quelle structure de réponse */}
                <pre className="text-xs text-slate-700 p-4 font-mono whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}