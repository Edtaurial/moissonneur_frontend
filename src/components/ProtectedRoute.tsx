import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const ProtectedRoute = () => {
  // On récupère l'état d'authentification depuis Redux
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Si pas connecté, on redirige vers /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si connecté, on affiche le contenu de la route (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;