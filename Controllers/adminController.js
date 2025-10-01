const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { validationResult } = require('express-validator');

// ===== AUTHENTIFICATION ADMIN =====

/**
 * Connexion administrateur
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des données
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email et mot de passe requis'
      });
    }

    // Rechercher l'utilisateur admin
    const [users] = await pool.execute(
      'SELECT * FROM utilisateurs WHERE email = ? AND role = "ADMIN"',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    const user = users[0];

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    // Vérifier que l'utilisateur est actif
    if (user.statut !== 'ACTIF') {
      return res.status(401).json({
        success: false,
        error: 'Compte désactivé'
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: user.id_utilisateur, 
        email: user.email, 
        role: user.role,
        restaurant_id: user.restaurant_id
      },
      process.env.JWT_SECRET || 'M@thematique2003',
      { expiresIn: '24h' }
    );

    // Mettre à jour la dernière connexion
    await pool.execute(
      'UPDATE utilisateurs SET derniere_connexion = NOW() WHERE id_utilisateur = ?',
      [user.id_utilisateur]
    );

    res.json({
      success: true,
      data: {
        user: {
          id_utilisateur: user.id_utilisateur,
          nom_utilisateur: user.nom_utilisateur,
          email: user.email,
          role: user.role,
          restaurant_id: user.restaurant_id,
          statut: user.statut,
          date_creation: user.date_creation
        },
        token
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion admin:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la connexion'
    });
  }
};

/**
 * Vérification du token admin
 */
const verifyAdminToken = async (req, res) => {
  try {
    const user = req.user;
    
    // Récupérer les informations complètes de l'utilisateur
    const [users] = await pool.execute(
      'SELECT * FROM utilisateurs WHERE id_utilisateur = ?',
      [user.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    const userData = users[0];

    res.json({
      success: true,
      data: {
        id_utilisateur: userData.id_utilisateur,
        nom_utilisateur: userData.nom_utilisateur,
        email: userData.email,
        role: userData.role,
        restaurant_id: userData.restaurant_id,
        statut: userData.statut,
        date_creation: userData.date_creation,
        derniere_connexion: userData.derniere_connexion
      }
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la vérification'
    });
  }
};

// ===== DASHBOARD =====

/**
 * Statistiques du dashboard
 */
const getDashboardStats = async (req, res) => {
  try {
    // Statistiques des restaurants (vraies données)
      const [restaurantStats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_restaurants,
        SUM(CASE WHEN statut = 'ACTIF' THEN 1 ELSE 0 END) as restaurants_actifs,
        SUM(CASE WHEN statut = 'SUSPENDU' THEN 1 ELSE 0 END) as restaurants_suspendus,
        SUM(CASE WHEN plan = 'PREMIUM' THEN 1 ELSE 0 END) as restaurants_premium,
        SUM(CASE WHEN plan = 'ENTERPRISE' THEN 1 ELSE 0 END) as restaurants_enterprise
        FROM restaurants
      `);

    // Statistiques des factures (vraies données FCFA)
    const [factureStats] = await pool.execute(`
      SELECT
        COUNT(*) as total_factures,
        SUM(CASE WHEN DATE(date_facture) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as factures_30j,
        SUM(CASE WHEN DATE(date_facture) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as factures_7j,
        COALESCE(SUM(CASE WHEN DATE(date_facture) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN montant_total ELSE 0 END), 0) as ca_30j_fcfa,
        COALESCE(SUM(CASE WHEN DATE(date_facture) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN montant_total ELSE 0 END), 0) as ca_7j_fcfa,
        COALESCE(SUM(montant_total), 0) as ca_total_fcfa
      FROM factures_archivees
    `);

    // Statistiques des utilisateurs (vraies données)
      const [userStats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_utilisateurs,
        SUM(CASE WHEN statut = 'ACTIF' THEN 1 ELSE 0 END) as utilisateurs_actifs,
        SUM(CASE WHEN role = 'MANAGER' THEN 1 ELSE 0 END) as managers,
        SUM(CASE WHEN role = 'CAISSIER' THEN 1 ELSE 0 END) as caissiers,
        SUM(CASE WHEN role = 'CUISINIER' THEN 1 ELSE 0 END) as cuisiniers,
        SUM(CASE WHEN role = 'ADMIN' THEN 1 ELSE 0 END) as admins
        FROM utilisateurs
      `);

    // Statistiques des produits (vraies données)
    const [productStats] = await pool.execute(`
        SELECT 
        COUNT(*) as total_produits,
        SUM(CASE WHEN actif = 1 THEN 1 ELSE 0 END) as produits_actifs,
        SUM(CASE WHEN stock_disponible = 0 THEN 1 ELSE 0 END) as produits_rupture
      FROM produits
    `);

    const stats = {
      restaurants: restaurantStats[0],
      factures: factureStats[0],
      utilisateurs: userStats[0],
      produits: productStats[0]
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du chargement des statistiques'
    });
  }
};

/**
 * Top restaurants par performance
 */
const getTopRestaurants = async (req, res) => {
  try {
    const [restaurants] = await pool.execute(`
        SELECT 
          r.id,
          r.nom,
          r.plan,
        r.statut,
        COUNT(DISTINCT u.id_utilisateur) as nb_utilisateurs,
        COUNT(DISTINCT f.id_facture) as nb_factures,
        COALESCE(SUM(f.montant_total), 0) as ca_total_fcfa,
        COALESCE(SUM(CASE WHEN DATE(f.date_facture) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN f.montant_total ELSE 0 END), 0) as ca_30j_fcfa
        FROM restaurants r
      LEFT JOIN utilisateurs u ON r.id = u.restaurant_id AND u.statut = 'ACTIF'
      LEFT JOIN factures_archivees f ON r.id = f.restaurant_id
      GROUP BY r.id, r.nom, r.plan, r.statut
      ORDER BY ca_total_fcfa DESC
        LIMIT 10
      `);

    res.json({
        success: true,
      data: restaurants
      });

    } catch (error) {
    console.error('Erreur lors du chargement des top restaurants:', error);
      res.status(500).json({
      success: false,
      error: 'Erreur lors du chargement des top restaurants'
    });
  }
};

// ===== GESTION DES RESTAURANTS =====

/**
 * Mettre à jour le statut d'un restaurant
 */
const updateRestaurantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!statut || !['ACTIF', 'INACTIF', 'SUSPENDU'].includes(statut)) {
      return res.status(400).json({
        success: false,
        error: 'Statut invalide. Utilisez ACTIF, INACTIF ou SUSPENDU'
      });
    }

    // Vérifier que le restaurant existe
    const [restaurants] = await pool.execute(
      'SELECT * FROM restaurants WHERE id = ?',
      [id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant non trouvé'
      });
    }

    // Mettre à jour le statut
    await pool.execute(
      'UPDATE restaurants SET statut = ?, date_mise_a_jour = NOW() WHERE id = ?',
      [statut, id]
    );

    res.json({
      success: true,
      message: `Restaurant ${statut.toLowerCase()} avec succès`,
      data: {
        id: parseInt(id),
        statut,
        date_mise_a_jour: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du statut'
    });
  }
};

