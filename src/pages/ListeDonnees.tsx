import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Import Link pour navigation
import { fetchJeuxDeDonnees } from '@/store/donneesSlice';
import { RootState, AppDispatch } from '@/store/store';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Ajout Button
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye } from 'lucide-react'; // Ajout Eye

export default function DataList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.data);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('all');

  useEffect(() => {
    if (items.length === 0) dispatch(fetchJeuxDeDonnees());
  }, [dispatch, items.length]);

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
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Catalogue de Données</h1>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
            <Input placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
          </div>
          <div className="w-full md:w-1/3">
            <Select value={selectedOrg} onValueChange={setSelectedOrg}>
              <SelectTrigger><SelectValue placeholder="Organisation" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les organisations</SelectItem>
                {uniqueOrganisations.map(org => <SelectItem key={org} value={org}>{org}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center text-sm text-slate-500 ml-auto">{filteredItems.length} résultat(s)</div>
        </div>
      </div>

      {/* Liste */}
      {loading ? <div className="text-center">Chargement...</div> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.slice(0, 50).map((jeu) => (
            <Card key={jeu.id} className="hover:shadow-md transition-shadow h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg leading-tight line-clamp-2" title={jeu.titre}>{jeu.titre}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-sm text-slate-600 mb-2 font-semibold">{jeu.organisation || "Non spécifiée"}</p>
                <p className="text-xs text-slate-500 line-clamp-3 mb-4 flex-grow">
                  {jeu.description || "Pas de description."}
                </p>
                <Link to={`/data/${jeu.id}`} className="mt-auto">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                        <Eye size={14}/> Voir Détails
                    </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}