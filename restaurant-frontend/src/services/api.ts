import axios from 'axios';
import { 
  ApiResponse, 
  Produit, 
  Session, 
  SessionResponse,
  PanierItem, 
  CreateSessionRequest, 
  AddToCartRequest, 
  UpdateQuantityRequest, 
  CreatePaymentRequest 
} from '../types';

const API_BASE_URL = 'http://192.168.1.66:3000';

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

  // Récupérer la session active d'une table
  async getActiveSession(qrCode: string): Promise<ApiResponse<SessionResponse>> {
    try {
      const response = await api.get(`/api/client/table/${qrCode}/session/active`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de la session active',
      };
    }
  }

  // Créer une session pour une table
  async createSession(qrCode: string, request: CreateSessionRequest): Promise<ApiResponse<SessionResponse>> {
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
  async validateOrder(sessionId: number, panierItems?: any[]): Promise<ApiResponse<void>> {
    try {
      await api.post(`/api/client/session/${sessionId}/order/validate`, {
        panierItems: panierItems
      }, {
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

  async generateInvoice(orderId: number): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/api/caisse/orders/${orderId}/invoice`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la génération de la facture',
      };
    }
  }

  async searchInvoices(filters: any): Promise<ApiResponse<any[]>> {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/api/caisse/invoices/search?${params.toString()}`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la recherche de factures',
      };
    }
  }

  async getArchivedInvoice(numeroFacture: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/api/caisse/invoices/${numeroFacture}`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de la facture',
      };
    }
  }

  async getInvoiceStatistics(dateDebut: string, dateFin: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/api/caisse/invoices/statistics?dateDebut=${dateDebut}&dateFin=${dateFin}`);
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

  async markOrderAsServed(orderId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.put(`/api/caisse/orders/${orderId}/serve`, {}, {
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
        error: error.response?.data?.message || 'Erreur lors de la mise à jour',
      };
    }
  }

  async cancelOrder(orderId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.put(`/api/caisse/orders/${orderId}/cancel`, {}, {
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
        error: error.response?.data?.message || 'Erreur lors de l\'annulation',
      };
    }
  }

  async validatePayment(paymentId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.put(`/api/caisse/payments/${paymentId}/validate`, {}, {
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
        error: error.response?.data?.message || 'Erreur lors de la validation',
      };
    }
  }

  async archivePayment(paymentId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.put(`/api/caisse/payments/${paymentId}/archive`, {}, {
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
        error: error.response?.data?.message || 'Erreur lors de l\'archivage',
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

  // Récupérer les commandes d'une session
  async getSessionOrders(sessionId: number): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get(`/api/client/session/${sessionId}/orders`);
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement des commandes de la session',
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

  async getManagerDashboard(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get('/api/manager/dashboard');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement du dashboard manager',
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
    idCategorie?: number;
  }, photoFile?: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('nomProduit', productData.nomProduit);
      formData.append('description', productData.description);
      formData.append('prixCfa', productData.prixCfa.toString());
      formData.append('stockDisponible', productData.stockDisponible.toString());
      
      if (productData.idCategorie) {
        formData.append('idCategorie', productData.idCategorie.toString());
      }
      
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const response = await api.post('/api/manager/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
  }, photoFile?: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      
      if (productData.nomProduit) formData.append('nomProduit', productData.nomProduit);
      if (productData.description !== undefined) formData.append('description', productData.description);
      if (productData.prixCfa) formData.append('prixCfa', productData.prixCfa.toString());
      if (productData.stockDisponible !== undefined) formData.append('stockDisponible', productData.stockDisponible.toString());
      if (productData.actif !== undefined) formData.append('actif', productData.actif.toString());
      
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const response = await api.put(`/api/manager/products/${idProduit}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

  // Gestion des catégories
  async getCategories(): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get('/api/manager/categories');
      return {
        success: response.data.success,
        data: response.data.data,
        error: response.data.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du chargement des catégories',
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