/**
 * Récupérer tous les restaurants
 */
const getAllRestaurants = async (req, res) => {
    try {
      const [restaurants] = await pool.execute(`
        SELECT 
          r.*,
        COUNT(DISTINCT u.id_utilisateur) as nb_utilisateurs,
        COUNT(DISTINCT c.id_commande) as nb_commandes_30j,
        COALESCE(SUM(CASE WHEN DATE(c.date_commande) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 
          (SELECT COALESCE(SUM(prix_cfa * quantite), 0) FROM commande_produits cp 
           JOIN produits p ON cp.id_produit = p.id_produit 
           WHERE cp.id_commande = c.id_commande) 
        ELSE 0 END), 0) as ca_30j
        FROM restaurants r
      LEFT JOIN utilisateurs u ON r.id = u.restaurant_id AND u.statut = 'ACTIF'
      LEFT JOIN sessions s ON r.id = s.restaurant_id
      LEFT JOIN commandes c ON s.id_session = c.id_session AND DATE(c.date_commande) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY r.id
        ORDER BY r.date_creation DESC
      `);

    res.json({
        success: true,
        data: restaurants
      });

    } catch (error) {
      console.error('Erreur lors du chargement des restaurants:', error);
      res.status(500).json({
        success: false,
      error: 'Erreur lors du chargement des restaurants'
    });
  }
};

/**
 * Récupérer un restaurant par ID
 */
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const [restaurants] = await pool.execute(
      'SELECT * FROM restaurants WHERE id = ?',
      [id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant non trouvé'
      });
    }

    res.json({
      success: true,
      data: restaurants[0]
    });

  } catch (error) {
    console.error('Erreur lors du chargement du restaurant:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du chargement du restaurant'
    });
  }
};

