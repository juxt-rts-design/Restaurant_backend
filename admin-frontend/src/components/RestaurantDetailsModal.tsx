import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  DollarSign, 
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  Clock,
  CreditCard
} from 'lucide-react';
import adminApiService from '../services/adminApi';
import { Restaurant } from '../types/admin';
import { useNotification } from './NotificationSystem';

interface RestaurantDetailsModalProps {
  restaurantId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onRestaurantUpdated?: (restaurant: Restaurant) => void;
}

const RestaurantDetailsModal: React.FC<RestaurantDetailsModalProps> = ({
  restaurantId,
  isOpen,
  onClose,
  onRestaurantUpdated
}) => {
  const { showNotification } = useNotification();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && restaurantId) {
      loadRestaurantDetails(restaurantId);
    }
  }, [isOpen, restaurantId]);

  const loadRestaurantDetails = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApiService.getRestaurantById(id);
      
      if (response.success && response.data) {
        setRestaurant(response.data);
      } else {
        setError(response.error || 'Erreur lors du chargement');
        showNotification({
          type: 'error',
          title: 'Erreur',
          message: response.error || 'Restaurant non trouvé'
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur lors du chargement');
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors du chargement des détails'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!restaurant) return;
    
    try {
      const response = await adminApiService.toggleRestaurantStatus(restaurant.id);
      if (response.success && response.data) {
        setRestaurant(response.data);
        onRestaurantUpdated?.(response.data);
        showNotification({
          type: 'success',
          title: 'Succès',
          message: `Restaurant ${response.data.statut.toLowerCase()} avec succès !`
        });
      } else {
        showNotification({
          type: 'error',
          title: 'Erreur',
          message: response.error || 'Erreur lors du changement de statut'
        });
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors du changement de statut'
      });
    }
  };

  const handleDelete = async () => {
    if (!restaurant) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ? Cette action est irréversible.')) {
      try {
        const response = await adminApiService.deleteRestaurant(restaurant.id);
        if (response.success) {
          showNotification({
            type: 'success',
            title: 'Succès',
            message: 'Restaurant supprimé avec succès !'
          });
          onClose();
        } else {
          showNotification({
            type: 'error',
            title: 'Erreur',
            message: response.error || 'Erreur lors de la suppression'
          });
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showNotification({
          type: 'error',
          title: 'Erreur',
          message: 'Erreur lors de la suppression'
        });
      }
    }
  };

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIF': return '#10b981';
      case 'SUSPENDU': return '#f59e0b';
      case 'INACTIF': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIF': return <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />;
      case 'SUSPENDU': return <AlertTriangle className="w-5 h-5" style={{ color: '#f59e0b' }} />;
      case 'INACTIF': return <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />;
      default: return null;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'BASIC': return '#6b7280';
      case 'PREMIUM': return '#8b5cf6';
      case 'ENTREPRISE': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 24px 0 24px',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '24px'
        }}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Building2 className="w-6 h-6" />
              Détails du Restaurant
            </h2>
            {restaurant && (
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '4px 0 0 0'
              }}>
                {restaurant.nom}
              </p>
            )}
          </div>
          
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X className="w-5 h-5" style={{ color: '#6b7280' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '0 24px 24px 24px' }}>
          {loading && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              fontSize: '16px',
              color: '#6b7280'
            }}>
              Chargement des détails...
            </div>
          )}

          {error && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              fontSize: '16px',
              color: '#ef4444'
            }}>
              {error}
            </div>
          )}

          {restaurant && !loading && !error && (
            <>
              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={handleToggleStatus}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: restaurant.statut === 'ACTIF' ? '#f59e0b' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {restaurant.statut === 'ACTIF' ? (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      Suspendre
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Activer
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleDelete}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>

              {/* Informations principales */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '24px'
              }}>
                {/* Informations générales */}
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Building2 className="w-5 h-5" />
                    Informations Générales
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Nom du Restaurant
                      </label>
                      <p style={{
                        fontSize: '16px',
                        color: '#111827',
                        margin: 0,
                        fontWeight: '500'
                      }}>
                        {restaurant.nom}
                      </p>
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Slug
                      </label>
                      <p style={{
                        fontSize: '14px',
                        color: '#111827',
                        margin: 0,
                        fontFamily: 'monospace',
                        backgroundColor: '#e5e7eb',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        {restaurant.slug}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#6b7280',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Statut
                        </label>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {getStatusIcon(restaurant.statut)}
                          <span style={{
                            fontSize: '14px',
                            color: getStatusColor(restaurant.statut),
                            fontWeight: '500'
                          }}>
                            {restaurant.statut}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#6b7280',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Plan
                        </label>
                        <span style={{
                          fontSize: '14px',
                          color: getPlanColor(restaurant.plan),
                          fontWeight: '500'
                        }}>
                          {restaurant.plan}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Mail className="w-5 h-5" />
                    Contact
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Email
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Mail className="w-4 h-4" style={{ color: '#6b7280' }} />
                        <a
                          href={`mailto:${restaurant.email}`}
                          style={{
                            fontSize: '14px',
                            color: '#3b82f6',
                            textDecoration: 'none'
                          }}
                        >
                          {restaurant.email}
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Téléphone
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Phone className="w-4 h-4" style={{ color: '#6b7280' }} />
                        <a
                          href={`tel:${restaurant.telephone}`}
                          style={{
                            fontSize: '14px',
                            color: '#3b82f6',
                            textDecoration: 'none'
                          }}
                        >
                          {restaurant.telephone}
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Adresse
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px'
                      }}>
                        <MapPin className="w-4 h-4" style={{ color: '#6b7280', marginTop: '2px' }} />
                        <span style={{
                          fontSize: '14px',
                          color: '#111827'
                        }}>
                          {restaurant.adresse}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuration et Historique */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px'
              }}>
                {/* Configuration */}
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Globe className="w-5 h-5" />
                    Configuration
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Devise
                      </label>
                      <p style={{
                        fontSize: '14px',
                        color: '#111827',
                        margin: 0
                      }}>
                        {restaurant.devise}
                      </p>
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Fuseau Horaire
                      </label>
                      <p style={{
                        fontSize: '14px',
                        color: '#111827',
                        margin: 0
                      }}>
                        {restaurant.fuseau_horaire}
                      </p>
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Limite Commandes/Mois
                      </label>
                      <p style={{
                        fontSize: '14px',
                        color: '#111827',
                        margin: 0
                      }}>
                        {restaurant.limite_commandes_mois}
                      </p>
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Limite Utilisateurs
                      </label>
                      <p style={{
                        fontSize: '14px',
                        color: '#111827',
                        margin: 0
                      }}>
                        {restaurant.limite_utilisateurs}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Historique */}
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Calendar className="w-5 h-5" />
                    Historique
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Date de Création
                      </label>
                      <p style={{
                        fontSize: '14px',
                        color: '#111827',
                        margin: 0
                      }}>
                        {new Date(restaurant.date_creation).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Dernière Mise à Jour
                      </label>
                      <p style={{
                        fontSize: '14px',
                        color: '#111827',
                        margin: 0
                      }}>
                        {new Date(restaurant.date_mise_a_jour).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsModal;
