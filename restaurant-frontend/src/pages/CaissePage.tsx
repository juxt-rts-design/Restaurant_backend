import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';
import { CommandeWithDetails, Paiement, SessionWithDetails } from '../types';
import { 
  ShoppingCart, 
  CreditCard, 
  X, 
  Search,
  RefreshCw,
  Eye,
  Check,
  XCircle,
  Users,
  Lock,
  ArrowLeft
} from 'lucide-react';

const CaissePage: React.FC = () => {
  const navigate = useNavigate();
  const { setLoading, setError } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'commandes' | 'paiements' | 'sessions'>('commandes');
  const [commandes, setCommandes] = useState<CommandeWithDetails[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [sessions, setSessions] = useState<SessionWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommande, setSelectedCommande] = useState<CommandeWithDetails | null>(null);
  const [showCommandeDetails, setShowCommandeDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCloseSessionModal, setShowCloseSessionModal] = useState(false);
  const [sessionToClose, setSessionToClose] = useState<SessionWithDetails | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'commandes':
          const commandesResponse = await apiService.getPendingOrders();
          if (commandesResponse.success && commandesResponse.data) {
            setCommandes(commandesResponse.data);
          }
          break;
        case 'paiements':
          const paiementsResponse = await apiService.getPendingPayments();
          if (paiementsResponse.success && paiementsResponse.data) {
            setPaiements(paiementsResponse.data);
          }
          break;
        case 'sessions':
          const sessionsResponse = await apiService.getActiveSessions();
          console.log('Réponse sessions:', sessionsResponse);
          if (sessionsResponse.success && sessionsResponse.data) {
            console.log('Sessions chargées:', sessionsResponse.data);
            setSessions(sessionsResponse.data);
          } else {
            console.error('Erreur chargement sessions:', sessionsResponse.error);
            setSessions([]);
          }
          break;
      }
    } catch (error) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsServed = async (idCommande: number) => {
    setIsProcessing(true);
    try {
      await apiService.markOrderAsServed(idCommande);
      await loadData();
    } catch (error) {
      setError('Erreur lors de la mise à jour');
      console.error('Erreur:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelOrder = async (idCommande: number) => {
    setIsProcessing(true);
    try {
      const response = await apiService.cancelOrder(idCommande);
      if (response.success) {
        await loadData();
      } else {
        setError(response.error || 'Erreur lors de l\'annulation de la commande');
      }
    } catch (error) {
      setError('Erreur lors de l\'annulation de la commande');
      console.error('Erreur:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleValidatePayment = async (idPaiement: number) => {
    setIsProcessing(true);
    try {
      await apiService.validatePayment(idPaiement);
      await loadData();
    } catch (error) {
      setError('Erreur lors de la validation du paiement');
      console.error('Erreur:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSession = async (session: SessionWithDetails) => {
    setSessionToClose(session);
    setShowCloseSessionModal(true);
  };

  const confirmCloseSession = async () => {
    if (!sessionToClose) return;
    
    console.log('Tentative de fermeture de la session:', sessionToClose.id_session);
    setIsProcessing(true);
    try {
      const response = await apiService.closeSession(sessionToClose.id_session);
      console.log('Réponse de fermeture de session:', response);
      if (response.success) {
        console.log('Session fermée avec succès, rechargement des données...');
        // Recharger les données pour voir la session fermée
        await loadData();
        setShowCloseSessionModal(false);
        setSessionToClose(null);
      } else {
        console.error('Erreur de fermeture:', response.error);
        setError(response.error || 'Erreur lors de la fermeture de la session');
      }
    } catch (error) {
      console.error('Erreur lors de la fermeture de la session:', error);
      setError('Erreur lors de la fermeture de la session');
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelCloseSession = () => {
    setShowCloseSessionModal(false);
    setSessionToClose(null);
  };

  const handleViewCommandeDetails = async (idCommande: number) => {
    try {
      const response = await apiService.getOrderDetails(idCommande);
      if (response.success && response.data) {
        setSelectedCommande(response.data);
        setShowCommandeDetails(true);
      }
    } catch (error) {
      setError('Erreur lors du chargement des détails');
      console.error('Erreur:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ENVOYÉ':
        return 'bg-blue-100 text-blue-800';
      case 'SERVI':
        return 'bg-green-100 text-green-800';
      case 'ANNULÉ':
        return 'bg-red-100 text-red-800';
      case 'EN_COURS':
        return 'bg-orange-100 text-orange-800';
      case 'EFFECTUÉ':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredCommandes = () => {
    if (!searchQuery) return commandes;
    
    return commandes.filter((commande) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        commande.nom_complet?.toLowerCase().includes(searchLower) ||
        commande.nom_table?.toLowerCase().includes(searchLower) ||
        commande.id_commande?.toString().includes(searchQuery)
      );
    });
  };

  const getFilteredPaiements = () => {
    if (!searchQuery) return paiements;
    
    return paiements.filter((paiement) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        paiement.code_validation?.toLowerCase().includes(searchLower) ||
        paiement.id_paiement?.toString().includes(searchQuery)
      );
    });
  };

  const getFilteredSessions = () => {
    if (!searchQuery) return sessions;
    
    return sessions.filter((session) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (session.nom_complet || session.client?.nom_complet)?.toLowerCase().includes(searchLower) ||
        (session.nom_table || session.table?.nom_table)?.toLowerCase().includes(searchLower) ||
        session.id_session?.toString().includes(searchQuery)
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                title="Retour à l'accueil"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                Interface Caisse
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <button
                onClick={loadData}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Actualiser"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {activeTab === 'sessions' && (
                <button
                  onClick={() => {
                    console.log('Sessions actuelles:', sessions);
                    console.log('Nombre de sessions:', sessions.length);
                  }}
                  className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded text-xs sm:text-sm hidden sm:block"
                >
                  Debug Sessions
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
              {[
                { id: 'commandes', label: 'Commandes', icon: ShoppingCart },
                { id: 'paiements', label: 'Paiements', icon: CreditCard },
                { id: 'sessions', label: 'Sessions', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-1 sm:space-x-2 py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.substring(0, 3)}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full max-w-sm sm:max-w-md"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'commandes' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commande
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Client
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Table
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Date
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getFilteredCommandes().map((commande: CommandeWithDetails) => (
                    <tr key={commande.id_commande} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex flex-col">
                          <span>#{commande.id_commande}</span>
                          <span className="text-xs text-gray-500 sm:hidden">{commande.nom_complet}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                        {commande.nom_complet}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                        {commande.nom_table}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(commande.statut_commande)}`}>
                          {commande.statut_commande}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {formatDate(commande.date_commande)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 sm:space-x-2">
                        <button
                          onClick={() => handleViewCommandeDetails(commande.id_commande)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {commande.statut_commande === 'ENVOYÉ' && (
                          <button
                            onClick={() => handleMarkAsServed(commande.id_commande)}
                            disabled={isProcessing}
                            className="text-green-600 hover:text-green-900"
                            title="Marquer comme servi"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleCancelOrder(commande.id_commande)}
                          disabled={isProcessing}
                          className="text-red-600 hover:text-red-900"
                          title="Annuler"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'paiements' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paiement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Méthode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getFilteredPaiements().map((paiement: Paiement) => (
                    <tr key={paiement.id_paiement} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{paiement.id_paiement}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(paiement.montant_total)} FCFA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {paiement.methode_paiement}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(paiement.statut_paiement)}`}>
                          {paiement.statut_paiement}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {paiement.code_validation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {paiement.statut_paiement === 'EN_COURS' && (
                          <button
                            onClick={() => handleValidatePayment(paiement.id_paiement)}
                            disabled={isProcessing}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Table
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ouverture
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getFilteredSessions().map((session: SessionWithDetails) => (
                    <tr key={session.id_session} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{session.id_session}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {session.nom_complet || session.client?.nom_complet}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {session.nom_table || session.table?.nom_table}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.statut_session)}`}>
                            {session.statut_session}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(session.date_ouverture)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleCloseSession(session)}
                            disabled={isProcessing}
                            className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                            title="Fermer la session"
                          >
                            <Lock className="w-4 h-4" />
                            <span>Fermer</span>
                          </button>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

                  {((activeTab === 'commandes' && getFilteredCommandes().length === 0) ||
                    (activeTab === 'paiements' && getFilteredPaiements().length === 0) ||
                    (activeTab === 'sessions' && getFilteredSessions().length === 0)) && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                {activeTab === 'commandes' && <ShoppingCart className="w-12 h-12 mx-auto" />}
                {activeTab === 'paiements' && <CreditCard className="w-12 h-12 mx-auto" />}
                {activeTab === 'sessions' && <Users className="w-12 h-12 mx-auto" />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun élément trouvé
              </h3>
              <p className="text-gray-600">
                {searchQuery ? 'Aucun résultat pour votre recherche' : 'Aucun élément à afficher'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Commande Details Modal */}
      {showCommandeDetails && selectedCommande && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCommandeDetails(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Détails de la commande #{selectedCommande.id_commande}
                </h2>
                <button
                  onClick={() => setShowCommandeDetails(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Client</label>
                    <p className="text-gray-900">{selectedCommande.nom_complet}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Table</label>
                    <p className="text-gray-900">{selectedCommande.nom_table}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Produits</label>
                  <div className="mt-2 space-y-2">
                    {selectedCommande.produits.map((produit) => (
                      <div key={produit.id_ligne} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{produit.nom_produit} × {produit.quantite}</span>
                        <span className="font-medium">{formatPrice(produit.prix_unitaire * produit.quantite)} FCFA</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-primary-600">{formatPrice(selectedCommande.total)} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation pour fermer une session */}
      {showCloseSessionModal && sessionToClose && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={cancelCloseSession} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Fermer la session
                </h2>
                <button
                  onClick={cancelCloseSession}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">Attention</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Cette action fermera définitivement la session et ne pourra pas être annulée.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session:</span>
                    <span className="font-medium">#{sessionToClose.id_session}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-medium">{sessionToClose.nom_complet || sessionToClose.client?.nom_complet}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Table:</span>
                    <span className="font-medium">{sessionToClose.nom_table || sessionToClose.table?.nom_table}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ouverte le:</span>
                    <span className="font-medium">{formatDate(sessionToClose.date_ouverture)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelCloseSession}
                  disabled={isProcessing}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmCloseSession}
                  disabled={isProcessing}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Fermeture...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Fermer la session
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaissePage;
