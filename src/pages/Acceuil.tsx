import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, BarChart3, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-slate-800 mb-6">Bienvenue sur la Plateforme de Données</h1>
      <p className="text-xl text-slate-600 mb-10">
        Explorez, analysez et visualisez les données environnementales moissonnées depuis de multiples sources.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="text-blue-500" /> Explorer les Données
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-slate-600">Accédez à l'intégralité du catalogue de données. Filtrez par organisation, recherchez par mots-clés et consultez les détails.</p>
            <Link to="/data">
              <Button className="gap-2">Consulter le catalogue <ArrowRight size={16} /></Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all border-l-4 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-green-500" /> Analyser les Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-slate-600">Visualisez la répartition des données par source, les principales organisations contributrices et exportez des rapports.</p>
            <Link to="/stats">
              <Button variant="secondary" className="gap-2">Voir les statistiques <ArrowRight size={16} /></Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}