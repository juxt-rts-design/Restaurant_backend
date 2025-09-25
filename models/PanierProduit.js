const { pool } = require('../config/database');

class PanierProduit {
  // Ajouter un produit au panier
  static async add(idPanier, idProduit, quantite, prixUnitaire) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO panier_produits (id_panier, id_produit, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
        [idPanier, idProduit, quantite, prixUnitaire]
      );
      
      return {
        id: result.insertId,
        idPanier,
        idProduit,
        quantite,
        prixUnitaire
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'ajout au panier: ${error.message}`);
    }
  }

  // Récupérer tous les produits d'un panier
  static async getByPanier(idPanier) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
          pp.*,
          p.nom_produit,
          p.description,
          p.stock_disponible,
          p.actif
        FROM panier_produits pp
        JOIN produits p ON pp.id_produit = p.id_produit
        WHERE pp.id_panier = ?
        ORDER BY pp.date_ajout ASC`,
        [idPanier]
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du panier: ${error.message}`);
    }
  }

  // Mettre à jour la quantité d'un produit dans le panier
  static async updateQuantity(idLigne, nouvelleQuantite) {
    try {
      if (nouvelleQuantite <= 0) {
        await this.remove(idLigne);
        return;
      }

      await pool.execute(
        'UPDATE panier_produits SET quantite = ? WHERE id_ligne = ?',
        [nouvelleQuantite, idLigne]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la quantité: ${error.message}`);
    }
  }

  // Supprimer un produit du panier
  static async remove(idLigne) {
    try {
      await pool.execute(
        'DELETE FROM panier_produits WHERE id_ligne = ?',
        [idLigne]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du produit: ${error.message}`);
    }
  }

  // Vérifier si un produit existe déjà dans le panier
  static async exists(idPanier, idProduit) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM panier_produits WHERE id_panier = ? AND id_produit = ?',
        [idPanier, idProduit]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la vérification du produit: ${error.message}`);
    }
  }

  // Calculer le total d'un panier
  static async getTotal(idPanier) {
    try {
      const [rows] = await pool.execute(
        'SELECT SUM(quantite * prix_unitaire) as total FROM panier_produits WHERE id_panier = ?',
        [idPanier]
      );
      return rows[0].total || 0;
    } catch (error) {
      throw new Error(`Erreur lors du calcul du total: ${error.message}`);
    }
  }

  // Vider un panier
  static async clear(idPanier) {
    try {
      await pool.execute(
        'DELETE FROM panier_produits WHERE id_panier = ?',
        [idPanier]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors du vidage du panier: ${error.message}`);
    }
  }
}

module.exports = PanierProduit;
