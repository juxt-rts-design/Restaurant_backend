const express = require('express');
const router = express.Router();
const ManagerController = require('../controllers/managerController');
const { authenticateEmployee, requireRole } = require('../middleware/auth');
const { validateId, validateIdProduit, validateProduit, validateTable, validateSearch } = require('../middleware/validation');
const upload = require('../middleware/upload');

// Toutes les routes du manager nécessitent une authentification
// Temporairement désactivé pour les tests
// router.use(authenticateEmployee);

// Récupérer le tableau de bord
router.get('/dashboard', 
  ManagerController.getDashboard
);

// Gestion des produits
router.route('/products')
  .get(validateSearch, ManagerController.getAllProducts)
  .post(upload.single('photo'), validateProduit, ManagerController.createProduct);

router.route('/products/:idProduit')
  .put(upload.single('photo'), validateIdProduit, ManagerController.updateProduct)
  .delete(validateIdProduit, ManagerController.deleteProduct);

// Gestion des catégories
router.route('/categories')
  .get(ManagerController.getAllCategories)
  .post(ManagerController.createCategory);

// Gestion des tables
router.route('/tables')
  .get(ManagerController.getAllTables)
  .post(requireRole(['manager', 'admin']), validateTable, ManagerController.createTable);

router.route('/tables/:idTable')
  .put(requireRole(['manager', 'admin']), validateId, ManagerController.updateTable);

// Historique des ventes
router.get('/sales/history', 
  validateSearch,
  ManagerController.getSalesHistory
);

// Statistiques détaillées
router.get('/stats/detailed', 
  validateSearch,
  ManagerController.getDetailedStats
);

// Gestion des clients
router.get('/clients', 
  validateSearch,
  ManagerController.getAllClients
);

// Générer des QR codes
router.get('/qr-codes', 
  ManagerController.generateQrCodes
);

// Rapports
router.get('/reports', 
  validateSearch,
  ManagerController.getReports
);

module.exports = router;
