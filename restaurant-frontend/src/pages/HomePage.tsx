import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Smartphone, CreditCard, Users, Clock, Star, Lock, User, Settings, ChefHat } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScanQR = () => {
    if (qrCode.trim()) {
      setIsScanning(true);
      // Simuler un délai de scan
      setTimeout(() => {
        navigate(`/client/${qrCode.trim()}`);
        setIsScanning(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScanQR();
    }
  };

  const features = [
    {
      icon: QrCode,
      title: 'Commande via QR Code',
      description: 'Scannez le QR code de votre table pour accéder au menu'
    },
    {
      icon: Smartphone,
      title: 'Interface Mobile',
      description: 'Optimisé pour smartphones et tablettes'
    },
    {
      icon: CreditCard,
      title: 'Paiement Multiple',
      description: 'Espèces, Mobile Money, Carte bancaire'
    },
    {
      icon: Users,
      title: 'Service Rapide',
      description: 'Commande directe sans attendre le serveur'
    },
    {
      icon: Clock,
      title: 'Temps Réel',
      description: 'Suivi de votre commande en direct'
    },
    {
      icon: Star,
      title: 'Expérience Moderne',
      description: 'Interface intuitive et moderne'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Restaurant Interactive</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <button
                onClick={() => navigate('/caisse')}
                className="text-gray-600 hover:text-gray-900 transition-colors px-2 sm:px-3 py-2 rounded-md hover:bg-gray-100 text-sm sm:text-base"
              >
                Caisse
              </button>
              <button
                onClick={() => navigate('/manager')}
                className="text-gray-600 hover:text-gray-900 transition-colors px-2 sm:px-3 py-2 rounded-md hover:bg-gray-100 text-sm sm:text-base"
              >
                Manager
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Commandez en toute
            <span className="text-blue-600"> simplicité</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            Scannez le QR code de votre table pour accéder au menu, 
            commander vos plats préférés et payer directement depuis votre smartphone.
          </p>

          {/* QR Code Scanner */}
          <div className="max-w-sm sm:max-w-md mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8 mb-8 sm:mb-12">
            <div className="text-center mb-4 sm:mb-6">
              <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Scanner le QR Code
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Entrez le code QR de votre table ou scannez-le
              </p>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <input
                type="text"
                placeholder="Code QR de la table (ex: TBL001LIBREVILLE12345678)"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm sm:text-base"
              />
              
              <button
                onClick={handleScanQR}
                disabled={!qrCode.trim() || isScanning}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {isScanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Scan en cours...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>Accéder au menu</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Demo QR Codes */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-2xl mx-auto">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Codes QR de démonstration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {[
                'TBL001LIBREVILLE12345678',
                'TBL002PORTGENTIL12345678',
                'TBL003FRANCEVILLE1234567'
              ].map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setQrCode(code);
                    navigate(`/client/${code}`);
                  }}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {code.substring(0, 8)}...
                  </div>
                  <div className="text-xs text-gray-600">
                    Cliquer pour tester
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir notre système ?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Une expérience de commande moderne, rapide et intuitive 
              qui révolutionne votre façon de commander au restaurant.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-4 sm:p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Prêt à commander ?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Trouvez le QR code sur votre table et commencez votre expérience 
            de commande interactive dès maintenant.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => navigate('/caisse')}
              className="bg-white text-blue-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Interface Caisse
            </button>
            <button
              onClick={() => navigate('/manager')}
              className="border-2 border-white text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors text-sm sm:text-base"
            >
              Dashboard Manager
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h3 className="text-xl font-bold">Restaurant Interactive</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Système de commande moderne pour restaurants
            </p>
            <p className="text-sm text-gray-500">
              © 2024 Restaurant Interactive. Tous droits réservés.
            </p>
          </div>

          {/* Section Accès Personnel */}
          <div className="mt-12 sm:mt-16 max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Accès Personnel
              </h2>
              <p className="text-gray-600 px-4">
                Espaces de travail pour le personnel du restaurant
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Accès Caissier */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Espace Caissier</h3>
                    <p className="text-sm sm:text-base text-gray-600">Gestion des commandes et paiements</p>
                  </div>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                    Gestion des commandes en temps réel
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                    Validation des paiements
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                    Fermeture des sessions
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Lock className="w-4 h-4" />
                  <span>Se connecter</span>
                </button>
              </div>

              {/* Accès Cuisinier */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Espace Cuisinier</h3>
                    <p className="text-sm sm:text-base text-gray-600">Gestion des commandes cuisine</p>
                  </div>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 flex-shrink-0"></div>
                    Commandes par table numérotées
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 flex-shrink-0"></div>
                    Suivi de préparation
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 flex-shrink-0"></div>
                    Quantités et détails
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/cuisine')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>Accéder</span>
                </button>
              </div>

              {/* Accès Admin */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Espace Administrateur</h3>
                    <p className="text-sm sm:text-base text-gray-600">Gestion complète du restaurant</p>
                  </div>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                    Gestion du menu et des produits
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                    Gestion des utilisateurs
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                    Statistiques et rapports
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Lock className="w-4 h-4" />
                  <span>Se connecter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;