/**
 * Créer un nouveau restaurant
 */
const createRestaurant = async (req, res) => {
  try {
    const {
      nom,
      slug,
      adresse,
      telephone,
      email,
      couleur_theme = '#3B82F6',
      devise = 'EUR',
      fuseau_horaire = 'Europe/Paris',
      plan = 'BASIC',
      limite_commandes_mois = 1000,
      limite_utilisateurs = 5
    } = req.body;

    // Validation des données requises
    if (!nom || !slug || !adresse || !telephone || !email) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Vérifier que le slug n'existe pas déjà
    const [existingRestaurants] = await pool.execute(
        'SELECT id FROM restaurants WHERE slug = ?',
        [slug]
      );

    if (existingRestaurants.length > 0) {
        return res.status(400).json({
          success: false,
        error: 'Ce slug est déjà utilisé'
      });
    }

    // Créer le restaurant
    const [result] = await pool.execute(`
      INSERT INTO restaurants (
        nom, slug, adresse, telephone, email, couleur_theme, 
        devise, fuseau_horaire, plan, limite_commandes_mois, 
        limite_utilisateurs, statut, date_creation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIF', NOW())
    `, [
      nom, slug, adresse, telephone, email, couleur_theme,
      devise, fuseau_horaire, plan, limite_commandes_mois, limite_utilisateurs
    ]);

    // Récupérer le restaurant créé
    const [newRestaurant] = await pool.execute(
      'SELECT * FROM restaurants WHERE id = ?',
      [result.insertId]
    );

      res.status(201).json({
        success: true,
      data: newRestaurant[0],
        message: 'Restaurant créé avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la création du restaurant:', error);
      res.status(500).json({
        success: false,
      error: 'Erreur lors de la création du restaurant'
    });
  }
};

/**
 * Mettre à jour un restaurant
 */
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier que le restaurant existe
    const [restaurants] = await pool.execute(
      'SELECT id FROM restaurants WHERE id = ?',
      [id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant non trouvé'
      });
    }

    // Vérifier l'unicité du slug si modifié
    if (updateData.slug) {
      const [existingRestaurants] = await pool.execute(
        'SELECT id FROM restaurants WHERE slug = ? AND id != ?',
        [updateData.slug, id]
      );

      if (existingRestaurants.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Ce slug est déjà utilisé'
        });
      }
    }

    // Construire la requête de mise à jour
    const allowedFields = [
      'nom', 'slug', 'adresse', 'telephone', 'email', 'couleur_theme',
      'devise', 'fuseau_horaire', 'plan', 'limite_commandes_mois', 'limite_utilisateurs'
    ];

    const updateFields = [];
    const updateValues = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(updateData[field]);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Aucune donnée à mettre à jour'
      });
    }

    updateFields.push('date_mise_a_jour = NOW()');
    updateValues.push(id);

    await pool.execute(
      `UPDATE restaurants SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Récupérer le restaurant mis à jour
    const [updatedRestaurant] = await pool.execute(
      'SELECT * FROM restaurants WHERE id = ?',
      [id]
    );

    res.json({
        success: true,
      data: updatedRestaurant[0],
        message: 'Restaurant mis à jour avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour du restaurant:', error);
      res.status(500).json({
        success: false,
      error: 'Erreur lors de la mise à jour du restaurant'
    });
  }
};

/**
 * Changer le statut d'un restaurant
 */
const toggleRestaurantStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que le restaurant existe et récupérer son statut actuel
    const [restaurants] = await pool.execute(
      'SELECT id, statut FROM restaurants WHERE id = ?',
      [id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant non trouvé'
      });
    }

    // Basculer le statut : ACTIF -> SUSPENDU, SUSPENDU -> ACTIF
    const currentStatus = restaurants[0].statut;
    const newStatus = currentStatus === 'ACTIF' ? 'SUSPENDU' : 'ACTIF';

    // Mettre à jour le statut
    await pool.execute(
      'UPDATE restaurants SET statut = ?, date_mise_a_jour = NOW() WHERE id = ?',
      [newStatus, id]
    );

    // Si suspension, désactiver tous les utilisateurs du restaurant
    if (newStatus === 'SUSPENDU') {
      await pool.execute(
        'UPDATE utilisateurs SET statut = "INACTIF" WHERE restaurant_id = ?',
        [id]
      );
    }

    // Récupérer le restaurant mis à jour
    const [updatedRestaurant] = await pool.execute(
      'SELECT * FROM restaurants WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      data: updatedRestaurant[0],
      message: `Restaurant ${newStatus.toLowerCase()} avec succès`
    });

  } catch (error) {
    console.error('Erreur lors du changement de statut:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du changement de statut'
    });
  }
};

/**
 * Supprimer un restaurant
 */
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que le restaurant existe
    const [restaurants] = await pool.execute(
      'SELECT id FROM restaurants WHERE id = ?',
      [id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant non trouvé'
      });
    }

    // Supprimer seulement le restaurant (approche minimale)
    const [result] = await pool.execute('DELETE FROM restaurants WHERE id = ?', [id]);
    
    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: 'Restaurant supprimé avec succès'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Restaurant non trouvé'
      });
    }

  } catch (error) {
    console.error('Erreur lors de la suppression du restaurant:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du restaurant',
      details: error.message
    });
  }
};

/**
 * Vérifier la disponibilité d'un slug
 */
const checkSlugAvailability = async (req, res) => {
  try {
    const { slug } = req.params;
    const { exclude } = req.query;

    let query = 'SELECT id FROM restaurants WHERE slug = ?';
    let params = [slug];

    if (exclude) {
      query += ' AND id != ?';
      params.push(exclude);
    }

    const [restaurants] = await pool.execute(query, params);

    res.json({
      success: true,
      data: {
        available: restaurants.length === 0
      }
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du slug:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la vérification du slug'
    });
  }
};

// ===== GESTION DES UTILISATEURS =====

/**
 * Récupérer tous les utilisateurs
 */
const getAllUsers = async (req, res) => {
    try {
      const [users] = await pool.execute(`
        SELECT 
          u.*,
        r.nom as restaurant_nom
        FROM utilisateurs u
      LEFT JOIN restaurants r ON u.restaurant_id = r.id
        ORDER BY u.date_creation DESC
      `);

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du chargement des utilisateurs'
    });
  }
};

/**
 * Récupérer les utilisateurs d'un restaurant
 */
const getUsersByRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.execute(
      'SELECT * FROM utilisateurs WHERE restaurant_id = ? ORDER BY date_creation DESC',
      [id]
    );

    res.json({
        success: true,
        data: users
      });

    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      res.status(500).json({
        success: false,
      error: 'Erreur lors du chargement des utilisateurs'
    });
  }
};

/**
 * Créer un nouvel utilisateur
 */
const createUser = async (req, res) => {
  try {
    const {
      nom_utilisateur,
      email,
      mot_de_passe,
      role,
      restaurant_id
    } = req.body;

    // Validation des données
    if (!nom_utilisateur || !email || !mot_de_passe || !role || !restaurant_id) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs sont requis'
      });
    }

    // Vérifier que le restaurant existe
    const [restaurants] = await pool.execute(
      'SELECT id FROM restaurants WHERE id = ?',
      [restaurant_id]
    );

    if (restaurants.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Restaurant non trouvé'
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
        error: 'Cet email est déjà utilisé'
        });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Créer l'utilisateur
    const [result] = await pool.execute(`
      INSERT INTO utilisateurs (
        nom_utilisateur, email, mot_de_passe, role, restaurant_id, statut, date_creation
      ) VALUES (?, ?, ?, ?, ?, 'ACTIF', NOW())
    `, [nom_utilisateur, email, hashedPassword, role, restaurant_id]);

    // Récupérer l'utilisateur créé (sans le mot de passe)
    const [newUser] = await pool.execute(`
      SELECT id_utilisateur, nom_utilisateur, email, role, restaurant_id, statut, date_creation
      FROM utilisateurs WHERE id_utilisateur = ?
    `, [result.insertId]);

      res.status(201).json({
        success: true,
      data: newUser[0],
        message: 'Utilisateur créé avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
      error: 'Erreur lors de la création de l\'utilisateur'
    });
  }
};

/**
 * Mettre à jour un utilisateur
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier que l'utilisateur existe
    const [users] = await pool.execute(
      'SELECT id_utilisateur FROM utilisateurs WHERE id_utilisateur = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Construire la requête de mise à jour
    const allowedFields = ['nom_utilisateur', 'email', 'role', 'statut', 'id_restaurant'];
    const updateFields = [];
    const updateValues = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(updateData[field]);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Aucune donnée à mettre à jour'
      });
    }

    updateValues.push(id);

    await pool.execute(
      `UPDATE utilisateurs SET ${updateFields.join(', ')} WHERE id_utilisateur = ?`,
      updateValues
    );

    // Récupérer l'utilisateur mis à jour
    const [updatedUser] = await pool.execute(`
      SELECT id_utilisateur, nom_utilisateur, email, role, restaurant_id, statut, date_creation
      FROM utilisateurs WHERE id_utilisateur = ?
    `, [id]);

    res.json({
        success: true,
      data: updatedUser[0],
        message: 'Utilisateur mis à jour avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
      error: 'Erreur lors de la mise à jour de l\'utilisateur'
    });
  }
};

/**
 * Supprimer un utilisateur
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'utilisateur existe
    const [users] = await pool.execute(
      'SELECT id_utilisateur FROM utilisateurs WHERE id_utilisateur = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Supprimer l'utilisateur
    await pool.execute(
      'DELETE FROM utilisateurs WHERE id_utilisateur = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression de l\'utilisateur'
    });
  }
};

// ===== ANALYTICS =====

/**
 * Analytics d'un restaurant
 */
const getRestaurantAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que le restaurant existe
    const [restaurants] = await pool.execute(
      'SELECT * FROM restaurants WHERE id = ?',
      [id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant non trouvé'
      });
    }

    const restaurant = restaurants[0];

    // Statistiques du restaurant
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT c.id_commande) as commandes_30j,
        COALESCE(SUM(
          (SELECT COALESCE(SUM(prix_cfa * quantite), 0) FROM commande_produits cp 
           JOIN produits p ON cp.id_produit = p.id_produit 
           WHERE cp.id_commande = c.id_commande)
        ), 0) as ca_30j,
        COUNT(DISTINCT u.id_utilisateur) as utilisateurs_actifs,
        COUNT(DISTINCT s.id) as sessions_actives
      FROM restaurants r
      LEFT JOIN sessions s2 ON r.id = s2.restaurant_id
      LEFT JOIN commandes c ON s2.id_session = c.id_session AND DATE(c.date_commande) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      LEFT JOIN utilisateurs u ON r.id = u.restaurant_id AND u.statut = 'ACTIF'
      LEFT JOIN sessions s ON r.id = s.restaurant_id AND s.statut = 'ACTIVE'
      WHERE r.id = ?
    `, [id]);

    res.json({
      success: true,
      data: {
        restaurant,
        stats: stats[0]
      }
    });

  } catch (error) {
    console.error('Erreur lors du chargement des analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du chargement des analytics'
    });
  }
};

