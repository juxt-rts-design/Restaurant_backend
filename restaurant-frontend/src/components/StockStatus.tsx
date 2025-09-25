import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface StockStatusProps {
  stock: number;
  isActive: boolean;
}

const StockStatus: React.FC<StockStatusProps> = ({ stock, isActive }) => {
  const getStockStatus = () => {
    if (!isActive) {
      return {
        status: 'inactive',
        color: 'bg-gray-100 text-gray-600',
        icon: <XCircle className="w-4 h-4" />,
        text: 'Inactif',
        description: 'Produit désactivé'
      };
    }

    if (stock === 0) {
      return {
        status: 'out-of-stock',
        color: 'bg-red-100 text-red-600',
        icon: <XCircle className="w-4 h-4" />,
        text: 'Rupture',
        description: 'Stock épuisé'
      };
    }

    if (stock <= 5) {
      return {
        status: 'low-stock',
        color: 'bg-orange-100 text-orange-600',
        icon: <AlertTriangle className="w-4 h-4" />,
        text: 'Stock faible',
        description: `Plus que ${stock} unité${stock > 1 ? 's' : ''}`
      };
    }

    if (stock <= 20) {
      return {
        status: 'medium-stock',
        color: 'bg-yellow-100 text-yellow-600',
        icon: <Clock className="w-4 h-4" />,
        text: 'Stock moyen',
        description: `${stock} unités disponibles`
      };
    }

    return {
      status: 'good-stock',
      color: 'bg-green-100 text-green-600',
      icon: <CheckCircle className="w-4 h-4" />,
      text: 'En stock',
      description: `${stock} unités disponibles`
    };
  };

  const stockInfo = getStockStatus();

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${stockInfo.color}`}>
      {stockInfo.icon}
      <span>{stockInfo.text}</span>
      <span className="text-xs opacity-75">({stockInfo.description})</span>
    </div>
  );
};

export default StockStatus;
