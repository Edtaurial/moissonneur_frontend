import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authentificationSlice';
import api from '../services/api';

// Imports ShadCN (vérifie les chemins si tes composants sont ailleurs)
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertCircle } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Tente de se connecter à l'API Django
      // Assure-toi que ton backend tourne sur le port 8000
      const response = await api.post('api/token-auth/', { 
        username, 
        password 
      });

      // Si succès, on récupère le token
      const { token } = response.data;
      
      // On met à jour Redux
      dispatch(login({ token, user: username }));
      
      // On redirige vers le Dashboard
      navigate('/dashboard');

    } catch (err: any) {
      console.error("Erreur Login:", err?.response?.status, err?.response?.data || err.message, err);
      const serverMessage = err?.response?.data?.detail || err?.response?.data || err.message;
      setError(typeof serverMessage === 'string' ? serverMessage : 'Identifiants incorrects ou erreur serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <CardDescription>Accédez à votre espace de données.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              {/* Affichage de l'erreur */}
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input 
                  id="username" 
                  placeholder="Ex: admin"
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Mot de passe</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" type="button" onClick={() => {setUsername(''); setPassword('')}}>
              Effacer
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}