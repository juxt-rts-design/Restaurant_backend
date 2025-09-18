-- Données typiques du Gabon pour la restauration interactive
-- Base de données : restauration_interactive

USE restauration;

-- Supprimer les données existantes (optionnel)
-- DELETE FROM paiements;
-- DELETE FROM commande_produits;
-- DELETE FROM commandes;
-- DELETE FROM sessions;
-- DELETE FROM clients;
-- DELETE FROM produits;
-- DELETE FROM tables;

-- Tables du restaurant avec noms gabonais
INSERT INTO tables (nom_table, capacite, qr_code, active) VALUES
('Table 1', 4, 'TBL001LIBREVILLE123456789', 1),
('Table 2', 6, 'TBL002PORTGENTIL123456789', 1),
('Table 3', 2, 'TBL003FRANCEVILLE123456789', 1),
('Table 4', 4, 'TBL004OYEM123456789012345', 1),
('Table 5', 8, 'TBL005MOANDA123456789012345', 1),
('Table 6', 2, 'TBL006LAMBARENE123456789012', 1),
('Table 7', 4, 'TBL007KOULAMOUTOU123456789', 1),
('Table 8', 6, 'TBL008TCHIBANGA123456789012', 1),
('Table 9', 4, 'TBL009MAKOKOU12345678901234', 1),
('Table 10', 2, 'TBL010BITAM1234567890123456', 1);

-- Clients gabonais typiques
INSERT INTO clients (nom_complet, date_enregistrement) VALUES
('MBOUMBA Jean-Baptiste', '2024-01-15 08:30:00'),
('NDONG Mireille', '2024-01-15 09:15:00'),
('OBAME Pierre', '2024-01-15 10:00:00'),
('MASSANGA Marie-Claire', '2024-01-15 11:30:00'),
('BOUKAMBA Daniel', '2024-01-15 12:45:00'),
('MABIKA Grace', '2024-01-15 14:20:00'),
('NTOUTOUME Paul', '2024-01-15 15:10:00'),
('MOUKAGNI Sylvie', '2024-01-15 16:30:00'),
('BIGANDA Joseph', '2024-01-15 17:45:00'),
('MBOUMBA-LONDO Patricia', '2024-01-15 18:20:00'),
('NDONG-MBA Roger', '2024-01-15 19:00:00'),
('OBAME-NDONG Martine', '2024-01-15 19:30:00');

-- Plats typiques du Gabon
INSERT INTO produits (nom_produit, description, prix_cfa, stock_disponible, actif) VALUES
-- Plats principaux gabonais
('Poulet Nyembwe', 'Poulet mijoté dans la sauce de noix de palme, accompagné de plantain', 4500, 25, 1),
('Poisson Braisé', 'Poisson frais braisé aux épices gabonaises, servi avec riz', 3800, 30, 1),
('Sauce Gombo', 'Sauce de gombo avec viande ou poisson, accompagnée de riz', 3500, 20, 1),
('Poulet DG', 'Poulet sauté aux légumes et plantain, spécialité gabonaise', 4200, 18, 1),
('Poisson à la Tomate', 'Poisson cuit à la tomate et aux oignons, servi avec riz', 3600, 22, 1),
('Sauce Arachide', 'Sauce d\'arachide avec viande, accompagnée de riz ou plantain', 3200, 15, 1),
('Poulet aux Épinards', 'Poulet mijoté aux épinards locaux, servi avec riz', 4000, 20, 1),
('Poisson Fumé', 'Poisson fumé traditionnel, accompagné de plantain et légumes', 4500, 12, 1),
('Sauce Feuilles', 'Sauce aux feuilles de manioc, avec viande ou poisson', 3000, 25, 1),
('Poulet aux Champignons', 'Poulet aux champignons sauvages, servi avec riz', 4300, 16, 1),

-- Accompagnements
('Riz Blanc', 'Riz parfumé cuit à la vapeur', 800, 100, 1),
('Plantain Mûr', 'Plantain mûr cuit à la vapeur', 1000, 80, 1),
('Plantain Vert', 'Plantain vert frit ou bouilli', 1200, 60, 1),
('Riz Sauce', 'Riz accompagné de sauce tomate', 1500, 50, 1),
('Frites de Plantain', 'Plantain coupé en frites et frit', 1800, 40, 1),
('Riz aux Légumes', 'Riz mélangé aux légumes locaux', 2000, 35, 1),

