const { pool } = require('../config/database');
const Session = require('./Session');
const Commande = require('./Commande');
const Paiement = require('./Paiement');

class SessionManager {
  // Vérifier si une session peut être fermée automatiquement
  static async canCloseSession(idSession) {
    try {
      // Récupérer toutes les commandes de la session
      const commandes = await Commande.getBySession(idSession);
      
      if (commandes.length === 0) {
        return { canClose: true, reason: 'Aucune commande' };
      }

      // Vérifier le statut de toutes les commandes
      const commandesEnAttente = commandes.filter(c => c.statut_commande === 'EN_ATTENTE');
      const commandesEnvoyees = commandes.filter(c => c.statut_commande === 'ENVOYÉ');
      const commandesServies = commandes.filter(c => c.statut_commande === 'SERVI');
      const commandesAnnulees = commandes.filter(c => c.statut_commande === 'ANNULÉ');

      // Si toutes les commandes sont servies ou annulées
      if (commandesEnAttente.length === 0 && commandesEnvoyees.length === 0) {
        // Vérifier que tous les paiements sont effectués
        const paiements = await Paiement.getBySession(idSession);
        const paiementsEnCours = paiements.filter(p => p.statut_paiement === 'EN_COURS');
        
        if (paiementsEnCours.length === 0) {
          return { canClose: true, reason: 'Toutes les commandes servies et payées' };
        } else {
          return { canClose: false, reason: 'Paiements en cours' };
        }
      }

      return { canClose: false, reason: 'Commandes en cours' };
    } catch (error) {
      throw new Error(`Erreur lors de la vérification de fermeture: ${error.message}`);
    }
  }

  // Fermer automatiquement une session si possible
  static async autoCloseSession(idSession) {
    try {
      const canClose = await this.canCloseSession(idSession);
      
      if (canClose.canClose) {
        await Session.close(idSession);
        return { closed: true, reason: canClose.reason };
      }
      
      return { closed: false, reason: canClose.reason };
    } catch (error) {
      throw new Error(`Erreur lors de la fermeture automatique: ${error.message}`);
    }
  }

  // Fermer une session après paiement complet
  static async closeAfterPayment(idSession) {
    try {
      // Vérifier que tous les paiements sont effectués
      const paiements = await Paiement.getBySession(idSession);
      const paiementsEnCours = paiements.filter(p => p.statut_paiement === 'EN_COURS');
      
      if (paiementsEnCours.length === 0) {
        // Vérifier que toutes les commandes sont servies
        const commandes = await Commande.getBySession(idSession);
        const commandesNonServies = commandes.filter(c => 
          c.statut_commande !== 'SERVI' && c.statut_commande !== 'ANNULÉ'
        );
        
        if (commandesNonServies.length === 0) {
          await Session.close(idSession);
          return { closed: true, reason: 'Session fermée après paiement complet' };
        }
      }
      
      return { closed: false, reason: 'Paiements ou commandes en cours' };
    } catch (error) {
      throw new Error(`Erreur lors de la fermeture après paiement: ${error.message}`);
    }
  }

  // Nettoyer les sessions anciennes (plus de 24h)
  static async cleanupOldSessions() {
    try {
      const [result] = await pool.execute(
        `UPDATE sessions 
         SET statut_session = 'FERMÉE', date_fermeture = NOW() 
         WHERE statut_session = 'OUVERTE' 
         AND date_ouverture < DATE_SUB(NOW(), INTERVAL 24 HOUR)`
      );
      
      return { cleaned: result.affectedRows };
    } catch (error) {
      throw new Error(`Erreur lors du nettoyage: ${error.message}`);
    }
  }

  // Obtenir le statut détaillé d'une session
  static async getSessionStatus(idSession) {
    try {
      const session = await Session.getById(idSession);
      if (!session) {
        return null;
      }

      const commandes = await Commande.getBySession(idSession);
      const paiements = await Paiement.getBySession(idSession);
      
      const stats = {
        session: session,
        commandes: {
          total: commandes.length,
          enAttente: commandes.filter(c => c.statut_commande === 'EN_ATTENTE').length,
          envoyees: commandes.filter(c => c.statut_commande === 'ENVOYÉ').length,
          servies: commandes.filter(c => c.statut_commande === 'SERVI').length,
          annulees: commandes.filter(c => c.statut_commande === 'ANNULÉ').length
        },
        paiements: {
          total: paiements.length,
          enCours: paiements.filter(p => p.statut_paiement === 'EN_COURS').length,
          effectues: paiements.filter(p => p.statut_paiement === 'EFFECTUÉ').length
        }
      };

      // Déterminer si la session peut être fermée
      const canClose = await this.canCloseSession(idSession);
      stats.canClose = canClose;

      return stats;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du statut: ${error.message}`);
    }
  }
}

module.exports = SessionManager;
