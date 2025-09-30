import React from 'react';
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Analyse des performances de la plateforme</p>
      </div>

      {/* Coming Soon */}
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-16 w-16 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Analytics en cours de développement</h3>
        <p className="mt-2 text-gray-500">
          Cette section contiendra des graphiques et analyses détaillées des performances.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Évolution CA</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Utilisateurs actifs</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <ShoppingCart className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Commandes</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <DollarSign className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Revenus</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
