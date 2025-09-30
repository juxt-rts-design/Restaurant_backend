import React, { useState, useEffect } from 'react';
import { X, Building2, Globe, Phone, Mail, MapPin, Palette } from 'lucide-react';
import { Restaurant, CreateRestaurantRequest } from '../types/admin';
import { adminApiService } from '../services/adminApi';

interface RestaurantFormProps {
  restaurant?: Restaurant | null;
  onSubmit: (data: CreateRestaurantRequest) => Promise<void>;
  onClose: () => void;
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({ restaurant, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<CreateRestaurantRequest>({
    nom: '',
    slug: '',
    adresse: '',
    telephone: '',
    email: '',
    couleur_theme: '#3B82F6',
    devise: 'EUR',
    fuseau_horaire: 'Europe/Paris',
    plan: 'BASIC',
    limite_commandes_mois: 1000,
    limite_utilisateurs: 5,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (restaurant) {
      setFormData({
        nom: restaurant.nom,
        slug: restaurant.slug,
        adresse: restaurant.adresse,
        telephone: restaurant.telephone,
        email: restaurant.email,
        couleur_theme: restaurant.couleur_theme,
        devise: restaurant.devise,
        fuseau_horaire: restaurant.fuseau_horaire,
        plan: restaurant.plan,
        limite_commandes_mois: restaurant.limite_commandes_mois,
        limite_utilisateurs: restaurant.limite_utilisateurs,
      });
    }
  }, [restaurant]);

  // Générer le slug automatiquement à partir du nom
  useEffect(() => {
    if (!restaurant && formData.nom) {
      const slug = formData.nom
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.nom, restaurant]);

  // Vérifier la disponibilité du slug
  useEffect(() => {
    if (formData.slug && formData.slug.length > 2) {
      const checkSlug = async () => {
        try {
          const response = await adminApiService.checkSlugAvailability(
            formData.slug, 
            restaurant?.id
          );
          setSlugAvailable(response.success && response.data?.available);
        } catch (error) {
          setSlugAvailable(null);
        }
      };

      const timeoutId = setTimeout(checkSlug, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSlugAvailable(null);
    }
  }, [formData.slug, restaurant?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Le slug est requis';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets';
    } else if (slugAvailable === false) {
      newErrors.slug = 'Ce slug est déjà utilisé';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    }

    if (!formData.adresse.trim()) {
      newErrors.adresse = 'L\'adresse est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const planLimits = {
    BASIC: { commandes: 1000, utilisateurs: 5 },
    PREMIUM: { commandes: 5000, utilisateurs: 20 },
    ENTERPRISE: { commandes: 50000, utilisateurs: 100 },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {restaurant ? 'Modifier le restaurant' : 'Nouveau restaurant'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom et Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nom" className="label">
                <Building2 className="h-4 w-4 inline mr-2" />
                Nom du restaurant *
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                className={`input ${errors.nom ? 'border-red-500' : ''}`}
                value={formData.nom}
                onChange={handleChange}
                placeholder="Restaurant Le Gourmet"
              />
              {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
            </div>

            <div>
              <label htmlFor="slug" className="label">
                <Globe className="h-4 w-4 inline mr-2" />
                Slug (URL) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  className={`input ${errors.slug ? 'border-red-500' : ''} ${slugAvailable === true ? 'border-green-500' : ''}`}
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="restaurant-le-gourmet"
                />
                {slugAvailable === true && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                    ✓
                  </div>
                )}
                {slugAvailable === false && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                    ✗
                  </div>
                )}
              </div>
              {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Utilisé dans l'URL: restaurant-frontend.com/{formData.slug}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="label">
                <Mail className="h-4 w-4 inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`input ${errors.email ? 'border-red-500' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@restaurant.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="telephone" className="label">
                <Phone className="h-4 w-4 inline mr-2" />
                Téléphone *
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                className={`input ${errors.telephone ? 'border-red-500' : ''}`}
                value={formData.telephone}
                onChange={handleChange}
                placeholder="+33 1 23 45 67 89"
              />
              {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
            </div>
          </div>

          {/* Adresse */}
          <div>
            <label htmlFor="adresse" className="label">
              <MapPin className="h-4 w-4 inline mr-2" />
              Adresse *
            </label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              className={`input ${errors.adresse ? 'border-red-500' : ''}`}
              value={formData.adresse}
              onChange={handleChange}
              placeholder="123 Rue de la Paix, 75001 Paris"
            />
            {errors.adresse && <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>}
          </div>

          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="plan" className="label">
                Plan d'abonnement *
              </label>
              <select
                id="plan"
                name="plan"
                className="input"
                value={formData.plan}
                onChange={handleChange}
              >
                <option value="BASIC">Basic</option>
                <option value="PREMIUM">Premium</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>

            <div>
              <label htmlFor="devise" className="label">
                Devise
              </label>
              <select
                id="devise"
                name="devise"
                className="input"
                value={formData.devise}
                onChange={handleChange}
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="XOF">XOF (FCFA)</option>
              </select>
            </div>

            <div>
              <label htmlFor="fuseau_horaire" className="label">
                Fuseau horaire
              </label>
              <select
                id="fuseau_horaire"
                name="fuseau_horaire"
                className="input"
                value={formData.fuseau_horaire}
                onChange={handleChange}
              >
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Africa/Libreville">Africa/Libreville</option>
              </select>
            </div>
          </div>

          {/* Limites (mises à jour automatiquement selon le plan) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="limite_commandes_mois" className="label">
                Limite commandes/mois
              </label>
              <input
                type="number"
                id="limite_commandes_mois"
                name="limite_commandes_mois"
                className="input"
                value={formData.limite_commandes_mois}
                onChange={handleChange}
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Plan {formData.plan}: {planLimits[formData.plan].commandes} commandes
              </p>
            </div>

            <div>
              <label htmlFor="limite_utilisateurs" className="label">
                Limite utilisateurs
              </label>
              <input
                type="number"
                id="limite_utilisateurs"
                name="limite_utilisateurs"
                className="input"
                value={formData.limite_utilisateurs}
                onChange={handleChange}
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Plan {formData.plan}: {planLimits[formData.plan].utilisateurs} utilisateurs
              </p>
            </div>
          </div>

          {/* Couleur du thème */}
          <div>
            <label htmlFor="couleur_theme" className="label">
              <Palette className="h-4 w-4 inline mr-2" />
              Couleur du thème
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                id="couleur_theme"
                name="couleur_theme"
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                value={formData.couleur_theme}
                onChange={handleChange}
              />
              <input
                type="text"
                className="input flex-1"
                value={formData.couleur_theme}
                onChange={handleChange}
                placeholder="#3B82F6"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
              className="btn btn-primary"
              disabled={loading || slugAvailable === false}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {restaurant ? 'Mise à jour...' : 'Création...'}
                </div>
              ) : (
                restaurant ? 'Mettre à jour' : 'Créer le restaurant'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantForm;
