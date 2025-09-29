const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Paiement {
  // Créer un nouveau paiement
  static async create(idCommande, methodePaiement, montantTotal) {
    try {
      const codeValidation = uuidv4().substring(0, 8).toUpperCase();
      
      const [result] = await pool.execute(
        'INSERT INTO paiements (id_commande, methode_paiement, montant_total, statut_paiement, code_validation) VALUES (?, ?, ?, ?, ?)',
        [idCommande, methodePaiement, montantTotal, 'EN_COURS', codeValidation]
      );
      
      return {
        id: result.insertId,
        idCommande,
        methodePaiement,
        montantTotal,
        statutPaiement: 'EN_COURS',
        codeValidation,
        datePaiement: new Date()
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création du paiement: ${error.message}`);
    }
  }

  // Récupérer un paiement par ID
  static async getById(idPaiement) {
    try {
      const [rows] = await pool.execute(
        'SELECT p.*, c.id_session, s.id_table, s.id_client, cl.nom_complet, t.nom_table ' +
        'FROM paiements p ' +
        'JOIN commandes c ON p.id_commande = c.id_commande ' +
        'JOIN sessions s ON c.id_session = s.id_session ' +
        'JOIN clients cl ON s.id_client = cl.id_client ' +
        'JOIN tables t ON s.id_table = t.id_table ' +
        'WHERE p.id_paiement = ?',
        [idPaiement]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du paiement: ${error.message}`);
    }
  }

  // Récupérer les paiements d'une commande
  static async getByCommande(idCommande) {
    try {
      const [rows] = await pool.execute(
        'SELECT p.*, c.id_session, s.id_table, s.id_client, cl.nom_complet, t.nom_table ' +
        'FROM paiements p ' +
        'JOIN commandes c ON p.id_commande = c.id_commande ' +
        'JOIN sessions s ON c.id_session = s.id_session ' +
        'JOIN clients cl ON s.id_client = cl.id_client ' +
        'JOIN tables t ON s.id_table = t.id_table ' +
        'WHERE p.id_commande = ?',
        [idCommande]
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des paiements de la commande: ${error.message}`);
    }
  }

  // Récupérer les paiements d'une session
  static async getBySession(idSession) {
    try {
      const [rows] = await pool.execute(
        'SELECT p.*, c.id_session, s.id_table, s.id_client, cl.nom_complet, t.nom_table ' +
        'FROM paiements p ' +
        'JOIN commandes c ON p.id_commande = c.id_commande ' +
        'JOIN sessions s ON c.id_session = s.id_session ' +
        'JOIN clients cl ON s.id_client = cl.id_client ' +
        'JOIN tables t ON s.id_table = t.id_table ' +
        'WHERE s.id_session = ?',
        [idSession]
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des paiements de la session: ${error.message}`);
    }
  }

  // Récupérer un paiement par code de validation
  static async getByCodeValidation(codeValidation) {
    try {
      const [rows] = await pool.execute(
        'SELECT p.*, c.id_session, s.id_table, s.id_client, cl.nom_complet, t.nom_table ' +
        'FROM paiements p ' +
        'JOIN commandes c ON p.id_commande = c.id_commande ' +
        'JOIN sessions s ON c.id_session = s.id_session ' +
        'JOIN clients cl ON s.id_client = cl.id_client ' +
        'JOIN tables t ON s.id_table = t.id_table ' +
        'WHERE p.code_validation = ?',
        [codeValidation]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du paiement par code: ${error.message}`);
    }
  }

  // Valider un paiement (validation réelle - paiement effectué)
  static async validate(idPaiement) {
    try {
      await pool.execute(
        'UPDATE paiements SET statut_paiement = "EFFECTUÉ" WHERE id_paiement = ?',
        [idPaiement]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la validation du paiement: ${error.message}`);
    }
  }

  // Valider un paiement par code
  static async validateByCode(codeValidation) {
    try {
      const paiement = await this.getByCodeValidation(codeValidation);
      if (!paiement) {
        throw new Error('Code de validation invalide');
      }

      if (paiement.statutPaiement === 'EFFECTUÉ') {
        throw new Error('Paiement déjà effectué');
      }

      await this.validate(paiement.id_paiement);
      return paiement;
    } catch (error) {
      throw new Error(`Erreur lors de la validation du paiement: ${error.message}`);
    }
  }

  // Récupérer les paiements en cours et effectués (pour la caisse)
  static async getPending() {
    try {
      const [rows] = await pool.execute(
        'SELECT p.*, c.id_session, s.id_table, s.id_client, cl.nom_complet, t.nom_table ' +
        'FROM paiements p ' +
        'JOIN commandes c ON p.id_commande = c.id_commande ' +
        'JOIN sessions s ON c.id_session = s.id_session ' +
        'JOIN clients cl ON s.id_client = cl.id_client ' +
        'JOIN tables t ON s.id_table = t.id_table ' +
        'WHERE p.statut_paiement IN ("EN_COURS", "EFFECTUÉ") ORDER BY p.date_paiement ASC'
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des paiements: ${error.message}`);
    }
  }

  // Récupérer tous les paiements
  static async getAll(limit = 50, offset = 0) {
    try {
      const [rows] = await pool.execute(
        'SELECT p.*, c.id_session, s.id_table, s.id_client, cl.nom_complet, t.nom_table ' +
        'FROM paiements p ' +
        'JOIN commandes c ON p.id_commande = c.id_commande ' +
        'JOIN sessions s ON c.id_session = s.id_session ' +
        'JOIN clients cl ON s.id_client = cl.id_client ' +
        'JOIN tables t ON s.id_table = t.id_table ' +
        'ORDER BY p.date_paiement DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des paiements: ${error.message}`);
    }
  }

  // Récupérer les statistiques de paiement
  static async getStats(dateDebut, dateFin) {
    try {
      let query = `
        SELECT 
          methode_paiement,
          COUNT(*) as nombre_paiements,
          SUM(montant_total) as total_montant,
          SUM(CASE WHEN statut_paiement = 'EFFECTUÉ' THEN 1 ELSE 0 END) as paiements_effectues,
          SUM(CASE WHEN statut_paiement = 'EFFECTUÉ' THEN montant_total ELSE 0 END) as montant_effectue
        FROM paiements
      `;
      
      const params = [];
      
      if (dateDebut && dateFin) {
        query += ' WHERE DATE(date_paiement) BETWEEN ? AND ?';
        params.push(dateDebut, dateFin);
      }
      
      query += ' GROUP BY methode_paiement';
      
      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
    }
  }

  // Annuler un paiement
  static async cancel(idPaiement) {
    try {
      await pool.execute(
        'UPDATE paiements SET statut_paiement = "ANNULÉ" WHERE id_paiement = ?',
        [idPaiement]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de l'annulation du paiement: ${error.message}`);
    }
  }

  // Archiver un paiement effectué (le supprimer de la vue)
  static async archive(idPaiement) {
    try {
      await pool.execute(
        'UPDATE paiements SET statut_paiement = "ARCHIVÉ" WHERE id_paiement = ?',
        [idPaiement]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de l'archivage du paiement: ${error.message}`);
    }
  }
}

module.exports = Paiement;