/**
 * Analytics globales
 */
const getGlobalAnalytics = async (req, res) => {
  try {
    // Analytics globales de la plateforme
    const [analytics] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT r.id) as total_restaurants,
        COUNT(DISTINCT u.id_utilisateur) as total_utilisateurs,
        COUNT(DISTINCT c.id_commande) as total_commandes_30j,
        COALESCE(SUM(
          (SELECT COALESCE(SUM(prix_cfa * quantite), 0) FROM commande_produits cp 
           JOIN produits p ON cp.id_produit = p.id_produit 
           WHERE cp.id_commande = c.id_commande)
        ), 0) as ca_total_30j,
        AVG(
          (SELECT COALESCE(SUM(prix_cfa * quantite), 0) FROM commande_produits cp 
           JOIN produits p ON cp.id_produit = p.id_produit 
           WHERE cp.id_commande = c.id_commande)
        ) as panier_moyen
      FROM restaurants r
      LEFT JOIN utilisateurs u ON r.id = u.restaurant_id
      LEFT JOIN sessions s ON r.id = s.restaurant_id
      LEFT JOIN commandes c ON s.id_session = c.id_session AND DATE(c.date_commande) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    res.json({
      success: true,
      data: analytics[0]
    });

  } catch (error) {
    console.error('Erreur lors du chargement des analytics globales:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du chargement des analytics globales'
    });
  }
};

