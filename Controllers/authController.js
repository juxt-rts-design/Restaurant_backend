const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

class AuthController {
  // Connexion multi-tenant
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe requis'
        });
      }

      // Trouver l'utilisateur avec son restaurant
      const [users] = await pool.execute(`
        SELECT 
          u.id_utilisateur,
          u.nom_utilisateur,
          u.email,
          u.mot_de_passe,
          u.role,
          u.statut,
          u.restaurant_id,
          r.nom as restaurant_nom,
          r.slug as restaurant_slug,
          r.couleur_theme,
          r.devise,
          r.plan
        FROM utilisateurs u
        JOIN restaurants r ON u.restaurant_id = r.id
        WHERE u.email = ? AND u.statut = 'ACTIF'
      `, [email]);

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      const user = users[0];

      // Vérifier le mot de passe
      const isMatch = await bcrypt.compare(password, user.mot_de_passe);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Vérifier que le restaurant est actif
      if (user.plan === 'SUSPENDU') {
        return res.status(403).json({
          success: false,
          message: 'Votre restaurant est suspendu. Contactez le support.'
        });
      }

      // Générer le token JWT avec les informations du restaurant
      const token = jwt.sign(
        { 
          userId: user.id_utilisateur,
          email: user.email,
          role: user.role,
          restaurantId: user.restaurant_id,
          restaurantSlug: user.restaurant_slug,
          restaurantPlan: user.plan
        },
        process.env.JWT_SECRET || 'M@thematique2003',
        { expiresIn: '24h' }
      );

      // Mettre à jour la dernière connexion
      await pool.execute(`
        UPDATE utilisateurs 
        SET derniere_connexion = NOW() 
        WHERE id_utilisateur = ?
      `, [user.id_utilisateur]);

      // Retourner les données utilisateur (sans le mot de passe)
      const userData = {
        id: user.id_utilisateur,
        nom: user.nom_utilisateur,
        email: user.email,
        role: user.role,
        restaurant: {
          id: user.restaurant_id,
          nom: user.restaurant_nom,
          slug: user.restaurant_slug,
          couleurTheme: user.couleur_theme,
          devise: user.devise,
          plan: user.plan
        }
      };

      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: { user: userData, token }
      });

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Vérifier le token JWT
  static async verify(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token manquant'
        });
      }

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'M@thematique2003');
      
      // Récupérer les informations utilisateur et restaurant
      const [users] = await pool.execute(`
        SELECT 
          u.id_utilisateur,
          u.nom_utilisateur,
          u.email,
          u.role,
          u.statut,
          u.restaurant_id,
          r.nom as restaurant_nom,
          r.slug as restaurant_slug,
          r.couleur_theme,
          r.devise,
          r.plan
        FROM utilisateurs u
        JOIN restaurants r ON u.restaurant_id = r.id
        WHERE u.id_utilisateur = ? AND u.statut = 'ACTIF'
      `, [decoded.userId]);

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      const user = users[0];

      // Retourner les données utilisateur (sans le mot de passe)
      const userData = {
        id: user.id_utilisateur,
        nom: user.nom_utilisateur,
        email: user.email,
        role: user.role,
        restaurant: {
          id: user.restaurant_id,
          nom: user.restaurant_nom,
          slug: user.restaurant_slug,
          couleurTheme: user.couleur_theme,
          devise: user.devise,
          plan: user.plan
        }
      };

      res.status(200).json({
        success: true,
        message: 'Token valide',
        data: { user: userData }
      });

    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
  }

  // Middleware pour vérifier l'authentification et le restaurant
  static async authenticate(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token manquant'
        });
      }

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'M@thematique2003');
      
      // Ajouter les informations utilisateur à la requête
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        restaurantId: decoded.restaurantId,
        restaurantSlug: decoded.restaurantSlug,
        restaurantPlan: decoded.restaurantPlan
      };

      next();
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
  }

  // Middleware pour vérifier les rôles
  static requireRole(allowedRoles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
      }

      next();
    };
  }

  // Créer un nouvel utilisateur (pour les managers)
  static async createUser(req, res) {
    try {
      const { nom, email, password, role } = req.body;
      const restaurantId = req.user.restaurantId;

      if (!nom || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'Tous les champs sont requis'
        });
      }

      // Vérifier que l'utilisateur est manager ou admin
      if (!['MANAGER', 'ADMIN'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Seuls les managers peuvent créer des utilisateurs'
        });
      }

      // Vérifier que l'email n'existe pas déjà
      const [existingUsers] = await pool.execute(
        'SELECT id_utilisateur FROM utilisateurs WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur
      const [result] = await pool.execute(`
        INSERT INTO utilisateurs (restaurant_id, nom_utilisateur, email, mot_de_passe, role)
        VALUES (?, ?, ?, ?, ?)
      `, [restaurantId, nom, email, hashedPassword, role]);

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: { userId: result.insertId }
      });

    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Lister les utilisateurs du restaurant
  static async getUsers(req, res) {
    try {
      const restaurantId = req.user.restaurantId;

      const [users] = await pool.execute(`
        SELECT 
          id_utilisateur,
          nom_utilisateur,
          email,
          role,
          statut,
          derniere_connexion,
          date_creation
        FROM utilisateurs 
        WHERE restaurant_id = ?
        ORDER BY date_creation DESC
      `, [restaurantId]);

      res.status(200).json({
        success: true,
        data: users
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}

module.exports = AuthController;
