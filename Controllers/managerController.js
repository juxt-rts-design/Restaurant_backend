const Produit = require('../models/Produit');
const Categorie = require('../models/Categorie');
const Table = require('../models/Table');
const Commande = require('../models/Commande');
const Paiement = require('../models/Paiement');
const Session = require('../models/Session');
const Client = require('../models/Client');
const upload = require('../middleware/upload');
const path = require('path');

class ManagerController {
  // Récupérer le tableau de bord
  static async getDashboard(req, res) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Statistiques des ventes
      const statsVentes = await Paiement.getStats(today, today);
      const totalVentes = statsVentes.reduce((sum, stat) => sum + parseInt(stat.montant_effectue || 0), 0);
      const totalPaiements = statsVentes.reduce((sum, stat) => sum + parseInt(stat.paiements_effectues || 0), 0);

      // Sessions actives
      const sessionsActives = await Session.getOpenSessions();
      const tablesOccupees = sessionsActives.length;

      // Commandes en attente
      const commandesEnAttente = await Commande.getPending();

      // Commandes servies (statut SERVI)
      const commandesServies = await Commande.getServed();

      // Paiements en attente
      const paiementsEnAttente = await Paiement.getPending();

      // Produits en rupture de stock
      const tousProduits = await Produit.getAll();
      const produitsRupture = tousProduits.filter(p => p.stock_disponible === 0);

      // Commandes récentes
      const commandesRecentes = await Commande.getAll(10, 0);

