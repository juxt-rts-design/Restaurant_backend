import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, CheckCircle, Info } from 'lucide-react';

interface StockNotificationProps {
  product: {
    id_produit: number;
    nom_produit: string;
    stock_disponible: number;
    actif: boolean;
  };
  onClose: () => void;
}

const StockNotification: React.FC<StockNotificationProps> = ({ product, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Délai pour l'animation
    }, 5000); // Auto-fermeture après 5 secondes

    return () => clearTimeout(timer);
  }, [onClose]);

  const getNotificationType = () => {
    if (!product.actif) {
      return {
        type: 'info',
        icon: <Info className="w-5 h-5" />,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        title: 'Produit désactivé',
        message: `${product.nom_produit} a été désactivé`
      };
    }

    if (product.stock_disponible === 0) {
      return {
        type: 'error',
        icon: <X className="w-5 h-5" />,
        color: 'bg-red-100 text-red-800 border-red-200',
        title: 'Stock épuisé',
        message: `${product.nom_produit} est en rupture de stock`
      };
    }

    if (product.stock_disponible <= 5) {
      return {
        type: 'warning',
        icon: <AlertTriangle className="w-5 h-5" />,
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        title: 'Stock faible',
        message: `${product.nom_produit} - Plus que ${product.stock_disponible} unité${product.stock_disponible > 1 ? 's' : ''}`
      };
    }

    return {
      type: 'success',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-green-100 text-green-800 border-green-200',
      title: 'Stock mis à jour',
      message: `${product.nom_produit} - ${product.stock_disponible} unités disponibles`
    };
  };

  const notification = getNotificationType();

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${notification.color} p-4`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {notification.icon}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">
              {notification.title}
            </p>
            <p className="mt-1 text-sm opacity-90">
              {notification.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockNotification;
