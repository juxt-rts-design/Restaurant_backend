import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItemProps } from '../types';

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { id_ligne, quantite, prix_unitaire, produit } = item;

  const handleIncreaseQuantity = () => {
    onUpdateQuantity(id_ligne, quantite + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantite > 1) {
      onUpdateQuantity(id_ligne, quantite - 1);
    } else {
      onRemove(id_ligne);
    }
  };

  const handleRemove = () => {
    onRemove(id_ligne);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = prix_unitaire * quantite;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">
            {produit.nom_produit}
          </h4>
          <p className="text-sm text-gray-600">
            {formatPrice(prix_unitaire)} × {quantite}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDecreaseQuantity}
              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <span className="text-lg font-medium text-gray-900 min-w-[2rem] text-center">
              {quantite}
            </span>
            
            <button
              onClick={handleIncreaseQuantity}
              className="w-8 h-8 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-right ml-4">
            <div className="text-lg font-bold text-primary-600">
              {formatPrice(totalPrice)}
            </div>
          </div>
          
          <button
            onClick={handleRemove}
            className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors ml-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;