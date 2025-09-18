const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Middleware d'authentification pour les employés (caisse, manager)
const authenticateEmployee = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification requis'
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.employee = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token d\'authentification invalide'
    });
  }
};

// Middleware d'authentification optionnelle (pour les clients)
const optionalAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.employee = decoded;
    }
    
    next();
  } catch (error) {
    // Continue sans authentification si le token est invalide
    next();
  }
};

// Middleware pour vérifier le rôle d'employé
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.employee) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    if (!roles.includes(req.employee.role)) {
      return res.status(403).json({
        success: false,
        message: 'Permissions insuffisantes'
      });
    }

    next();
  };
};

module.exports = {
  authenticateEmployee,
  optionalAuth,
  requireRole
};
