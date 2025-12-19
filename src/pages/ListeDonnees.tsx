import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchJeuxDeDonnees } from '@/store/donneesSlice'; // ou donneesSlice selon votre nom de fichier
import { RootState, AppDispatch } from '@/store/store';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react'; // Ajout des flèches

export default function DataList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.data);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('all');
  
  //etats pour la pagination  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24; // nombre de cartes par page

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

  // Réinitialiser la page à 1 quand on filtre
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedOrg]);

  const uniqueOrganisations = useMemo(() => {
    const orgs = items
      .map(item => item.organisation)
      .filter((org, index, self) => org && self.indexOf(org) === index)
      .sort();
    return orgs;
  }, [items]);

  // calculs pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
        window.scrollTo(0, 0); // on remonter en haut de page
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        window.scrollTo(0, 0);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen flex flex-col gap-8">
      
      <h1 className="text-3xl font-bold text-slate-800">Catalogue de Données</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Barre de recherche */}
          <div className="relative col-span-1 md:col-span-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
                placeholder="Rechercher par titre..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10"
            />
          </div>

          {/* Menu deroulant */}
          <div className="col-span-1 md:col-span-4">
            <Select value={selectedOrg} onValueChange={setSelectedOrg}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Organisation" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[100] border-slate-200 shadow-xl max-h-[300px]">
                <SelectItem value="all">Toutes les organisations</SelectItem>
                {uniqueOrganisations.map(org => (
                    <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Compteur global */}
          <div className="col-span-1 md:col-span-3 flex justify-end text-sm text-slate-500 font-medium">
            {filteredItems.length} résultat(s) total
          </div>
        </div>
      </div>

      {/* Liste paginee */}
      {loading ? <div className="text-center py-10">Chargement...</div> : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr z-0">
            {currentItems.map((jeu) => (
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

            {/* controles de pagination */}
            {filteredItems.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-slate-200">
                    <Button 
                        variant="outline" 
                        onClick={prevPage} 
                        disabled={currentPage === 1}
                        className="gap-2"
                    >
                        <ChevronLeft size={16} /> Précédent
                    </Button>
                    
                    <span className="text-sm font-medium text-slate-600">
                        Page {currentPage} sur {totalPages}
                    </span>
                    
                    <Button 
                        variant="outline" 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages}
                        className="gap-2"
                    >
                        Suivant <ChevronRight size={16} />
                    </Button>
                </div>
            )}
        </>
      )}
    </div>
  );
}