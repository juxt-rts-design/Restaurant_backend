const { pool } = require('../config/database');

class Produit {
  // Créer un nouveau produit
  static async create(nomProduit, description, prixCfa, stockDisponible = 0, photoUrl = null, idCategorie = null) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO produits (nom_produit, description, photo_url, prix_cfa, stock_disponible, id_categorie) VALUES (?, ?, ?, ?, ?, ?)',
        [nomProduit, description, photoUrl, prixCfa, stockDisponible, idCategorie]
      );
      
      return {
        id: result.insertId,
        nomProduit,
        description,
        photoUrl,
        prixCfa,
        stockDisponible,
        idCategorie,
        actif: true
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création du produit: ${error.message}`);
    }
  }

  // Récupérer un produit par ID
  static async getById(idProduit) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM produits WHERE id_produit = ? AND actif = 1',
        [idProduit]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du produit: ${error.message}`);
    }
  }

  // Récupérer tous les produits actifs
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT p.*, c.nom_categorie, c.icone, c.couleur ' +
        'FROM produits p ' +
        'LEFT JOIN categories c ON p.id_categorie = c.id_categorie ' +
        'WHERE p.actif = 1 ORDER BY p.nom_produit'
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des produits: ${error.message}`);
    }
  }

  // Rechercher des produits par nom
  static async searchByName(nom) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM produits WHERE (nom_produit LIKE ? OR description LIKE ?) AND actif = 1 ORDER BY nom_produit',
        [`%${nom}%`, `%${nom}%`]
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de produits: ${error.message}`);
    }
  }

  // Mettre à jour un produit
  static async update(idProduit, data) {
    try {
      const fields = [];
      const values = [];
      
      if (data.nomProduit) {
        fields.push('nom_produit = ?');
        values.push(data.nomProduit);
      }
      if (data.description !== undefined) {
        fields.push('description = ?');
        values.push(data.description);
      }
      if (data.photoUrl !== undefined) {
        fields.push('photo_url = ?');
        values.push(data.photoUrl);
      }
      if (data.idCategorie !== undefined) {
        fields.push('id_categorie = ?');
        values.push(data.idCategorie);
      }
      if (data.prixCfa) {
        fields.push('prix_cfa = ?');
        values.push(data.prixCfa);
      }
      if (data.stockDisponible !== undefined) {
        fields.push('stock_disponible = ?');
        values.push(data.stockDisponible);
      }
      if (data.actif !== undefined) {
        fields.push('actif = ?');
        values.push(data.actif ? 1 : 0);
      }
      
      if (fields.length === 0) {
        throw new Error('Aucune donnée à mettre à jour');
      }
      
      values.push(idProduit);
      
      await pool.execute(
        `UPDATE produits SET ${fields.join(', ')} WHERE id_produit = ?`,
        values
      );
      
      return await this.getById(idProduit);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du produit: ${error.message}`);
    }
  }

  // Supprimer un produit (désactiver)
  static async delete(idProduit) {
    try {
      await pool.execute(
        'UPDATE produits SET actif = 0 WHERE id_produit = ?',
        [idProduit]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du produit: ${error.message}`);
    }
  }

  // Mettre à jour le stock
  static async updateStock(idProduit, quantite) {
    try {
      await pool.execute(
        'UPDATE produits SET stock_disponible = stock_disponible - ? WHERE id_produit = ?',
        [quantite, idProduit]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du stock: ${error.message}`);
    }
  }

  // Vérifier la disponibilité du stock
  static async checkStock(idProduit, quantiteDemandee) {
    try {
      const [rows] = await pool.execute(
        'SELECT stock_disponible FROM produits WHERE id_produit = ? AND actif = 1',
        [idProduit]
      );
      
      if (rows.length === 0) {
        return { disponible: false, message: 'Produit non trouvé' };
      }
      
      const stockDisponible = rows[0].stock_disponible;
      const disponible = stockDisponible >= quantiteDemandee;
      
      return {
        disponible,
        stockDisponible,
        quantiteDemandee,
        message: disponible ? 'Stock disponible' : 'Stock insuffisant'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la vérification du stock: ${error.message}`);
    }
  }
}

module.exports = Produit;
