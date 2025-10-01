import React, { useState, useEffect } from 'react';
import { X, Users, Mail, Phone, Building2, Shield, Lock, User as UserIcon } from 'lucide-react';
import adminApiService from '../services/adminApi';
import { CreateUserRequest, Restaurant, User } from '../types/admin';
import { useNotification } from './NotificationSystem';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<CreateUserRequest>({
    nom_utilisateur: '',
    email: '',
    mot_de_passe: '',
    role: 'CAISSIER',
    restaurant_id: null,
    statut: 'ACTIF'
  });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadRestaurants();
    }
  }, [isOpen]);

  const loadRestaurants = async () => {
    try {
      const response = await adminApiService.getAllRestaurants();
      if (response.success && response.data) {
        setRestaurants(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des restaurants:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'restaurant_id' ? (value ? parseInt(value) : null) : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom_utilisateur.trim()) {
      newErrors.nom_utilisateur = 'Le nom d\'utilisateur est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.mot_de_passe.trim()) {
      newErrors.mot_de_passe = 'Le mot de passe est requis';
    } else if (formData.mot_de_passe.length < 6) {
      newErrors.mot_de_passe = 'Le mot de passe doit contenir au moins 6 caractères';
    }


    if (!formData.role) {
      newErrors.role = 'Le rôle est requis';
    }

    if (!formData.restaurant_id) {
      newErrors.restaurant_id = 'Le restaurant est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await adminApiService.createUser(formData);
      
      if (response.success && response.data) {
        showNotification({
          type: 'success',
          title: 'Succès',
          message: 'Utilisateur créé avec succès !'
        });
        onSuccess(response.data);
        onClose();
        // Reset form
        setFormData({
          nom_utilisateur: '',
          email: '',
          mot_de_passe: '',
          role: 'CAISSIER',
          restaurant_id: null,
          statut: 'ACTIF'
        });
      } else {
        showNotification({
          type: 'error',
          title: 'Erreur',
          message: response.error || 'Erreur lors de la création de l\'utilisateur'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors de la création de l\'utilisateur'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '👑';
      case 'MANAGER':
        return '💼';
      case 'CAISSIER':
        return '💳';
      case 'CUISINIER':
        return '👨‍🍳';
      default:
        return '👤';
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0 0 4px 0'
              }}>
                Nouvel Utilisateur
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Créer un nouvel utilisateur sur la plateforme
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: '#f3f4f6',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
            }}
          >
            <X style={{ width: '20px', height: '20px', color: '#6b7280' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Nom d'utilisateur */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Nom d'utilisateur *
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon style={{
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
                  name="nom_utilisateur"
                  value={formData.nom_utilisateur}
                  onChange={handleInputChange}
                  placeholder="Ex: Jean Dupont"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    fontSize: '16px',
                    border: `1px solid ${errors.nom_utilisateur ? '#ef4444' : '#d1d5db'}`,
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
                    e.target.style.borderColor = errors.nom_utilisateur ? '#ef4444' : '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.nom_utilisateur && (
                <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                  {errors.nom_utilisateur}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af'
                }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jean@restaurant.com"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    fontSize: '16px',
                    border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
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
                    e.target.style.borderColor = errors.email ? '#ef4444' : '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.email && (
                <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Mot de passe *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af'
                }} />
                <input
                  type="password"
                  name="mot_de_passe"
                  value={formData.mot_de_passe}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    fontSize: '16px',
                    border: `1px solid ${errors.mot_de_passe ? '#ef4444' : '#d1d5db'}`,
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
                    e.target.style.borderColor = errors.mot_de_passe ? '#ef4444' : '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.mot_de_passe && (
                <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                  {errors.mot_de_passe}
                </p>
              )}
            </div>


            {/* Rôle */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Rôle *
              </label>
              <div style={{ position: 'relative' }}>
                <Shield style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af'
                }} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    fontSize: '16px',
                    border: `1px solid ${errors.role ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '12px',
                    background: '#f9fafb',
                    cursor: 'pointer',
                    appearance: 'none'
                  }}
                >
                  <option value="CAISSIER">💳 Caissier</option>
                  <option value="CUISINIER">👨‍🍳 Cuisinier</option>
                  <option value="MANAGER">💼 Manager</option>
                  <option value="ADMIN">👑 Admin</option>
                </select>
              </div>
              {errors.role && (
                <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                  {errors.role}
                </p>
              )}
            </div>

            {/* Restaurant */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Restaurant *
              </label>
              <div style={{ position: 'relative' }}>
                <Building2 style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af'
                }} />
                <select
                  name="restaurant_id"
                  value={formData.restaurant_id || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    fontSize: '16px',
                    border: `1px solid ${errors.restaurant_id ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '12px',
                    background: '#f9fafb',
                    cursor: 'pointer',
                    appearance: 'none'
                  }}
                >
                  <option value="">Sélectionner un restaurant</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.nom} ({restaurant.plan})
                    </option>
                  ))}
                </select>
              </div>
              {errors.restaurant_id && (
                <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                  {errors.restaurant_id}
                </p>
              )}
            </div>

            {/* Statut */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Statut
              </label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  background: '#f9fafb',
                  cursor: 'pointer',
                  appearance: 'none'
                }}
              >
                <option value="ACTIF">✅ Actif</option>
                <option value="INACTIF">❌ Inactif</option>
                <option value="SUSPENDU">⚠️ Suspendu</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#6b7280',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Création...
                </div>
              ) : (
                'Créer l\'utilisateur'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
