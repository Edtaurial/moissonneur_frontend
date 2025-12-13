import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchJeuxDeDonnees } from '@/store/donneesSlice';
import { RootState, AppDispatch } from '@/store/store';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye } from 'lucide-react';

export default function DataList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.data);

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
    <div className="p-8 max-w-7xl mx-auto min-h-screen flex flex-col gap-8">
      
      <h1 className="text-3xl font-bold text-slate-800">Catalogue de Données</h1>

      {/* --- Correction Layout : Utilisation de Grid au lieu de Flex pour un meilleur espacement --- */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Barre de Recherche (prend 5 colonnes) */}
          <div className="relative col-span-1 md:col-span-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
                placeholder="Rechercher par titre..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10" // Plus d'espace pour l'icône
            />
          </div>

          {/* Menu Déroulant (prend 4 colonnes) */}
          <div className="col-span-1 md:col-span-4">
            <Select value={selectedOrg} onValueChange={setSelectedOrg}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Organisation" />
              </SelectTrigger>
              {/* Correction Z-Index : on force le fond blanc et un z-index élevé */}
              <SelectContent className="bg-white z-[100] border-slate-200 shadow-xl max-h-[300px]">
                <SelectItem value="all">Toutes les organisations</SelectItem>
                {uniqueOrganisations.map(org => (
                    <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Compteur (prend 3 colonnes, aligné à droite) */}
          <div className="col-span-1 md:col-span-3 flex justify-end text-sm text-slate-500 font-medium">
            {filteredItems.length} résultat(s)
          </div>
        </div>
      </div>

      {/* Liste */}
      {loading ? <div className="text-center py-10">Chargement...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr z-0">
          {filteredItems.slice(0, 50).map((jeu) => (
            <Card key={jeu.id} className="hover:shadow-md transition-shadow h-full flex flex-col overflow-hidden border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg leading-tight line-clamp-2" title={jeu.titre}>{jeu.titre}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col pt-2">
                <div className="mb-4">
                    <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full font-medium">
                        {jeu.organisation ? jeu.organisation.substring(0, 30) + (jeu.organisation.length > 30 ? '...' : '') : "Non spécifiée"}
                    </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-3 mb-4 flex-grow">
                  {jeu.description || "Pas de description."}
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100">
                    <Link to={`/data/${jeu.id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full gap-2 hover:bg-slate-50 hover:text-blue-600">
                            <Eye size={14}/> Voir Détails
                        </Button>
                    </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}