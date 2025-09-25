const SessionManager = require('../models/SessionManager');
const Session = require('../models/Session');

class SessionController {
  // Obtenir le statut détaillé d'une session
  static async getSessionStatus(req, res) {
    try {
      const { idSession } = req.params;
      
      // Vérifier que la session existe
      const session = await Session.getById(idSession);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session non trouvée'
        });
      }

      // Obtenir le statut détaillé
      const status = await SessionManager.getSessionStatus(idSession);

      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Fermer une session manuellement
  static async closeSession(req, res) {
    try {
      const { idSession } = req.params;
      
      // Vérifier que la session existe
      const session = await Session.getById(idSession);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session non trouvée'
        });
      }

      if (session.statut_session === 'FERMÉE') {
        return res.status(400).json({
          success: false,
          message: 'Session déjà fermée'
        });
      }

      // Fermer la session
      await Session.close(idSession);

      res.json({
        success: true,
        message: 'Session fermée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la fermeture de la session:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Nettoyer les sessions anciennes
  static async cleanupOldSessions(req, res) {
    try {
      const result = await SessionManager.cleanupOldSessions();
      
      res.json({
        success: true,
        message: `${result.cleaned} sessions anciennes nettoyées`,
        data: result
      });
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}

module.exports = SessionController;
