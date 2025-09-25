const express = require('express');
const router = express.Router();
const CuisineController = require('../Controllers/cuisineController');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../Middleware/validation');

// Validations pour la mise à jour du statut
const validateUpdateStatut = [
  body('statut')
    .isIn(['EN_ATTENTE', 'EN_PREPARATION', 'PRET'])
    .withMessage('Statut invalide'),
  handleValidationErrors
];

// Routes pour la cuisine
router.get('/commandes', CuisineController.getCommandes);
router.put('/produits/:idLigne/statut', validateUpdateStatut, CuisineController.updateProduitStatut);
router.get('/stats', CuisineController.getStats);

module.exports = router;
