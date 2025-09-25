const Client = require('../models/Client');
const Table = require('../models/Table');
const Session = require('../models/Session');
const Produit = require('../models/Produit');
const Commande = require('../models/Commande');
const CommandeProduit = require('../models/CommandeProduit');
const Paiement = require('../models/Paiement');
const SessionManager = require('../models/SessionManager');

class ClientController {
  // Scanner un QR code et accéder au menu
  static async scanQrCode(req, res) {
    try {
      const { qrCode } = req.params;
      
      // Vérifier si la table existe et est active
      const table = await Table.getByQrCode(qrCode);
      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Table non trouvée ou inactive'
        });
      }

      // Vérifier s'il y a déjà une session active
      const activeSession = await Session.getActiveByTable(table.id_table);
      
      if (activeSession) {
        return res.json({
          success: true,
          message: 'Session déjà active sur cette table',
          data: {
            table: {
              id: table.id_table,
              nom: table.nom_table,
              capacite: table.capacite
            },
            session: {
              id: activeSession.id_session,
              client: activeSession.nom_complet,
              dateOuverture: activeSession.date_ouverture
            }
          }
        });
      }

      // Récupérer le menu
      const menu = await Produit.getAll();

      res.json({
        success: true,
        message: 'QR code scanné avec succès',
        data: {
          table: {
            id: table.id_table,
            nom: table.nom_table,
            capacite: table.capacite
          },
          menu
        }
      });
    } catch (error) {
      console.error('Erreur lors du scan du QR code:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Créer une session client
  static async createSession(req, res) {
    try {
      const { qrCode } = req.params;
      const { nomComplet } = req.body;

      // Vérifier si la table existe
      const table = await Table.getByQrCode(qrCode);
      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Table non trouvée'
        });
      }

      // Vérifier s'il y a déjà une session active
      const hasActiveSession = await Session.hasActiveSession(table.id_table);
      if (hasActiveSession) {
        return res.status(400).json({
          success: false,
          message: 'Une session est déjà active sur cette table'
        });
      }

      // Créer le client
      const client = await Client.create(nomComplet);

      // Créer la session
      const session = await Session.create(table.id_table, client.id);

      res.status(201).json({
        success: true,
        message: 'Session créée avec succès',
        data: {
          session: {
            id: session.id,
            client: client.nomComplet,
            table: table.nom_table,
            dateOuverture: session.dateOuverture
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Récupérer le menu
  static async getMenu(req, res) {
    try {
      const { q } = req.query;
      
      let menu;
      if (q) {
        menu = await Produit.searchByName(q);
      } else {
        menu = await Produit.getAll();
      }

      res.json({
        success: true,
        data: menu
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du menu:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Ajouter un produit au panier
  static async addToCart(req, res) {
    try {
      const { idSession } = req.params;
      const { idProduit, quantite } = req.body;
      
      console.log('Ajout au panier - Session:', idSession, 'Produit:', idProduit, 'Quantité:', quantite);

      // Vérifier que la session existe
      console.log('Vérification de la session:', idSession);
      const session = await Session.getById(idSession);
      console.log('Session trouvée:', session);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session non trouvée'
        });
      }

      // Vérifier que le produit existe et est disponible
      const produit = await Produit.getById(idProduit);
      if (!produit) {
        return res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
      }

      // Vérifier le stock
      const stockCheck = await Produit.checkStock(idProduit, quantite);
      if (!stockCheck.disponible) {
        return res.status(400).json({
          success: false,
          message: stockCheck.message
        });
      }

      // Récupérer ou créer une commande en attente
      let commandes = await Commande.getBySession(idSession);
      let commande = commandes.find(c => c.statut_commande === 'EN_ATTENTE');

      if (!commande) {
        console.log('Création d\'une nouvelle commande pour la session:', idSession);
        commande = await Commande.create(idSession);
        console.log('Commande créée:', commande);
      } else {
        console.log('Commande existante trouvée:', commande);
      }

      // Vérifier si le produit est déjà dans la commande
      console.log('Vérification du produit dans la commande:', commande.id_commande, idProduit);
      const existingItem = await CommandeProduit.exists(commande.id_commande, idProduit);
      
      if (existingItem) {
        // Mettre à jour la quantité
        const newQuantite = existingItem.quantite + quantite;
        await CommandeProduit.updateQuantity(existingItem.id_ligne, newQuantite);
      } else {
        // Ajouter le produit
        await CommandeProduit.add(commande.id_commande, idProduit, quantite, produit.prix_cfa);
      }

      // Récupérer le panier mis à jour
      const panier = await CommandeProduit.getPanierBySession(idSession);
      const total = await CommandeProduit.getTotal(commande.id_commande);

      res.json({
        success: true,
        message: 'Produit ajouté au panier',
        data: {
          panier,
          total
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Récupérer le panier
  static async getCart(req, res) {
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

      const panier = await CommandeProduit.getPanierBySession(idSession);
      const commandes = await Commande.getBySession(idSession);
      const commande = commandes.find(c => c.statut_commande === 'EN_ATTENTE');
      
      let total = 0;
      if (commande) {
        total = await CommandeProduit.getTotal(commande.id_commande);
      }

      res.json({
        success: true,
        data: {
          panier,
          total
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour la quantité d'un produit
  static async updateQuantity(req, res) {
    try {
      const { idLigne } = req.params;
      const { quantite } = req.body;

      if (quantite < 0) {
        return res.status(400).json({
          success: false,
          message: 'La quantité ne peut pas être négative'
        });
      }

      await CommandeProduit.updateQuantity(idLigne, quantite);

      res.json({
        success: true,
        message: 'Quantité mise à jour'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un produit du panier
  static async removeFromCart(req, res) {
    try {
      const { idLigne } = req.params;

      await CommandeProduit.remove(idLigne);

      res.json({
        success: true,
        message: 'Produit supprimé du panier'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Valider la commande
  static async validateOrder(req, res) {
    try {
      const { idSession } = req.params;
      const { panierItems } = req.body; // Recevoir le panier du frontend

      // Vérifier que la session existe
      const session = await Session.getById(idSession);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session non trouvée'
        });
      }

      // Récupérer ou créer la commande en attente
      let commandes = await Commande.getBySession(idSession);
      let commande = commandes.find(c => c.statut_commande === 'EN_ATTENTE');

      if (!commande) {
        commande = await Commande.create(idSession);
      }

      // Si on a reçu le panier du frontend, synchroniser avec la base de données
      if (panierItems && Array.isArray(panierItems)) {
        // Vider la commande existante
        await CommandeProduit.clearCommande(commande.id_commande);
        
        // Ajouter tous les items du panier
        for (const item of panierItems) {
          const produit = await Produit.getById(item.id_produit);
          if (produit) {
            await CommandeProduit.add(commande.id_commande, item.id_produit, item.quantite, produit.prix_cfa);
          }
        }
      }

      // Vérifier que le panier n'est pas vide
      const panier = await CommandeProduit.getByCommande(commande.id_commande);
      if (panier.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Le panier est vide'
        });
      }

      // Mettre à jour le statut de la commande
      await Commande.updateStatus(commande.id_commande, 'ENVOYÉ');

      // Mettre à jour les stocks
      for (const item of panier) {
        await Produit.updateStock(item.id_produit, item.quantite);
      }

      res.json({
        success: true,
        message: 'Commande validée et envoyée à la cuisine',
        data: {
          commandeId: commande.id_commande
        }
      });
    } catch (error) {
      console.error('Erreur lors de la validation de la commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Créer un paiement
  static async createPayment(req, res) {
    try {
      const { idSession } = req.params;
      const { methodePaiement } = req.body;

      // Vérifier que la session existe
      const session = await Session.getById(idSession);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session non trouvée'
        });
      }

      // Récupérer la commande envoyée
      const commandes = await Commande.getBySession(idSession);
      const commande = commandes.find(c => c.statut_commande === 'ENVOYÉ');

      if (!commande) {
        return res.status(400).json({
          success: false,
          message: 'Aucune commande envoyée trouvée'
        });
      }

      // Calculer le total
      const total = await CommandeProduit.getTotal(commande.id_commande);

      // Créer le paiement
      const paiement = await Paiement.create(commande.id_commande, methodePaiement, total);

      // Vérifier si la session peut être fermée automatiquement
      const sessionStatus = await SessionManager.getSessionStatus(idSession);
      let sessionClosed = false;
      
      if (sessionStatus.canClose.canClose) {
        const closeResult = await SessionManager.autoCloseSession(idSession);
        sessionClosed = closeResult.closed;
      }

      res.status(201).json({
        success: true,
        message: 'Paiement créé avec succès',
        data: {
          paiement: {
            id: paiement.id,
            methodePaiement: paiement.methodePaiement,
            montantTotal: paiement.montantTotal,
            codeValidation: paiement.codeValidation,
            statutPaiement: paiement.statutPaiement
          },
          sessionClosed: sessionClosed,
          sessionStatus: sessionStatus
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création du paiement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Fermer la session
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
}

module.exports = ClientController;