// ===== FONCTIONS PLACEHOLDER POUR LES FONCTIONNALITÉS FUTURES =====

const getPlans = async (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'BASIC', nom: 'Basic', prix: 29, limite_commandes: 1000, limite_utilisateurs: 5 },
      { id: 'PREMIUM', nom: 'Premium', prix: 79, limite_commandes: 5000, limite_utilisateurs: 20 },
      { id: 'ENTERPRISE', nom: 'Enterprise', prix: 199, limite_commandes: 50000, limite_utilisateurs: 100 }
    ]
  });
};

const updateRestaurantPlan = async (req, res) => {
  res.json({
    success: true,
    message: 'Plan mis à jour avec succès'
  });
};

const getRestaurantStats = async (req, res) => {
  res.json({
    success: true,
    data: []
  });
};

const getUserStats = async (req, res) => {
  res.json({
    success: true,
    data: []
  });
};

const getRevenueStats = async (req, res) => {
  res.json({
    success: true,
    data: []
  });
};

const suspendRestaurant = async (req, res) => {
  res.json({
    success: true,
    message: 'Restaurant suspendu avec succès'
  });
};

const unsuspendRestaurant = async (req, res) => {
  res.json({
    success: true,
    message: 'Restaurant réactivé avec succès'
  });
};

