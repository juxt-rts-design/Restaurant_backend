const express = require('express');
const router = express.Router();
const SessionController = require('../controllers/sessionController');
const { validateIdSession } = require('../middleware/validation');

// Obtenir le statut détaillé d'une session
router.get('/:idSession/status', 
  validateIdSession,
  SessionController.getSessionStatus
);

// Fermer une session manuellement
router.post('/:idSession/close', 
  validateIdSession,
  SessionController.closeSession
);

// Nettoyer les sessions anciennes (admin)
router.post('/cleanup', 
  SessionController.cleanupOldSessions
);

module.exports = router;
