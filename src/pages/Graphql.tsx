import React, { useState } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Code, Play, FileJson } from 'lucide-react';

export default function GraphQLExplorer() {
  const [data, setData] = useState<any>(null); // 'any' car ça peut être un tableau ou un objet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Requête par défaut
  const [query, setQuery] = useState(`query {
  tousLesJeux(first: 50) {
    id
    titre
    organisation
  }
}`);

  // Exemples de requêtes pour tester rapidement
  const loadPreset = (type: 'list' | 'single' | 'filter') => {
    if (type === 'list') {
      setQuery(`query {
  tousLesJeux(first: 10) {
    id
    titre
  }
}`);
    } else if (type === 'single') {
      setQuery(`query {
  jeuDeDonnees(id: 1) {
    id
    titre
    description
    urlSource
  }
}`);
    } else if (type === 'filter') {
      setQuery(`query {
  tousLesJeux(titreContains: "eau", first: 5) {
    id
    titre
    organisation
  }
}`);
    }
  };

  const handleFetchGraphQL = async () => {
    setLoading(true);
    setError('');
    setData(null);

    try {
      console.log("Envoi requête GraphQL...");
      
      const response = await api.post('graphql/', { query });

      console.log("Réponse brute:", response.data);

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      if (response.data.data) {
        // Logique générique : on prend la première clé de données trouvée
        const keys = Object.keys(response.data.data);
        if (keys.length > 0) {
            setData(response.data.data[keys[0]]);
        } else {
            throw new Error("Réponse vide.");
        }
      } else {
        throw new Error("Structure de réponse invalide.");
      }

    } catch (err: any) {
      console.error("Erreur GraphQL:", err);
      setError(err.response?.data?.error || err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Explorateur GraphQL</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Colonne Gauche : Éditeur */}
        <div className="space-y-4">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Code className="text-purple-500" /> Requête
              </CardTitle>
              {/* Boutons de préréglages */}
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => loadPreset('list')}>Liste (5)</Button>
                <Button variant="outline" size="sm" onClick={() => loadPreset('single')}>Détail (ID 1)</Button>
                <Button variant="outline" size="sm" onClick={() => loadPreset('filter')}>Filtre "eau"</Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-2">
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
            <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200 flex items-center gap-2">
              <AlertCircle size={20} className="shrink-0" /> 
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* Colonne Droite : Résultats JSON */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-slate-700 flex items-center gap-2">
            Résultats
          </h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-0 h-[500px] overflow-hidden flex flex-col relative">
            
            {loading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            )}

            <div className="overflow-y-auto flex-1 p-4 bg-slate-50">
                {data ? (
                    <pre className="text-xs text-slate-800 font-mono whitespace-pre-wrap">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <FileJson size={48} className="mb-4 opacity-20" />
                        <p>Le résultat JSON s'affichera ici.</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}