const getSuspensions = async (req, res) => {
  res.json({
    success: true,
    data: []
  });
};

const getAdminLogs = async (req, res) => {
  res.json({
    success: true,
    data: []
  });
};

const getRestaurantAudit = async (req, res) => {
  res.json({
    success: true,
    data: []
  });
};

const createBackup = async (req, res) => {
  res.json({
    success: true,
    message: 'Sauvegarde créée avec succès'
  });
};

const getBackups = async (req, res) => {
  res.json({
    success: true,
    data: []
  });
};

const runMaintenance = async (req, res) => {
  res.json({
    success: true,
    message: 'Maintenance exécutée avec succès'
  });
};

module.exports = {
  // Authentification
  loginAdmin,
  verifyAdminToken,
  
  // Dashboard
  getDashboardStats,
  getTopRestaurants,
  
  // Restaurants
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  updateRestaurantStatus,
  toggleRestaurantStatus,
  deleteRestaurant,
  checkSlugAvailability,
  
  // Utilisateurs
  getAllUsers,
  getUsersByRestaurant,
  createUser,
  updateUser,
  deleteUser,
  
  // Analytics
  getRestaurantAnalytics,
  getGlobalAnalytics,
  
  // Fonctionnalités futures
  getPlans,
  updateRestaurantPlan,
  getRestaurantStats,
  getUserStats,
  getRevenueStats,
  suspendRestaurant,
  unsuspendRestaurant,
  getSuspensions,
  getAdminLogs,
  getRestaurantAudit,
  createBackup,
  getBackups,
  runMaintenance
};

