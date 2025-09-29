const { pool } = require('../config/database');

class FactureArchivee {
  // Archiver une facture
  static async archiver(factureData) {
    try {
      const {
        numeroFacture,
        commande,
        client,
        produits,
        totaux,
        paiement,
        restaurant
      } = factureData;

      const [result] = await pool.execute(
        `INSERT INTO factures_archivees (
          numero_facture, id_commande, id_session, id_client, nom_client, nom_table,
          date_facture, date_commande, montant_total, methode_paiement, statut_paiement,
          code_validation, date_paiement, produits_json, totaux_json, restaurant_info
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          numeroFacture,
          commande.id,
          commande.id_session || null,
          commande.id_client || null,
          client.nom,
          client.table,
          factureData.dateFacture,
          commande.date,
          totaux.totalTTC,
          paiement ? paiement.methode : null,
          paiement ? paiement.statut : null,
          paiement ? paiement.codeValidation : null,
          paiement ? paiement.datePaiement : null,
          JSON.stringify(produits),
          JSON.stringify(totaux),
          JSON.stringify(restaurant)
        ]
      );

      return {
        id_facture: result.insertId,
        numero_facture: numeroFacture
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'archivage de la facture: ${error.message}`);
    }
  }

  // Récupérer une facture par numéro
  static async getByNumero(numeroFacture) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM factures_archivees WHERE numero_facture = ?',
        [numeroFacture]
      );
      
      if (rows.length === 0) return null;
      
      const facture = rows[0];
      return {
        ...facture,
        produits: JSON.parse(facture.produits_json),
        totaux: JSON.parse(facture.totaux_json),
        restaurant: JSON.parse(facture.restaurant_info)
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la facture: ${error.message}`);
    }
  }

  // Rechercher des factures avec filtres
  static async rechercher(filtres = {}) {
    try {
      let query = 'SELECT * FROM factures_archivees WHERE 1=1';
      const params = [];

      // Filtre par date de début
      if (filtres.dateDebut) {
        query += ' AND DATE(date_facture) >= ?';
        params.push(filtres.dateDebut);
      }

      // Filtre par date de fin
      if (filtres.dateFin) {
        query += ' AND DATE(date_facture) <= ?';
        params.push(filtres.dateFin);
      }

      // Filtre par nom de client
      if (filtres.nomClient) {
        query += ' AND nom_client LIKE ?';
        params.push(`%${filtres.nomClient}%`);
      }

      // Filtre par table
      if (filtres.nomTable) {
        query += ' AND nom_table LIKE ?';
        params.push(`%${filtres.nomTable}%`);
      }

      // Filtre par montant minimum
      if (filtres.montantMin) {
        query += ' AND montant_total >= ?';
        params.push(filtres.montantMin);
      }

      // Filtre par montant maximum
      if (filtres.montantMax) {
        query += ' AND montant_total <= ?';
        params.push(filtres.montantMax);
      }

      // Filtre par méthode de paiement
      if (filtres.methodePaiement) {
        query += ' AND methode_paiement = ?';
        params.push(filtres.methodePaiement);
      }

      // Filtre par numéro de facture
      if (filtres.numeroFacture) {
        query += ' AND numero_facture LIKE ?';
        params.push(`%${filtres.numeroFacture}%`);
      }

      // Tri et pagination
      query += ' ORDER BY date_facture DESC';
      
      if (filtres.limit) {
        query += ' LIMIT ?';
        params.push(filtres.limit);
        
        if (filtres.offset) {
          query += ' OFFSET ?';
          params.push(filtres.offset);
        }
      }

      const [rows] = await pool.execute(query, params);
      
      return rows.map(facture => ({
        ...facture,
        produits: JSON.parse(facture.produits_json),
        totaux: JSON.parse(facture.totaux_json),
        restaurant: JSON.parse(facture.restaurant_info)
      }));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de factures: ${error.message}`);
    }
  }

  // Obtenir les statistiques des factures
  static async getStatistiques(dateDebut, dateFin) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
          DATE(date_facture) as date_jour,
          COUNT(*) as nombre_factures,
          SUM(montant_total) as montant_total_jour,
          SUM(CASE WHEN methode_paiement = 'A_LA_CAISSE' THEN 1 ELSE 0 END) as paiements_caisse,
          SUM(CASE WHEN methode_paiement = 'MOBILE_MONEY' THEN 1 ELSE 0 END) as paiements_mobile_money
        FROM factures_archivees 
        WHERE DATE(date_facture) BETWEEN ? AND ?
        GROUP BY DATE(date_facture)
        ORDER BY date_jour DESC`,
        [dateDebut, dateFin]
      );

      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
    }
  }

  // Obtenir le total des ventes par période
  static async getTotalVentes(dateDebut, dateFin) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
          COUNT(*) as total_factures,
          SUM(montant_total) as total_montant,
          AVG(montant_total) as moyenne_montant,
          MIN(montant_total) as montant_min,
          MAX(montant_total) as montant_max
        FROM factures_archivees 
        WHERE DATE(date_facture) BETWEEN ? AND ?`,
        [dateDebut, dateFin]
      );

      return rows[0];
    } catch (error) {
      throw new Error(`Erreur lors du calcul des totaux: ${error.message}`);
    }
  }

  // Supprimer une facture archivée (pour les cas exceptionnels)
  static async supprimer(numeroFacture) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM factures_archivees WHERE numero_facture = ?',
        [numeroFacture]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la facture: ${error.message}`);
    }
  }
}

module.exports = FactureArchivee;
