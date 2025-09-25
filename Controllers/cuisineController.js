const { pool } = require('../config/database');

class CuisineController {
  // Obtenir toutes les commandes pour la cuisine
  static async getCommandes(req, res) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          c.id_commande,
          c.id_session,
          c.statut_commande,
          c.date_commande,
          s.id_table,
          s.id_client,
          cl.nom_complet,
          t.nom_table,
          cp.id_ligne,
          cp.id_produit,
          p.nom_produit,
          cp.quantite,
          cp.prix_unitaire,
          cp.statut_preparation
        FROM commandes c
        JOIN sessions s ON c.id_session = s.id_session
        JOIN clients cl ON s.id_client = cl.id_client
        JOIN tables t ON s.id_table = t.id_table
        JOIN commande_produits cp ON c.id_commande = cp.id_commande
        JOIN produits p ON cp.id_produit = p.id_produit
        WHERE c.statut_commande IN ('EN_ATTENTE', 'ENVOYÉ', 'EN_PREPARATION')
        ORDER BY c.date_commande DESC, c.id_commande, cp.id_ligne
      `);

      // Grouper les produits par commande
      const commandesMap = new Map();
      
      rows.forEach(row => {
        const commandeId = row.id_commande;
        
        if (!commandesMap.has(commandeId)) {
          commandesMap.set(commandeId, {
            id_commande: row.id_commande,
            id_session: row.id_session,
            statut_commande: row.statut_commande,
            date_commande: row.date_commande,
            nom_complet: row.nom_complet,
            nom_table: row.nom_table,
            produits: []
          });
        }
        
        commandesMap.get(commandeId).produits.push({
          id_ligne: row.id_ligne,
          id_produit: row.id_produit,
          nom_produit: row.nom_produit,
          quantite: row.quantite,
          prix_unitaire: row.prix_unitaire,
          statut_preparation: row.statut_preparation
        });
      });

      const commandes = Array.from(commandesMap.values());

      res.json({
        success: true,
        data: commandes
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes cuisine:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour le statut d'un produit
  static async updateProduitStatut(req, res) {
    try {
      const { idLigne } = req.params;
      const { statut } = req.body;

      // Vérifier que le statut est valide
      if (!['EN_ATTENTE', 'EN_PREPARATION', 'PRET'].includes(statut)) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide'
        });
      }

      // Mettre à jour le statut
      const [result] = await pool.execute(
        'UPDATE commande_produits SET statut_preparation = ? WHERE id_ligne = ?',
        [statut, idLigne]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
      }

      // Vérifier si tous les produits de la commande sont prêts
      const [produits] = await pool.execute(
        'SELECT statut_preparation FROM commande_produits WHERE id_commande = (SELECT id_commande FROM commande_produits WHERE id_ligne = ?)',
        [idLigne]
      );

      const tousPrets = produits.every(p => p.statut_preparation === 'PRET');
      
      if (tousPrets) {
        // Mettre à jour le statut de la commande
        await pool.execute(
          'UPDATE commandes SET statut_commande = "PRET" WHERE id_commande = (SELECT id_commande FROM commande_produits WHERE id_ligne = ?)',
          [idLigne]
        );
      }

      res.json({
        success: true,
        message: 'Statut mis à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les statistiques de la cuisine
  static async getStats(req, res) {
    try {
      const [stats] = await pool.execute(`
        SELECT 
          COUNT(DISTINCT c.id_commande) as total_commandes,
          COUNT(CASE WHEN cp.statut_preparation = 'EN_ATTENTE' THEN 1 END) as produits_en_attente,
          COUNT(CASE WHEN cp.statut_preparation = 'EN_PREPARATION' THEN 1 END) as produits_en_preparation,
          COUNT(CASE WHEN cp.statut_preparation = 'PRET' THEN 1 END) as produits_pretes,
          COUNT(CASE WHEN c.statut_commande = 'PRET' THEN 1 END) as commandes_pretes
        FROM commandes c
        LEFT JOIN commande_produits cp ON c.id_commande = cp.id_commande
        WHERE c.statut_commande IN ('EN_ATTENTE', 'ENVOYÉ', 'EN_PREPARATION', 'PRET')
      `);

      res.json({
        success: true,
        data: stats[0]
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques cuisine:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}

module.exports = CuisineController;
