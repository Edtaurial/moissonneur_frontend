import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JeuDeDonnees } from '@/store/donneesSlice';

interface DataChartsProps {
  data: JeuDeDonnees[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

export default function DataCharts({ data }: DataChartsProps) {
  
  // 1. Analyse par domaines thematiques
  const categoryStats = useMemo(() => {
    const categories: Record<string, string[]> = {
      'Climat': ['climat', 'climate', 'temp', 'precipitation', 'weather', 'météo', 'meteo', 'wind', 'vent', 'air', 'atmosph'],
      'Hydrologie': ['hydrolog', 'river', 'rivière', 'riviere', 'lake', 'lac', 'stream', 'ruisseau', 'flow', 'débit', 'debit', 'water level', 'niveau d\'eau', 'bassin', 'watershed'],
      'Qualité Eau': ['quality', 'qualité', 'pollution', 'nutrient', 'nutriment', 'contaminant', 'chemistry', 'chimie', 'ph ', 'oxygen', 'oxygene', 'turbidit', 'eutrophi'],
      'Cryosphère': ['ice', 'glace', 'snow', 'neige', 'permafrost', 'gélisol', 'frozen', 'gel', 'cryo', 'glacier'],
      'Océan': ['ocean', 'océan', 'sea', 'mer', 'marine', 'coastal', 'côtier', 'cotier', 'tide', 'marée', 'salinity', 'salinité', 'offshore'],
      'Stations': ['station', 'sensor', 'capteur', 'observatory', 'observatoire', 'network', 'réseau', 'buoy', 'bouée', 'mooring', 'mouillage'],
      'Géospatial': ['spatial', 'geospatial', 'géospatial', 'gis', 'sig', 'map', 'carte', 'atlas', 'shapefile', 'raster', 'vector']
    };

    const stats: Record<string, number> = {
      'Climat': 0, 'Hydrologie': 0, 'Qualité Eau': 0, 'Cryosphère': 0, 
      'Océan': 0, 'Stations': 0, 'Géospatial': 0, 'Autre': 0
    };

    data.forEach(item => {
      if (!item.titre) return;
      const titleLower = item.titre.toLowerCase();
      let matched = false;

      for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => titleLower.includes(keyword))) {
          stats[category]++;
          matched = true;
        }
      }
      if (!matched) stats['Autre']++;
    });

    return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [data]);

  // 2. top 5 organisations 
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

  // 3. evolution temporelle (Line Chart)
  const timeStats = useMemo(() => {
    const stats: Record<string, number> = {};
    data.forEach(item => {
      if (item.date_creation_source) {
        const year = new Date(item.date_creation_source).getFullYear();
        if (!isNaN(year) && year > 1900 && year <= new Date().getFullYear()) {
            stats[year] = (stats[year] || 0) + 1;
        }
      }
    });
    return Object.entries(stats)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year);
  }, [data]);

  // 4. saisonnalite des publications 
  const seasonStats = useMemo(() => {
    // Initialisation
    const stats = { 'Hiver': 0, 'Printemps': 0, 'Été': 0, 'Automne': 0 };
    
    data.forEach(item => {
      if (item.date_creation_source) {
        const date = new Date(item.date_creation_source);
        const month = date.getMonth(); // 0 (Janvier) à 11 (Décembre)
        
        // Découpage saisons (Approximatif Hémisphère Nord)
        // Hiver : Dec, Jan, Fev
        if (month === 11 || month === 0 || month === 1) stats['Hiver']++;
        // Printemps : Mars, Avril, Mai
        else if (month >= 2 && month <= 4) stats['Printemps']++;
        // Été : Juin, Juil, Août
        else if (month >= 5 && month <= 7) stats['Été']++;
        // Automne : Sept, Oct, Nov
        else stats['Automne']++;
      }
    });

    return [
      { subject: 'Hiver', A: stats['Hiver'], fullMark: 150 },
      { subject: 'Printemps', A: stats['Printemps'], fullMark: 150 },
      { subject: 'Été', A: stats['Été'], fullMark: 150 },
      { subject: 'Automne', A: stats['Automne'], fullMark: 150 },
    ];
  }, [data]);

  return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            {/* Graphique 1 : Répartition Thématique */}
            <Card className="shadow-sm">
                <CardHeader>
                <CardTitle>Répartition Thématique</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 40, left: 40, bottom: 0 }}>
                    <Pie
                        data={categoryStats}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => (percent ?? 0) > 0.01 ? `${name} (${((percent ?? 0) * 100).toFixed(0)}%)` : ''}
                        outerRadius={65}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [value, `${props.payload.name}`]} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
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
                    <BarChart data={orgStats} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} style={{ fontSize: '11px' }} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="count" name="Jeux de données" fill="#0088FE" radius={[0, 4, 4, 0]} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    </BarChart>
                </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            {/* Graphique 3 : Évolution Temporelle  */}
            <Card className="shadow-sm">
                <CardHeader>
                <CardTitle>Historique des Publications</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="count" name="Nouveaux jeux" stroke="#82ca9d" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Graphique 4 : Saisonnalité */}
            <Card className="shadow-sm">
                <CardHeader>
                <CardTitle>Saisonnalité des Publications</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={seasonStats}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis />
                        <Radar
                            name="Jeux publiés"
                            dataKey="A"
                            stroke="#752cc9ff"
                            fill="#752cc9ff"
                            fillOpacity={0.6}
                        />
                        <Tooltip />
                        <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                    </RadarChart>
                </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}