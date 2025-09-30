import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, Database, Key } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Configuration de la plateforme SaaS</p>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Security Settings */}
        <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
              <p className="text-sm text-gray-500">Configuration de la sécurité</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Gestion des mots de passe, authentification, permissions et accès.
          </p>
        </div>

        {/* Notifications */}
        <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-500">Configuration des alertes</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Paramètres d'email, SMS et notifications push pour les événements.
          </p>
        </div>

        {/* Database */}
        <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Base de données</h3>
              <p className="text-sm text-gray-500">Gestion des données</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Sauvegardes, maintenance et optimisation de la base de données.
          </p>
        </div>

        {/* API Keys */}
        <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <Key className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Clés API</h3>
              <p className="text-sm text-gray-500">Gestion des accès API</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Création et gestion des clés API pour les intégrations tierces.
          </p>
        </div>

        {/* System Settings */}
        <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <SettingsIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Système</h3>
              <p className="text-sm text-gray-500">Configuration générale</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Paramètres généraux de la plateforme, maintenance et logs.
          </p>
        </div>

        {/* Billing */}
        <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <SettingsIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Facturation</h3>
              <p className="text-sm text-gray-500">Gestion des abonnements</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Configuration des plans, tarifs et système de facturation.
          </p>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <SettingsIcon className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Configuration en cours de développement
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Les paramètres détaillés seront disponibles dans une prochaine version.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
