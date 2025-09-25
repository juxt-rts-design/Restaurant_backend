const { body, param, query, validationResult } = require('express-validator');

// Middleware pour traiter les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    });
  }
  next();
};

// Validations pour les clients
const validateClient = [
  body('nomComplet')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Le nom complet doit contenir entre 2 et 150 caractères'),
  handleValidationErrors
];

// Validations pour les tables
const validateTable = [
  body('nomTable')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Le nom de la table est requis (max 50 caractères)'),
  body('capacite')
    .optional()
    .isInt({ min: 0 })
    .withMessage('La capacité doit être un nombre positif'),
  handleValidationErrors
];

// Validations pour les produits
const validateProduit = [
  body('nomProduit')
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage('Le nom du produit est requis (max 150 caractères)'),
  body('prixCfa')
    .isInt({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),
  body('stockDisponible')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Le stock doit être un nombre positif'),
  handleValidationErrors
];

// Validations pour les commandes
const validateCommande = [
  body('produits')
    .isArray({ min: 1 })
    .withMessage('Au moins un produit est requis'),
  body('produits.*.idProduit')
    .isInt({ min: 1 })
    .withMessage('ID produit invalide'),
  body('produits.*.quantite')
    .isInt({ min: 1 })
    .withMessage('La quantité doit être un nombre positif'),
  handleValidationErrors
];

// Validations pour l'ajout au panier
const validateAddToCart = [
  body('idProduit')
    .isInt({ min: 1 })
    .withMessage('ID produit invalide'),
  body('quantite')
    .isInt({ min: 1 })
    .withMessage('La quantité doit être un nombre positif'),
  handleValidationErrors
];

// Validations pour les paiements
const validatePaiement = [
  body('methodePaiement')
    .isIn(['ESPECES', 'MOBILE_MONEY', 'CARTE', 'A_LA_CAISSE'])
    .withMessage('Méthode de paiement invalide'),
  handleValidationErrors
];

// Validations pour les paramètres d'ID
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID invalide'),
  handleValidationErrors
];

// Validations pour les paramètres d'ID de produit
const validateIdProduit = [
  param('idProduit')
    .isInt({ min: 1 })
    .withMessage('ID produit invalide'),
  handleValidationErrors
];

// Validations pour les paramètres d'ID de commande
const validateIdCommande = [
  param('idCommande')
    .isInt({ min: 1 })
    .withMessage('ID commande invalide'),
  handleValidationErrors
];

// Validations pour les paramètres d'ID de paiement
const validateIdPaiement = [
  param('idPaiement')
    .isInt({ min: 1 })
    .withMessage('ID paiement invalide'),
  handleValidationErrors
];

// Validations pour les paramètres d'ID de session
const validateIdSession = [
  param('idSession')
    .isInt({ min: 1 })
    .withMessage('ID session invalide'),
  handleValidationErrors
];

// Validations pour les paramètres de recherche
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Le terme de recherche doit contenir entre 1 et 100 caractères'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être entre 1 et 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('L\'offset doit être un nombre positif'),
  handleValidationErrors
];

// Validations pour les QR codes
const validateQrCode = [
  param('qrCode')
    .isLength({ min: 20, max: 30 })
    .withMessage('QR code invalide'),
  handleValidationErrors
];

// Validations pour les codes de validation
const validateCodeValidation = [
  body('codeValidation')
    .isLength({ min: 8, max: 8 })
    .withMessage('Code de validation invalide'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateClient,
  validateTable,
  validateProduit,
  validateCommande,
  validateAddToCart,
  validatePaiement,
  validateId,
  validateIdProduit,
  validateIdCommande,
  validateIdPaiement,
  validateIdSession,
  validateSearch,
  validateQrCode,
  validateCodeValidation
};
