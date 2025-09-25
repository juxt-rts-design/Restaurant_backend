const { pool } = require('../config/database');

class Session {
  // Créer une nouvelle session
  static async create(idTable, idClient) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO sessions (id_table, id_client, statut_session) VALUES (?, ?, ?)',
        [idTable, idClient, 'OUVERTE']
      );
      
      return {
        id: result.insertId,
        idTable,
        idClient,
        statutSession: 'OUVERTE',
        dateOuverture: new Date(),
        dateFermeture: null
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création de la session: ${error.message}`);
    }
  }

  // Récupérer une session par ID
  static async getById(idSession) {
    try {
      const [rows] = await pool.execute(
        'SELECT s.*, c.nom_complet, t.nom_table FROM sessions s ' +
        'JOIN clients c ON s.id_client = c.id_client ' +
        'JOIN tables t ON s.id_table = t.id_table ' +
        'WHERE s.id_session = ?',
        [idSession]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la session: ${error.message}`);
    }
  }

  // Récupérer la session active d'une table
  static async getActiveByTable(idTable) {
    try {
      const [rows] = await pool.execute(
        'SELECT s.*, c.nom_complet, t.nom_table FROM sessions s ' +
        'JOIN clients c ON s.id_client = c.id_client ' +
        'JOIN tables t ON s.id_table = t.id_table ' +
        'WHERE s.id_table = ? AND s.statut_session = "OUVERTE"',
        [idTable]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la session active: ${error.message}`);
    }
  }

  // Fermer une session
  static async close(idSession) {
    try {
      await pool.execute(
        'UPDATE sessions SET statut_session = "FERMÉE", date_fermeture = NOW() WHERE id_session = ?',
        [idSession]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la fermeture de la session: ${error.message}`);
    }
  }

  // Récupérer toutes les sessions ouvertes
  static async getOpenSessions() {
    try {
      const [rows] = await pool.execute(
        'SELECT s.*, c.nom_complet, t.nom_table FROM sessions s ' +
        'JOIN clients c ON s.id_client = c.id_client ' +
        'JOIN tables t ON s.id_table = t.id_table ' +
        'WHERE s.statut_session = "OUVERTE" ORDER BY s.date_ouverture DESC'
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des sessions ouvertes: ${error.message}`);
    }
  }

  // Récupérer l'historique des sessions
  static async getHistory(limit = 50, offset = 0) {
    try {
      const [rows] = await pool.execute(
        'SELECT s.*, c.nom_complet, t.nom_table FROM sessions s ' +
        'JOIN clients c ON s.id_client = c.id_client ' +
        'JOIN tables t ON s.id_table = t.id_table ' +
        'ORDER BY s.date_ouverture DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l\'historique: ${error.message}`);
    }
  }

  // Vérifier si une table a une session active
  static async hasActiveSession(idTable) {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM sessions WHERE id_table = ? AND statut_session = "OUVERTE"',
        [idTable]
      );
      return rows[0].count > 0;
    } catch (error) {
      throw new Error(`Erreur lors de la vérification de la session active: ${error.message}`);
    }
  }

  // Fermer une session
  static async close(idSession) {
    try {
      const [result] = await pool.execute(
        'UPDATE sessions SET statut_session = "FERMÉE", date_fermeture = NOW() WHERE id_session = ?',
        [idSession]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Session non trouvée ou déjà fermée');
      }
      
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la fermeture de la session: ${error.message}`);
    }
  }
}

module.exports = Session;
