import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0f9ff 100%)',
      fontFamily: "'Inter', system-ui, sans-serif",
      display: 'flex'
    }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        marginLeft: '256px'
      }}>
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main style={{ 
          flex: 1, 
          padding: '24px',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
