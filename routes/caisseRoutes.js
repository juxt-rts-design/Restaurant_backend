const express = require('express');
const router = express.Router();
const CaisseController = require('../controllers/caisseController');
const { authenticateEmployee, requireRole } = require('../middleware/auth');
const { validateId, validateIdCommande, validateIdPaiement, validateIdSession, validateCodeValidation, validateSearch } = require('../middleware/validation');

// Toutes les routes de la caisse nécessitent une authentification
// Temporairement désactivé pour les tests
// router.use(authenticateEmployee);

// Récupérer les commandes en attente
router.get('/orders/pending', 
  CaisseController.getPendingOrders
);

// Récupérer les détails d'une commande
router.get('/orders/:idCommande', 
  validateIdCommande,
  CaisseController.getOrderDetails
);

// Marquer une commande comme servie
router.put('/orders/:idCommande/serve', 
  validateIdCommande,
  CaisseController.markOrderAsServed
);

// Annuler une commande
router.put('/orders/:idCommande/cancel', 
  validateIdCommande,
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
  validateIdPaiement,
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
  validateIdSession,
  CaisseController.closeSession
);

// Rechercher des commandes ou paiements
router.get('/search', 
  validateSearch,
  CaisseController.search
);

// Générer une facture pour une commande
router.get('/orders/:idCommande/invoice', 
  validateIdCommande,
  CaisseController.generateInvoice
);

// Rechercher des factures archivées
router.get('/invoices/search', 
  CaisseController.rechercherFactures
);

// Récupérer toutes les factures archivées (doit être avant la route générique)
router.get('/invoices/all', 
  CaisseController.getAllFacturesArchivees
);

// Récupérer une facture archivée par numéro (doit être après les routes spécifiques)
router.get('/invoices/:numeroFacture', 
  CaisseController.getFactureArchivee
);

// Obtenir les statistiques des factures
router.get('/invoices/statistics', 
  CaisseController.getStatistiquesFactures
);

module.exports = router;
