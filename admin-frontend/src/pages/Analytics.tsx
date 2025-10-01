import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Building2,
  Download,
  Filter,
  RefreshCw,
  LineChart,
  PieChart
} from 'lucide-react';
import adminApiService from '../services/adminApi';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number;
    weekly: number;
    daily: number;
    growth: number;
  };
  orders: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    growth: number;
  };
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };
  restaurants: {
    total: number;
    active: number;
    premium: number;
    growth: number;
  };
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30j');
  const [selectedRestaurant, setSelectedRestaurant] = useState('all');

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod, selectedRestaurant]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getAnalyticsData(selectedPeriod, selectedRestaurant);
      if (response.success && response.data) {
        setAnalyticsData(response.data);
      } else {
        console.error('Erreur lors du chargement des analyses:', response.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des analyses:', error);
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

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
            Chargement des analyses...
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
          📊 Analyses
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          margin: 0
        }}>
          Tableaux de bord et métriques de performance de la plateforme
        </p>
      </div>

      {/* Filtres */}
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
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Filter style={{ width: '20px', height: '20px', color: '#6b7280' }} />
            <span style={{ fontSize: '16px', fontWeight: '500', color: '#374151' }}>
              Filtres :
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* Période */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                padding: '12px 16px',
                fontSize: '16px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                background: 'white',
                cursor: 'pointer',
                minWidth: '120px'
              }}
            >
              <option value="7j">7 derniers jours</option>
              <option value="30j">30 derniers jours</option>
              <option value="90j">90 derniers jours</option>
              <option value="1a">1 an</option>
            </select>

            {/* Restaurant */}
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
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
              <option value="all">Tous les restaurants</option>
              <option value="1">Restaurant RUNGWE</option>
              <option value="2">Chez Mama</option>
              <option value="3">Sushi Zen</option>
            </select>

            {/* Bouton Actualiser */}
            <button
              onClick={loadAnalyticsData}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#3b82f6',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
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
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              Actualiser
            </button>

            {/* Bouton Export */}
            <button
              onClick={() => alert('Fonctionnalité d\'export à implémenter')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#059669',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '12px',
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
              <Download style={{ width: '16px', height: '16px' }} />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Revenus */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '24px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            {analyticsData && (() => {
              const GrowthIcon = analyticsData.revenue.growth >= 0 ? TrendingUp : TrendingDown;
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <GrowthIcon style={{ width: '16px', height: '16px', color: analyticsData.revenue.growth >= 0 ? '#10b981' : '#ef4444' }} />
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: analyticsData.revenue.growth >= 0 ? '#10b981' : '#ef4444'
                  }}>
                    {analyticsData.revenue.growth >= 0 ? '+' : ''}{analyticsData.revenue.growth}%
                  </span>
                </div>
              );
            })()}
          </div>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#6b7280',
            margin: '0 0 8px 0'
          }}>
            Chiffre d'Affaires Total
          </h3>
          <p style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#111827',
            margin: '0 0 8px 0'
          }}>
            {analyticsData ? formatCurrency(analyticsData.revenue.total) : '0 FCFA'}
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
            <span>Mois: {analyticsData ? formatCurrency(analyticsData.revenue.monthly) : '0'}</span>
            <span>Semaine: {analyticsData ? formatCurrency(analyticsData.revenue.weekly) : '0'}</span>
          </div>
        </div>

        {/* Commandes */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '24px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingCart style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            {analyticsData && (() => {
              const GrowthIcon = analyticsData.orders.growth >= 0 ? TrendingUp : TrendingDown;
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <GrowthIcon style={{ width: '16px', height: '16px', color: analyticsData.orders.growth >= 0 ? '#10b981' : '#ef4444' }} />
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: analyticsData.orders.growth >= 0 ? '#10b981' : '#ef4444'
                  }}>
                    {analyticsData.orders.growth >= 0 ? '+' : ''}{analyticsData.orders.growth}%
                  </span>
                </div>
              );
            })()}
          </div>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#6b7280',
            margin: '0 0 8px 0'
          }}>
            Commandes Total
          </h3>
          <p style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#111827',
            margin: '0 0 8px 0'
          }}>
            {analyticsData ? formatNumber(analyticsData.orders.total) : '0'}
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
            <span>Terminées: {analyticsData ? formatNumber(analyticsData.orders.completed) : '0'}</span>
            <span>En cours: {analyticsData ? formatNumber(analyticsData.orders.pending) : '0'}</span>
          </div>
        </div>

        {/* Utilisateurs */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '24px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            {analyticsData && (() => {
              const GrowthIcon = analyticsData.users.growth >= 0 ? TrendingUp : TrendingDown;
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <GrowthIcon style={{ width: '16px', height: '16px', color: analyticsData.users.growth >= 0 ? '#10b981' : '#ef4444' }} />
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: analyticsData.users.growth >= 0 ? '#10b981' : '#ef4444'
                  }}>
                    {analyticsData.users.growth >= 0 ? '+' : ''}{analyticsData.users.growth}%
                  </span>
                </div>
              );
            })()}
          </div>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#6b7280',
            margin: '0 0 8px 0'
          }}>
            Utilisateurs Actifs
          </h3>
          <p style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#111827',
            margin: '0 0 8px 0'
          }}>
            {analyticsData ? formatNumber(analyticsData.users.total) : '0'}
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
            <span>Actifs: {analyticsData ? formatNumber(analyticsData.users.active) : '0'}</span>
            <span>Nouveaux: {analyticsData ? formatNumber(analyticsData.users.new) : '0'}</span>
          </div>
        </div>

        {/* Restaurants */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '24px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            {analyticsData && (() => {
              const GrowthIcon = analyticsData.restaurants.growth >= 0 ? TrendingUp : TrendingDown;
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <GrowthIcon style={{ width: '16px', height: '16px', color: analyticsData.restaurants.growth >= 0 ? '#10b981' : '#ef4444' }} />
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: analyticsData.restaurants.growth >= 0 ? '#10b981' : '#ef4444'
                  }}>
                    {analyticsData.restaurants.growth >= 0 ? '+' : ''}{analyticsData.restaurants.growth}%
                  </span>
                </div>
              );
            })()}
          </div>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#6b7280',
            margin: '0 0 8px 0'
          }}>
            Restaurants Actifs
          </h3>
          <p style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#111827',
            margin: '0 0 8px 0'
          }}>
            {analyticsData ? formatNumber(analyticsData.restaurants.total) : '0'}
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
            <span>Actifs: {analyticsData ? formatNumber(analyticsData.restaurants.active) : '0'}</span>
            <span>Premium: {analyticsData ? formatNumber(analyticsData.restaurants.premium) : '0'}</span>
          </div>
        </div>
      </div>

      {/* Graphiques placeholder */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Graphique des revenus */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#111827',
              margin: 0
            }}>
              Évolution des Revenus
            </h3>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LineChart style={{ width: '16px', height: '16px', color: 'white' }} />
            </div>
          </div>
          <div style={{
            height: '200px',
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #10b981'
          }}>
            <div style={{ textAlign: 'center' }}>
              <LineChart style={{ width: '48px', height: '48px', color: '#10b981', margin: '0 auto 12px' }} />
              <p style={{ color: '#059669', fontWeight: '500' }}>
                Graphique des revenus
              </p>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                À implémenter avec Chart.js
              </p>
            </div>
          </div>
        </div>

        {/* Graphique des commandes */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#111827',
              margin: 0
            }}>
              Répartition des Commandes
            </h3>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PieChart style={{ width: '16px', height: '16px', color: 'white' }} />
            </div>
          </div>
          <div style={{
            height: '200px',
            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #3b82f6'
          }}>
            <div style={{ textAlign: 'center' }}>
              <PieChart style={{ width: '48px', height: '48px', color: '#3b82f6', margin: '0 auto 12px' }} />
              <p style={{ color: '#1d4ed8', fontWeight: '500' }}>
                Graphique en secteurs
              </p>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                À implémenter avec Chart.js
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Message de développement */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '32px',
        textAlign: 'center'
      }}>
        <BarChart3 style={{ 
          width: '64px', 
          height: '64px', 
          color: '#3b82f6', 
          margin: '0 auto 16px' 
        }} />
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#111827',
          margin: '0 0 8px 0'
        }}>
          Section Analyses en développement
        </h3>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: 0
        }}>
          Les graphiques interactifs et les métriques avancées seront bientôt disponibles !
        </p>
      </div>
    </div>
  );
};

export default Analytics;
