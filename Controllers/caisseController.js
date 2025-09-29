const Commande = require('../models/Commande');
const Paiement = require('../models/Paiement');
const Session = require('../models/Session');
const Client = require('../models/Client');
const Table = require('../models/Table');
const SessionManager = require('../models/SessionManager');
const FactureArchivee = require('../models/FactureArchivee');

class CaisseController {
  // Récupérer toutes les commandes en attente
  static async getPendingOrders(req, res) {
    try {
      const commandes = await Commande.getPending();
      
      // Enrichir avec les détails des commandes
      const commandesAvecDetails = await Promise.all(
        commandes.map(async (commande) => {
          const details = await Commande.getDetails(commande.id_commande);
          return details;
        })
      );

      res.json({
        success: true,
        data: commandesAvecDetails
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Récupérer les détails d'une commande
  static async getOrderDetails(req, res) {
    try {
      const { idCommande } = req.params;
      
      const details = await Commande.getDetails(idCommande);
      if (!details) {
        return res.status(404).json({
          success: false,
          message: 'Commande non trouvée'
        });
      }

      res.json({
        success: true,
        data: details
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Marquer une commande comme servie
  static async markOrderAsServed(req, res) {
    try {
      const { idCommande } = req.params;
      
      // Vérifier que la commande existe
      const commande = await Commande.getById(idCommande);
      if (!commande) {
        return res.status(404).json({
          success: false,
          message: 'Commande non trouvée'
        });
      }

      // Mettre à jour le statut
      await Commande.updateStatus(idCommande, 'SERVI');

      res.json({
        success: true,
        message: 'Commande marquée comme servie'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Annuler une commande
  static async cancelOrder(req, res) {
    try {
      const { idCommande } = req.params;
      
      // Vérifier que la commande existe
      const commande = await Commande.getById(idCommande);
      if (!commande) {
        return res.status(404).json({
          success: false,
          message: 'Commande non trouvée'
        });
      }

      // Annuler la commande
      await Commande.cancel(idCommande);

      res.json({
        success: true,
        message: 'Commande annulée'
      });
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Récupérer les paiements en cours
  static async getPendingPayments(req, res) {
    try {
      const paiements = await Paiement.getPending();

      res.json({
        success: true,
        data: paiements
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Valider un paiement par code
  static async validatePaymentByCode(req, res) {
    try {
      const { codeValidation } = req.body;
      
      const paiement = await Paiement.validateByCode(codeValidation);

      res.json({
        success: true,
        message: 'Paiement validé avec succès',
        data: {
          paiement: {
            id: paiement.id_paiement,
            montantTotal: paiement.montant_total,
            methodePaiement: paiement.methode_paiement,
            statutPaiement: 'EFFECTUÉ',
            client: paiement.nom_complet,
            table: paiement.nom_table
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la validation du paiement:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Valider un paiement par ID
  static async validatePayment(req, res) {
    try {
      const { idPaiement } = req.params;
      
      // Vérifier que le paiement existe
      const paiement = await Paiement.getById(idPaiement);
      if (!paiement) {
        return res.status(404).json({
          success: false,
          message: 'Paiement non trouvé'
        });
      }

      if (paiement.statut_paiement === 'EFFECTUÉ') {
        return res.status(400).json({
          success: false,
          message: 'Paiement déjà effectué'
        });
      }

      // Valider le paiement
      await Paiement.validate(idPaiement);

      // Générer automatiquement une facture après validation
      let factureGeneree = null;
      try {
        factureGeneree = await this._generateInvoiceInternal(paiement.id_commande);
        if (factureGeneree) {
          console.log(`✅ Facture générée automatiquement: ${factureGeneree.numeroFacture}`);
        }
      } catch (error) {
        console.log('⚠️ Erreur lors de la génération automatique de facture:', error.message);
      }

      // Récupérer la session du paiement pour vérifier la fermeture automatique
      const commande = await Commande.getById(paiement.id_commande);
      const sessionStatus = await SessionManager.getSessionStatus(commande.id_session);
      let sessionClosed = false;
      
      if (sessionStatus.canClose.canClose) {
        const closeResult = await SessionManager.autoCloseSession(commande.id_session);
        sessionClosed = closeResult.closed;
      }

      res.json({
        success: true,
        message: 'Paiement effectué avec succès - Facture générée',
        data: {
          sessionClosed: sessionClosed,
          sessionStatus: sessionStatus,
          factureGeneree: factureGeneree
        }
      });
    } catch (error) {
      console.error('Erreur lors de la validation du paiement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Archiver un paiement validé
  static async archivePayment(req, res) {
    try {
      const { idPaiement } = req.params;
      
      // Vérifier que le paiement existe
      const paiement = await Paiement.getById(idPaiement);
      if (!paiement) {
        return res.status(404).json({
          success: false,
          message: 'Paiement non trouvé'
        });
      }

      if (paiement.statut_paiement !== 'EFFECTUÉ') {
        return res.status(400).json({
          success: false,
          message: 'Seuls les paiements effectués peuvent être archivés'
        });
      }

      // Archiver le paiement
      await Paiement.archive(idPaiement);

      res.json({
        success: true,
        message: 'Paiement archivé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de l\'archivage du paiement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Récupérer l'historique des paiements
  static async getPaymentHistory(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;
      
      const paiements = await Paiement.getAll(parseInt(limit), parseInt(offset));

      res.json({
        success: true,
        data: paiements
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Récupérer les statistiques de la journée
  static async getDailyStats(req, res) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const stats = await Paiement.getStats(today, today);

      // Calculer les totaux
      const totalVentes = stats.reduce((sum, stat) => sum + parseInt(stat.montant_effectue || 0), 0);
      const totalPaiements = stats.reduce((sum, stat) => sum + parseInt(stat.paiements_effectues || 0), 0);

      res.json({
        success: true,
        data: {
          date: today,
          totalVentes,
          totalPaiements,
          details: stats
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Récupérer les sessions actives
  static async getActiveSessions(req, res) {
    try {
      const sessions = await Session.getOpenSessions();

      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Fermer une session
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

  // Rechercher une commande ou un paiement
  static async search(req, res) {
    try {
      const { q, type } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Terme de recherche requis'
        });
      }

      let results = [];

      if (!type || type === 'commande') {
        // Rechercher dans les commandes
        const commandes = await Commande.getAll(100, 0);
        const commandesFiltrees = commandes.filter(c => 
          c.nom_complet.toLowerCase().includes(q.toLowerCase()) ||
          c.nom_table.toLowerCase().includes(q.toLowerCase()) ||
          c.id_commande.toString().includes(q)
        );
        
        results = results.concat(commandesFiltrees.map(c => ({
          type: 'commande',
          id: c.id_commande,
          client: c.nom_complet,
          table: c.nom_table,
          statut: c.statut_commande,
          date: c.date_commande
        })));
      }

      if (!type || type === 'paiement') {
        // Rechercher dans les paiements
        const paiements = await Paiement.getAll(100, 0);
        const paiementsFiltres = paiements.filter(p => 
          p.nom_complet.toLowerCase().includes(q.toLowerCase()) ||
          p.nom_table.toLowerCase().includes(q.toLowerCase()) ||
          p.code_validation.toLowerCase().includes(q.toLowerCase()) ||
          p.id_paiement.toString().includes(q)
        );
        
        results = results.concat(paiementsFiltres.map(p => ({
          type: 'paiement',
          id: p.id_paiement,
          client: p.nom_complet,
          table: p.nom_table,
          montant: p.montant_total,
          statut: p.statut_paiement,
          code: p.code_validation,
          date: p.date_paiement
        })));
      }

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Fermer une session
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

      // Vérifier que la session est ouverte
      if (session.statut_session !== 'OUVERTE') {
        return res.status(400).json({
          success: false,
          message: 'La session est déjà fermée'
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

  // Générer une facture pour une commande
  static async generateInvoice(req, res) {
    try {
      const { idCommande } = req.params;
      
      // Récupérer les détails de la commande
      const commande = await Commande.getDetails(idCommande);
      if (!commande) {
        return res.status(404).json({
          success: false,
          message: 'Commande non trouvée'
        });
      }

      // Récupérer les informations de paiement si elles existent
      let paiement = null;
      try {
        const paiements = await Paiement.getByCommande(idCommande);
        paiement = paiements.length > 0 ? paiements[0] : null;
        if (!paiement) {
          console.log(`⚠️  Aucun paiement trouvé pour la commande ${idCommande} - Facture générée sans paiement`);
        }
      } catch (error) {
        console.log(`⚠️  Erreur lors de la récupération du paiement pour la commande ${idCommande}:`, error.message);
      }

      // Générer un numéro de facture unique
      const numeroFacture = `FACT-${Date.now()}-${idCommande}`;
      
      // Calculer les totaux
      const sousTotal = commande.total;
      const tva = 0; // Pas de TVA pour l'instant
      const totalTTC = sousTotal + tva;

      // Créer l'objet facture
      const facture = {
        numeroFacture,
        dateFacture: new Date().toISOString(),
        commande: {
          id: commande.id_commande,
          date: commande.date_commande,
          statut: commande.statut_commande
        },
        client: {
          nom: commande.nom_complet,
          table: commande.nom_table
        },
        produits: commande.produits.map(produit => ({
          nom: produit.nom_produit,
          quantite: produit.quantite,
          prixUnitaire: produit.prix_unitaire,
          prixTotal: produit.prix_unitaire * produit.quantite
        })),
        totaux: {
          sousTotal,
          tva,
          totalTTC
        },
        paiement: paiement ? {
          methode: paiement.methode_paiement,
          statut: paiement.statut_paiement,
          codeValidation: paiement.code_validation,
          datePaiement: paiement.date_paiement
        } : {
          methode: 'NON_PAYÉ',
          statut: 'EN_ATTENTE',
          codeValidation: null,
          datePaiement: null
        },
        restaurant: {
          nom: "RUNGWE",
          adresse: "Libreville, Gabon",
          telephone: "+241 76 23 49 42",
          email: "renaryella2003@gmail.com"
        }
      };

      // Archiver la facture automatiquement
      try {
        await FactureArchivee.archiver(facture);
        console.log(`Facture ${numeroFacture} archivée avec succès`);
      } catch (archiveError) {
        console.error('Erreur lors de l\'archivage de la facture:', archiveError);
        // On continue même si l'archivage échoue
      }

      res.json({
        success: true,
        data: facture,
        message: paiement ? 
          'Facture générée et archivée avec succès' : 
          'Facture générée et archivée avec succès (sans paiement)'
      });
    } catch (error) {
      console.error('Erreur lors de la génération de la facture:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Rechercher des factures archivées
  static async rechercherFactures(req, res) {
    try {
      const filtres = req.query;
      
      // Conversion des paramètres
      const filtresFormates = {
        dateDebut: filtres.dateDebut,
        dateFin: filtres.dateFin,
        nomClient: filtres.nomClient,
        nomTable: filtres.nomTable,
        montantMin: filtres.montantMin ? parseFloat(filtres.montantMin) : null,
        montantMax: filtres.montantMax ? parseFloat(filtres.montantMax) : null,
        methodePaiement: filtres.methodePaiement,
        numeroFacture: filtres.numeroFacture,
        limit: filtres.limit ? parseInt(filtres.limit) : 50,
        offset: filtres.offset ? parseInt(filtres.offset) : 0
      };

      const factures = await FactureArchivee.rechercher(filtresFormates);

      res.json({
        success: true,
        data: factures,
        message: `${factures.length} facture(s) trouvée(s)`
      });
    } catch (error) {
      console.error('Erreur lors de la recherche de factures:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Récupérer une facture archivée par numéro
  static async getFactureArchivee(req, res) {
    try {
      const { numeroFacture } = req.params;
      
      const facture = await FactureArchivee.getByNumero(numeroFacture);
      if (!facture) {
        return res.status(404).json({
          success: false,
          message: 'Facture non trouvée'
        });
      }

      res.json({
        success: true,
        data: facture,
        message: 'Facture récupérée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la facture:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les statistiques des factures
  static async getStatistiquesFactures(req, res) {
    try {
      const { dateDebut, dateFin } = req.query;
      
      if (!dateDebut || !dateFin) {
        return res.status(400).json({
          success: false,
          message: 'Les paramètres dateDebut et dateFin sont requis'
        });
      }

      const [statistiques, totalVentes] = await Promise.all([
        FactureArchivee.getStatistiques(dateDebut, dateFin),
        FactureArchivee.getTotalVentes(dateDebut, dateFin)
      ]);

      res.json({
        success: true,
        data: {
          statistiques,
          totalVentes,
          periode: { dateDebut, dateFin }
        },
        message: 'Statistiques récupérées avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Méthode interne pour générer une facture (utilisée par validatePayment)
  static async _generateInvoiceInternal(idCommande) {
    try {
      // Récupérer les détails de la commande
      const commande = await Commande.getDetails(idCommande);
      if (!commande) {
        throw new Error('Commande non trouvée');
      }

      // Récupérer les informations de paiement
      let paiement = null;
      try {
        const paiements = await Paiement.getByCommande(idCommande);
        paiement = paiements.length > 0 ? paiements[0] : null;
      } catch (error) {
        console.log('Aucun paiement trouvé pour cette commande');
      }

      // Générer un numéro de facture unique
      const numeroFacture = `FACT-${Date.now()}-${idCommande}`;
      
      // Calculer les totaux
      const sousTotal = commande.total;
      const tva = 0;
      const totalTTC = sousTotal + tva;

      // Créer l'objet facture
      const facture = {
        numeroFacture,
        dateFacture: new Date().toISOString(),
        commande: {
          id: commande.id_commande,
          date: commande.date_commande,
          statut: commande.statut_commande
        },
        client: {
          nom: commande.nom_complet,
          table: commande.nom_table
        },
        produits: commande.produits.map(produit => ({
          nom: produit.nom_produit,
          quantite: produit.quantite,
          prixUnitaire: produit.prix_unitaire,
          prixTotal: produit.prix_unitaire * produit.quantite
        })),
        totaux: {
          sousTotal,
          tva,
          totalTTC
        },
        paiement: paiement ? {
          methode: paiement.methode_paiement,
          statut: paiement.statut_paiement,
          codeValidation: paiement.code_validation,
          datePaiement: paiement.date_paiement
        } : {
          methode: 'NON_PAYÉ',
          statut: 'EN_ATTENTE',
          codeValidation: null,
          datePaiement: null
        },
        restaurant: {
          nom: "RUNGWE",
          adresse: "Libreville, Gabon",
          telephone: "+241 76 23 49 42",
          email: "renaryella2003@gmail.com"
        }
      };

      // Archiver la facture automatiquement
      try {
        await FactureArchivee.archiver(facture);
        console.log(`Facture ${numeroFacture} archivée avec succès`);
      } catch (archiveError) {
        console.error('Erreur lors de l\'archivage de la facture:', archiveError);
      }

      return facture;
    } catch (error) {
      throw new Error(`Erreur lors de la génération de la facture: ${error.message}`);
    }
  }
}

module.exports = CaisseController;
