const express = require('express');
const router = express.Router();
const settingsController = require('../Controllers/settingsController');
const { auth } = require('../Middleware/auth');

// Middleware pour vérifier que l'utilisateur est admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Accès refusé. Rôle administrateur requis.'
    });
  }
};

// ===== PARAMÈTRES SYSTÈME =====
router.get('/settings', auth, requireAdmin, settingsController.getSettings);
router.put('/settings', auth, requireAdmin, settingsController.updateSettings);

// ===== STATISTIQUES SYSTÈME =====
router.get('/stats', auth, requireAdmin, settingsController.getSystemStats);

// ===== GESTION DES CLÉS API =====
router.get('/api-keys', auth, requireAdmin, settingsController.getApiKeys);
router.post('/api-keys', auth, requireAdmin, settingsController.createApiKey);
router.put('/api-keys/:id/regenerate', auth, requireAdmin, settingsController.regenerateApiKey);

// ===== SAUVEGARDE =====
router.post('/backup', auth, requireAdmin, settingsController.backupDatabase);

module.exports = router;