-- Entrées et salades
('Salade de Légumes', 'Salade fraîche de légumes locaux', 2000, 30, 1),
('Avocat Vinaigrette', 'Avocat local avec vinaigrette maison', 1800, 25, 1),
('Tomates à l\'Huile', 'Tomates fraîches à l\'huile d\'olive', 1500, 40, 1),
('Salade de Concombre', 'Concombre frais avec oignons et citron', 1200, 35, 1),

-- Soupes
('Soupe de Poisson', 'Soupe traditionnelle de poisson frais', 2500, 20, 1),
('Soupe de Légumes', 'Soupe aux légumes de saison', 1800, 25, 1),
('Soupe de Viande', 'Soupe de viande aux légumes', 2200, 18, 1),

-- Boissons locales
('Jus de Bissap', 'Jus d\'hibiscus rouge, boisson traditionnelle', 1200, 50, 1),
('Jus de Gingembre', 'Jus de gingembre frais, rafraîchissant', 1000, 40, 1),
('Jus de Tamarin', 'Jus de tamarin, boisson acidulée', 1500, 30, 1),
('Jus de Mangue', 'Jus de mangue fraîche', 1800, 35, 1),
('Jus d\'Ananas', 'Jus d\'ananas frais', 1600, 40, 1),
('Jus de Papaye', 'Jus de papaye nature', 1400, 25, 1),
('Jus de Goyave', 'Jus de goyave fraîche', 1300, 30, 1),

-- Boissons chaudes
('Café Gabonais', 'Café robusta du Gabon, torréfié localement', 1000, 100, 1),
('Thé Rouge', 'Thé rouge de qualité', 800, 80, 1),
('Chocolat Chaud', 'Chocolat chaud au lait', 1500, 50, 1),
('Café au Lait', 'Café au lait de vache', 1200, 60, 1),

-- Boissons gazeuses et eau
('Coca-Cola', 'Boisson gazeuse 33cl', 800, 100, 1),
('Fanta Orange', 'Boisson gazeuse à l\'orange 33cl', 800, 80, 1),
('Sprite', 'Boisson gazeuse citron 33cl', 800, 70, 1),
('Eau Minérale', 'Eau minérale 50cl', 600, 120, 1),
('Eau Gazeuse', 'Eau gazeuse 50cl', 700, 60, 1),

-- Desserts
('Fruits de Saison', 'Assortiment de fruits tropicaux', 2000, 30, 1),
('Banane Flambée', 'Banane plantain flambée au rhum', 2500, 20, 1),
('Ananas Caramélisé', 'Ananas caramélisé avec glace', 2200, 15, 1),
('Mangue au Sucre', 'Mangue fraîche saupoudrée de sucre', 1800, 25, 1),
('Papaye au Citron', 'Papaye fraîche avec jus de citron', 1500, 20, 1),

-- Boissons alcoolisées (optionnelles)
('Bière Régab', 'Bière gabonaise 33cl', 1800, 50, 1),
('Bière Castel', 'Bière importée 33cl', 2000, 40, 1),
('Vin Rouge', 'Verre de vin rouge', 3000, 30, 1),
('Vin Blanc', 'Verre de vin blanc', 3000, 25, 1),
('Rhum Local', 'Rhum gabonais 4cl', 2500, 20, 1);

-- Sessions de test avec clients gabonais
INSERT INTO sessions (id_table, id_client, statut_session, date_ouverture, date_fermeture) VALUES
(1, 1, 'OUVERTE', '2024-01-15 12:00:00', NULL),
(2, 2, 'FERMÉE', '2024-01-15 11:30:00', '2024-01-15 13:45:00'),
(3, 3, 'OUVERTE', '2024-01-15 18:00:00', NULL),
(4, 4, 'FERMÉE', '2024-01-15 10:15:00', '2024-01-15 12:30:00'),
(5, 5, 'OUVERTE', '2024-01-15 19:30:00', NULL);

