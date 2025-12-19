import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { User, Mail, Save, ArrowLeft, AlertCircle, CheckCircle, Lock } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',       
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('api/me/');
      // On ne remplit pas les champs mot de passe a la lecture
      setFormData(prev => ({ ...prev, ...response.data, password: '', confirmPassword: '' }));
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
    setMessage(null);

    // validation du mot de passe
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: "Les nouveaux mots de passe ne correspondent pas." });
      return;
    }

    setSaving(true);

    try {
      // on prépare l'objet à envoyer
      const dataToSend: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email
      };

      // on ajoute le mot de passe seulement s'il a été rempli
      if (formData.password) {
        dataToSend.password = formData.password;
      }

      await api.patch('api/me/', dataToSend);
      
      setMessage({ type: 'success', text: "Profil mis à jour avec succès !" });
      
      // on vide les champs mot de passe après succès
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));

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
      <Card className="w-full max-w-lg mt-10 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="p-0 h-auto hover:bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
          </div>
          <CardTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" /> Mon Profil
          </CardTitle>
          <CardDescription>Consultez et modifiez vos informations personnelles.</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            
            {message && (
              <div className={`p-3 rounded-md flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {message.text}
              </div>
            )}

            {/* Informations de base */}
            <div className="space-y-4 border-b pb-4">
                <h3 className="font-medium text-slate-700">Informations générales</h3>
                <div className="space-y-1">
                <Label htmlFor="username">Nom d'utilisateur (non modifiable)</Label>
                <Input id="username" value={formData.username} disabled className="bg-slate-100 text-slate-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="first_name">Prénom</Label>
                    <Input id="first_name" value={formData.first_name} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="last_name">Nom</Label>
                    <Input id="last_name" value={formData.last_name} onChange={handleChange} />
                </div>
                </div>

                <div className="space-y-1">
                <Label htmlFor="email">Adresse courriel</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} className="pl-9" />
                </div>
                </div>
            </div>

            {/* Section Sécurité (Mot de passe) */}
            <div className="space-y-4">
                <h3 className="font-medium text-slate-700 flex items-center gap-2">
                    <Lock size={16} /> Sécurité
                </h3>
                <p className="text-xs text-slate-500">Laissez vide si vous ne souhaitez pas changer de mot de passe.</p>
                
                <div className="space-y-1">
                    <Label htmlFor="password">Nouveau mot de passe</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder="••••••••"
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        placeholder="••••••••"
                    />
                </div>
            </div>

          </CardContent>
          
          <CardFooter className="flex justify-end pt-2">
            <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? 'Sauvegarde...' : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Enregistrer les modifications
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}