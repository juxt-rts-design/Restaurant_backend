const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
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

// ===== AUTHENTIFICATION ADMIN =====
router.post('/auth/login', adminController.loginAdmin);
router.get('/auth/verify', auth, adminController.verifyAdminToken);

// ===== DASHBOARD =====
router.get('/dashboard', auth, requireAdmin, adminController.getDashboardStats);
router.get('/dashboard/top-restaurants', auth, requireAdmin, adminController.getTopRestaurants);

// ===== GESTION DES RESTAURANTS =====
router.get('/restaurants', auth, requireAdmin, adminController.getAllRestaurants);
router.get('/restaurants/:id', auth, requireAdmin, adminController.getRestaurantById);
router.post('/restaurants', auth, requireAdmin, adminController.createRestaurant);
router.put('/restaurants/:id', auth, requireAdmin, adminController.updateRestaurant);
router.patch('/restaurants/:id/status', auth, requireAdmin, adminController.updateRestaurantStatus);
router.delete('/restaurants/:id', auth, requireAdmin, adminController.deleteRestaurant);

// Vérification de disponibilité du slug
router.get('/restaurants/check-slug/:slug', auth, requireAdmin, adminController.checkSlugAvailability);

// ===== GESTION DES UTILISATEURS =====
router.get('/users', auth, requireAdmin, adminController.getAllUsers);
router.get('/restaurants/:id/users', auth, requireAdmin, adminController.getUsersByRestaurant);
router.post('/users', auth, requireAdmin, adminController.createUser);
router.put('/users/:id', auth, requireAdmin, adminController.updateUser);
router.delete('/users/:id', auth, requireAdmin, adminController.deleteUser);

// ===== ANALYTICS =====
router.get('/restaurants/:id/analytics', auth, requireAdmin, adminController.getRestaurantAnalytics);
router.get('/analytics/global', auth, requireAdmin, adminController.getGlobalAnalytics);

// ===== GESTION DES PLANS =====
router.get('/plans', auth, requireAdmin, adminController.getPlans);
router.put('/restaurants/:id/plan', auth, requireAdmin, adminController.updateRestaurantPlan);

// ===== STATISTIQUES AVANCÉES =====
router.get('/stats/restaurants', auth, requireAdmin, adminController.getRestaurantStats);
router.get('/stats/users', auth, requireAdmin, adminController.getUserStats);
router.get('/stats/revenue', auth, requireAdmin, adminController.getRevenueStats);

// ===== GESTION DES SUSPENSIONS =====
router.post('/restaurants/:id/suspend', auth, requireAdmin, adminController.suspendRestaurant);
router.post('/restaurants/:id/unsuspend', auth, requireAdmin, adminController.unsuspendRestaurant);
router.get('/suspensions', auth, requireAdmin, adminController.getSuspensions);

// ===== LOGS ET AUDIT =====
router.get('/logs', auth, requireAdmin, adminController.getAdminLogs);
router.get('/audit/restaurants/:id', auth, requireAdmin, adminController.getRestaurantAudit);

// ===== BACKUP ET MAINTENANCE =====
router.post('/backup', auth, requireAdmin, adminController.createBackup);
router.get('/backups', auth, requireAdmin, adminController.getBackups);
router.post('/maintenance', auth, requireAdmin, adminController.runMaintenance);

module.exports = router;