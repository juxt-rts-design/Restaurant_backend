import React, { useState } from 'react';
import { X, AlertTriangle, Clock, User as UserIcon, MessageSquare } from 'lucide-react';
import { Restaurant } from '../types/admin';

interface SuspensionModalProps {
  restaurant: Restaurant;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const SuspensionModal: React.FC<SuspensionModalProps> = ({ restaurant, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('7'); // jours
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  const suspensionReasons = [
    { value: 'non_paiement', label: 'Non-paiement de l\'abonnement' },
    { value: 'violation_tos', label: 'Violation des conditions d\'utilisation' },
    { value: 'comportement_abusif', label: 'Comportement abusif' },
    { value: 'probleme_technique', label: 'Problème technique' },
    { value: 'demande_client', label: 'Demande du client' },
    { value: 'autre', label: 'Autre raison' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Suspendre le restaurant</h2>
              <p className="text-sm text-gray-500">{restaurant.nom}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Warning */}
        <div className="p-6 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Attention : Cette action est irréversible
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Le restaurant sera immédiatement suspendu et ne pourra plus accéder à la plateforme.
                Tous les utilisateurs seront déconnectés.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Raison de la suspension */}
          <div>
            <label htmlFor="reason" className="label">
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              Raison de la suspension *
            </label>
            <select
              id="reason"
              className="input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Sélectionner une raison</option>
              {suspensionReasons.map((reasonOption) => (
                <option key={reasonOption.value} value={reasonOption.value}>
                  {reasonOption.label}
                </option>
              ))}
            </select>
          </div>

          {/* Durée de la suspension */}
          <div>
            <label htmlFor="duration" className="label">
              <Clock className="h-4 w-4 inline mr-2" />
              Durée de la suspension
            </label>
            <select
              id="duration"
              className="input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="1">1 jour</option>
              <option value="7">7 jours</option>
              <option value="30">30 jours</option>
              <option value="90">90 jours</option>
              <option value="indefinite">Indéfinie</option>
            </select>
          </div>

          {/* Message pour le restaurant */}
          <div>
            <label htmlFor="message" className="label">
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Message pour le restaurant
            </label>
            <textarea
              id="message"
              className="input min-h-[100px] resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Expliquez la raison de la suspension et les étapes pour la lever..."
            />
          </div>

          {/* Informations sur l'impact */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Impact de la suspension :</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Accès à la plateforme bloqué</li>
              <li>• Tous les utilisateurs déconnectés</li>
              <li>• Commandes en cours suspendues</li>
              <li>• Données conservées</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={loading || !reason.trim()}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Suspension...
                </div>
              ) : (
                'Suspendre le restaurant'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuspensionModal;
