const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/clientController');
const { validateQrCode, validateClient, validateCommande, validateAddToCart, validatePaiement, validateSearch } = require('../middleware/validation');
const { qrCodeRateLimit, paymentRateLimit } = require('../middleware/security');

// Routes pour les clients (accès via QR code)

// Scanner un QR code et récupérer les informations de la table
router.get('/table/:qrCode', 
  qrCodeRateLimit,
  validateQrCode,
  ClientController.scanQrCode
);

// Récupérer la session active d'une table
router.get('/table/:qrCode/session/active', 
  qrCodeRateLimit,
  validateQrCode,
  ClientController.getActiveSession
);

// Créer une session client
router.post('/table/:qrCode/session', 
  qrCodeRateLimit,
  validateQrCode,
  validateClient,
  ClientController.createSession
);

// Récupérer le menu
router.get('/menu', 
  validateSearch,
  ClientController.getMenu
);

// Routes pour les sessions
router.use('/session/:idSession', (req, res, next) => {
  // Middleware pour valider l'existence de la session
  next();
});

// Ajouter un produit au panier
router.post('/session/:idSession/cart', 
  validateAddToCart,
  ClientController.addToCart
);

// Récupérer le panier
router.get('/session/:idSession/cart', 
  ClientController.getCart
);

// Récupérer les commandes d'une session
router.get('/session/:idSession/orders', 
  ClientController.getSessionOrders
);

// Mettre à jour la quantité d'un produit
router.put('/cart/:idLigne', 
  ClientController.updateQuantity
);

// Supprimer un produit du panier
router.delete('/cart/:idLigne', 
  ClientController.removeFromCart
);

// Valider la commande
router.post('/session/:idSession/order/validate', 
  ClientController.validateOrder
);

// Créer un paiement
router.post('/session/:idSession/payment', 
  paymentRateLimit,
  validatePaiement,
  ClientController.createPayment
);

// Fermer la session
router.post('/session/:idSession/close', 
  ClientController.closeSession
);

module.exports = router;
