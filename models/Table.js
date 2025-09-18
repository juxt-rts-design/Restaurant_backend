const { pool } = require('../config/database');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

class Table {
  // Créer une nouvelle table
  static async create(nomTable, capacite = 0) {
    try {
      const qrCode = uuidv4().replace(/-/g, '');
      const [result] = await pool.execute(
        'INSERT INTO tables (nom_table, capacite, qr_code) VALUES (?, ?, ?)',
        [nomTable, capacite, qrCode]
      );
      
      const table = {
        id: result.insertId,
        nomTable,
        capacite,
        qrCode,
        active: true
      };
      
      return table;
    } catch (error) {
      throw new Error(`Erreur lors de la création de la table: ${error.message}`);
    }
  }

  // Récupérer une table par QR code
  static async getByQrCode(qrCode) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tables WHERE qr_code = ? AND active = 1',
        [qrCode]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la table: ${error.message}`);
    }
  }

  // Récupérer une table par ID
  static async getById(idTable) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tables WHERE id_table = ?',
        [idTable]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la table: ${error.message}`);
    }
  }

  // Récupérer toutes les tables
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tables ORDER BY nom_table'
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des tables: ${error.message}`);
    }
  }

  // Mettre à jour le statut d'une table
  static async updateStatus(idTable, active) {
    try {
      await pool.execute(
        'UPDATE tables SET active = ? WHERE id_table = ?',
        [active ? 1 : 0, idTable]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la table: ${error.message}`);
    }
  }

  // Générer le QR code en image
  static async generateQrCodeImage(qrCode, baseUrl) {
    try {
      const qrUrl = `${baseUrl}/${qrCode}`;
      const qrCodeImage = await QRCode.toDataURL(qrUrl);
      return qrCodeImage;
    } catch (error) {
      throw new Error(`Erreur lors de la génération du QR code: ${error.message}`);
    }
  }

  // Récupérer les tables actives
  static async getActiveTables() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tables WHERE active = 1 ORDER BY nom_table'
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des tables actives: ${error.message}`);
    }
  }
}

module.exports = Table;
