import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChefHat, 
  Clock, 
  X, 
  ArrowLeft,
  Users,
  Utensils,
  Bell,
  Eye
} from 'lucide-react';
import { apiService } from '../services/api';

interface CommandeWithDetails {
  id_commande: number;
  id_session: number;
  statut_commande: string;
  date_commande: string;
  nom_complet: string;
  nom_table: string;
  produits: Array<{
    id_ligne: number;
    nom_produit: string;
    quantite: number;
    prix_unitaire: number;
    statut_preparation: string;
  }>;
}

const CuisinierPage: React.FC = () => {
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState<CommandeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommande, setSelectedCommande] = useState<CommandeWithDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState<'TOUTES' | 'EN_ATTENTE' | 'EN_PREPARATION' | 'PRETES'>('TOUTES');
  const [updatingProducts, setUpdatingProducts] = useState<Set<number>>(new Set());
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    clientName: string;
    tableName: string;
    commandeId: number;
    timestamp: Date;
  }>>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Jouer un son de notification
  const playNotificationSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignorer les erreurs de lecture audio (permissions, etc.)
      });
    } catch (error) {
      // Ignorer les erreurs
    }
  };

  // Charger les commandes
  const loadCommandes = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      }
      const response = await apiService.getCommandesCuisine();
      if (response.success) {
        const newCommandes = response.data;
        
        // Détecter les nouvelles commandes (pas lors du chargement initial)
        if (!isInitialLoad && commandes.length > 0) {
          const existingIds = new Set(commandes.map((c: CommandeWithDetails) => c.id_commande));
          const newCommandesDetected = newCommandes.filter((c: CommandeWithDetails) => !existingIds.has(c.id_commande));
          
          // Ajouter des notifications pour les nouvelles commandes
          newCommandesDetected.forEach((commande: CommandeWithDetails) => {
            const notificationId = `notification-${commande.id_commande}-${Date.now()}`;
            setNotifications(prev => [...prev, {
              id: notificationId,
              clientName: commande.nom_complet,
              tableName: commande.nom_table,
              commandeId: commande.id_commande,
              timestamp: new Date()
            }]);
          });

          // Jouer le son de notification s'il y a de nouvelles commandes
          if (newCommandesDetected.length > 0) {
            playNotificationSound();
          }
        }
        
        setCommandes(newCommandes);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadCommandes(true); // Chargement initial
    // Recharger toutes les 10 secondes pour détecter les nouvelles commandes
    const interval = setInterval(() => loadCommandes(false), 10000);
    return () => clearInterval(interval);
  }, []);

  // Fermer le panneau de notifications en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotifications && !target.closest('.notification-panel')) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  // Marquer un produit comme en préparation
  const handleStartPreparation = async (idLigne: number) => {
    // Éviter les clics multiples
    if (updatingProducts.has(idLigne)) return;
    
    // Marquer comme en cours de mise à jour
    setUpdatingProducts(prev => new Set(prev).add(idLigne));

    // Mise à jour optimiste immédiate
    setCommandes(prevCommandes => 
      prevCommandes.map(commande => ({
        ...commande,
        produits: commande.produits.map(p => 
          p.id_ligne === idLigne ? { ...p, statut_preparation: 'EN_PREPARATION' } : p
        )
      }))
    );

    // Mise à jour du modal si ouvert
    if (selectedCommande) {
      setSelectedCommande(prev => prev ? {
        ...prev,
        produits: prev.produits.map(p => 
          p.id_ligne === idLigne ? { ...p, statut_preparation: 'EN_PREPARATION' } : p
        )
      } : null);
    }

    // Appel API en arrière-plan
    try {
      const response = await apiService.updateProduitStatut(idLigne, 'EN_PREPARATION');
      if (!response.success) {
        // En cas d'erreur, recharger les données
        await loadCommandes();
      }
    } catch (error) {
      console.error('Erreur lors du démarrage de la préparation:', error);
      // En cas d'erreur, recharger les données
      await loadCommandes();
    } finally {
      // Retirer de la liste des produits en cours de mise à jour
      setUpdatingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(idLigne);
        return newSet;
      });
    }
  };

  // Marquer un produit comme prêt
  const handleMarkReady = async (idLigne: number) => {
    // Éviter les clics multiples
    if (updatingProducts.has(idLigne)) return;
    
    // Marquer comme en cours de mise à jour
    setUpdatingProducts(prev => new Set(prev).add(idLigne));

    // Mise à jour optimiste immédiate
    setCommandes(prevCommandes => 
      prevCommandes.map(commande => ({
        ...commande,
        produits: commande.produits.map(p => 
          p.id_ligne === idLigne ? { ...p, statut_preparation: 'PRET' } : p
        )
      }))
    );

    // Mise à jour du modal si ouvert
    if (selectedCommande) {
      setSelectedCommande(prev => prev ? {
        ...prev,
        produits: prev.produits.map(p => 
          p.id_ligne === idLigne ? { ...p, statut_preparation: 'PRET' } : p
        )
      } : null);
    }

    // Appel API en arrière-plan
    try {
      const response = await apiService.updateProduitStatut(idLigne, 'PRET');
      if (!response.success) {
        // En cas d'erreur, recharger les données
        await loadCommandes();
      }
    } catch (error) {
      console.error('Erreur lors de la finalisation:', error);
      // En cas d'erreur, recharger les données
      await loadCommandes();
    } finally {
      // Retirer de la liste des produits en cours de mise à jour
      setUpdatingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(idLigne);
        return newSet;
      });
    }
  };

  // Filtrer les commandes et leurs produits
  const getFilteredCommandes = () => {
    if (filter === 'TOUTES') return commandes;
    
    return commandes.map(commande => {
      // Filtrer les produits selon le statut sélectionné
      const produitsFiltres = commande.produits.filter(produit => {
        if (filter === 'EN_ATTENTE') {
          return produit.statut_preparation === 'EN_ATTENTE';
        }
        if (filter === 'EN_PREPARATION') {
          return produit.statut_preparation === 'EN_PREPARATION';
        }
        if (filter === 'PRETES') {
          return produit.statut_preparation === 'PRET';
        }
        return true;
      });
      
      // Retourner la commande avec seulement les produits filtrés
      return {
        ...commande,
        produits: produitsFiltres
      };
    }).filter(commande => commande.produits.length > 0); // Ne garder que les commandes qui ont des produits après filtrage
  };

  // Obtenir le statut d'une commande (basé sur les produits filtrés)
  const getCommandeStatus = (commande: CommandeWithDetails) => {
    const produits = commande.produits; // Déjà filtrés par getFilteredCommandes()
    const enAttente = produits.filter(p => p.statut_preparation === 'EN_ATTENTE').length;
    const enPreparation = produits.filter(p => p.statut_preparation === 'EN_PREPARATION').length;
    const pretes = produits.filter(p => p.statut_preparation === 'PRET').length;
    
    // Si on a un filtre actif, le statut correspond au filtre
    if (filter !== 'TOUTES') {
      if (filter === 'EN_ATTENTE') return { status: 'EN_ATTENTE', count: enAttente, color: 'bg-red-100 text-red-800' };
      if (filter === 'EN_PREPARATION') return { status: 'EN_PREPARATION', count: enPreparation, color: 'bg-yellow-100 text-yellow-800' };
      if (filter === 'PRETES') return { status: 'PRETES', count: pretes, color: 'bg-green-100 text-green-800' };
    }
    
    // Logique normale pour "TOUTES"
    if (enAttente > 0) return { status: 'EN_ATTENTE', count: enAttente, color: 'bg-red-100 text-red-800' };
    if (enPreparation > 0) return { status: 'EN_PREPARATION', count: enPreparation, color: 'bg-yellow-100 text-yellow-800' };
    if (pretes > 0) return { status: 'PRETES', count: pretes, color: 'bg-green-100 text-green-800' };
    return { status: 'TERMINEE', count: 0, color: 'bg-gray-100 text-gray-800' };
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  // Supprimer une notification
  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Supprimer toutes les notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Formater l'heure de la notification
  const formatNotificationTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes === 1) return 'Il y a 1 minute';
    return `Il y a ${minutes} minutes`;
  };

  const filteredCommandes = getFilteredCommandes();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-800 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Retour</span>
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ChefHat className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Espace Cuisinier</h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Gestion des commandes</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 hidden sm:flex">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{new Date().toLocaleTimeString('fr-FR')}</span>
              </div>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panneau de notifications */}
      {showNotifications && (
        <div className="notification-panel fixed top-16 right-4 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Tout effacer
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900">Nouvelle commande</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Commande #{notification.commandeId} reçue
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{notification.clientName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>Table {notification.tableName}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatNotificationTime(notification.timestamp)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filtres */}
        <div className="mb-4 sm:mb-6">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2">
            {[
              { key: 'TOUTES', label: 'Toutes', shortLabel: 'Toutes', count: commandes.length },
              { key: 'EN_ATTENTE', label: 'En attente', shortLabel: 'Attente', count: commandes.filter(c => c.produits.some(p => p.statut_preparation === 'EN_ATTENTE')).length },
              { key: 'EN_PREPARATION', label: 'En préparation', shortLabel: 'Prépa', count: commandes.filter(c => c.produits.some(p => p.statut_preparation === 'EN_PREPARATION')).length },
              { key: 'PRETES', label: 'Prêtes', shortLabel: 'Prêtes', count: commandes.filter(c => c.produits.some(p => p.statut_preparation === 'PRET')).length }
            ].map(({ key, label, shortLabel, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === key
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="hidden sm:inline">{label} ({count})</span>
                <span className="sm:hidden">{shortLabel} ({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Liste des commandes */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : filteredCommandes.length === 0 ? (
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
            <p className="text-gray-600">Aucune commande ne correspond aux filtres sélectionnés.</p>
          </div>
        ) : (
          <>
            {/* Vue mobile - Cartes */}
            <div className="block lg:hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {filteredCommandes.map((commande) => {
                  const status = getCommandeStatus(commande);
                  return (
                    <div
                      key={commande.id_commande}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="text-center flex-shrink-0">
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">#{commande.id_commande}</div>
                            <div className="text-xs text-gray-500">Commande</div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              <span className="font-medium text-gray-900 truncate">{commande.nom_complet}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm text-gray-600">
                              <span>Table: {commande.nom_table}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="text-xs sm:text-sm">{formatDate(commande.date_commande)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color} self-start sm:self-auto`}>
                            {status.status} ({status.count})
                          </span>
                          <button
                            onClick={() => {
                              setSelectedCommande(commande);
                              setShowDetails(true);
                            }}
                            className="flex items-center space-x-1 px-3 py-1 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors self-start sm:self-auto whitespace-nowrap"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Détails</span>
                          </button>
                        </div>
                      </div>

                      {/* Produits de la commande */}
                      <div className="space-y-3 sm:space-y-4">
                        {commande.produits.map((produit) => (
                          <div
                            key={produit.id_ligne}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 bg-gray-50 rounded-lg space-y-2 sm:space-y-0"
                          >
                            <div className="flex items-center space-x-4 sm:space-x-5 flex-1">
                              <div className="text-base sm:text-lg font-semibold text-gray-900 flex-shrink-0">
                                {produit.quantite}x
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{produit.nom_produit}</div>
                                <div className="text-xs sm:text-sm text-gray-600">{produit.prix_unitaire} FCFA</div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                              <span className={`px-3 py-1 rounded text-sm font-medium self-start sm:self-auto ${
                                produit.statut_preparation === 'EN_ATTENTE' ? 'bg-red-100 text-red-800' :
                                produit.statut_preparation === 'EN_PREPARATION' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {produit.statut_preparation}
                              </span>
                              
                                  {produit.statut_preparation === 'EN_ATTENTE' && (
                                    <button
                                      onClick={() => handleStartPreparation(produit.id_ligne)}
                                      disabled={updatingProducts.has(produit.id_ligne)}
                                      className={`px-4 py-2 text-white text-sm rounded transition-colors self-start sm:self-auto ${
                                        updatingProducts.has(produit.id_ligne)
                                          ? 'bg-orange-400 cursor-not-allowed'
                                          : 'bg-orange-600 hover:bg-orange-700'
                                      }`}
                                    >
                                      {updatingProducts.has(produit.id_ligne) ? '...' : 'Commencer'}
                                    </button>
                                  )}
                                  
                                  {produit.statut_preparation === 'EN_PREPARATION' && (
                                    <button
                                      onClick={() => handleMarkReady(produit.id_ligne)}
                                      disabled={updatingProducts.has(produit.id_ligne)}
                                      className={`px-4 py-2 text-white text-sm rounded transition-colors self-start sm:self-auto ${
                                        updatingProducts.has(produit.id_ligne)
                                          ? 'bg-green-400 cursor-not-allowed'
                                          : 'bg-green-600 hover:bg-green-700'
                                      }`}
                                    >
                                      {updatingProducts.has(produit.id_ligne) ? '...' : 'Prêt'}
                                    </button>
                                  )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vue desktop - Liste */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* En-tête de la liste */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                    <div className="col-span-4">Produit</div>
                    <div className="col-span-1">Qté</div>
                    <div className="col-span-2">Prix</div>
                    <div className="col-span-2">Statut</div>
                    <div className="col-span-3">Actions</div>
                  </div>
                </div>

                {/* Corps de la liste */}
                <div>
                  {filteredCommandes.map((commande, commandeIndex) => (
                    <div key={commande.id_commande}>
                      {/* En-tête de commande */}
                      <div className="bg-blue-50 px-6 py-3 border-b border-blue-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                #{commande.id_commande}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{commande.nom_complet}</div>
                                <div className="text-xs text-gray-600">Table {commande.nom_table} • {formatDate(commande.date_commande)}</div>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedCommande(commande);
                              setShowDetails(true);
                            }}
                            className="flex items-center space-x-2 px-3 py-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">Détails</span>
                          </button>
                        </div>
                      </div>

                      {/* Produits de la commande */}
                      <div className="divide-y divide-gray-100">
                        {commande.produits.map((produit) => (
                          <div key={produit.id_ligne} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="grid grid-cols-12 gap-4 items-center">
                              {/* Produit */}
                              <div className="col-span-4">
                                <div className="font-medium text-gray-900">{produit.nom_produit}</div>
                              </div>

                              {/* Quantité */}
                              <div className="col-span-1">
                                <span className="font-semibold text-gray-900">{produit.quantite}x</span>
                              </div>

                              {/* Prix */}
                              <div className="col-span-2">
                                <span className="text-sm text-gray-600">{produit.prix_unitaire} FCFA</span>
                              </div>

                              {/* Statut */}
                              <div className="col-span-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  produit.statut_preparation === 'EN_ATTENTE' ? 'bg-red-100 text-red-800' :
                                  produit.statut_preparation === 'EN_PREPARATION' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {produit.statut_preparation}
                                </span>
                              </div>

                              {/* Actions */}
                              <div className="col-span-3">
                                <div className="flex items-center space-x-2">
                                  {produit.statut_preparation === 'EN_ATTENTE' && (
                                    <button
                                      onClick={() => handleStartPreparation(produit.id_ligne)}
                                      disabled={updatingProducts.has(produit.id_ligne)}
                                      className={`px-4 py-2 text-white text-sm rounded-lg transition-colors font-medium ${
                                        updatingProducts.has(produit.id_ligne)
                                          ? 'bg-orange-400 cursor-not-allowed'
                                          : 'bg-orange-600 hover:bg-orange-700'
                                      }`}
                                    >
                                      {updatingProducts.has(produit.id_ligne) ? '...' : 'Commencer'}
                                    </button>
                                  )}
                                  
                                  {produit.statut_preparation === 'EN_PREPARATION' && (
                                    <button
                                      onClick={() => handleMarkReady(produit.id_ligne)}
                                      disabled={updatingProducts.has(produit.id_ligne)}
                                      className={`px-4 py-2 text-white text-sm rounded-lg transition-colors font-medium ${
                                        updatingProducts.has(produit.id_ligne)
                                          ? 'bg-green-400 cursor-not-allowed'
                                          : 'bg-green-600 hover:bg-green-700'
                                      }`}
                                    >
                                      {updatingProducts.has(produit.id_ligne) ? '...' : 'Prêt'}
                                    </button>
                                  )}

                                  {produit.statut_preparation === 'PRET' && (
                                    <span className="text-green-600 text-sm font-medium">✓ Terminé</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Espacement entre les commandes */}
                      {commandeIndex < filteredCommandes.length - 1 && (
                        <div className="h-4 bg-gray-50"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de détails */}
      {showDetails && selectedCommande && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowDetails(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-sm sm:max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Commande #{selectedCommande.id_commande}
                  </h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Client:</span>
                      <span className="ml-2 font-medium">{selectedCommande.nom_complet}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Table:</span>
                      <span className="ml-2 font-medium">{selectedCommande.nom_table}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedCommande.date_commande)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Statut:</span>
                      <span className="ml-2 font-medium">{selectedCommande.statut_commande}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-3">Produits commandés</h3>
                    <div className="space-y-2">
                      {selectedCommande.produits.map((produit) => (
                        <div key={produit.id_ligne} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm sm:text-base">{produit.quantite}x {produit.nom_produit}</div>
                            <div className="text-xs sm:text-sm text-gray-600">{produit.prix_unitaire} FCFA</div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium self-start sm:self-auto ${
                            produit.statut_preparation === 'EN_ATTENTE' ? 'bg-red-100 text-red-800' :
                            produit.statut_preparation === 'EN_PREPARATION' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {produit.statut_preparation}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuisinierPage;
