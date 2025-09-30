import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Restaurant } from '../types/admin';
import { adminApiService } from '../services/adminApi';
import toast from 'react-hot-toast';

interface AdminState {
  user: User | null;
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
}

type AdminAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_RESTAURANTS'; payload: Restaurant[] }
  | { type: 'ADD_RESTAURANT'; payload: Restaurant }
  | { type: 'UPDATE_RESTAURANT'; payload: Restaurant }
  | { type: 'REMOVE_RESTAURANT'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

const initialState: AdminState = {
  user: null,
  restaurants: [],
  loading: false,
  error: null,
};

const adminReducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_RESTAURANTS':
      return { ...state, restaurants: action.payload };
    case 'ADD_RESTAURANT':
      return { ...state, restaurants: [...state.restaurants, action.payload] };
    case 'UPDATE_RESTAURANT':
      return {
        ...state,
        restaurants: state.restaurants.map(restaurant =>
          restaurant.id === action.payload.id ? action.payload : restaurant
        ),
      };
    case 'REMOVE_RESTAURANT':
      return {
        ...state,
        restaurants: state.restaurants.filter(restaurant => restaurant.id !== action.payload),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
};

interface AdminContextType {
  state: AdminState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loadRestaurants: () => Promise<void>;
  createRestaurant: (data: any) => Promise<boolean>;
  updateRestaurant: (id: number, data: any) => Promise<boolean>;
  deleteRestaurant: (id: number) => Promise<boolean>;
  toggleRestaurantStatus: (id: number, statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU') => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyAuth();
    }
  }, []);

  const verifyAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await adminApiService.verifyToken();
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_USER', payload: response.data });
        await loadRestaurants();
      } else {
        localStorage.removeItem('adminToken');
        dispatch({ type: 'SET_USER', payload: null });
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
      dispatch({ type: 'SET_USER', payload: null });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await adminApiService.login(email, password);
      
      if (response.success && response.data) {
        localStorage.setItem('adminToken', response.data.token);
        dispatch({ type: 'SET_USER', payload: response.data.user });
        await loadRestaurants();
        toast.success('Connexion réussie !');
        return true;
      } else {
        toast.error(response.error || 'Erreur de connexion');
        return false;
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    dispatch({ type: 'LOGOUT' });
    toast.success('Déconnexion réussie');
  };

  const loadRestaurants = async (): Promise<void> => {
    try {
      const response = await adminApiService.getAllRestaurants();
      if (response.success && response.data) {
        dispatch({ type: 'SET_RESTAURANTS', payload: response.data });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des restaurants:', error);
    }
  };

  const createRestaurant = async (data: any): Promise<boolean> => {
    try {
      const response = await adminApiService.createRestaurant(data);
      if (response.success && response.data) {
        dispatch({ type: 'ADD_RESTAURANT', payload: response.data });
        toast.success('Restaurant créé avec succès !');
        return true;
      } else {
        toast.error(response.error || 'Erreur lors de la création');
        return false;
      }
    } catch (error) {
      toast.error('Erreur lors de la création du restaurant');
      return false;
    }
  };

  const updateRestaurant = async (id: number, data: any): Promise<boolean> => {
    try {
      const response = await adminApiService.updateRestaurant(id, data);
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_RESTAURANT', payload: response.data });
        toast.success('Restaurant mis à jour avec succès !');
        return true;
      } else {
        toast.error(response.error || 'Erreur lors de la mise à jour');
        return false;
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du restaurant');
      return false;
    }
  };

  const deleteRestaurant = async (id: number): Promise<boolean> => {
    try {
      const response = await adminApiService.deleteRestaurant(id);
      if (response.success) {
        dispatch({ type: 'REMOVE_RESTAURANT', payload: id });
        toast.success('Restaurant supprimé avec succès !');
        return true;
      } else {
        toast.error(response.error || 'Erreur lors de la suppression');
        return false;
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression du restaurant');
      return false;
    }
  };

  const toggleRestaurantStatus = async (id: number, statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU'): Promise<boolean> => {
    try {
      const response = await adminApiService.toggleRestaurantStatus(id, statut);
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_RESTAURANT', payload: response.data });
        const statusText = statut === 'ACTIF' ? 'activé' : statut === 'INACTIF' ? 'désactivé' : 'suspendu';
        toast.success(`Restaurant ${statusText} avec succès !`);
        return true;
      } else {
        toast.error(response.error || 'Erreur lors du changement de statut');
        return false;
      }
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
      return false;
    }
  };

  const value: AdminContextType = {
    state,
    login,
    logout,
    loadRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    toggleRestaurantStatus,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