// ===== ANALYSES =====
const getAnalyticsData = async (req, res) => {
  try {
    const { period = '30j', restaurant_id = 'all' } = req.query;
    
    // Calculer les dates selon la période
    let dateFilter = '';
    let dateParams = [];
    
    switch (period) {
      case '7j':
        dateFilter = 'AND date_commande >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
        break;
      case '30j':
        dateFilter = 'AND date_commande >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
        break;
      case '90j':
        dateFilter = 'AND date_commande >= DATE_SUB(NOW(), INTERVAL 90 DAY)';
        break;
      case '1a':
        dateFilter = 'AND date_commande >= DATE_SUB(NOW(), INTERVAL 1 YEAR)';
        break;
    }

    // Filtre restaurant
    let restaurantFilter = '';
    if (restaurant_id !== 'all') {
      restaurantFilter = 'AND restaurant_id = ?';
      dateParams.push(restaurant_id);
    }

    // 1. REVENUS
    const [revenueData] = await pool.execute(`
      SELECT 
        COALESCE(SUM(montant_total), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN date_facture >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN montant_total ELSE 0 END), 0) as monthly_revenue,
        COALESCE(SUM(CASE WHEN date_facture >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN montant_total ELSE 0 END), 0) as weekly_revenue,
        COALESCE(SUM(CASE WHEN date_facture >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN montant_total ELSE 0 END), 0) as daily_revenue
      FROM factures_archivees 
      WHERE 1=1 ${restaurantFilter}
    `, dateParams);

    // 2. COMMANDES
    const [ordersData] = await pool.execute(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN statut_commande = 'SERVI' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN statut_commande = '' OR statut_commande IS NULL THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN statut_commande = 'ANNULÉ' THEN 1 ELSE 0 END) as cancelled_orders
      FROM commandes 
      WHERE 1=1 ${restaurantFilter} ${dateFilter}
    `, dateParams);

    // 3. UTILISATEURS
    const [usersData] = await pool.execute(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN statut = 'ACTIF' THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN date_creation >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_users
      FROM utilisateurs 
      WHERE 1=1 ${restaurantFilter}
    `, dateParams);

    // 4. RESTAURANTS
    const [restaurantsData] = await pool.execute(`
      SELECT 
        COUNT(*) as total_restaurants,
        SUM(CASE WHEN statut = 'ACTIF' THEN 1 ELSE 0 END) as active_restaurants,
        SUM(CASE WHEN plan IN ('PREMIUM', 'ENTERPRISE') THEN 1 ELSE 0 END) as premium_restaurants
      FROM restaurants
    `);

    // Calculer les croissances (comparaison avec la période précédente)
    const [prevRevenueData] = await pool.execute(`
      SELECT 
        COALESCE(SUM(montant_total), 0) as prev_total_revenue
      FROM factures_archivees 
      WHERE 1=1 ${restaurantFilter}
      AND date_facture < DATE_SUB(NOW(), INTERVAL ${period === '7j' ? 7 : period === '30j' ? 30 : period === '90j' ? 90 : 365} DAY)
      AND date_facture >= DATE_SUB(NOW(), INTERVAL ${period === '7j' ? 14 : period === '30j' ? 60 : period === '90j' ? 180 : 730} DAY)
    `, dateParams);

    const [prevOrdersData] = await pool.execute(`
      SELECT 
        COUNT(*) as prev_total_orders
      FROM commandes 
      WHERE 1=1 ${restaurantFilter}
      AND date_commande < DATE_SUB(NOW(), INTERVAL ${period === '7j' ? 7 : period === '30j' ? 30 : period === '90j' ? 90 : 365} DAY)
      AND date_commande >= DATE_SUB(NOW(), INTERVAL ${period === '7j' ? 14 : period === '30j' ? 60 : period === '90j' ? 180 : 730} DAY)
    `, dateParams);

    // Calculer les pourcentages de croissance
    const revenueGrowth = prevRevenueData[0].prev_total_revenue > 0 
      ? ((revenueData[0].total_revenue - prevRevenueData[0].prev_total_revenue) / prevRevenueData[0].prev_total_revenue) * 100
      : 0;

    const ordersGrowth = prevOrdersData[0].prev_total_orders > 0 
      ? ((ordersData[0].total_orders - prevOrdersData[0].prev_total_orders) / prevOrdersData[0].prev_total_orders) * 100
      : 0;

    const usersGrowth = usersData[0].total_users > 0 
      ? (usersData[0].new_users / usersData[0].total_users) * 100
      : 0;

    const restaurantsGrowth = restaurantsData[0].total_restaurants > 0 
      ? (restaurantsData[0].active_restaurants / restaurantsData[0].total_restaurants) * 100
      : 0;

    const analyticsData = {
      revenue: {
        total: parseFloat(revenueData[0].total_revenue) || 0,
        monthly: parseFloat(revenueData[0].monthly_revenue) || 0,
        weekly: parseFloat(revenueData[0].weekly_revenue) || 0,
        daily: parseFloat(revenueData[0].daily_revenue) || 0,
        growth: Math.round(revenueGrowth * 100) / 100
      },
      orders: {
        total: parseInt(ordersData[0].total_orders) || 0,
        completed: parseInt(ordersData[0].completed_orders) || 0,
        pending: parseInt(ordersData[0].pending_orders) || 0,
        cancelled: parseInt(ordersData[0].cancelled_orders) || 0,
        growth: Math.round(ordersGrowth * 100) / 100
      },
      users: {
        total: parseInt(usersData[0].total_users) || 0,
        active: parseInt(usersData[0].active_users) || 0,
        new: parseInt(usersData[0].new_users) || 0,
        growth: Math.round(usersGrowth * 100) / 100
      },
      restaurants: {
        total: parseInt(restaurantsData[0].total_restaurants) || 0,
        active: parseInt(restaurantsData[0].active_restaurants) || 0,
        premium: parseInt(restaurantsData[0].premium_restaurants) || 0,
        growth: Math.round(restaurantsGrowth * 100) / 100
      }
    };

    res.json({
      success: true,
      data: analyticsData,
      period,
      restaurant_id
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des analyses:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des données d\'analyses'
    });
  }
};

// Export de la fonction getAnalyticsData
module.exports.getAnalyticsData = getAnalyticsData;