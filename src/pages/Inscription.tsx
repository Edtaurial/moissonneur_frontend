import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function Inscription() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await api.post('api/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      // Redirection vers le login après succès
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors de l'inscription. Vérifiez les données.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>Inscription</CardTitle>
          <CardDescription>Créez votre compte pour accéder à la plateforme.</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}
            
            <div className="space-y-1">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input id="username" value={formData.username} onChange={handleChange} required className="h-10" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Courriel</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} required className="h-10" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleChange} required className="h-10" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="h-10" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full cursor-pointer hover:cursor-pointer" disabled={loading}>
              {loading ? 'Création...' : "S'inscrire"}
            </Button>
            <div className="text-sm text-center text-slate-500">
              Déjà un compte ? <Link to="/login" className="text-blue-600 hover:underline">Se connecter</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}