import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export interface JeuDeDonnees {
  id: number;
  titre: string;
  description: string;
  organisation: string;
  source_catalogue: string;
  url_source: string;
  date_creation_source: string | null;
  date_modification_source: string | null;
}

interface DataState {
  items: JeuDeDonnees[];
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  items: [],
  loading: false,
  error: null,
};

// action asynchrone pour récupérer les données depuis Django
export const fetchJeuxDeDonnees = createAsyncThunk(
  'data/fetchJeuxDeDonnees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('api/donnees/');
      //console.log("Réponse brute API:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erreur lors de la récupération des données');
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJeuxDeDonnees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJeuxDeDonnees.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchJeuxDeDonnees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dataSlice.reducer;