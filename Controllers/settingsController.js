const { pool } = require('../config/database');

// ===== RÉCUPÉRATION DES PARAMÈTRES =====
const getSettings = async (req, res) => {
  try {
    const { category = 'all' } = req.query;
    
    let query = 'SELECT * FROM system_settings';
    let params = [];
    
    if (category !== 'all') {
      query += ' WHERE category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY category, setting_key';
    
    const [settings] = await pool.execute(query, params);
    
    // Organiser les paramètres par catégorie
    const organizedSettings = {};
    settings.forEach(setting => {
      if (!organizedSettings[setting.category]) {
        organizedSettings[setting.category] = {};
      }
      
      // Convertir la valeur selon le type
      let value = setting.setting_value;
      switch (setting.setting_type) {
        case 'number':
          value = parseFloat(value) || 0;
          break;
        case 'boolean':
          value = value === 'true';
          break;
        case 'json':
          try {
            value = JSON.parse(value);
          } catch (e) {
            value = value;
          }
          break;
        default:
          value = value;
      }
      
      organizedSettings[setting.category][setting.setting_key] = {
        value,
        type: setting.setting_type,
        description: setting.description,
        is_public: setting.is_public
      };
    });
    
    res.json({
      success: true,
      data: organizedSettings
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des paramètres'
    });
  }
};

// ===== MISE À JOUR DES PARAMÈTRES =====
const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Paramètres invalides'
      });
    }
    
    const updates = [];
    const params = [];
    
    // Préparer les mises à jour
    for (const [category, categorySettings] of Object.entries(settings)) {
      for (const [key, value] of Object.entries(categorySettings)) {
        let stringValue = value;
        let type = 'string';
        
        // Déterminer le type et convertir
        if (typeof value === 'boolean') {
          stringValue = value.toString();
          type = 'boolean';
        } else if (typeof value === 'number') {
          stringValue = value.toString();
          type = 'number';
        } else if (typeof value === 'object') {
          stringValue = JSON.stringify(value);
          type = 'json';
        }
        
        updates.push('(?, ?, ?, ?, ?)');
        params.push(key, stringValue, type, '', category); // Description vide par défaut
      }
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Aucun paramètre à mettre à jour'
      });
    }
    
    // Utiliser INSERT ... ON DUPLICATE KEY UPDATE
    const query = `
      INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category) 
      VALUES ${updates.join(', ')}
      ON DUPLICATE KEY UPDATE 
      setting_value = VALUES(setting_value),
      setting_type = VALUES(setting_type),
      description = VALUES(description),
      updated_at = CURRENT_TIMESTAMP
    `;
    
    await pool.execute(query, params);
    
    res.json({
      success: true,
      message: 'Paramètres mis à jour avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour des paramètres'
    });
  }
};

