import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

interface Restaurant {
  id: number;
  nom: string;
  slug: string;
  couleurTheme: string;
  devise: string;
  plan: string;
}

interface User {
  id: number;
  nom: string;
  email: string;
  role: string;
  restaurant_id: number;
  restaurant: Restaurant;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  verifyToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Vérifier le token au chargement
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        const { user: userData, token: authToken } = response.data;
        
        console.log('👤 Utilisateur connecté:', userData);
        console.log('🔑 Token reçu:', authToken ? 'Présent' : 'Absent');
        
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('authToken', authToken);
        
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Erreur de connexion' };
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, error: 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const verifyToken = async (): Promise<void> => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await apiService.verifyToken(token);
      
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        // Token invalide, déconnecter
        logout();
      }
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    verifyToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};