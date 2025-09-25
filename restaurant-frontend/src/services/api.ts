import axios from 'axios';
import { 
  ApiResponse, 
  Produit, 
  Session, 
  PanierItem, 
  CreateSessionRequest, 
  AddToCartRequest, 
  UpdateQuantityRequest, 
  CreatePaymentRequest 
} from '../types';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

class ApiService {
  // Scanner un QR code et récupérer les informations de la table
  async scanQrCode(qrCode: string): Promise<ApiResponse<{ table: any; session?: Session; menu: Produit[] }>> {
    try {
      const response = await api.get(`/table/${qrCode}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du scan du QR code',
      };
    }
  }

  // Créer une session pour une table
  async createSession(qrCode: string, request: CreateSessionRequest): Promise<ApiResponse<Session>> {
    try {
      const response = await api.post(`/api/client/table/${qrCode}/session`, {
        nomComplet: request.nomComplet,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création de la session',
      };
    }
  }

  // Récupérer le menu
  async getMenu(searchQuery?: string): Promise<ApiResponse<Produit[]>> {
    try {
      const response = await api.get('/api/client/menu', {
        params: searchQuery ? { q: searchQuery } : {},
      });
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement du menu',
      };
    }
  }

  // Récupérer le panier d'une session
  async getCart(sessionId: number): Promise<ApiResponse<{ panier: PanierItem[]; total: number }>> {
    try {
      const response = await api.get(`/api/client/session/${sessionId}/cart`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement du panier',
      };
    }
  }

  // Ajouter un produit au panier
  async addToCart(sessionId: number, request: AddToCartRequest): Promise<ApiResponse<{ panier: PanierItem[]; total: number }>> {
    try {
      const response = await api.post(`/api/client/session/${sessionId}/cart`, request, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'ajout au panier',
      };
    }
  }

  // Mettre à jour la quantité d'un article
  async updateQuantity(idLigne: number, request: UpdateQuantityRequest): Promise<ApiResponse<void>> {
    try {
      await api.put(`/api/client/cart/${idLigne}`, request);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour',
      };
    }
  }

  // Supprimer un article du panier
  async removeFromCart(idLigne: number): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/api/client/cart/${idLigne}`);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression',
      };
    }
  }

  // Valider une commande
  async validateOrder(sessionId: number): Promise<ApiResponse<void>> {
    try {
      await api.post(`/api/client/session/${sessionId}/order/validate`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la validation de la commande',
      };
    }
  }

  // Créer un paiement
  async createPayment(sessionId: number, request: CreatePaymentRequest): Promise<ApiResponse<void>> {
    try {
      await api.post(`/api/client/session/${sessionId}/payment`, request, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du paiement',
      };
    }
  }


  // Méthodes pour la caisse
  async getPendingOrders(): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get('/api/caisse/orders/pending');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement des commandes',
      };
    }
  }

  async getPendingPayments(): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get('/api/caisse/payments/pending');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement des paiements',
      };
    }
  }

  async getActiveSessions(): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get('/api/caisse/sessions/active');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement des sessions',
      };
    }
  }

  async getOrderDetails(orderId: number): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/api/caisse/orders/${orderId}`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement des détails',
      };
    }
  }

  async markOrderAsServed(orderId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.put(`/api/caisse/orders/${orderId}/serve`);
      return {
        success: response.data.success,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour',
      };
    }
  }

  async cancelOrder(orderId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.put(`/api/caisse/orders/${orderId}/cancel`);
      return {
        success: response.data.success,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'annulation',
      };
    }
  }

  async validatePayment(paymentId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.put(`/api/caisse/payments/${paymentId}/validate`);
      return {
        success: response.data.success,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la validation',
      };
    }
  }

  async validatePaymentByCode(codeValidation: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.post('/api/caisse/payments/validate-code', { codeValidation });
      return {
        success: response.data.success,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la validation',
      };
    }
  }

  async closeSession(sessionId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.post(`/api/caisse/sessions/${sessionId}/close`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return {
        success: response.data.success,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la fermeture de session',
      };
    }
  }

  async getDailyStats(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get('/api/caisse/stats/daily');
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

  // Méthodes pour la gestion du menu (Manager)
  async getAllProducts(): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get('/api/manager/products');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement des produits',
      };
    }
  }

  async createProduct(productData: {
    nomProduit: string;
    description: string;
    prixCfa: number;
    stockDisponible: number;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/api/manager/products', productData);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création du produit',
      };
    }
  }

  async updateProduct(idProduit: number, productData: {
    nomProduit?: string;
    description?: string;
    prixCfa?: number;
    stockDisponible?: number;
    actif?: boolean;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await api.put(`/api/manager/products/${idProduit}`, productData);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du produit',
      };
    }
  }

  async deleteProduct(idProduit: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/api/manager/products/${idProduit}`);
      return {
        success: response.data.success,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression du produit',
      };
    }
  }

  // ===== CUISINE =====
  
  // Obtenir les commandes pour la cuisine
  async getCommandesCuisine() {
    try {
      const response = await api.get('/api/cuisine/commandes');
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des commandes cuisine:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la récupération des commandes'
      };
    }
  }

  // Mettre à jour le statut d'un produit
  async updateProduitStatut(idLigne: number, statut: 'EN_ATTENTE' | 'EN_PREPARATION' | 'PRET') {
    try {
      const response = await api.put(`/api/cuisine/produits/${idLigne}/statut`, { statut }, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la mise à jour du statut'
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;