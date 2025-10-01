import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Mail, Phone, Building2, Shield, Calendar, MapPin, Crown, Briefcase, ChefHat, CreditCard } from 'lucide-react';
import adminApiService from '../services/adminApi';
import { User as UserType } from '../types/admin';
import { useNotification } from './NotificationSystem';

interface UserDetailsModalProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: UserType) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ userId, isOpen, onClose, onUserUpdated }) => {
  const { showNotification } = useNotification();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadUserDetails();
    }
  }, [isOpen, userId]);

  const loadUserDetails = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await adminApiService.getAllUsers();
      if (response.success && response.data) {
        const foundUser = response.data.find(u => u.id_utilisateur === userId);
        if (foundUser) {
          setUser(foundUser);
        } else {
          showNotification({
            type: 'error',
            title: 'Erreur',
            message: 'Utilisateur non trouvé'
          });
          onClose();
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors du chargement des détails'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />;
      case 'MANAGER':
        return <Briefcase style={{ width: '20px', height: '20px', color: '#3b82f6' }} />;
      case 'CAISSE':
        return <CreditCard style={{ width: '20px', height: '20px', color: '#10b981' }} />;
      case 'CUISINE':
        return <ChefHat style={{ width: '20px', height: '20px', color: '#f59e0b' }} />;
      default:
        return <UserIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />;
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'ACTIF':
        return '#10b981';
      case 'INACTIF':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (!isOpen || !user) return null;

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
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '30px',
        animation: 'slideInUp 0.3s ease-out'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
          }}
        >
          <X className="w-6 h-6" />
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <UserIcon className="w-7 h-7 mr-3 text-blue-600" />
          Détails de l'Utilisateur
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '16px', color: '#6b7280' }}>Chargement...</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Informations principales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Nom utilisateur</label>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <UserIcon style={{ width: '16px', height: '16px', color: '#6b7280', marginRight: '8px' }} />
                  <span style={{ fontSize: '16px', color: '#1f2937' }}>{user.nom_utilisateur}</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Email</label>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <Mail style={{ width: '16px', height: '16px', color: '#6b7280', marginRight: '8px' }} />
                  <span style={{ fontSize: '16px', color: '#1f2937' }}>{user.email}</span>
                </div>
              </div>


              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Rôle</label>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  {getRoleIcon(user.role)}
                  <span style={{ fontSize: '16px', color: '#1f2937', marginLeft: '8px' }}>{user.role}</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Statut</label>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <Shield style={{ width: '16px', height: '16px', color: getStatusColor(user.statut), marginRight: '8px' }} />
                  <span style={{ fontSize: '16px', color: '#1f2937' }}>{user.statut}</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Restaurant</label>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <Building2 style={{ width: '16px', height: '16px', color: '#6b7280', marginRight: '8px' }} />
                  <span style={{ fontSize: '16px', color: '#1f2937' }}>{user.restaurant_nom || 'Non assigné'}</span>
                </div>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '15px' }}>Informations supplémentaires</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Date de création</label>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <Calendar style={{ width: '16px', height: '16px', color: '#6b7280', marginRight: '8px' }} />
                    <span style={{ fontSize: '16px', color: '#1f2937' }}>
                      {user.date_creation ? new Date(user.date_creation).toLocaleDateString('fr-FR') : 'Non renseigné'}
                    </span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Dernière connexion</label>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <Calendar style={{ width: '16px', height: '16px', color: '#6b7280', marginRight: '8px' }} />
                    <span style={{ fontSize: '16px', color: '#1f2937' }}>
                      {user.derniere_connexion ? new Date(user.derniere_connexion).toLocaleDateString('fr-FR') : 'Jamais'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsModal;
