const { pool } = require('../config/database');

class Commande {
  // Créer une nouvelle commande
  static async create(idSession) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO commandes (id_session, statut_commande) VALUES (?, ?)',
        [idSession, 'EN_ATTENTE']
      );
      
      return {
        id_commande: result.insertId,
        id_session: idSession,
        statut_commande: 'EN_ATTENTE',
        date_commande: new Date()
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création de la commande: ${error.message}`);
    }
  }

  // Récupérer une commande par ID
  static async getById(idCommande) {
    try {
      const [rows] = await pool.execute(
        'SELECT c.*, s.id_table, s.id_client, cl.nom_complet, t.nom_table ' +
        'FROM commandes c ' +
        'JOIN sessions s ON c.id_session = s.id_session ' +
        'JOIN clients cl ON s.id_client = cl.id_client ' +
        'JOIN tables t ON s.id_table = t.id_table ' +
        'WHERE c.id_commande = ?',
        [idCommande]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la commande: ${error.message}`);
    }
  }

  // Récupérer les commandes d'une session
  static async getBySession(idSession) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM commandes WHERE id_session = ? ORDER BY date_commande DESC',
        [idSession]
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commandes de la session: ${error.message}`);
    }
  }

  // Récupérer toutes les commandes en attente
  static async getPending() {
    try {
      const [rows] = await pool.execute(
        'SELECT c.*, s.id_table, s.id_client, cl.nom_complet, t.nom_table ' +
        'FROM commandes c ' +
        'JOIN sessions s ON c.id_session = s.id_session ' +
        'JOIN clients cl ON s.id_client = cl.id_client ' +
        'JOIN tables t ON s.id_table = t.id_table ' +
        'WHERE c.statut_commande = "EN_ATTENTE" ORDER BY c.date_commande ASC'
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commandes en attente: ${error.message}`);
    }
  }

  // Mettre à jour le statut d'une commande
  static async updateStatus(idCommande, statutCommande) {
    try {
      await pool.execute(
        'UPDATE commandes SET statut_commande = ? WHERE id_commande = ?',
        [statutCommande, idCommande]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du statut de la commande: ${error.message}`);
    }
  }

  // Récupérer les détails d'une commande avec produits
  static async getDetails(idCommande) {
    try {
      // Récupérer la commande
      const commande = await this.getById(idCommande);
      if (!commande) {
        return null;
      }

      // Récupérer les produits de la commande
      const [produits] = await pool.execute(
        'SELECT cp.*, p.nom_produit, p.description ' +
        'FROM commande_produits cp ' +
        'JOIN produits p ON cp.id_produit = p.id_produit ' +
        'WHERE cp.id_commande = ?',
        [idCommande]
      );

      // Calculer le total
      const total = produits.reduce((sum, produit) => {
        return sum + (produit.prix_unitaire * produit.quantite);
      }, 0);

      return {
        ...commande,
        produits,
        total
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des détails de la commande: ${error.message}`);
    }
  }

  // Récupérer toutes les commandes
  static async getAll(limit = 50, offset = 0) {
    try {
      const [rows] = await pool.execute(
        'SELECT c.*, s.id_table, s.id_client, cl.nom_complet, t.nom_table ' +
        'FROM commandes c ' +
        'JOIN sessions s ON c.id_session = s.id_session ' +
        'JOIN clients cl ON s.id_client = cl.id_client ' +
        'JOIN tables t ON s.id_table = t.id_table ' +
        'ORDER BY c.date_commande DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commandes: ${error.message}`);
    }
  }

  // Annuler une commande
  static async cancel(idCommande) {
    try {
      await pool.execute(
        'UPDATE commandes SET statut_commande = "ANNULÉ" WHERE id_commande = ?',
        [idCommande]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de l\'annulation de la commande: ${error.message}`);
    }
  }
}

module.exports = Commande;
