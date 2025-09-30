import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  BarChart3, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

const Sidebar: React.FC = () => {
  const { logout } = useAdmin();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Restaurants', href: '/restaurants', icon: Building2 },
    { name: 'Utilisateurs', href: '/users', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  return (
    <div style={{
      width: '256px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid rgba(229, 231, 235, 0.5)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Logo */}
      <div style={{ 
        padding: '24px', 
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)'
          }}>
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#111827',
              margin: 0
            }}>
              Admin SaaS
            </h1>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              margin: 0
            }}>
              Gestion Restaurants
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ marginTop: '24px', flex: 1 }}>
        <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: isActive ? '#1d4ed8' : '#4b5563',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent'
                })}
              >
                <Icon style={{ 
                  marginRight: '12px', 
                  width: '20px', 
                  height: '20px' 
                }} />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div style={{ 
        padding: '16px', 
        borderTop: '1px solid rgba(229, 231, 235, 0.5)' 
      }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#4b5563',
            borderRadius: '8px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
            e.currentTarget.style.color = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#4b5563';
          }}
        >
          <LogOut style={{ marginRight: '12px', width: '20px', height: '20px' }} />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
