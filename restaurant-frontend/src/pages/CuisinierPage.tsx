import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChefHat, 
  Clock, 
  CheckCircle, 
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

  // Charger les commandes
  const loadCommandes = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCommandesCuisine();
      if (response.success) {
        setCommandes(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommandes();
    // Recharger toutes les 30 secondes
    const interval = setInterval(loadCommandes, 30000);
    return () => clearInterval(interval);
  }, []);

  // Marquer un produit comme en préparation
  const handleStartPreparation = async (idLigne: number) => {
    try {
      const response = await apiService.updateProduitStatut(idLigne, 'EN_PREPARATION');
      if (response.success) {
        await loadCommandes();
        if (selectedCommande) {
          setSelectedCommande(prev => prev ? {
            ...prev,
            produits: prev.produits.map(p => 
              p.id_ligne === idLigne ? { ...p, statut_preparation: 'EN_PREPARATION' } : p
            )
          } : null);
        }
      }
    } catch (error) {
      console.error('Erreur lors du démarrage de la préparation:', error);
    }
  };

  // Marquer un produit comme prêt
  const handleMarkReady = async (idLigne: number) => {
    try {
      const response = await apiService.updateProduitStatut(idLigne, 'PRET');
      if (response.success) {
        await loadCommandes();
        if (selectedCommande) {
          setSelectedCommande(prev => prev ? {
            ...prev,
            produits: prev.produits.map(p => 
              p.id_ligne === idLigne ? { ...p, statut_preparation: 'PRET' } : p
            )
          } : null);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la finalisation:', error);
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

  const filteredCommandes = getFilteredCommandes();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Espace Cuisinier</h1>
                  <p className="text-sm text-gray-600">Gestion des commandes</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleTimeString('fr-FR')}</span>
              </div>
              <button
                onClick={loadCommandes}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filtres */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { key: 'TOUTES', label: 'Toutes', count: commandes.length },
              { key: 'EN_ATTENTE', label: 'En attente', count: commandes.filter(c => c.produits.some(p => p.statut_preparation === 'EN_ATTENTE')).length },
              { key: 'EN_PREPARATION', label: 'En préparation', count: commandes.filter(c => c.produits.some(p => p.statut_preparation === 'EN_PREPARATION')).length },
              { key: 'PRETES', label: 'Prêtes', count: commandes.filter(c => c.produits.some(p => p.statut_preparation === 'PRET')).length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {label} ({count})
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
          <div className="grid gap-4">
            {filteredCommandes.map((commande) => {
              const status = getCommandeStatus(commande);
              return (
                <div
                  key={commande.id_commande}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">#{commande.id_commande}</div>
                        <div className="text-xs text-gray-500">Commande</div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{commande.nom_complet}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>Table: {commande.nom_table}</span>
                          <span>•</span>
                          <span>{formatDate(commande.date_commande)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.status} ({status.count})
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCommande(commande);
                          setShowDetails(true);
                        }}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Détails</span>
                      </button>
                    </div>
                  </div>

                  {/* Produits de la commande */}
                  <div className="space-y-2">
                    {commande.produits.map((produit) => (
                      <div
                        key={produit.id_ligne}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-lg font-semibold text-gray-900">
                            {produit.quantite}x
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{produit.nom_produit}</div>
                            <div className="text-sm text-gray-600">{produit.prix_unitaire} FCFA</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            produit.statut_preparation === 'EN_ATTENTE' ? 'bg-red-100 text-red-800' :
                            produit.statut_preparation === 'EN_PREPARATION' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {produit.statut_preparation}
                          </span>
                          
                          {produit.statut_preparation === 'EN_ATTENTE' && (
                            <button
                              onClick={() => handleStartPreparation(produit.id_ligne)}
                              className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                            >
                              Commencer
                            </button>
                          )}
                          
                          {produit.statut_preparation === 'EN_PREPARATION' && (
                            <button
                              onClick={() => handleMarkReady(produit.id_ligne)}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                            >
                              Prêt
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
        )}
      </div>

      {/* Modal de détails */}
      {showDetails && selectedCommande && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowDetails(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Commande #{selectedCommande.id_commande}
                  </h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
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
                        <div key={produit.id_ligne} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{produit.quantite}x {produit.nom_produit}</div>
                            <div className="text-sm text-gray-600">{produit.prix_unitaire} FCFA</div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
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
