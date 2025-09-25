const express = require('express');
const router = express.Router();
const PanierController = require('../controllers/panierController');
const { validateIdSession } = require('../middleware/validation');

// Récupérer ou créer le panier d'un utilisateur
router.post('/session/:idSession/panier', 
  validateIdSession,
  PanierController.getOrCreatePanier
);

// Ajouter un produit au panier d'un utilisateur
router.post('/session/:idSession/panier/add', 
  validateIdSession,
  PanierController.addToPanier
);

// Récupérer le panier d'un utilisateur
router.get('/session/:idSession/panier', 
  validateIdSession,
  PanierController.getPanier
);

// Mettre à jour la quantité d'un produit dans le panier
router.put('/panier/item/:idLigne', 
  validateIdSession,
  PanierController.updateQuantity
);

// Supprimer un produit du panier
router.delete('/panier/item/:idLigne', 
  validateIdSession,
  PanierController.removeFromPanier
);

// Récupérer tous les paniers d'une session (pour la caisse)
router.get('/session/:idSession/paniers', 
  validateIdSession,
  PanierController.getPaniersBySession
);

module.exports = router;
