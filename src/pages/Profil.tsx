import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { User, Mail, Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  
  // États pour les données du formulaire
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '' // Lecture seule
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Charger les infos au montage
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('api/me/');
      setFormData(response.data);
    } catch (error) {
      console.error("Erreur chargement profil:", error);
      setMessage({ type: 'error', text: "Impossible de charger les informations." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // On envoie une requête PATCH pour modifier seulement les champs changés
      await api.patch('api/me/', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email
      });
      setMessage({ type: 'success', text: "Profil mis à jour avec succès !" });
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      setMessage({ type: 'error', text: "Erreur lors de la sauvegarde." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center p-10">Chargement du profil...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex justify-center items-start">
      <Card className="w-full max-w-lg mt-10">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="p-0 h-auto hover:bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
          </div>
          <CardTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6" /> Mon Profil
          </CardTitle>
          <CardDescription>Consultez et modifiez vos informations personnelles.</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            
            {message && (
              <div className={`p-3 rounded-md flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {message.text}
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="username">Nom d'utilisateur (non modifiable)</Label>
              <Input id="username" value={formData.username} disabled className="bg-slate-100" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="first_name">Prénom</Label>
                <Input id="first_name" value={formData.first_name} onChange={handleChange} placeholder="Votre prénom" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="last_name">Nom</Label>
                <Input id="last_name" value={formData.last_name} onChange={handleChange} placeholder="Votre nom" />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Adresse courriel</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                <Input id="email" type="email" value={formData.email} onChange={handleChange} className="pl-8" placeholder="exemple@domaine.com" />
              </div>
            </div>

          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Sauvegarde...' : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Enregistrer
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}