const Panier = require('../models/Panier');
const PanierProduit = require('../models/PanierProduit');
const Produit = require('../models/Produit');
const Session = require('../models/Session');

class PanierController {
  // Créer ou récupérer le panier d'un utilisateur
  static async getOrCreatePanier(req, res) {
    try {
      const { idSession } = req.params;
      const { nomUtilisateur } = req.body;

      if (!nomUtilisateur) {
        return res.status(400).json({
          success: false,
          message: 'Nom d\'utilisateur requis'
        });
      }

      // Vérifier que la session existe
      const session = await Session.getById(idSession);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session non trouvée'
        });
      }

      // Récupérer ou créer le panier de l'utilisateur
      let panier = await Panier.getActiveByUser(idSession, nomUtilisateur);
      
      if (!panier) {
        panier = await Panier.create(idSession, nomUtilisateur);
      }

      // Récupérer les produits du panier
      const produits = await PanierProduit.getByPanier(panier.id);
      const total = await PanierProduit.getTotal(panier.id);

      res.json({
        success: true,
        data: {
          panier: {
            id: panier.id,
            nomUtilisateur: panier.nomUtilisateur,
            produits: produits,
            total: total
          }
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

  // Ajouter un produit au panier d'un utilisateur
  static async addToPanier(req, res) {
    try {
      const { idSession } = req.params;
      const { idProduit, quantite, nomUtilisateur } = req.body;

      if (!nomUtilisateur) {
        return res.status(400).json({
          success: false,
          message: 'Nom d\'utilisateur requis'
        });
      }

      // Vérifier que la session existe
      const session = await Session.getById(idSession);
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

      // Récupérer ou créer le panier de l'utilisateur
      let panier = await Panier.getActiveByUser(idSession, nomUtilisateur);
      
      if (!panier) {
        panier = await Panier.create(idSession, nomUtilisateur);
      }

      // Vérifier si le produit est déjà dans le panier
      const existingItem = await PanierProduit.exists(panier.id, idProduit);
      
      if (existingItem) {
        // Mettre à jour la quantité
        const newQuantite = existingItem.quantite + quantite;
        await PanierProduit.updateQuantity(existingItem.id_ligne, newQuantite);
      } else {
        // Ajouter le produit
        await PanierProduit.add(panier.id, idProduit, quantite, produit.prix_cfa);
      }

      // Récupérer le panier mis à jour
      const produits = await PanierProduit.getByPanier(panier.id);
      const total = await PanierProduit.getTotal(panier.id);

      res.json({
        success: true,
        message: 'Produit ajouté au panier',
        data: {
          panier: {
            id: panier.id,
            nomUtilisateur: panier.nomUtilisateur,
            produits: produits,
            total: total
          }
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

  // Récupérer le panier d'un utilisateur
  static async getPanier(req, res) {
    try {
      const { idSession } = req.params;
      const { nomUtilisateur } = req.query;

      if (!nomUtilisateur) {
        return res.status(400).json({
          success: false,
          message: 'Nom d\'utilisateur requis'
        });
      }

      // Récupérer le panier de l'utilisateur
      const panier = await Panier.getActiveByUser(idSession, nomUtilisateur);
      
      if (!panier) {
        return res.json({
          success: true,
          data: {
            panier: {
              id: null,
              nomUtilisateur: nomUtilisateur,
              produits: [],
              total: 0
            }
          }
        });
      }

      // Récupérer les produits du panier
      const produits = await PanierProduit.getByPanier(panier.id);
      const total = await PanierProduit.getTotal(panier.id);

      res.json({
        success: true,
        data: {
          panier: {
            id: panier.id,
            nomUtilisateur: panier.nomUtilisateur,
            produits: produits,
            total: total
          }
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

  // Mettre à jour la quantité d'un produit dans le panier
  static async updateQuantity(req, res) {
    try {
      const { idLigne } = req.params;
      const { quantite } = req.body;

      await PanierProduit.updateQuantity(idLigne, quantite);

      res.json({
        success: true,
        message: 'Quantité mise à jour'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un produit du panier
  static async removeFromPanier(req, res) {
    try {
      const { idLigne } = req.params;

      await PanierProduit.remove(idLigne);

      res.json({
        success: true,
        message: 'Produit supprimé du panier'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Récupérer tous les paniers d'une session (pour la caisse)
  static async getPaniersBySession(req, res) {
    try {
      const { idSession } = req.params;

      const paniers = await Panier.getActiveBySession(idSession);
      
      const paniersAvecProduits = await Promise.all(
        paniers.map(async (panier) => {
          const produits = await PanierProduit.getByPanier(panier.id);
          const total = await PanierProduit.getTotal(panier.id);
          
          return {
            ...panier,
            produits,
            total
          };
        })
      );

      res.json({
        success: true,
        data: paniersAvecProduits
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des paniers:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}

module.exports = PanierController;
