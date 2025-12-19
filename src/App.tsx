import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import GraphQL from './pages/Graphql';
import Connexion from './pages/Connexion';
import Home from './pages/Acceuil';
import DataList from './pages/ListeDonnees';
import DataDetails from './pages/Details';
import Stats from './pages/Statistiques';
import Profile from './pages/Profil';
import Inscription from './pages/inscription';


const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/*routes publiques*/}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />

        {/*routes protégées connexion requise*/}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Accueil */}
            <Route path="/home" element={<Home />} />
            
            {/* Catalogue de données */}
            <Route path="/data" element={<DataList />} />
            
            {/* Détails d'une donnée  */}
            <Route path="/data/:id" element={<DataDetails />} />
            
            {/* Statistiques et Rapports */}
            <Route path="/stats" element={<Stats />} />
            
            {/* Profil Utilisateur */}
            <Route path="/profil" element={<Profile />} />
            <Route path="/graphql" element={<GraphQL />} />
            
            {/* Redirections pour les anciennes routes ou la racine */}
            <Route path="/dashboard" element={<Navigate to="/home" replace />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            
          </Route>
        </Route>

        {/* Route par défaut : redirige vers le login si url est inconnue */}
        <Route path="*" element={<Navigate to="/connexion" replace />} />
      </Routes>
    </Router>
  );
}

export default App;