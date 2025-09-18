-- Spécialités régionales et plats saisonniers du Gabon
-- À exécuter après gabon-data.sql

USE restauration_interactive;

-- Plats de fête et occasions spéciales
INSERT INTO produits (nom_produit, description, prix_cfa, stock_disponible, actif) VALUES
-- Plats de fête
('Poulet de Fête', 'Poulet entier rôti aux épices, plat de fête traditionnel', 6500, 10, 1),
('Poisson Royal', 'Gros poisson braisé entier, servi pour les grandes occasions', 8000, 8, 1),
('Riz Parfumé aux Épices', 'Riz cuit avec épices locales et bouillon de viande', 2500, 30, 1),
('Plantain de Fête', 'Plantain mûr cuit avec sucre et cannelle', 2000, 20, 1),

-- Spécialités de Libreville
('Poulet Libreville', 'Poulet aux légumes et épices, spécialité de la capitale', 4800, 15, 1),
('Poisson Capitale', 'Poisson aux tomates et oignons, style Libreville', 4200, 18, 1),
('Sauce Capitale', 'Sauce mixte tomate-gombo, spécialité de Libreville', 3800, 12, 1),

-- Spécialités de Port-Gentil
('Poulet Pétrolier', 'Poulet aux légumes, spécialité de Port-Gentil', 5200, 10, 1),
('Poisson du Port', 'Poisson frais du port, cuit aux épices', 4500, 15, 1),
('Riz du Littoral', 'Riz aux fruits de mer, spécialité côtière', 3500, 20, 1),

-- Spécialités de l'Est (Franceville, Moanda)
('Poulet de l\'Est', 'Poulet aux légumes de l\'Est du Gabon', 4600, 12, 1),
('Poisson de l\'Est', 'Poisson aux herbes de l\'Est', 4000, 14, 1),
('Sauce de l\'Est', 'Sauce aux feuilles de l\'Est', 3200, 16, 1),

-- Spécialités du Nord (Oyem, Bitam)
('Poulet du Nord', 'Poulet aux épices du Nord', 4400, 10, 1),
('Poisson du Nord', 'Poisson fumé du Nord', 5000, 8, 1),
('Riz du Nord', 'Riz aux légumes du Nord', 2800, 18, 1),

-- Plats végétariens
('Riz aux Légumes Verts', 'Riz aux légumes verts locaux', 2200, 25, 1),
('Plantain aux Légumes', 'Plantain avec légumes sautés', 2500, 20, 1),
('Salade Tropicale', 'Salade de légumes et fruits tropicaux', 3000, 15, 1),
('Riz aux Épinards', 'Riz aux épinards locaux', 2000, 22, 1),

-- Plats pour enfants
('Poulet Doux', 'Poulet sans épices, pour les enfants', 3500, 20, 1),
('Riz Simple', 'Riz blanc simple, pour les enfants', 1000, 50, 1),
('Plantain Doux', 'Plantain mûr sans épices', 1200, 30, 1),
('Jus de Fruits Mixte', 'Mélange de jus de fruits pour enfants', 1500, 40, 1),

-- Boissons traditionnelles
('Bissap Rouge', 'Hibiscus rouge traditionnel', 1000, 60, 1),
('Bissap Blanc', 'Hibiscus blanc, plus doux', 1200, 40, 1),
('Jus de Kola', 'Jus de noix de kola, énergisant', 2000, 25, 1),
('Jus de Baobab', 'Jus de fruit de baobab', 1800, 20, 1),
('Jus de Corossol', 'Jus de corossol, fruit tropical', 1600, 30, 1),
('Jus de Maracuja', 'Jus de fruit de la passion', 1400, 35, 1),

-- Boissons chaudes traditionnelles
('Café Robusta', 'Café robusta du Gabon, torréfié artisanalement', 1200, 80, 1),
('Thé aux Herbes', 'Thé aux herbes médicinales locales', 1000, 50, 1),
('Chocolat Artisanal', 'Chocolat chaud artisanal', 1800, 30, 1),
('Café au Lait de Coco', 'Café au lait de coco', 1500, 25, 1),

-- Desserts traditionnels
('Beignets de Plantain', 'Beignets de plantain mûr', 1500, 40, 1),
('Beignets de Banane', 'Beignets de banane', 1200, 35, 1),
('Fruits au Sucre', 'Fruits tropicaux au sucre de canne', 2000, 25, 1),
('Glace Coco', 'Glace à la noix de coco', 2500, 20, 1),
('Glace Mangue', 'Glace à la mangue', 2200, 18, 1),
('Glace Ananas', 'Glace à l\'ananas', 2000, 15, 1),

-- Plats de saison (pluie)
('Soupe de Pluie', 'Soupe chaude pour la saison des pluies', 2800, 20, 1),
('Poulet aux Légumes de Pluie', 'Poulet aux légumes de saison des pluies', 4500, 15, 1),
('Riz aux Légumes de Pluie', 'Riz aux légumes de saison', 2500, 25, 1),

-- Plats de saison (sèche)
('Poulet Sec', 'Poulet séché, spécialité de saison sèche', 5000, 12, 1),
('Poisson Sec', 'Poisson séché traditionnel', 4500, 10, 1),
('Légumes Secs', 'Légumes secs cuisinés', 2000, 30, 1);

-- Mise à jour des stocks pour les plats populaires
UPDATE produits SET stock_disponible = 50 WHERE nom_produit = 'Riz Blanc';
UPDATE produits SET stock_disponible = 40 WHERE nom_produit = 'Plantain Mûr';
UPDATE produits SET stock_disponible = 60 WHERE nom_produit = 'Jus de Bissap';
UPDATE produits SET stock_disponible = 45 WHERE nom_produit = 'Café Gabonais';

