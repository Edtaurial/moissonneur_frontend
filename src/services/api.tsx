import axios from 'axios';

// L'URL de votre API Django (locale ou Render)
// Pour le développement local, assurez-vous que votre serveur Django tourne sur le port 8000
const API_URL = 'http://127.0.0.1:8000/';  //https://edwin2025.pythonanywhere.com/

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token automatiquement à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;