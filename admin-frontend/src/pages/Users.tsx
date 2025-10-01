import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  Building2,
  Shield,
  UserCheck,
  UserX,
  Crown,
  Briefcase,
  ChefHat,
  CreditCard,
  Calendar,
  MapPin
} from 'lucide-react';
import adminApiService from '../services/adminApi';
import { User } from '../types/admin';
import CreateUserModal from '../components/CreateUserModal';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [restaurantFilter, setRestaurantFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: number, action: string) => {
    try {
      if (action === 'Activer') {
        const response = await adminApiService.updateUser(userId, { statut: 'ACTIF' });
        if (response.success) {
          alert(`✅ Utilisateur activé avec succès !`);
          await loadUsers();
        } else {
          alert(`❌ Erreur: ${response.error}`);
        }
      } else if (action === 'Désactiver') {
        const response = await adminApiService.updateUser(userId, { statut: 'INACTIF' });
        if (response.success) {
          alert(`⚠️ Utilisateur désactivé avec succès !`);
          await loadUsers();
        } else {
          alert(`❌ Erreur: ${response.error}`);
        }
      } else if (action === 'Voir détails') {
        window.location.href = `/users/${userId}`;
      } else if (action === 'Éditer') {
        window.location.href = `/users/${userId}/edit`;
      } else if (action === 'Supprimer') {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
          const response = await adminApiService.deleteUser(userId);
          if (response.success) {
            alert(`🗑️ Utilisateur supprimé avec succès !`);
            await loadUsers();
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />;
      case 'MANAGER':
        return <Briefcase style={{ width: '16px', height: '16px', color: '#3b82f6' }} />;
      case 'CAISSIER':
        return <CreditCard style={{ width: '16px', height: '16px', color: '#10b981' }} />;
      case 'CUISINIER':
        return <ChefHat style={{ width: '16px', height: '16px', color: '#f59e0b' }} />;
      default:
        return <UsersIcon style={{ width: '16px', height: '16px', color: '#6b7280' }} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '#8b5cf6';
      case 'MANAGER':
        return '#3b82f6';
      case 'CAISSIER':
        return '#10b981';
      case 'CUISINIER':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'ACTIF':
        return '#10b981';
      case 'INACTIF':
        return '#ef4444';
      case 'SUSPENDU':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'ACTIF':
        return <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981' }} />;
      case 'INACTIF':
        return <XCircle style={{ width: '16px', height: '16px', color: '#ef4444' }} />;
      case 'SUSPENDU':
        return <AlertTriangle style={{ width: '16px', height: '16px', color: '#f59e0b' }} />;
      default:
        return <AlertTriangle style={{ width: '16px', height: '16px', color: '#6b7280' }} />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nom_utilisateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.telephone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || user.statut === statusFilter;
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesRestaurant = restaurantFilter === 'ALL' || user.restaurant_id?.toString() === restaurantFilter;
    
    return matchesSearch && matchesStatus && matchesRole && matchesRestaurant;
  });

  // Get unique restaurants for filter
  const uniqueRestaurants = Array.from(new Set(users.map(user => user.restaurant_id).filter(Boolean)));

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
            Chargement des utilisateurs...
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
          👥 Utilisateurs
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          margin: 0
        }}>
          Gestion de tous les utilisateurs de la plateforme
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
          {/* Bouton Nouvel Utilisateur */}
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
            Nouvel Utilisateur
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
                {users.length}
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
                {users.filter(u => u.statut === 'ACTIF').length}
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
                color: '#8b5cf6',
                margin: '0 0 4px 0'
              }}>
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                margin: 0
              }}>
                Admins
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#3b82f6',
                margin: '0 0 4px 0'
              }}>
                {users.filter(u => u.role === 'MANAGER').length}
              </p>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                margin: 0
              }}>
                Managers
              </p>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Recherche */}
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
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
              placeholder="Rechercher un utilisateur..."
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
            <option value="INACTIF">Inactif</option>
            <option value="SUSPENDU">Suspendu</option>
          </select>

          {/* Filtre Rôle */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
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
            <option value="ALL">Tous les rôles</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="CAISSIER">Caissier</option>
            <option value="CUISINIER">Cuisinier</option>
          </select>

          {/* Filtre Restaurant */}
          <select
            value={restaurantFilter}
            onChange={(e) => setRestaurantFilter(e.target.value)}
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
            <option value="ALL">Tous les restaurants</option>
            {uniqueRestaurants.map(restaurantId => (
              <option key={restaurantId} value={restaurantId}>
                Restaurant {restaurantId}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des Utilisateurs */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {filteredUsers.length === 0 ? (
          <div style={{
            padding: '64px 24px',
            textAlign: 'center'
          }}>
            <UsersIcon style={{
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
              Aucun utilisateur trouvé
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0
            }}>
              {searchTerm || statusFilter !== 'ALL' || roleFilter !== 'ALL' || restaurantFilter !== 'ALL'
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Commencez par créer votre premier utilisateur'
              }
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredUsers.map((user, index) => (
              <div
                key={user.id_utilisateur}
                style={{
                  padding: '24px',
                  borderBottom: index < filteredUsers.length - 1 ? '1px solid #f3f4f6' : 'none',
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
                  {/* Informations de l'utilisateur */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${getRoleColor(user.role)}, ${getRoleColor(user.role)}dd)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 12px ${getRoleColor(user.role)}40`
                    }}>
                      <span style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>
                        {user.nom_utilisateur.charAt(0).toUpperCase()}
                      </span>
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
                          {user.nom_utilisateur}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: `rgba(${getRoleColor(user.role).replace('#', '')}, 0.1)`,
                            color: getRoleColor(user.role),
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {getRoleIcon(user.role)}
                            {user.role}
                          </span>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: `rgba(${getStatusColor(user.statut).replace('#', '')}, 0.1)`,
                            color: getStatusColor(user.statut),
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {getStatusIcon(user.statut)}
                            {user.statut}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {user.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Mail style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>
                              {user.email}
                            </span>
                          </div>
                        )}
                        {user.telephone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Phone style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>
                              {user.telephone}
                            </span>
                          </div>
                        )}
                        {user.restaurant_id && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Building2 style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>
                              Restaurant {user.restaurant_id}
                            </span>
                          </div>
                        )}
                        {user.date_creation && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>
                              {new Date(user.date_creation).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Boutons d'action */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserAction(user.id_utilisateur, 'Voir détails');
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
                          handleUserAction(user.id_utilisateur, 'Éditer');
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

                      {user.statut === 'INACTIF' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserAction(user.id_utilisateur, 'Activer');
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
                          <UserCheck style={{ width: '16px', height: '16px', color: '#10b981' }} />
                        </button>
                      ) : user.statut === 'ACTIF' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserAction(user.id_utilisateur, 'Désactiver');
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
                          title="Désactiver"
                        >
                          <UserX style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                        </button>
                      ) : null}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserAction(user.id_utilisateur, 'Supprimer');
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
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadUsers}
      />
    </div>
  );
};

export default Users;