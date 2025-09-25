import React, { useState } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';

interface Product {
  id_produit: number;
  nom_produit: string;
  description: string;
  prix_cfa: number;
  stock_disponible: number;
  actif: boolean;
}

interface ProductEditModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProduct: Partial<Product>) => Promise<void>;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    nom_produit: product.nom_produit,
    description: product.description,
    prix_cfa: product.prix_cfa,
    stock_disponible: product.stock_disponible,
    actif: product.actif
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nom_produit: product.nom_produit,
      description: product.description,
      prix_cfa: product.prix_cfa,
      stock_disponible: product.stock_disponible,
      actif: product.actif
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-strong w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Modifier le produit</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {/* Nom du produit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit
              </label>
              <input
                type="text"
                value={formData.nom_produit}
                onChange={(e) => handleInputChange('nom_produit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nom du produit"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Description du produit"
              />
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (FCFA)
              </label>
              <input
                type="number"
                value={formData.prix_cfa}
                onChange={(e) => handleInputChange('prix_cfa', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Prix en FCFA"
                min="0"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock disponible
              </label>
              <input
                type="number"
                value={formData.stock_disponible}
                onChange={(e) => handleInputChange('stock_disponible', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Quantité en stock"
                min="0"
              />
            </div>

            {/* Statut actif */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="actif"
                checked={formData.actif}
                onChange={(e) => handleInputChange('actif', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="actif" className="text-sm font-medium text-gray-700">
                Produit actif
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Réinitialiser</span>
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex items-center space-x-2 px-4 py-2 text-white rounded-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditModal;
