const express = require('express');
const router = express.Router();
const CaisseController = require('../controllers/caisseController');
const { authenticateEmployee, requireRole } = require('../middleware/auth');
const { validateId, validateCodeValidation, validateSearch } = require('../middleware/validation');

// Toutes les routes de la caisse nécessitent une authentification
router.use(authenticateEmployee);

// Récupérer les commandes en attente
router.get('/orders/pending', 
  CaisseController.getPendingOrders
);

// Récupérer les détails d'une commande
router.get('/orders/:idCommande', 
  validateId,
  CaisseController.getOrderDetails
);

// Marquer une commande comme servie
router.put('/orders/:idCommande/serve', 
  validateId,
  CaisseController.markOrderAsServed
);

// Annuler une commande
router.put('/orders/:idCommande/cancel', 
  validateId,
  CaisseController.cancelOrder
);

// Récupérer les paiements en cours
router.get('/payments/pending', 
  CaisseController.getPendingPayments
);

// Valider un paiement par code
router.post('/payments/validate-code', 
  validateCodeValidation,
  CaisseController.validatePaymentByCode
);

// Valider un paiement par ID
router.put('/payments/:idPaiement/validate', 
  validateId,
  CaisseController.validatePayment
);

// Récupérer l'historique des paiements
router.get('/payments/history', 
  validateSearch,
  CaisseController.getPaymentHistory
);

// Récupérer les statistiques de la journée
router.get('/stats/daily', 
  CaisseController.getDailyStats
);

// Récupérer les sessions actives
router.get('/sessions/active', 
  CaisseController.getActiveSessions
);

// Fermer une session
router.post('/sessions/:idSession/close', 
  validateId,
  CaisseController.closeSession
);

// Rechercher des commandes ou paiements
router.get('/search', 
  validateSearch,
  CaisseController.search
);

module.exports = router;
