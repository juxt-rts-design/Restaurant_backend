const { pool } = require('../config/database');

class Client {
  // Créer un nouveau client
  static async create(nomComplet) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO clients (nom_complet) VALUES (?)',
        [nomComplet]
      );
      return { id: result.insertId, nomComplet, dateEnregistrement: new Date() };
    } catch (error) {
      throw new Error(`Erreur lors de la création du client: ${error.message}`);
    }
  }

  // Récupérer un client par ID
  static async getById(idClient) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM clients WHERE id_client = ?',
        [idClient]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du client: ${error.message}`);
    }
  }

  // Récupérer tous les clients
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM clients ORDER BY date_enregistrement DESC'
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des clients: ${error.message}`);
    }
  }

  // Rechercher des clients par nom
  static async searchByName(nom) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM clients WHERE nom_complet LIKE ? ORDER BY date_enregistrement DESC',
        [`%${nom}%`]
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de clients: ${error.message}`);
    }
  }
}

module.exports = Client;
