import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JeuDeDonnees } from '@/store/donneesSlice';

interface DataChartsProps {
  data: JeuDeDonnees[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function DataCharts({ data }: DataChartsProps) {
  
  // 1. Calculer les statistiques pour le PieChart (Par Source)
  const sourceStats = useMemo(() => {
    const stats: Record<string, number> = {};
    data.forEach(item => {
      const source = item.source_catalogue || 'Inconnu';
      stats[source] = (stats[source] || 0) + 1;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [data]);

  // 2. Calculer les statistiques pour le BarChart (Top 5 Organisations)
  const orgStats = useMemo(() => {
    const stats: Record<string, number> = {};
    data.forEach(item => {
      // Ignorer les "Organisation non spécifiée" pour ce graphique
      if (item.organisation && item.organisation !== 'Organisation non spécifiée') {
        stats[item.organisation] = (stats[item.organisation] || 0) + 1;
      }
    });
    
    // Convertir en tableau, trier et prendre le top 5
    return Object.entries(stats)
      .map(([name, count]) => ({ name: name.substring(0, 20) + '...', full_name: name, count })) // On tronque le nom pour l'affichage
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data]);

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8">
      {/* Graphique Circulaire */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par Source</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sourceStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} ${((entry.percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sourceStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Graphique à Barres */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Organisations</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orgStats} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} style={{ fontSize: '12px' }} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Legend />
              <Bar dataKey="count" name="Nombre de jeux" fill="#8884d8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}