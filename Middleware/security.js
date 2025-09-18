const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('../config/config');

// Configuration Helmet pour la sécurité
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
});

// Configuration du rate limiting
const rateLimitConfig = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting spécifique pour les paiements
const paymentRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 tentatives de paiement par IP toutes les 5 minutes
  message: {
    success: false,
    message: 'Trop de tentatives de paiement, veuillez réessayer plus tard'
  }
});

// Rate limiting pour les QR codes
const qrCodeRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 scans de QR code par IP par minute
  message: {
    success: false,
    message: 'Trop de scans de QR code, veuillez réessayer plus tard'
  }
});

// Middleware pour valider les types de contenu
const validateContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        success: false,
        message: 'Content-Type doit être application/json'
      });
    }
  }
  next();
};

// Middleware pour logger les requêtes suspectes
const logSuspiciousActivity = (req, res, next) => {
  const userAgent = req.get('User-Agent');
  const ip = req.ip || req.connection.remoteAddress;
  
  // Détecter les patterns suspects
  const suspiciousPatterns = [
    /script/i,
    /<script/i,
    /javascript:/i,
    /onload/i,
    /onerror/i,
    /eval\(/i,
    /document\./i,
    /window\./i
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(req.url) || pattern.test(userAgent) || pattern.test(JSON.stringify(req.body))
  );
  
  if (isSuspicious) {
    console.warn(`⚠️ Activité suspecte détectée - IP: ${ip}, URL: ${req.url}, User-Agent: ${userAgent}`);
  }
  
  next();
};

// Middleware pour nettoyer les données d'entrée
const sanitizeInput = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  };

  const sanitizeObject = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key]);
        }
      }
    }
  };

  if (req.body) {
    sanitizeObject(req.body);
  }
  
  if (req.query) {
    sanitizeObject(req.query);
  }
  
  if (req.params) {
    sanitizeObject(req.params);
  }

  next();
};

module.exports = {
  helmetConfig,
  rateLimitConfig,
  paymentRateLimit,
  qrCodeRateLimit,
  validateContentType,
  logSuspiciousActivity,
  sanitizeInput
};
