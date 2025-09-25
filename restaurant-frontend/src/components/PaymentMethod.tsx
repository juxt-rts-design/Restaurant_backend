import React from 'react';
import { CreditCard, Smartphone, Banknote, Store } from 'lucide-react';
import { PaymentMethodProps } from '../types';

const PaymentMethod: React.FC<PaymentMethodProps> = ({ method, selected, onSelect }) => {
  const paymentMethods = {
    ESPECES: {
      name: 'Espèces',
      description: 'Paiement en liquide',
      icon: Banknote,
      color: 'bg-green-500',
    },
    MOBILE_MONEY: {
      name: 'Mobile Money',
      description: 'Airtel Money, Moov Money',
      icon: Smartphone,
      color: 'bg-blue-500',
    },
    CARTE: {
      name: 'Carte bancaire',
      description: 'Visa, Mastercard',
      icon: CreditCard,
      color: 'bg-purple-500',
    },
    A_LA_CAISSE: {
      name: 'À la caisse',
      description: 'Code unique pour la caisse',
      icon: Store,
      color: 'bg-orange-500',
    },
  };

  const methodInfo = paymentMethods[method];
  const Icon = methodInfo.icon;

  return (
    <button
      onClick={() => onSelect(method)}
      className={`
        w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
        ${selected 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
        }
      `}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${methodInfo.color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="font-medium text-gray-900">
            {methodInfo.name}
          </div>
          <div className="text-sm text-gray-600">
            {methodInfo.description}
          </div>
        </div>
        
        {selected && (
          <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    </button>
  );
};

export default PaymentMethod;