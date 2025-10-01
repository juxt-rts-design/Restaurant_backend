import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Mail, Phone, Building2, Shield, Save, Loader2 } from 'lucide-react';
import adminApiService from '../services/adminApi';
import { User, UpdateUserRequest } from '../types/admin';
import { useNotification } from './NotificationSystem';

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onUserUpdated }) => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<UpdateUserRequest>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        nom_utilisateur: user.nom_utilisateur,
        email: user.email,
        role: user.role,
        statut: user.statut,
        id_restaurant: user.id_restaurant
      });
    }
  }, [isOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id_utilisateur) {
      showNotification({ type: 'error', title: 'Erreur', message: 'ID de l\'utilisateur manquant pour la mise à jour.' });
      return;
    }

    setLoading(true);
    try {
      const response = await adminApiService.updateUser(user.id_utilisateur, formData);
      if (response.success && response.data) {
        showNotification({ type: 'success', title: 'Succès', message: 'Utilisateur mis à jour avec succès !' });
        onUserUpdated(response.data);
        onClose();
      } else {
        showNotification({ type: 'error', title: 'Erreur', message: response.error || 'Erreur lors de la mise à jour de l\'utilisateur.' });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      showNotification({ type: 'error', title: 'Erreur', message: 'Erreur réseau lors de la mise à jour de l\'utilisateur.' });
    } finally {
      setLoading(false);
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
          Éditer l'Utilisateur: {user.nom_utilisateur}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          {/* Nom utilisateur */}
          <div>
            <label htmlFor="nom_utilisateur" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Nom utilisateur</label>
            <input
              type="text"
              id="nom_utilisateur"
              name="nom_utilisateur"
              value={formData.nom_utilisateur || ''}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db',
                fontSize: '16px', color: '#1f2937', outline: 'none', transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db',
                fontSize: '16px', color: '#1f2937', outline: 'none', transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>


          {/* Rôle */}
          <div>
            <label htmlFor="role" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Rôle</label>
            <select
              id="role"
              name="role"
              value={formData.role || ''}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db',
                fontSize: '16px', color: '#1f2937', outline: 'none', transition: 'border-color 0.2s',
                boxSizing: 'border-box', appearance: 'none', background: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007bff%22%20d%3D%22M287%20197.3L159.9%2069.8c-4.8-4.8-12.5-4.8-17.3%200L5.4%20197.3c-4.8%204.8-4.8%2012.5%200%2017.3s12.5%204.8%2017.3%200l130.7-130.7c4.8-4.8%2012.5-4.8%2017.3%200l130.7%20130.7c4.8%204.8%2012.5%204.8%2017.3%200s4.8-12.5%200-17.3z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 12px center / 12px auto',
                backgroundColor: 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option value="ADMIN">Administrateur</option>
              <option value="MANAGER">Manager</option>
              <option value="CAISSE">Caissier</option>
              <option value="CUISINE">Cuisinier</option>
            </select>
          </div>

          {/* Statut */}
          <div>
            <label htmlFor="statut" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Statut</label>
            <select
              id="statut"
              name="statut"
              value={formData.statut || ''}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db',
                fontSize: '16px', color: '#1f2937', outline: 'none', transition: 'border-color 0.2s',
                boxSizing: 'border-box', appearance: 'none', background: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007bff%22%20d%3D%22M287%20197.3L159.9%2069.8c-4.8-4.8-12.5-4.8-17.3%200L5.4%20197.3c-4.8%204.8-4.8%2012.5%200%2017.3s12.5%204.8%2017.3%200l130.7-130.7c4.8-4.8%2012.5-4.8%2017.3%200l130.7%20130.7c4.8%204.8%2012.5%204.8%2017.3%200s4.8-12.5%200-17.3z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 12px center / 12px auto',
                backgroundColor: 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option value="ACTIF">Actif</option>
              <option value="INACTIF">Inactif</option>
            </select>
          </div>

          {/* Restaurant */}
          <div>
            <label htmlFor="id_restaurant" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Restaurant</label>
            <input
              type="number"
              id="id_restaurant"
              name="id_restaurant"
              value={formData.id_restaurant || ''}
              onChange={handleChange}
              min="1"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db',
                fontSize: '16px', color: '#1f2937', outline: 'none', transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 25px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.2s ease-in-out',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2563eb')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#3b82f6')}
            >
              {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
              {loading ? 'Mise à jour...' : 'Sauvegarder les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
