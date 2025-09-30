import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { adminApiService } from '../services/adminApi';
import { Restaurant } from '../types/admin';
import CreateRestaurantModal from '../components/CreateRestaurantModal';

const Restaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getAllRestaurants();
      if (response.success && response.data) {
        setRestaurants(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantAction = async (restaurantId: number, action: string) => {
    try {
      if (action === 'Activer') {
        const response = await adminApiService.toggleRestaurantStatus(restaurantId, 'ACTIF');
        if (response.success) {
          alert(`✅ Restaurant activé avec succès !`);
          await loadRestaurants();
        } else {
          alert(`❌ Erreur: ${response.error}`);
        }
      } else if (action === 'Suspendre') {
        const response = await adminApiService.toggleRestaurantStatus(restaurantId, 'SUSPENDU');
        if (response.success) {
          alert(`⚠️ Restaurant suspendu avec succès !`);
          await loadRestaurants();
        } else {
          alert(`❌ Erreur: ${response.error}`);
        }
      } else if (action === 'Voir détails') {
        window.location.href = `/restaurants/${restaurantId}`;
      } else if (action === 'Éditer') {
        window.location.href = `/restaurants/${restaurantId}/edit`;
      } else if (action === 'Supprimer') {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) {
          const response = await adminApiService.deleteRestaurant(restaurantId);
          if (response.success) {
            alert(`🗑️ Restaurant supprimé avec succès !`);
            await loadRestaurants();
          } else {
            alert(`❌ Erreur: ${response.error}`);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
      alert('❌ Erreur lors de l\'exécution de l\'action');
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'ACTIF':
        return <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981' }} />;
      case 'SUSPENDU':
        return <AlertTriangle style={{ width: '16px', height: '16px', color: '#f59e0b' }} />;
      case 'INACTIF':
        return <XCircle style={{ width: '16px', height: '16px', color: '#ef4444' }} />;
      default:
        return <AlertTriangle style={{ width: '16px', height: '16px', color: '#6b7280' }} />;
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'ACTIF':
        return '#10b981';
      case 'SUSPENDU':
        return '#f59e0b';
      case 'INACTIF':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'PREMIUM':
        return '#8b5cf6';
      case 'ENTERPRISE':
        return '#3b82f6';
      case 'BASIC':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.telephone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || restaurant.statut === statusFilter;
    const matchesPlan = planFilter === 'ALL' || restaurant.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '400px' 
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ color: '#6b7280', fontWeight: '500' }}>
            Chargement des restaurants...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#111827',
          margin: '0 0 8px 0'
        }}>
          🏪 Restaurants
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          margin: 0
        }}>
          Gestion de tous les restaurants de la plateforme
        </p>
      </div>

      {/* Actions et Filtres */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          {/* Bouton Nouveau Restaurant */}
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
          >
            <Plus style={{ width: '20px', height: '20px' }} />
            Nouveau Restaurant
          </button>

          {/* Statistiques rapides */}
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#111827',
                margin: '0 0 4px 0'
              }}>
                {restaurants.length}
              </p>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                margin: 0
              }}>
                Total
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#10b981',
                margin: '0 0 4px 0'
              }}>
                {restaurants.filter(r => r.statut === 'ACTIF').length}
              </p>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                margin: 0
              }}>
                Actifs
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#f59e0b',
                margin: '0 0 4px 0'
              }}>
                {restaurants.filter(r => r.statut === 'SUSPENDU').length}
              </p>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                margin: 0
              }}>
                Suspendus
              </p>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          alignItems: 'center' 
        }}>
          {/* Recherche */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Rechercher un restaurant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                fontSize: '16px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                background: '#f9fafb',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Filtre Statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              background: 'white',
              cursor: 'pointer',
              minWidth: '160px'
            }}
          >
            <option value="ALL">Tous les statuts</option>
            <option value="ACTIF">Actif</option>
            <option value="SUSPENDU">Suspendu</option>
            <option value="INACTIF">Inactif</option>
          </select>

          {/* Filtre Plan */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              background: 'white',
              cursor: 'pointer',
              minWidth: '160px'
            }}
          >
            <option value="ALL">Tous les plans</option>
            <option value="BASIC">Basic</option>
            <option value="PREMIUM">Premium</option>
            <option value="ENTERPRISE">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Liste des Restaurants */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {filteredRestaurants.length === 0 ? (
          <div style={{
            padding: '64px 24px',
            textAlign: 'center'
          }}>
            <Building2 style={{
              width: '64px',
              height: '64px',
              color: '#d1d5db',
              margin: '0 auto 16px'
            }} />
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              Aucun restaurant trouvé
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0
            }}>
              {searchTerm || statusFilter !== 'ALL' || planFilter !== 'ALL' 
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Commencez par créer votre premier restaurant'
              }
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                style={{
                  padding: '24px',
                  borderBottom: index < filteredRestaurants.length - 1 ? '1px solid #f3f4f6' : 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between' 
                }}>
                  {/* Informations du restaurant */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}>
                      <Building2 style={{ width: '28px', height: '28px', color: 'white' }} />
                    </div>

                    {/* Détails */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#111827',
                          margin: 0
                        }}>
                          {restaurant.nom}
                        </h3>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: `rgba(${getStatusColor(restaurant.statut).replace('#', '')}, 0.1)`,
                          color: getStatusColor(restaurant.statut)
                        }}>
                          {restaurant.statut}
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: `rgba(${getPlanColor(restaurant.plan).replace('#', '')}, 0.1)`,
                          color: getPlanColor(restaurant.plan)
                        }}>
                          {restaurant.plan}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        {restaurant.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Mail style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>
                              {restaurant.email}
                            </span>
                          </div>
                        )}
                        {restaurant.telephone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Phone style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>
                              {restaurant.telephone}
                            </span>
                          </div>
                        )}
                        {restaurant.adresse && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>
                              {restaurant.adresse}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Statistiques rapides */}
                    <div style={{ display: 'flex', gap: '16px', marginRight: '16px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ 
                          fontSize: '16px', 
                          fontWeight: 'bold', 
                          color: '#111827',
                          margin: '0 0 2px 0'
                        }}>
                          {restaurant.nb_utilisateurs || 0}
                        </p>
                        <p style={{ 
                          fontSize: '12px', 
                          color: '#6b7280',
                          margin: 0
                        }}>
                          Utilisateurs
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ 
                          fontSize: '16px', 
                          fontWeight: 'bold', 
                          color: '#10b981',
                          margin: '0 0 2px 0'
                        }}>
                          {restaurant.ca_total_fcfa ? restaurant.ca_total_fcfa.toLocaleString() : '0'}
                        </p>
                        <p style={{ 
                          fontSize: '12px', 
                          color: '#6b7280',
                          margin: 0
                        }}>
                          FCFA
                        </p>
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestaurantAction(restaurant.id, 'Voir détails');
                        }}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          background: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f3f4f6';
                          e.currentTarget.style.borderColor = '#9ca3af';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                        title="Voir détails"
                      >
                        <Eye style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestaurantAction(restaurant.id, 'Éditer');
                        }}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          background: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#eff6ff';
                          e.currentTarget.style.borderColor = '#3b82f6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                        title="Éditer"
                      >
                        <Edit style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                      </button>

                      {restaurant.statut === 'SUSPENDU' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestaurantAction(restaurant.id, 'Activer');
                          }}
                          style={{
                            padding: '8px',
                            borderRadius: '8px',
                            border: '1px solid #10b981',
                            background: '#ecfdf5',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#d1fae5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ecfdf5';
                          }}
                          title="Activer"
                        >
                          <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981' }} />
                        </button>
                      ) : restaurant.statut === 'ACTIF' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestaurantAction(restaurant.id, 'Suspendre');
                          }}
                          style={{
                            padding: '8px',
                            borderRadius: '8px',
                            border: '1px solid #f59e0b',
                            background: '#fef3c7',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fde68a';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fef3c7';
                          }}
                          title="Suspendre"
                        >
                          <AlertTriangle style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                        </button>
                      ) : null}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestaurantAction(restaurant.id, 'Supprimer');
                        }}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: '1px solid #ef4444',
                          background: '#fef2f2',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#fee2e2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fef2f2';
                        }}
                        title="Supprimer"
                      >
                        <Trash2 style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de création */}
      <CreateRestaurantModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadRestaurants}
      />
    </div>
  );
};

export default Restaurants;