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

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
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
      const response = await api.post('/admin/auth/login', { email, password });
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
      const response = await api.get('/admin/auth/verify');
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
      const response = await api.get('/admin/dashboard');
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
      const response = await api.get('/admin/dashboard/top-restaurants');
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

  // ===== RESTAURANTS =====
  async getAllRestaurants(): Promise<ApiResponse<Restaurant[]>> {
    try {
      const response = await api.get('/admin/restaurants');
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

  async getRestaurantById(id: number): Promise<ApiResponse<Restaurant>> {
    try {
      const response = await api.get(`/admin/restaurants/${id}`);
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

  async createRestaurant(restaurantData: CreateRestaurantRequest): Promise<ApiResponse<Restaurant>> {
    try {
      const response = await api.post('/admin/restaurants', restaurantData);
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

  async updateRestaurant(id: number, restaurantData: UpdateRestaurantRequest): Promise<ApiResponse<Restaurant>> {
    try {
      const response = await api.put(`/admin/restaurants/${id}`, restaurantData);
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

  async toggleRestaurantStatus(id: number): Promise<ApiResponse<Restaurant>> {
    try {
      const response = await api.patch(`/admin/restaurants/${id}/toggle-status`, {});
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
      const response = await api.delete(`/admin/restaurants/${id}`);
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

  async checkSlugAvailability(slug: string): Promise<ApiResponse<{ available: boolean }>> {
    try {
      const response = await api.get(`/admin/restaurants/check-slug/${slug}`);
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

  // ===== UTILISATEURS =====
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await api.get('/admin/users');
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
      const response = await api.get(`/admin/restaurants/${restaurantId}/users`);
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

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      const response = await api.post('/admin/users', userData);
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

  async updateUser(id: number, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
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
      const response = await api.delete(`/admin/users/${id}`);
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

  // ===== ANALYSES =====
  async getAnalyticsData(period: string = '30j', restaurantId: string = 'all'): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/admin/analytics?period=${period}&restaurant_id=${restaurantId}`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des analyses',
      };
    }
  }

  async getRestaurantAnalytics(restaurantId: number): Promise<ApiResponse<RestaurantAnalytics>> {
    try {
      const response = await api.get(`/admin/restaurants/${restaurantId}/analytics`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des analyses du restaurant',
      };
    }
  }

  async getGlobalAnalytics(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get('/admin/analytics/global');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des analyses globales',
      };
    }
  }

  // ===== PARAMÈTRES SYSTÈME =====
  async getSettings(category: string = 'all'): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/settings/settings?category=${category}`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des paramètres',
      };
    }
  }

  async updateSettings(settings: any): Promise<ApiResponse<any>> {
    try {
      const response = await api.put('/settings/settings', { settings });
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour des paramètres',
      };
    }
  }

  async getSystemStats(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get('/settings/stats');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des statistiques',
      };
    }
  }

  // ===== GESTION DES CLÉS API =====
  async getApiKeys(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get('/settings/api-keys');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des clés API',
      };
    }
  }

  async createApiKey(keyData: { key_name: string; key_type?: string; permissions?: string[] }): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/settings/api-keys', keyData);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création de la clé API',
      };
    }
  }

  async regenerateApiKey(keyId: number): Promise<ApiResponse<any>> {
    try {
      const response = await api.put(`/settings/api-keys/${keyId}/regenerate`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la régénération de la clé API',
      };
    }
  }

  // ===== SAUVEGARDE =====
  async backupDatabase(): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/settings/backup');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la sauvegarde',
      };
    }
  }
}

export default new AdminApiService();