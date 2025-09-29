const { pool } = require('../config/database');

class Categorie {
  // Récupérer toutes les catégories actives
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM categories WHERE actif = 1 ORDER BY nom_categorie'
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des catégories: ${error.message}`);
    }
  }

  // Récupérer une catégorie par ID
  static async getById(idCategorie) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM categories WHERE id_categorie = ? AND actif = 1',
        [idCategorie]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la catégorie: ${error.message}`);
    }
  }

  // Créer une nouvelle catégorie
  static async create(nomCategorie, description = null, icone = null, couleur = '#3B82F6') {
    try {
      const [result] = await pool.execute(
        'INSERT INTO categories (nom_categorie, description, icone, couleur) VALUES (?, ?, ?, ?)',
        [nomCategorie, description, icone, couleur]
      );
      
      return {
        id_categorie: result.insertId,
        nom_categorie: nomCategorie,
        description,
        icone,
        couleur,
        actif: true
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création de la catégorie: ${error.message}`);
    }
  }

  // Mettre à jour une catégorie
  static async update(idCategorie, data) {
    try {
      const fields = [];
      const values = [];
      
      if (data.nomCategorie) {
        fields.push('nom_categorie = ?');
        values.push(data.nomCategorie);
      }
      if (data.description !== undefined) {
        fields.push('description = ?');
        values.push(data.description);
      }
      if (data.icone !== undefined) {
        fields.push('icone = ?');
        values.push(data.icone);
      }
      if (data.couleur !== undefined) {
        fields.push('couleur = ?');
        values.push(data.couleur);
      }
      if (data.actif !== undefined) {
        fields.push('actif = ?');
        values.push(data.actif ? 1 : 0);
      }
      
      if (fields.length === 0) {
        throw new Error('Aucune donnée à mettre à jour');
      }
      
      values.push(idCategorie);
      
      await pool.execute(
        `UPDATE categories SET ${fields.join(', ')} WHERE id_categorie = ?`,
        values
      );
      
      return await this.getById(idCategorie);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la catégorie: ${error.message}`);
    }
  }

  // Supprimer une catégorie (soft delete)
  static async delete(idCategorie) {
    try {
      await pool.execute(
        'UPDATE categories SET actif = 0 WHERE id_categorie = ?',
        [idCategorie]
      );
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la catégorie: ${error.message}`);
    }
  }
}

module.exports = Categorie;

