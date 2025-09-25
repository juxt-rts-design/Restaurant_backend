import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import ProductEditModal from '../components/ProductEditModal';
import StockStatus from '../components/StockStatus';

interface DashboardStats {
  ventesJour: number;
  tablesOccupees: number;
  tablesLibres: number;
  commandesEnCours: number;
  commandesServies: number;
  paiementsEnAttente: number;
  paiementsValides: number;
}

interface ProductStats {
  id_produit: number;
  nom_produit: string;
  quantite_vendue: number;
  chiffre_affaires: number;
}

const ManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading, setLoading, setError } = useAppContext();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'rapports'>('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    ventesJour: 0,
    tablesOccupees: 0,
    tablesLibres: 0,
    commandesEnCours: 0,
    commandesServies: 0,
    paiementsEnAttente: 0,
    paiementsValides: 0
  });
  const [productStats, setProductStats] = useState<ProductStats[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  
  // États pour la gestion des produits
  const [newProduct, setNewProduct] = useState({
    nomProduit: '',
    description: '',
    prixCfa: 0,
    stockDisponible: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  // Rafraîchissement automatique toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'dashboard') {
        loadDashboardData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Charger les statistiques du jour
      const statsResponse = await apiService.getDailyStats();
      console.log('Réponse stats:', statsResponse);
      
      // Charger les commandes en attente
      const commandesResponse = await apiService.getPendingOrders();
      console.log('Réponse commandes:', commandesResponse);
      
      // Charger les paiements en attente
      const paiementsResponse = await apiService.getPendingPayments();
      console.log('Réponse paiements:', paiementsResponse);
      
      // Charger les sessions actives
      const sessionsResponse = await apiService.getActiveSessions();
      console.log('Réponse sessions:', sessionsResponse);

      // Stocker les vraies données
      if (sessionsResponse.success && sessionsResponse.data) {
        setActiveSessions(sessionsResponse.data);
      }
      if (commandesResponse.success && commandesResponse.data) {
        setPendingOrders(commandesResponse.data);
      }
      if (paiementsResponse.success && paiementsResponse.data) {
        setPendingPayments(paiementsResponse.data);
      }

      if (statsResponse.success && statsResponse.data) {
        const apiData = statsResponse.data;
        setStats({
          ventesJour: apiData.totalVentes || 0,
          tablesOccupees: sessionsResponse.success ? sessionsResponse.data?.length || 0 : 0,
          tablesLibres: 8 - (sessionsResponse.success ? sessionsResponse.data?.length || 0 : 0), // 8 tables total
          commandesEnCours: commandesResponse.success ? commandesResponse.data?.length || 0 : 0,
          commandesServies: 0, // À calculer depuis l'historique
          paiementsEnAttente: paiementsResponse.success ? paiementsResponse.data?.length || 0 : 0,
          paiementsValides: apiData.totalPaiements || 0
        });
      }

      // Charger les statistiques des produits via l'API manager
      const productsResponse = await apiService.getAllProducts();
      if (productsResponse.success && productsResponse.data) {
        setProducts(productsResponse.data);
        // Pour l'instant, on garde des stats simulées car l'API ne fournit pas encore les stats de vente par produit
        const mockProductStats = productsResponse.data.map((product: any) => ({
          id_produit: product.id_produit,
          nom_produit: product.nom_produit,
          quantite_vendue: Math.floor(Math.random() * 20) + 1,
          chiffre_affaires: (Math.floor(Math.random() * 20) + 1) * product.prix_cfa
        }));
        setProductStats(mockProductStats);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonctions pour la gestion des produits
  const handleAddProduct = async () => {
    if (!newProduct.nomProduit || !newProduct.description || newProduct.prixCfa <= 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.createProduct(newProduct);
      if (response.success) {
        alert('Produit créé avec succès !');
        setNewProduct({ nomProduit: '', description: '', prixCfa: 0, stockDisponible: 0 });
        setShowAddProduct(false);
        await loadDashboardData(); // Recharger les données
      } else {
        alert('Erreur lors de la création: ' + response.error);
      }
    } catch (error: any) {
      console.error('Erreur lors de la création du produit:', error);
      alert('Erreur lors de la création du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (product: any) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleSaveProduct = async (updatedProduct: any) => {
    setIsSubmitting(true);
    try {
      const response = await apiService.updateProduct(editingProduct.id_produit, {
        nomProduit: updatedProduct.nom_produit,
        description: updatedProduct.description,
        prixCfa: updatedProduct.prix_cfa,
        stockDisponible: updatedProduct.stock_disponible,
        actif: updatedProduct.actif
      });

      if (response.success) {
        // Mettre à jour localement pour un feedback immédiat
        setProducts(prev => prev.map(p => 
          p.id_produit === editingProduct.id_produit 
            ? { ...p, ...updatedProduct }
            : p
        ));
        setShowEditModal(false);
        setEditingProduct(null);
        // Recharger les données pour s'assurer de la cohérence
        await loadDashboardData();
      } else {
        throw new Error(response.error || 'Erreur lors de la mise à jour');
      }
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      throw error; // Laisser la modal gérer l'erreur
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (product: any) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${product.nom_produit}" ?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.deleteProduct(product.id_produit);
      if (response.success) {
        // Mettre à jour localement pour un feedback immédiat
        setProducts(prev => prev.filter(p => p.id_produit !== product.id_produit));
        // Recharger les données pour s'assurer de la cohérence
        await loadDashboardData();
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error: any) {
      console.error('Erreur lors de la suppression du produit:', error);
      alert('Erreur lors de la suppression du produit: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Retour à l'accueil"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Manager</h1>
            </div>
            <div className="text-sm text-gray-500">
              Dernière mise à jour: {formatDate(new Date().toISOString())}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'menu'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Gestion Menu</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('rapports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rapports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <PieChart className="w-4 h-4" />
                <span>Rapports</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Ventes du jour</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(stats.ventesJour)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Tables occupées</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.tablesOccupees} / {stats.tablesOccupees + stats.tablesLibres}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShoppingCart className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Commandes en cours</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.commandesEnCours}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Paiements en attente</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.paiementsEnAttente}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphiques et métriques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Produits les plus vendus */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Produits les plus vendus
                </h3>
                <div className="space-y-4">
                  {productStats.slice(0, 5).map((product, index) => (
                    <div key={product.id_produit} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.nom_produit}</p>
                          <p className="text-xs text-gray-500">{product.quantite_vendue} vendus</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(product.chiffre_affaires)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* État des tables */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  État des tables
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Tables occupées</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.tablesOccupees}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-gray-700">Tables libres</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.tablesLibres}</span>
                  </div>
                  <div className="pt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(stats.tablesOccupees / (stats.tablesOccupees + stats.tablesLibres)) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Taux d'occupation: {Math.round((stats.tablesOccupees / (stats.tablesOccupees + stats.tablesLibres)) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions actives en temps réel */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Sessions actives en temps réel
              </h3>
              <div className="space-y-3">
                {stats.tablesOccupees > 0 ? (
                  <div className="text-sm text-gray-600 mb-4">
                    {stats.tablesOccupees} table(s) occupée(s) sur 8
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucune session active</p>
                  </div>
                )}
                
                {/* Affichage des vraies sessions actives */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSessions.map((session) => (
                    <div key={session.id_session} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {session.nom_table} - {session.nom_complet}
                        </p>
                        <p className="text-xs text-gray-500">
                          Session #{session.id_session} - {formatDate(session.date_ouverture)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activité récente */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Activité récente
              </h3>
              <div className="space-y-3">
                {/* Vraies commandes en attente */}
                {pendingOrders.map((commande) => (
                  <div key={commande.id_commande} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Commande #{commande.id_commande} - {commande.nom_complet}
                      </p>
                      <p className="text-xs text-gray-500">
                        {commande.nom_table} - {formatCurrency(commande.total)} - {formatDate(commande.date_commande)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Vrais paiements en attente */}
                {pendingPayments.map((paiement) => (
                  <div key={paiement.id_paiement} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Paiement #{paiement.id_paiement} - {paiement.nom_client}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(paiement.montant_total)} - {paiement.methode_paiement} - {formatDate(paiement.date_paiement)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {stats.ventesJour > 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Ventes du jour: {formatCurrency(stats.ventesJour)}
                      </p>
                      <p className="text-xs text-gray-500">Chiffre d'affaires total</p>
                    </div>
                  </div>
                )}
                
                {pendingOrders.length === 0 && pendingPayments.length === 0 && stats.ventesJour === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucune activité récente</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Header avec bouton d'ajout */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Gestion du Menu</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un produit</span>
              </button>
            </div>

            {/* Formulaire d'ajout de produit */}
            {showAddProduct && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter un nouveau produit</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      value={newProduct.nomProduit}
                      onChange={(e) => setNewProduct({...newProduct, nomProduit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Poulet DG"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (CFA) *
                    </label>
                    <input
                      type="number"
                      value={newProduct.prixCfa}
                      onChange={(e) => setNewProduct({...newProduct, prixCfa: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 2500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock disponible
                    </label>
                    <input
                      type="number"
                      value={newProduct.stockDisponible}
                      onChange={(e) => setNewProduct({...newProduct, stockDisponible: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Description du produit..."
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddProduct(false);
                      setNewProduct({ nomProduit: '', description: '', prixCfa: 0, stockDisponible: 0 });
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddProduct}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Création...' : 'Créer le produit'}
                  </button>
                </div>
              </div>
            )}

            {/* Liste des produits */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id_produit} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.nom_produit}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.prix_cfa)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{product.stock_disponible}</span>
                          <StockStatus stock={product.stock_disponible} isActive={product.actif} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.actif 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleUpdateProduct(product)}
                          disabled={isSubmitting}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          disabled={isSubmitting}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rapports' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Rapports et Analyses</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Performance des ventes
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ventes aujourd'hui</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(stats.ventesJour)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Commandes servies</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.commandesServies}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Paiements validés</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.paiementsValides}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Métriques clés
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Panier moyen</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(stats.ventesJour / Math.max(stats.commandesServies, 1))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taux de conversion</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round((stats.paiementsValides / Math.max(stats.commandesEnCours + stats.commandesServies, 1)) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Temps moyen de service</span>
                    <span className="text-sm font-medium text-gray-900">15 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'édition de produit */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default ManagerPage;