// ===== STATISTIQUES SYSTÈME =====
const getSystemStats = async (req, res) => {
  try {
    // Statistiques des restaurants
    const [restaurantStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_restaurants,
        SUM(CASE WHEN statut = 'ACTIF' THEN 1 ELSE 0 END) as active_restaurants,
        SUM(CASE WHEN statut = 'SUSPENDU' THEN 1 ELSE 0 END) as suspended_restaurants
      FROM restaurants
    `);
    
    // Statistiques des utilisateurs
    const [userStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN statut = 'ACTIF' THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN role = 'ADMIN' THEN 1 ELSE 0 END) as admin_users,
        SUM(CASE WHEN role = 'MANAGER' THEN 1 ELSE 0 END) as manager_users,
        SUM(CASE WHEN role = 'CAISSIER' THEN 1 ELSE 0 END) as cashier_users,
        SUM(CASE WHEN role = 'CUISINIER' THEN 1 ELSE 0 END) as chef_users
      FROM utilisateurs
    `);
    
    // Revenus totaux en FCFA
    const [revenueStats] = await pool.execute(`
      SELECT 
        COALESCE(SUM(montant_total), 0) as total_revenue_fcfa,
        COALESCE(SUM(CASE WHEN date_facture >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN montant_total ELSE 0 END), 0) as monthly_revenue_fcfa,
        COALESCE(SUM(CASE WHEN date_facture >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN montant_total ELSE 0 END), 0) as weekly_revenue_fcfa
      FROM factures_archivees
    `);
    
    // Taille de la base de données
    const [dbSize] = await pool.execute(`
      SELECT 
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as size_mb
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `);
    
    // Dernière sauvegarde (simulation)
    const lastBackup = new Date();
    lastBackup.setHours(lastBackup.getHours() - 2);
    
    const stats = {
      restaurants: restaurantStats[0],
      users: userStats[0],
      revenue: revenueStats[0],
      database: {
        size_mb: dbSize[0].size_mb || 0,
        last_backup: lastBackup.toISOString()
      }
    };
    
    // Mettre à jour les statistiques dans system_settings
    await pool.execute(`
      INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category) 
      VALUES 
        ('total_restaurants', ?, 'number', 'Nombre total de restaurants', 'stats'),
        ('total_users', ?, 'number', 'Nombre total d\'utilisateurs', 'stats'),
        ('total_revenue_fcfa', ?, 'number', 'Revenus totaux en FCFA', 'stats'),
        ('database_size_mb', ?, 'number', 'Taille de la base en MB', 'database'),
        ('last_backup', ?, 'string', 'Dernière sauvegarde', 'database')
      ON DUPLICATE KEY UPDATE 
        setting_value = VALUES(setting_value),
        updated_at = CURRENT_TIMESTAMP
    `, [
      restaurantStats[0].total_restaurants,
      userStats[0].total_users,
      revenueStats[0].total_revenue_fcfa,
      dbSize[0].size_mb,
      lastBackup.toISOString()
    ]);
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
};

// ===== GESTION DES CLÉS API =====
const getApiKeys = async (req, res) => {
  try {
    const [keys] = await pool.execute(`
      SELECT 
        ak.*,
        u.nom_utilisateur as created_by_name
      FROM api_keys ak
      LEFT JOIN utilisateurs u ON ak.created_by = u.id_utilisateur
      WHERE ak.is_active = true
      ORDER BY ak.created_at DESC
    `);
    
    // Masquer les valeurs des clés pour la sécurité
    const maskedKeys = keys.map(key => ({
      ...key,
      key_value: key.key_value.substring(0, 12) + '••••••••••••••••'
    }));
    
    res.json({
      success: true,
      data: maskedKeys
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des clés API:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des clés API'
    });
  }
};

const createApiKey = async (req, res) => {
  try {
    const { key_name, key_type = 'admin', permissions = ['read'] } = req.body;
    const created_by = req.user.id_utilisateur;
    
    if (!key_name) {
      return res.status(400).json({
        success: false,
        error: 'Le nom de la clé est requis'
      });
    }
    
    // Générer une clé API sécurisée
    const keyValue = 'sk_live_' + require('crypto').randomBytes(32).toString('hex');
    
    const [result] = await pool.execute(`
      INSERT INTO api_keys (key_name, key_value, key_type, permissions, created_by)
      VALUES (?, ?, ?, ?, ?)
    `, [key_name, keyValue, key_type, JSON.stringify(permissions), created_by]);
    
    res.json({
      success: true,
      data: {
        id: result.insertId,
        key_name,
        key_value: keyValue,
        key_type,
        permissions
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la création de la clé API:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de la clé API'
    });
  }
};

const regenerateApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const newKeyValue = 'sk_live_' + require('crypto').randomBytes(32).toString('hex');
    
    const [result] = await pool.execute(`
      UPDATE api_keys 
      SET key_value = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND is_active = true
    `, [newKeyValue, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Clé API non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: {
        key_value: newKeyValue
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la régénération de la clé API:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la régénération de la clé API'
    });
  }
};

// ===== SAUVEGARDE DE LA BASE DE DONNÉES =====
const backupDatabase = async (req, res) => {
  try {
    // Simulation d'une sauvegarde (en production, utiliser mysqldump)
    const backupTime = new Date().toISOString();
    
    // Mettre à jour le timestamp de la dernière sauvegarde
    await pool.execute(`
      UPDATE system_settings 
      SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
      WHERE setting_key = 'last_backup'
    `, [backupTime]);
    
    res.json({
      success: true,
      message: 'Sauvegarde effectuée avec succès',
      data: {
        backup_time: backupTime
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la sauvegarde'
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getSystemStats,
  getApiKeys,
  createApiKey,
  regenerateApiKey,
  backupDatabase
};