-- Ajout de clients supplémentaires avec des noms typiques
INSERT INTO clients (nom_complet, date_enregistrement) VALUES
('MBOUMBA-LONDO Jean-Pierre', '2024-01-16 08:00:00'),
('NDONG-MBA Marie-Thérèse', '2024-01-16 09:30:00'),
('OBAME-NDONG Paul-Henri', '2024-01-16 10:45:00'),
('MASSANGA-LONDO Sylvie', '2024-01-16 12:15:00'),
('BOUKAMBA-MBOUMBA Daniel', '2024-01-16 13:30:00'),
('MABIKA-NDONG Grace', '2024-01-16 14:45:00'),
('NTOUTOUME-OBAME Pierre', '2024-01-16 16:00:00'),
('MOUKAGNI-MASSANGA Martine', '2024-01-16 17:15:00'),
('BIGANDA-LONDO Joseph', '2024-01-16 18:30:00'),
('MBOUMBA-NDONG Patricia', '2024-01-16 19:45:00');

-- Sessions supplémentaires
INSERT INTO sessions (id_table, id_client, statut_session, date_ouverture, date_fermeture) VALUES
(6, 13, 'OUVERTE', '2024-01-16 12:00:00', NULL),
(7, 14, 'FERMÉE', '2024-01-16 11:00:00', '2024-01-16 13:30:00'),
(8, 15, 'OUVERTE', '2024-01-16 18:00:00', NULL),
(9, 16, 'FERMÉE', '2024-01-16 10:30:00', '2024-01-16 12:45:00'),
(10, 17, 'OUVERTE', '2024-01-16 19:00:00', NULL);

-- Commandes supplémentaires
INSERT INTO commandes (id_session, statut_commande, date_commande) VALUES
(6, 'EN_ATTENTE', '2024-01-16 12:30:00'),
(7, 'SERVI', '2024-01-16 11:15:00'),
(8, 'ENVOYÉ', '2024-01-16 18:15:00'),
(9, 'SERVI', '2024-01-16 10:45:00'),
(10, 'EN_ATTENTE', '2024-01-16 19:15:00');

-- Détails des commandes avec spécialités
INSERT INTO commande_produits (id_commande, id_produit, quantite, prix_unitaire) VALUES
-- Commande 6 (Table Lambarene - MBOUMBA-LONDO Jean-Pierre)
(6, 1, 1, 4500), -- Poulet Nyembwe
(6, 11, 1, 800), -- Riz Blanc
(6, 25, 1, 1200), -- Jus de Bissap
(6, 17, 1, 2000), -- Salade de Légumes

-- Commande 7 (Table Koulamoutou - NDONG-MBA Marie-Thérèse) - FERMÉE
(7, 2, 1, 3800), -- Poisson Braisé
(7, 12, 1, 1000), -- Plantain Mûr
(7, 26, 1, 1000), -- Jus de Gingembre

-- Commande 8 (Table Tchibanga - OBAME-NDONG Paul-Henri) - ENVOYÉE
(8, 3, 1, 3500), -- Sauce Gombo
(8, 11, 1, 800), -- Riz Blanc
(8, 27, 1, 1500), -- Jus de Tamarin

-- Commande 9 (Table Makokou - MASSANGA-LONDO Sylvie) - FERMÉE
(9, 4, 1, 4200), -- Poulet DG
(9, 13, 1, 1200), -- Plantain Vert
(9, 28, 1, 1800), -- Jus de Mangue

-- Commande 10 (Table Bitam - BOUKAMBA-MBOUMBA Daniel) - EN ATTENTE
(10, 5, 1, 3600), -- Poisson à la Tomate
(10, 11, 1, 800), -- Riz Blanc
(10, 29, 1, 1600); -- Jus d'Ananas

-- Paiements supplémentaires
INSERT INTO paiements (id_commande, methode_paiement, montant_total, statut_paiement, code_validation, date_paiement) VALUES
(6, 'MOBILE_MONEY', 8500, 'EN_COURS', 'GAB45678', '2024-01-16 12:45:00'),
(7, 'ESPECES', 5800, 'EFFECTUÉ', 'GAB90123', '2024-01-16 13:25:00'),
(8, 'CARTE', 5800, 'EFFECTUÉ', 'GAB56789', '2024-01-16 18:20:00'),
(9, 'A_LA_CAISSE', 7200, 'EFFECTUÉ', 'GAB01234', '2024-01-16 12:40:00'),
(10, 'MOBILE_MONEY', 6000, 'EN_COURS', 'GAB89012', '2024-01-16 19:20:00');

-- Statistiques finales
SELECT 'Spécialités gabonaises ajoutées avec succès!' as message;

-- Afficher les plats les plus chers (plats de fête)
SELECT 
    nom_produit as 'Plat de Fête',
    description as 'Description',
    CONCAT(prix_cfa, ' FCFA') as 'Prix'
FROM produits 
WHERE actif = 1 AND prix_cfa >= 6000
ORDER BY prix_cfa DESC;

-- Afficher les boissons traditionnelles
SELECT 
    nom_produit as 'Boisson Traditionnelle',
    description as 'Description',
    CONCAT(prix_cfa, ' FCFA') as 'Prix'
FROM produits 
WHERE actif = 1 AND nom_produit LIKE '%Bissap%' OR nom_produit LIKE '%Kola%' OR nom_produit LIKE '%Baobab%'
ORDER BY prix_cfa;
