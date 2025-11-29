import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authentificationSlice';
import dataReducer from './donneesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;