-- Commandes de test
INSERT INTO commandes (id_session, statut_commande, date_commande) VALUES
(1, 'EN_ATTENTE', '2024-01-15 12:15:00'),
(2, 'SERVI', '2024-01-15 11:45:00'),
(3, 'ENVOYÉ', '2024-01-15 18:20:00'),
(4, 'SERVI', '2024-01-15 10:30:00'),
(5, 'EN_ATTENTE', '2024-01-15 19:45:00');

-- Détails des commandes avec plats gabonais
INSERT INTO commande_produits (id_commande, id_produit, quantite, prix_unitaire) VALUES
-- Commande 1 (Table Libreville - MBOUMBA Jean-Baptiste)
(1, 1, 1, 4500), -- Poulet Nyembwe
(1, 11, 2, 800), -- Riz Blanc
(1, 25, 1, 1200), -- Jus de Bissap

-- Commande 2 (Table Port-Gentil - NDONG Mireille) - FERMÉE
(2, 2, 1, 3800), -- Poisson Braisé
(2, 12, 1, 1000), -- Plantain Mûr
(2, 26, 1, 1000), -- Jus de Gingembre
(2, 20, 1, 2500), -- Soupe de Poisson

-- Commande 3 (Table Franceville - OBAME Pierre) - ENVOYÉE
(3, 3, 1, 3500), -- Sauce Gombo
(3, 11, 1, 800), -- Riz Blanc
(3, 27, 1, 1500), -- Jus de Tamarin

-- Commande 4 (Table Oyem - MASSANGA Marie-Claire) - FERMÉE
(4, 4, 1, 4200), -- Poulet DG
(4, 13, 1, 1200), -- Plantain Vert
(4, 28, 1, 1800), -- Jus de Mangue
(4, 17, 1, 2000), -- Salade de Légumes

-- Commande 5 (Table Moanda - BOUKAMBA Daniel) - EN ATTENTE
(5, 5, 1, 3600), -- Poisson à la Tomate
(5, 11, 1, 800), -- Riz Blanc
(5, 29, 1, 1600), -- Jus d'Ananas

-- Paiements de test
INSERT INTO paiements (id_commande, methode_paiement, montant_total, statut_paiement, code_validation, date_paiement) VALUES
(1, 'CARTE', 7100, 'EN_COURS', 'GAB12345', '2024-01-15 12:20:00'),
(2, 'ESPECES', 9300, 'EFFECTUÉ', 'GAB67890', '2024-01-15 13:40:00'),
(3, 'MOBILE_MONEY', 5800, 'EFFECTUÉ', 'GAB23456', '2024-01-15 18:25:00'),
(4, 'A_LA_CAISSE', 9200, 'EFFECTUÉ', 'GAB78901', '2024-01-15 12:25:00'),
(5, 'CARTE', 6000, 'EN_COURS', 'GAB34567', '2024-01-15 19:50:00');

-- Statistiques de vente pour le tableau de bord
-- Ces données permettront d'avoir des statistiques réalistes

-- Vue des ventes par méthode de paiement (pour les rapports)
-- Les données ci-dessus génèrent automatiquement ces statistiques

-- Affichage des données insérées
SELECT 'Données gabonaises insérées avec succès!' as message;

-- Vérification des données
SELECT 
    'Tables' as type,
    COUNT(*) as nombre
FROM tables
UNION ALL
SELECT 
    'Produits' as type,
    COUNT(*) as nombre
FROM produits
UNION ALL
SELECT 
    'Clients' as type,
    COUNT(*) as nombre
FROM clients
UNION ALL
SELECT 
    'Sessions' as type,
    COUNT(*) as nombre
FROM sessions
UNION ALL
SELECT 
    'Commandes' as type,
    COUNT(*) as nombre
FROM commandes
UNION ALL
SELECT 
    'Paiements' as type,
    COUNT(*) as nombre
FROM paiements;

-- Afficher quelques plats typiques
SELECT 
    nom_produit as 'Plat Gabonais',
    description as 'Description',
    CONCAT(prix_cfa, ' FCFA') as 'Prix'
FROM produits 
WHERE actif = 1 
ORDER BY prix_cfa DESC 
LIMIT 10;
