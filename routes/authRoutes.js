const express = require('express');
const AuthController = require('../Controllers/authController');

const router = express.Router();

// Routes d'authentification
router.post('/login', AuthController.login);
router.get('/verify', AuthController.verify);

// Routes protégées pour la gestion des utilisateurs
router.post('/users', 
  AuthController.authenticate, 
  AuthController.requireRole(['MANAGER', 'ADMIN']), 
  AuthController.createUser
);

router.get('/users', 
  AuthController.authenticate, 
  AuthController.requireRole(['MANAGER', 'ADMIN']), 
  AuthController.getUsers
);

module.exports = router;
