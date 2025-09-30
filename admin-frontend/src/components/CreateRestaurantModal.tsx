import React, { useState } from 'react';
import { X, Building2, Mail, Phone, MapPin, Globe, CreditCard } from 'lucide-react';
import { adminApiService } from '../services/adminApi';
import { CreateRestaurantRequest } from '../types/admin';

interface CreateRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateRestaurantModal: React.FC<CreateRestaurantModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<CreateRestaurantRequest>({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    pays: 'Gabon',
    plan: 'BASIC',
    statut: 'ACTIF'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom du restaurant est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    }

    if (!formData.adresse.trim()) {
      newErrors.adresse = 'L\'adresse est requise';
    }

    if (!formData.ville.trim()) {
      newErrors.ville = 'La ville est requise';
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
      const response = await adminApiService.createRestaurant(formData);
      
      if (response.success) {
        alert('✅ Restaurant créé avec succès !');
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          nom: '',
          email: '',
          telephone: '',
          adresse: '',
          ville: '',
          pays: 'Gabon',
          plan: 'BASIC',
          statut: 'ACTIF'
        });
      } else {
        alert(`❌ Erreur: ${response.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('❌ Erreur lors de la création du restaurant');
    } finally {
      setLoading(false);
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
              <Building2 style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0 0 4px 0'
              }}>
                Nouveau Restaurant
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Créer un nouveau restaurant sur la plateforme
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
            {/* Nom du restaurant */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Nom du restaurant *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                placeholder="Ex: Restaurant Le Gourmet"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: `1px solid ${errors.nom ? '#ef4444' : '#d1d5db'}`,
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
                  e.target.style.borderColor = errors.nom ? '#ef4444' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.nom && (
                <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                  {errors.nom}
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
                  placeholder="contact@restaurant.com"
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

            {/* Téléphone */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Téléphone *
              </label>
              <div style={{ position: 'relative' }}>
                <Phone style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af'
                }} />
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="+241 01 23 45 67"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    fontSize: '16px',
                    border: `1px solid ${errors.telephone ? '#ef4444' : '#d1d5db'}`,
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
                    e.target.style.borderColor = errors.telephone ? '#ef4444' : '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.telephone && (
                <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                  {errors.telephone}
                </p>
              )}
            </div>

            {/* Adresse */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Adresse *
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin style={{
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
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  placeholder="123 Avenue de la République"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    fontSize: '16px',
                    border: `1px solid ${errors.adresse ? '#ef4444' : '#d1d5db'}`,
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
                    e.target.style.borderColor = errors.adresse ? '#ef4444' : '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.adresse && (
                <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                  {errors.adresse}
                </p>
              )}
            </div>

            {/* Ville */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Ville *
              </label>
              <input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleInputChange}
                placeholder="Libreville"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: `1px solid ${errors.ville ? '#ef4444' : '#d1d5db'}`,
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
                  e.target.style.borderColor = errors.ville ? '#ef4444' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.ville && (
                <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                  {errors.ville}
                </p>
              )}
            </div>

            {/* Pays */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Pays
              </label>
              <input
                type="text"
                name="pays"
                value={formData.pays}
                onChange={handleInputChange}
                placeholder="Gabon"
                style={{
                  width: '100%',
                  padding: '12px 16px',
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

            {/* Plan */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Plan
              </label>
              <div style={{ position: 'relative' }}>
                <CreditCard style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: '#9ca3af'
                }} />
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    fontSize: '16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    background: '#f9fafb',
                    cursor: 'pointer',
                    appearance: 'none'
                  }}
                >
                  <option value="BASIC">Basic - Gratuit</option>
                  <option value="PREMIUM">Premium - 50,000 FCFA/mois</option>
                  <option value="ENTERPRISE">Enterprise - 100,000 FCFA/mois</option>
                </select>
              </div>
            </div>

            {/* Statut */}
            <div>
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
                <option value="ACTIF">Actif</option>
                <option value="INACTIF">Inactif</option>
                <option value="SUSPENDU">Suspendu</option>
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
                'Créer le restaurant'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRestaurantModal;
