import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import adminApiService from '../services/adminApi';
import { RestaurantStats, TopRestaurant } from '../types/admin';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<RestaurantStats | null>(null);
  const [topRestaurants, setTopRestaurants] = useState<TopRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, topRestaurantsResponse] = await Promise.all([
        adminApiService.getDashboardStats(),
        adminApiService.getTopRestaurants()
      ]);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      if (topRestaurantsResponse.success && topRestaurantsResponse.data) {
        setTopRestaurants(topRestaurantsResponse.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatCardClick = (title: string) => {
    console.log(`Clic sur la carte: ${title}`);
    // Actions spécifiques selon la carte cliquée
    switch (title) {
      case 'Restaurants':
        // Rediriger vers la page restaurants
        window.location.href = '/restaurants';
        break;
      case 'Factures Total':
        // Afficher les détails des factures
        alert(`Total de ${stats?.factures?.total_factures} factures pour ${(stats?.factures?.ca_total_fcfa || 0).toLocaleString()} FCFA`);
        break;
      case 'Utilisateurs':
        // Rediriger vers la page utilisateurs
        window.location.href = '/users';
        break;
      case 'CA Total':
        // Afficher les détails du CA
        alert(`Chiffre d'affaires total: ${(stats?.factures?.ca_total_fcfa || 0).toLocaleString()} FCFA\nCA 30j: ${(stats?.factures?.ca_30j_fcfa || 0).toLocaleString()} FCFA`);
        break;
      case 'Produits':
        // Afficher les détails des produits
        alert(`Total: ${stats?.produits?.total_produits} produits\nActifs: ${stats?.produits?.produits_actifs}\nEn rupture: ${stats?.produits?.produits_rupture}`);
        break;
      case 'Restaurants Suspendus':
        // Afficher les restaurants suspendus
        alert(`Attention: ${stats?.restaurants?.restaurants_suspendus} restaurants sont suspendus et nécessitent une action !`);
        break;
    }
  };

  const handleRestaurantAction = async (restaurantId: number, action: string) => {
    try {
      console.log(`Action ${action} sur le restaurant ${restaurantId}`);
      
      if (action === 'Activer') {
        // Appeler l'API pour activer le restaurant
        const response = await adminApiService.toggleRestaurantStatus(restaurantId, 'ACTIF');
        if (response.success) {
          alert(`✅ Restaurant ${restaurantId} activé avec succès !`);
          // Recharger les données
          await loadDashboardData();
        } else {
          alert(`❌ Erreur: ${response.error}`);
        }
      } else if (action === 'Suspendre') {
        // Appeler l'API pour suspendre le restaurant
        const response = await adminApiService.toggleRestaurantStatus(restaurantId, 'SUSPENDU');
        if (response.success) {
          alert(`⚠️ Restaurant ${restaurantId} suspendu avec succès !`);
          // Recharger les données
          await loadDashboardData();
        } else {
          alert(`❌ Erreur: ${response.error}`);
        }
      } else if (action === 'Voir détails') {
        // Rediriger vers la page de détails du restaurant
        window.location.href = `/restaurants/${restaurantId}`;
      } else if (action === 'Nouveau Restaurant') {
        // Rediriger vers la page de création
        window.location.href = '/restaurants/new';
      } else if (action === 'Synchroniser données') {
        // Recharger toutes les données
        await loadDashboardData();
        alert('🔄 Données synchronisées avec succès !');
      } else {
        alert(`Action "${action}" effectuée sur le restaurant ${restaurantId}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
      alert('❌ Erreur lors de l\'exécution de l\'action');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Restaurants',
      value: stats?.restaurants?.total_restaurants || 0,
      icon: Building2,
      color: 'blue',
      change: `${stats?.restaurants?.restaurants_actifs || 0} actifs`,
      changeType: 'positive' as const,
    },
    {
      title: 'Factures Total',
      value: stats?.factures?.total_factures || 0,
      icon: ShoppingCart,
      color: 'green',
      change: `${stats?.factures?.factures_30j || 0} (30j)`,
      changeType: 'positive' as const,
    },
    {
      title: 'Utilisateurs',
      value: stats?.utilisateurs?.total_utilisateurs || 0,
      icon: Users,
      color: 'purple',
      change: `${stats?.utilisateurs?.managers || 0} managers`,
      changeType: 'positive' as const,
    },
    {
      title: 'CA Total',
      value: `${(stats?.factures?.ca_total_fcfa || 0).toLocaleString()} FCFA`,
      icon: DollarSign,
      color: 'orange',
      change: `${(stats?.factures?.ca_30j_fcfa || 0).toLocaleString()} FCFA (30j)`,
      changeType: 'positive' as const,
    },
    {
      title: 'Produits',
      value: stats?.produits?.total_produits || 0,
      icon: Activity,
      color: 'yellow',
      change: `${stats?.produits?.produits_actifs || 0} actifs`,
      changeType: 'positive' as const,
    },
    {
      title: 'Restaurants Suspendus',
      value: stats?.restaurants?.restaurants_suspendus || 0,
      icon: TrendingDown,
      color: 'red',
      change: 'Attention requise',
      changeType: 'negative' as const,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Vue d'ensemble de la plateforme SaaS</p>
      </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    const colorClasses = {
                      blue: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      green: 'linear-gradient(135deg, #10b981, #059669)',
                      purple: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      orange: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      yellow: 'linear-gradient(135deg, #eab308, #ca8a04)',
                      red: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    };

                    return (
                      <div 
                        key={index} 
                        className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                        style={{ 
                          background: 'white',
                          borderRadius: '16px',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #e5e7eb',
                          animationDelay: `${index * 0.1}s`,
                          animation: 'slideUp 0.3s ease-out'
                        }}
                        onClick={() => handleStatCardClick(stat.title)}
                      >
                        <div style={{ padding: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div>
                              <p style={{ 
                                fontSize: '14px', 
                                fontWeight: '500', 
                                color: '#6b7280',
                                margin: '0 0 8px 0'
                              }}>
                                {stat.title}
                              </p>
                              <p style={{ 
                                fontSize: '32px', 
                                fontWeight: 'bold', 
                                color: '#111827',
                                margin: 0
                              }}>
                                {stat.value}
                              </p>
                            </div>
                            <div style={{
                              padding: '16px',
                              borderRadius: '16px',
                              background: colorClasses[stat.color as keyof typeof colorClasses],
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              transform: 'scale(1)',
                              transition: 'transform 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}>
                              <Icon style={{ width: '24px', height: '24px', color: 'white' }} />
                            </div>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            padding: '12px',
                            borderRadius: '8px',
                            background: stat.changeType === 'positive' ? '#f0fdf4' : '#fef2f2',
                            border: `1px solid ${stat.changeType === 'positive' ? '#bbf7d0' : '#fecaca'}`
                          }}>
                            {stat.changeType === 'positive' ? (
                              <TrendingUp style={{ width: '16px', height: '16px', color: '#10b981', marginRight: '8px' }} />
                            ) : (
                              <TrendingDown style={{ width: '16px', height: '16px', color: '#ef4444', marginRight: '8px' }} />
                            )}
                            <span style={{ 
                              fontSize: '14px', 
                              fontWeight: '500',
                              color: stat.changeType === 'positive' ? '#059669' : '#dc2626'
                            }}>
                              {stat.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

      {/* Top Restaurants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Restaurants Table */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            padding: '24px', 
            borderBottom: '1px solid #e5e7eb' 
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#111827',
              margin: '0 0 8px 0'
            }}>
              🏆 Top Restaurants
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              margin: 0
            }}>
              Classement par chiffre d'affaires
            </p>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {topRestaurants.slice(0, 5).map((restaurant, index) => (
                <div 
                  key={restaurant.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f0f9ff, #e0f2fe)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc, #f1f5f9)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: index === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 
                                  index === 1 ? 'linear-gradient(135deg, #9ca3af, #6b7280)' :
                                  index === 2 ? 'linear-gradient(135deg, #cd7c2f, #a16207)' :
                                  'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}>
                      <span style={{ 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        color: 'white'
                      }}>
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: '#111827',
                        margin: '0 0 4px 0'
                      }}>
                        {restaurant.nom}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: restaurant.plan === 'PREMIUM' ? '#fef3c7' : 
                                     restaurant.plan === 'ENTERPRISE' ? '#dbeafe' : '#f3f4f6',
                          color: restaurant.plan === 'PREMIUM' ? '#92400e' : 
                                 restaurant.plan === 'ENTERPRISE' ? '#1e40af' : '#374151'
                        }}>
                          {restaurant.plan}
                        </span>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: restaurant.statut === 'ACTIF' ? '#dcfce7' : '#fef2f2',
                          color: restaurant.statut === 'ACTIF' ? '#166534' : '#dc2626'
                        }}>
                          {restaurant.statut}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      color: '#111827',
                      margin: '0 0 4px 0'
                    }}>
                      {restaurant.ca_total_fcfa.toLocaleString()} FCFA
                    </p>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#6b7280',
                      margin: '0 0 8px 0'
                    }}>
                      {restaurant.nb_factures} factures
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestaurantAction(restaurant.id, 'Voir détails');
                        }}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#3b82f6',
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#dbeafe';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#eff6ff';
                        }}
                      >
                        👁️ Détails
                      </button>
                      {restaurant.statut === 'SUSPENDU' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestaurantAction(restaurant.id, 'Activer');
                          }}
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#059669',
                            background: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#d1fae5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ecfdf5';
                          }}
                        >
                          ✅ Activer
                        </button>
                      ) : restaurant.statut === 'ACTIF' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestaurantAction(restaurant.id, 'Suspendre');
                          }}
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#dc2626',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fee2e2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fef2f2';
                          }}
                        >
                          ⚠️ Suspendre
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            padding: '24px', 
            borderBottom: '1px solid #e5e7eb' 
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#111827',
              margin: '0 0 8px 0'
            }}>
              ⚡ Actions Rapides
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              margin: 0
            }}>
              Gestion de la plateforme
            </p>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                onClick={() => handleRestaurantAction(0, 'Nouveau Restaurant')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 24px',
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
                <Building2 style={{ width: '20px', height: '20px', marginRight: '12px' }} />
                🏪 Nouveau Restaurant
              </button>
              
              <button 
                onClick={() => window.location.href = '/users'}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #e0f2fe, #bae6fd)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc, #f1f5f9)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Users style={{ width: '20px', height: '20px', marginRight: '12px' }} />
                👥 Gérer Utilisateurs
              </button>
              
              <button 
                onClick={() => window.location.href = '/analytics'}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f0fdf4, #dcfce7)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc, #f1f5f9)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Activity style={{ width: '20px', height: '20px', marginRight: '12px' }} />
                📊 Voir Analytics
              </button>

              <button 
                onClick={() => handleRestaurantAction(0, 'Synchroniser données')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#7c2d12',
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  border: '1px solid #f59e0b',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fde68a, #fcd34d)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fef3c7, #fde68a)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                🔄 Synchroniser Données
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
