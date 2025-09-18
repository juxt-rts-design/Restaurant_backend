const { pool } = require('../config/database');

class CommandeProduit {
  // Ajouter un produit à une commande
  static async add(idCommande, idProduit, quantite, prixUnitaire) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO commande_produits (id_commande, id_produit, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
        [idCommande, idProduit, quantite, prixUnitaire]
      );
      
      return {
        id: result.insertId,
        idCommande,
        idProduit,
        quantite,
        prixUnitaire
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'ajout du produit à la commande: ${error.message}`);
    }
  }

  // Récupérer les produits d'une commande
  static async getByCommande(idCommande) {
    try {
      const [rows] = await pool.execute(
        'SELECT cp.*, p.nom_produit, p.description ' +
        'FROM commande_produits cp ' +
        'JOIN produits p ON cp.id_produit = p.id_produit ' +
        'WHERE cp.id_commande = ?',
        [idCommande]
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des produits de la commande: ${error.message}`);
    }
  }

  // Mettre à jour la quantité d'un produit dans une commande
  static async updateQuantity(idLigne, quantite) {
    try {
      if (quantite <= 0) {
        // Supprimer la ligne si la quantité est 0 ou négative
        await this.remove(idLigne);
        return true;
      }

      await pool.execute(
        'UPDATE commande_produits SET quantite = ? WHERE id_ligne = ?',
        [quantite, idLigne]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la quantité: ${error.message}`);
    }
  }

  // Supprimer un produit d'une commande
  static async remove(idLigne) {
    try {
      await pool.execute(
        'DELETE FROM commande_produits WHERE id_ligne = ?',
        [idLigne]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du produit de la commande: ${error.message}`);
    }
  }

  // Vérifier si un produit existe déjà dans une commande
  static async exists(idCommande, idProduit) {
    try {
      const [rows] = await pool.execute(
        'SELECT id_ligne, quantite FROM commande_produits WHERE id_commande = ? AND id_produit = ?',
        [idCommande, idProduit]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la vérification du produit dans la commande: ${error.message}`);
    }
  }

  // Calculer le total d'une commande
  static async getTotal(idCommande) {
    try {
      const [rows] = await pool.execute(
        'SELECT SUM(prix_unitaire * quantite) as total FROM commande_produits WHERE id_commande = ?',
        [idCommande]
      );
      return rows[0].total || 0;
    } catch (error) {
      throw new Error(`Erreur lors du calcul du total de la commande: ${error.message}`);
    }
  }

  // Récupérer le panier d'une session (dernière commande en attente)
  static async getPanierBySession(idSession) {
    try {
      // Récupérer la dernière commande en attente de la session
      const [commandes] = await pool.execute(
        'SELECT id_commande FROM commandes WHERE id_session = ? AND statut_commande = "EN_ATTENTE" ORDER BY date_commande DESC LIMIT 1',
        [idSession]
      );

      if (commandes.length === 0) {
        return [];
      }

      const idCommande = commandes[0].id_commande;
      return await this.getByCommande(idCommande);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du panier: ${error.message}`);
    }
  }
}

module.exports = CommandeProduit;
