import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Bell, User } from 'lucide-react';

const Header: React.FC = () => {
  const { state } = useAdmin();

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '16px 24px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        {/* Page Title */}
        <div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#111827',
            margin: 0
          }}>
            Administration SaaS
          </h1>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280',
            margin: 0
          }}>
            Gestion de la plateforme multi-restaurants
          </p>
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Notifications */}
          <button style={{
            padding: '12px',
            color: '#9ca3af',
            borderRadius: '8px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#2563eb';
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#9ca3af';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}>
            <Bell style={{ width: '24px', height: '24px' }} />
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '12px',
              height: '12px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></span>
          </button>

          {/* User Info */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '8px', 
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(249, 250, 251, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#111827',
                margin: 0
              }}>
                {state.user?.nom_utilisateur}
              </p>
              <p style={{ 
                fontSize: '12px', 
                color: '#2563eb', 
                fontWeight: '500',
                margin: 0
              }}>
                {state.user?.role}
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <User style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
