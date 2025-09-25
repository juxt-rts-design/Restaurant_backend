const { pool } = require('../config/database');

class Panier {
  // Créer un panier pour un utilisateur
  static async create(idSession, nomUtilisateur) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO paniers (id_session, nom_utilisateur, statut_panier) VALUES (?, ?, ?)',
        [idSession, nomUtilisateur, 'ACTIF']
      );
      
      return {
        id: result.insertId,
        idSession,
        nomUtilisateur,
        statutPanier: 'ACTIF',
        dateCreation: new Date()
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création du panier: ${error.message}`);
    }
  }

  // Récupérer le panier actif d'un utilisateur dans une session
  static async getActiveByUser(idSession, nomUtilisateur) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM paniers WHERE id_session = ? AND nom_utilisateur = ? AND statut_panier = "ACTIF"',
        [idSession, nomUtilisateur]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du panier: ${error.message}`);
    }
  }

  // Récupérer tous les paniers actifs d'une session
  static async getActiveBySession(idSession) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM paniers WHERE id_session = ? AND statut_panier = "ACTIF"',
        [idSession]
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des paniers: ${error.message}`);
    }
  }

  // Fermer un panier (après validation de commande)
  static async close(idPanier) {
    try {
      await pool.execute(
        'UPDATE paniers SET statut_panier = "FERMÉ", date_fermeture = NOW() WHERE id_panier = ?',
        [idPanier]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la fermeture du panier: ${error.message}`);
    }
  }

  // Vérifier si un utilisateur a un panier actif
  static async hasActivePanier(idSession, nomUtilisateur) {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM paniers WHERE id_session = ? AND nom_utilisateur = ? AND statut_panier = "ACTIF"',
        [idSession, nomUtilisateur]
      );
      return rows[0].count > 0;
    } catch (error) {
      throw new Error(`Erreur lors de la vérification du panier: ${error.message}`);
    }
  }
}

module.exports = Panier;
