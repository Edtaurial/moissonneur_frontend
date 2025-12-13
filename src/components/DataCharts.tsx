import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JeuDeDonnees } from '@/store/donneesSlice';

interface DataChartsProps {
  data: JeuDeDonnees[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function DataCharts({ data }: DataChartsProps) {
  
  // 1. Répartition par Source (Pie Chart)
  const sourceStats = useMemo(() => {
    const stats: Record<string, number> = {};
    data.forEach(item => {
      const source = item.source_catalogue || 'Inconnu';
      stats[source] = (stats[source] || 0) + 1;
    });
    // On trie pour avoir les plus gros secteurs en premier
    return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  // 2. Top 5 Organisations (Bar Chart)
  const orgStats = useMemo(() => {
    const stats: Record<string, number> = {};
    data.forEach(item => {
      if (item.organisation && item.organisation !== 'Organisation non spécifiée') {
        stats[item.organisation] = (stats[item.organisation] || 0) + 1;
      }
    });
    
    return Object.entries(stats)
      .map(([name, count]) => ({ name: name.substring(0, 20) + '...', full_name: name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data]);

  // 3. Évolution Temporelle (Line Chart) - NOUVEAU
  const timeStats = useMemo(() => {
    const stats: Record<string, number> = {};
    data.forEach(item => {
      if (item.date_creation_source) {
        const year = new Date(item.date_creation_source).getFullYear();
        if (!isNaN(year)) {
            stats[year] = (stats[year] || 0) + 1;
        }
      }
    });

    return Object.entries(stats)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year); // Tri chronologique
  }, [data]);

  return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
        {/* Graphique 1 : Sources */}
        <Card className="shadow-sm">
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
                    label={({ name, percent }) => (percent ?? 0) > 0.05 ? `${((percent ?? 0) * 100).toFixed(0)}%` : ''}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {sourceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
            </CardContent>
        </Card>

        {/* Graphique 2 : Organisations */}
        <Card className="shadow-sm">
            <CardHeader>
            <CardTitle>Top 5 Organisations</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orgStats} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '11px' }} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="count" name="Jeux de données" fill="#0088FE" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
            </CardContent>
        </Card>
        </div>

        {/* Graphique 3 : Évolution Temporelle (Pleine largeur) */}
        <Card className="shadow-sm">
            <CardHeader>
            <CardTitle>Évolution Temporelle des Publications</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="count" name="Nouveaux jeux par an" stroke="#82ca9d" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
  );
}