const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const { testConnection } = require('./config/database');
const { 
  helmetConfig, 
  rateLimitConfig, 
  validateContentType, 
  logSuspiciousActivity, 
  sanitizeInput 
} = require('./middleware/security');

// Import des routes
const clientRoutes = require('./routes/clientRoutes');
const caisseRoutes = require('./routes/caisseRoutes');
const managerRoutes = require('./routes/managerRoutes');
const cuisineRoutes = require('./routes/cuisineRoutes');
const panierRoutes = require('./routes/panierRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const qrRoutes = require('./routes/qrRoutes');

// Créer l'application Express
const app = express();

// Middlewares de sécurité
app.use(helmetConfig);
app.use(rateLimitConfig);
app.use(logSuspiciousActivity);
app.use(sanitizeInput);

// Configuration CORS
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(validateContentType);

// Route de base
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Restauration Interactive',
    version: '1.0.0',
    endpoints: {
      client: '/api/client',
      caisse: '/api/caisse',
      manager: '/api/manager',
      qr: '/table'
    }
  });
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Serveur opérationnel',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes API
app.use('/api/client', clientRoutes);
app.use('/api/caisse', caisseRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/cuisine', cuisineRoutes);
app.use('/api/panier', panierRoutes);
app.use('/api/session', sessionRoutes);
app.use('/table', qrRoutes);

// Middleware de gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint non trouvé',
    path: req.originalUrl
  });
});

// Middleware de gestion des erreurs globales
app.use((error, req, res, next) => {
  console.error('Erreur globale:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Erreur interne du serveur',
    ...(config.nodeEnv === 'development' && { stack: error.stack })
  });
});

// Fonction pour démarrer le serveur
const startServer = async () => {
  try {
    // Tester la connexion à la base de données
    await testConnection();
    
    // Démarrer le serveur
    app.listen(config.port, () => {
      console.log('🚀 Serveur de Restauration Interactive démarré');
      console.log(`📍 Port: ${config.port}`);
      console.log(`🌍 Environnement: ${config.nodeEnv}`);
      console.log(`🔗 URL: http://localhost:${config.port}`);
      console.log('📱 QR Codes: http://localhost:' + config.port + '/table/[QR_CODE]');
      console.log('📊 API Documentation: http://localhost:' + config.port + '/api');
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion des signaux d'arrêt
process.on('SIGTERM', () => {
  console.log('🛑 Signal SIGTERM reçu. Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Signal SIGINT reçu. Arrêt du serveur...');
  process.exit(0);
});

// Démarrer le serveur
startServer();