      res.json({
        success: true,
        data: {
          ventes: {
            totalVentes,
            totalPaiements,
            details: statsVentes
          },
          tables: {
            occupees: tablesOccupees,
            total: (await Table.getAll()).length
          },
          commandes: {
            enAttente: commandesEnAttente.length,
            servies: commandesServies.length,
            recentes: commandesRecentes
          },
          paiements: {
            enAttente: paiementsEnAttente.filter(p => p.statut_paiement === 'EN_COURS').length,
            effectues: paiementsEnAttente.filter(p => p.statut_paiement === 'EFFECTUÉ').length
          },
          stock: {
            produitsRupture: produitsRupture.length,
            produitsRuptureList: produitsRupture
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du tableau de bord:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Gestion des produits
  static async createProduct(req, res) {
    try {
      const { nomProduit, description, prixCfa, stockDisponible, idCategorie } = req.body;
      
      // Gérer l'upload de l'image si présente
      let photoUrl = null;
      if (req.file) {
        photoUrl = `/uploads/products/${req.file.filename}`;
      }
      
      const produit = await Produit.create(nomProduit, description, prixCfa, stockDisponible, photoUrl, idCategorie);

      res.status(201).json({
        success: true,
        message: 'Produit créé avec succès',
        data: produit
      });
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  static async updateProduct(req, res) {
    try {
      const { idProduit } = req.params;
      const updateData = req.body;
      
      // Gérer l'upload de l'image si présente
      if (req.file) {
        updateData.photoUrl = `/uploads/products/${req.file.filename}`;
      }
      
      const produit = await Produit.update(idProduit, updateData);

      res.json({
        success: true,
        message: 'Produit mis à jour avec succès',
        data: produit
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { idProduit } = req.params;
      
      await Produit.delete(idProduit);

      res.json({
        success: true,
        message: 'Produit supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Gestion des catégories
  static async getAllCategories(req, res) {
    try {
      const categories = await Categorie.getAll();

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  static async createCategory(req, res) {
    try {
      const { nomCategorie, description, icone, couleur } = req.body;
      
      const categorie = await Categorie.create(nomCategorie, description, icone, couleur);

      res.status(201).json({
        success: true,
        message: 'Catégorie créée avec succès',
        data: categorie
      });
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  static async getAllProducts(req, res) {
    try {
      const { q } = req.query;
      
      let produits;
      if (q) {
        produits = await Produit.searchByName(q);
      } else {
        produits = await Produit.getAll();
      }

      res.json({
        success: true,
        data: produits
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Gestion des tables
  static async createTable(req, res) {
    try {
      const { nomTable, capacite } = req.body;
      
      const table = await Table.create(nomTable, capacite);

      res.status(201).json({
        success: true,
        message: 'Table créée avec succès',
        data: table
      });
    } catch (error) {
      console.error('Erreur lors de la création de la table:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  static async updateTable(req, res) {
    try {
      const { idTable } = req.params;
      const { nomTable, capacite, active } = req.body;
      
      const updateData = {};
      if (nomTable) updateData.nomTable = nomTable;
      if (capacite !== undefined) updateData.capacite = capacite;
      if (active !== undefined) updateData.active = active;

      // Mise à jour basique pour les tables
      const table = await Table.getById(idTable);
      if (!table) {
        return res.status(404).json({
          success: false,
          message: 'Table non trouvée'
        });
      }

      // Mise à jour du statut actif
      if (active !== undefined) {
        await Table.updateStatus(idTable, active);
      }

      res.json({
        success: true,
        message: 'Table mise à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la table:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  static async getAllTables(req, res) {
    try {
      const tables = await Table.getAll();

      res.json({
        success: true,
        data: tables
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des tables:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Historique des ventes
  static async getSalesHistory(req, res) {
    try {
      const { dateDebut, dateFin, limit = 50, offset = 0 } = req.query;
      
      let paiements;
      if (dateDebut && dateFin) {
        paiements = await Paiement.getStats(dateDebut, dateFin);
      } else {
        paiements = await Paiement.getAll(parseInt(limit), parseInt(offset));
      }

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

  // Statistiques détaillées
  static async getDetailedStats(req, res) {
    try {
      const { dateDebut, dateFin } = req.query;
      
      const stats = await Paiement.getStats(dateDebut, dateFin);
      
      // Calculer les totaux
      const totalVentes = stats.reduce((sum, stat) => sum + parseInt(stat.montant_effectue || 0), 0);
      const totalPaiements = stats.reduce((sum, stat) => sum + parseInt(stat.paiements_effectues || 0), 0);
      const totalTentatives = stats.reduce((sum, stat) => sum + parseInt(stat.nombre_paiements || 0), 0);
      
      // Taux de réussite
      const tauxReussite = totalTentatives > 0 ? (totalPaiements / totalTentatives * 100).toFixed(2) : 0;

      res.json({
        success: true,
        data: {
          periode: {
            debut: dateDebut,
            fin: dateFin
          },
          totaux: {
            ventes: totalVentes,
            paiementsEffectues: totalPaiements,
            tentativesTotal: totalTentatives,
            tauxReussite: parseFloat(tauxReussite)
          },
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

  // Gestion des clients
  static async getAllClients(req, res) {
    try {
      const { q, limit = 50, offset = 0 } = req.query;
      
      let clients;
      if (q) {
        clients = await Client.searchByName(q);
      } else {
        clients = await Client.getAll();
      }

      // Appliquer la pagination
      const clientsPagination = clients.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

      res.json({
        success: true,
        data: {
          clients: clientsPagination,
          total: clients.length,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Générer des QR codes pour les tables
  static async generateQrCodes(req, res) {
    try {
      const tables = await Table.getActiveTables();
      const qrCodes = [];

      for (const table of tables) {
        const qrCodeImage = await Table.generateQrCodeImage(table.qr_code, process.env.QR_CODE_BASE_URL || 'http://localhost:3000/table');
        qrCodes.push({
          table: {
            id: table.id_table,
            nom: table.nom_table,
            capacite: table.capacite
          },
          qrCode: table.qr_code,
          qrCodeImage,
          url: `${process.env.QR_CODE_BASE_URL || 'http://localhost:3000/table'}/${table.qr_code}`
        });
      }

      res.json({
        success: true,
        data: qrCodes
      });
    } catch (error) {
      console.error('Erreur lors de la génération des QR codes:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Récupérer les rapports
  static async getReports(req, res) {
    try {
      const { type, dateDebut, dateFin } = req.query;
      
      let rapport = {};

      switch (type) {
        case 'ventes':
          rapport = await Paiement.getStats(dateDebut, dateFin);
          break;
        case 'commandes':
          rapport = await Commande.getAll(1000, 0);
          break;
        case 'clients':
          rapport = await Client.getAll();
          break;
        case 'tables':
          rapport = await Table.getAll();
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Type de rapport non supporté'
          });
      }

      res.json({
        success: true,
        data: {
          type,
          periode: {
            debut: dateDebut,
            fin: dateFin
          },
          rapport
        }
      });
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}

module.exports = ManagerController;
