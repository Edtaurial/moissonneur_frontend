import axios from 'axios';


const API_URL = 'https://edwin2025.pythonanywhere.com/';  //https://edwin2025.pythonanywhere.com/

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

export default api;