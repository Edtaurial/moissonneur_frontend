import axios from 'axios';


const API_URL = 'https://edwin2025.pythonanywhere.com/';  //https://edwin2025.pythonanywhere.com/  http://127.0.0.1:8000/

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// intercepteur pour ajouter le token automatiquement à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// intercepteur de réponse pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Si le token est invalide ou expiré
      console.warn("Session expirée ou token invalide. Déconnexion...");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // On redirige vers la page de connexion
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

export default api;