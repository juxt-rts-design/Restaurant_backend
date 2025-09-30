import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ClientPage from './pages/ClientPage';
import CaissePage from './pages/CaissePage';
import ManagerPage from './pages/ManagerPage';
import CuisinierPage from './pages/CuisinierPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/client/:qrCode" element={<ClientPage />} />
              
              {/* Routes protégées par rôle */}
              <Route path="/caisse" element={
                <ProtectedRoute allowedRoles={['CAISSIER', 'MANAGER', 'ADMIN']}>
                  <CaissePage />
                </ProtectedRoute>
              } />
              
              <Route path="/manager" element={
                <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
                  <ManagerPage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminPage />
                </ProtectedRoute>
              } />
              
              <Route path="/cuisine" element={
                <ProtectedRoute allowedRoles={['CUISINIER', 'MANAGER', 'ADMIN']}>
                  <CuisinierPage />
                </ProtectedRoute>
              } />
              
              {/* Route pour page de confirmation */}
              <Route path="/confirmation" element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée!</h1>
                    <p className="text-gray-600 mb-4">Votre commande a été enregistrée avec succès.</p>
                    <button 
                      onClick={() => window.location.href = '/'}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                      Retour à l'accueil
                    </button>
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;