import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { 
  Building2, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  BarChart3,
  UserPlus,
  Store
} from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // États pour le dashboard
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  
  // États pour les restaurants
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<any>(null);
  
  // États pour les utilisateurs
  const [users, setUsers] = useState<any[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Formulaire restaurant
  const [restaurantForm, setRestaurantForm] = useState({
    nom: '',
    slug: '',
    adresse: '',
    telephone: '',
    email: '',
    couleur_theme: '#3B82F6',
    devise: 'XOF',
    plan: 'GRATUIT'
  });

  // Formulaire utilisateur
  const [userForm, setUserForm] = useState({
    restaurant_id: '',
    nom_utilisateur: '',
    email: '',
    mot_de_passe: '',
    role: 'MANAGER'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'restaurants') {
      loadRestaurants();
    } else if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAdminDashboard();
      if (response.success) {
        setDashboardStats(response.data);
      } else {
        setError(response.error || 'Erreur lors du chargement des données');
      }
    } catch (error) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllRestaurants();
      if (response.success) {
        setRestaurants(response.data);
      } else {
        setError(response.error || 'Erreur lors du chargement des restaurants');
      }
    } catch (error) {
      setError('Erreur lors du chargement des restaurants');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.error || 'Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiService.createRestaurant(restaurantForm);
      if (response.success) {
        setSuccess('Restaurant créé avec succès');
        setShowRestaurantModal(false);
        setRestaurantForm({
          nom: '',
          slug: '',
          adresse: '',
          telephone: '',
          email: '',
          couleur_theme: '#3B82F6',
          devise: 'XOF',
          plan: 'GRATUIT'
        });
        loadRestaurants();
      } else {
        setError(response.error || 'Erreur lors de la création du restaurant');
      }
    } catch (error) {
      setError('Erreur lors de la création du restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiService.createUser(userForm);
      if (response.success) {
        setSuccess('Utilisateur créé avec succès');
        setShowUserModal(false);
        setUserForm({
          restaurant_id: '',
          nom_utilisateur: '',
          email: '',
          mot_de_passe: '',
          role: 'MANAGER'
        });
        loadUsers();
      } else {
        setError(response.error || 'Erreur lors de la création de l\'utilisateur');
      }
    } catch (error) {
      setError('Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRestaurantStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIF' ? 'SUSPENDU' : 'ACTIF';
    console.log('🔄 Changement de statut:', { id, currentStatus, newStatus });
    
    try {
      const response = await apiService.toggleRestaurantStatus(id, newStatus);
      console.log('📡 Réponse API:', response);
      
      if (response.success) {
        setSuccess(`Restaurant ${newStatus.toLowerCase()} avec succès`);
        setError(''); // Clear any previous errors
        loadRestaurants();
      } else {
        console.error('❌ Erreur API:', response.error);
        setError(response.error || 'Erreur lors du changement de statut');
      }
    } catch (error) {
      console.error('❌ Erreur catch:', error);
      setError('Erreur lors du changement de statut');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIF': return 'bg-green-100 text-green-800';
      case 'SUSPENDU': return 'bg-red-100 text-red-800';
      case 'FERME': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'GRATUIT': return 'bg-gray-100 text-gray-800';
      case 'BASIC': return 'bg-blue-100 text-blue-800';
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'ENTREPRISE': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Administration SaaS</h1>
                <p className="text-sm text-gray-500">Gestion multi-restaurants</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.nom}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'restaurants', label: 'Restaurants', icon: Store },
              { id: 'users', label: 'Utilisateurs', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Statistiques restaurants */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Restaurants</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats?.restaurants?.total_restaurants || 0}
                    </p>
                    <p className="text-xs text-green-600">
                      {dashboardStats?.restaurants?.restaurants_actifs || 0} actifs
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistiques utilisateurs */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats?.utilisateurs?.total_utilisateurs || 0}
                    </p>
                    <p className="text-xs text-green-600">
                      {dashboardStats?.utilisateurs?.utilisateurs_actifs || 0} actifs
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistiques commandes */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Commandes (30j)</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats?.commandes?.commandes_30j || 0}
                    </p>
                    <p className="text-xs text-blue-600">
                      {dashboardStats?.commandes?.commandes_7j || 0} cette semaine
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistiques chiffre d'affaires */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">CA (30j)</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(dashboardStats?.paiements?.ca_30j || 0)}
                    </p>
                    <p className="text-xs text-green-600">
                      {formatCurrency(dashboardStats?.paiements?.ca_7j || 0)} cette semaine
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top restaurants */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Top 5 Restaurants</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardStats?.topRestaurants?.map((restaurant: any, index: number) => (
                    <div key={restaurant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{restaurant.nom}</p>
                          <p className="text-sm text-gray-500">
                            {restaurant.nb_utilisateurs} utilisateurs • {restaurant.nb_commandes} commandes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(restaurant.chiffre_affaires)}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(restaurant.plan)}`}>
                          {restaurant.plan}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des Restaurants</h2>
              <button
                onClick={() => setShowRestaurantModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Nouveau Restaurant</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateurs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CA (30j)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {restaurants.map((restaurant) => (
                    <tr key={restaurant.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{restaurant.nom}</div>
                          <div className="text-sm text-gray-500">{restaurant.slug}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(restaurant.plan)}`}>
                          {restaurant.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(restaurant.statut)}`}>
                          {restaurant.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {restaurant.nb_utilisateurs}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(restaurant.chiffre_affaires_30j)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleToggleRestaurantStatus(restaurant.id, restaurant.statut)}
                          className={`${
                            restaurant.statut === 'ACTIF' 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {restaurant.statut === 'ACTIF' ? 'Suspendre' : 'Activer'}
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
              <button
                onClick={() => setShowUserModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Nouvel Utilisateur</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière connexion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.nom_utilisateur}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.restaurant_nom}</div>
                        <div className="text-sm text-gray-500">{user.restaurant_slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.statut)}`}>
                          {user.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.derniere_connexion ? new Date(user.derniere_connexion).toLocaleDateString('fr-FR') : 'Jamais'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal Restaurant */}
      {showRestaurantModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nouveau Restaurant</h3>
              <form onSubmit={handleCreateRestaurant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    value={restaurantForm.nom}
                    onChange={(e) => setRestaurantForm({...restaurantForm, nom: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <input
                    type="text"
                    value={restaurantForm.slug}
                    onChange={(e) => setRestaurantForm({...restaurantForm, slug: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plan</label>
                  <select
                    value={restaurantForm.plan}
                    onChange={(e) => setRestaurantForm({...restaurantForm, plan: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="GRATUIT">Gratuit</option>
                    <option value="BASIC">Basic</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="ENTREPRISE">Entreprise</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowRestaurantModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Création...' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Utilisateur */}
      {showUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nouvel Utilisateur</h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Restaurant</label>
                  <select
                    value={userForm.restaurant_id}
                    onChange={(e) => setUserForm({...userForm, restaurant_id: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Sélectionner un restaurant</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    value={userForm.nom_utilisateur}
                    onChange={(e) => setUserForm({...userForm, nom_utilisateur: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                  <input
                    type="password"
                    value={userForm.mot_de_passe}
                    onChange={(e) => setUserForm({...userForm, mot_de_passe: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rôle</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="MANAGER">Manager</option>
                    <option value="CAISSIER">Caissier</option>
                    <option value="CUISINIER">Cuisinier</option>
                    <option value="SERVEUR">Serveur</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Création...' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;