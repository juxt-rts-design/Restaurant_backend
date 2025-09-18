require('dotenv').config();

const config = {
  // Configuration du serveur
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Configuration JWT
  jwtSecret: process.env.JWT_SECRET || 'M@thematique2003',
  jwtExpiresIn: '24h',
  
  // Configuration des QR codes
  qrCodeBaseUrl: process.env.QR_CODE_BASE_URL || 'http://localhost:3000/table',
  
  // Configuration des paiements
  mobileMoneyEnabled: process.env.MOBILE_MONEY_ENABLED === 'true',
  
  // Configuration CORS
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:3001'],
  
  // Configuration des limites de taux
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite de 100 requêtes par IP par fenêtre
  }
};

module.exports = config;
