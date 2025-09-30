import axios from 'axios';
import { 
  Restaurant, 
  User, 
  RestaurantStats, 
  TopRestaurant,
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse,
  PaginatedResponse,
  RestaurantAnalytics
} from '../types/admin';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AdminApiService {
  // ===== AUTHENTIFICATION =====
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await api.post('/api/admin/auth/login', { email, password });
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la connexion',
      };
    }
  }

  async verifyToken(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get('/api/admin/auth/verify');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Token invalide',
      };
    }
  }

  // ===== DASHBOARD =====
  async getDashboardStats(): Promise<ApiResponse<RestaurantStats>> {
    try {
      const response = await api.get('/api/admin/dashboard');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement des statistiques',
      };
    }
  }

  async getTopRestaurants(): Promise<ApiResponse<TopRestaurant[]>> {
    try {
      const response = await api.get('/api/admin/dashboard/top-restaurants');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement des top restaurants',
      };
    }
  }

  // ===== RESTAURANTS =====
  async getAllRestaurants(): Promise<ApiResponse<Restaurant[]>> {
    try {
      const response = await api.get('/api/admin/restaurants');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement des restaurants',
      };
    }
  }

  async getRestaurant(id: number): Promise<ApiResponse<Restaurant>> {
    try {
      const response = await api.get(`/api/admin/restaurants/${id}`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement du restaurant',
      };
    }
  }

  async createRestaurant(data: CreateRestaurantRequest): Promise<ApiResponse<Restaurant>> {
    try {
      const response = await api.post('/api/admin/restaurants', data);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création du restaurant',
      };
    }
  }

  async updateRestaurant(id: number, data: UpdateRestaurantRequest): Promise<ApiResponse<Restaurant>> {
    try {
      const response = await api.put(`/api/admin/restaurants/${id}`, data);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du restaurant',
      };
    }
  }

  async toggleRestaurantStatus(id: number, statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU'): Promise<ApiResponse<Restaurant>> {
    try {
      const response = await api.patch(`/api/admin/restaurants/${id}/status`, { statut });
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du changement de statut',
      };
    }
  }

  async deleteRestaurant(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/api/admin/restaurants/${id}`);
      return {
        success: response.data.success,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression du restaurant',
      };
    }
  }

  // ===== UTILISATEURS =====
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await api.get('/api/admin/users');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement des utilisateurs',
      };
    }
  }

  async getUsersByRestaurant(restaurantId: number): Promise<ApiResponse<User[]>> {
    try {
      const response = await api.get(`/api/admin/restaurants/${restaurantId}/users`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement des utilisateurs',
      };
    }
  }

  async createUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      const response = await api.post('/api/admin/users', data);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création de l\'utilisateur',
      };
    }
  }

  async updateUser(id: number, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    try {
      const response = await api.put(`/api/admin/users/${id}`, data);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur',
      };
    }
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/api/admin/users/${id}`);
      return {
        success: response.data.success,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur',
      };
    }
  }

  // ===== ANALYTICS =====
  async getRestaurantAnalytics(restaurantId: number): Promise<ApiResponse<RestaurantAnalytics>> {
    try {
      const response = await api.get(`/api/admin/restaurants/${restaurantId}/analytics`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement des analytics',
      };
    }
  }

  // ===== UTILITAIRES =====
  async checkSlugAvailability(slug: string, excludeId?: number): Promise<ApiResponse<{ available: boolean }>> {
    try {
      const response = await api.get(`/api/admin/restaurants/check-slug/${slug}${excludeId ? `?exclude=${excludeId}` : ''}`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la vérification du slug',
      };
    }
  }
}

export const adminApiService = new AdminApiService();
export default adminApiService;
