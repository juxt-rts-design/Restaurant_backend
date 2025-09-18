-- Promotions et prix spéciaux typiques du Gabon
-- À exécuter après gabon-data.sql et gabon-specialties.sql

USE restauration_interactive;

-- Créer une table pour les promotions
CREATE TABLE IF NOT EXISTS promotions (
    id_promotion BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom_promotion VARCHAR(150) NOT NULL,
    description TEXT,
    type_promotion ENUM('POURCENTAGE', 'FIXE', 'MENU') NOT NULL,
    valeur_promotion DECIMAL(10,2) NOT NULL,
    date_debut DATETIME NOT NULL,
    date_fin DATETIME NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    produits_concernes JSON,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Promotions typiques du Gabon
INSERT INTO promotions (nom_promotion, description, type_promotion, valeur_promotion, date_debut, date_fin, active) VALUES
-- Promotions de fête nationale
('Fête de l\'Indépendance', 'Réduction spéciale pour la fête nationale du Gabon', 'POURCENTAGE', 15.00, '2024-08-17 00:00:00', '2024-08-17 23:59:59', 1),
('Jour de l\'An', 'Promotion du Nouvel An', 'POURCENTAGE', 20.00, '2024-01-01 00:00:00', '2024-01-01 23:59:59', 1),
('Noël', 'Promotion de Noël', 'POURCENTAGE', 25.00, '2024-12-25 00:00:00', '2024-12-25 23:59:59', 1),

-- Promotions de saison
('Saison des Pluies', 'Plats chauds en promotion pendant la saison des pluies', 'POURCENTAGE', 10.00, '2024-09-01 00:00:00', '2024-12-15 23:59:59', 1),
('Saison Sèche', 'Boissons fraîches en promotion pendant la saison sèche', 'POURCENTAGE', 15.00, '2024-06-01 00:00:00', '2024-08-31 23:59:59', 1),

-- Promotions hebdomadaires
('Mercredi Poulet', 'Poulet en promotion tous les mercredis', 'FIXE', 500.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1),
('Vendredi Poisson', 'Poisson en promotion tous les vendredis', 'FIXE', 400.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1),
('Dimanche Famille', 'Menu famille le dimanche', 'POURCENTAGE', 12.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1),

-- Promotions horaires
('Déjeuner Express', 'Menu rapide de 11h à 14h', 'FIXE', 1000.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1),
('Dîner Tardif', 'Réduction après 20h', 'POURCENTAGE', 8.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1),

-- Promotions spéciales
('Premier Client', 'Réduction pour les nouveaux clients', 'POURCENTAGE', 10.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1),
('Anniversaire', 'Réduction le jour de l\'anniversaire', 'POURCENTAGE', 15.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1);

-- Mise à jour des prix pour refléter l'économie gabonaise
-- Réduction des prix pour les plats de base
UPDATE produits SET prix_cfa = prix_cfa - 200 WHERE nom_produit IN ('Riz Blanc', 'Plantain Mûr', 'Eau Minérale');
UPDATE produits SET prix_cfa = prix_cfa - 300 WHERE nom_produit IN ('Coca-Cola', 'Fanta Orange', 'Sprite');
UPDATE produits SET prix_cfa = prix_cfa - 500 WHERE nom_produit IN ('Poulet Nyembwe', 'Poisson Braisé', 'Sauce Gombo');

-- Augmentation des prix pour les plats de fête
UPDATE produits SET prix_cfa = prix_cfa + 1000 WHERE nom_produit IN ('Poulet de Fête', 'Poisson Royal');
UPDATE produits SET prix_cfa = prix_cfa + 500 WHERE nom_produit IN ('Poulet Libreville', 'Poisson Capitale');

-- Ajustement des prix des boissons traditionnelles
UPDATE produits SET prix_cfa = 800 WHERE nom_produit = 'Jus de Bissap';
UPDATE produits SET prix_cfa = 700 WHERE nom_produit = 'Jus de Gingembre';
UPDATE produits SET prix_cfa = 900 WHERE nom_produit = 'Jus de Tamarin';

-- Créer des menus spéciaux
INSERT INTO produits (nom_produit, description, prix_cfa, stock_disponible, actif) VALUES
-- Menus complets
('Menu Libreville', 'Poulet Nyembwe + Riz + Jus de Bissap + Dessert', 7500, 20, 1),
('Menu Port-Gentil', 'Poisson Braisé + Plantain + Jus de Gingembre + Dessert', 6800, 18, 1),
('Menu Franceville', 'Sauce Gombo + Riz + Jus de Tamarin + Dessert', 6200, 22, 1),
('Menu Famille', '2 Poulets + 2 Riz + 2 Plantains + 4 Boissons', 12000, 15, 1),
('Menu Étudiant', 'Plat simple + Riz + Boisson', 3500, 30, 1),
('Menu Travailleur', 'Plat principal + Riz + Boisson + Dessert', 5500, 25, 1),

-- Plats du jour (prix réduits)
('Plat du Jour - Lundi', 'Poulet aux légumes + Riz', 3000, 40, 1),
('Plat du Jour - Mardi', 'Poisson aux tomates + Riz', 3200, 35, 1),
('Plat du Jour - Mercredi', 'Sauce arachide + Riz', 2800, 30, 1),
('Plat du Jour - Jeudi', 'Poulet DG + Plantain', 3500, 25, 1),
('Plat du Jour - Vendredi', 'Poisson fumé + Riz', 3800, 20, 1),
('Plat du Jour - Samedi', 'Poulet de fête + Riz', 4000, 15, 1),
('Plat du Jour - Dimanche', 'Poisson royal + Plantain', 4200, 18, 1);

-- Ajouter des clients avec des professions typiques
INSERT INTO clients (nom_complet, date_enregistrement) VALUES
('MBOUMBA Jean (Enseignant)', '2024-01-17 08:30:00'),
('NDONG Marie (Infirmière)', '2024-01-17 09:15:00'),
('OBAME Pierre (Fonctionnaire)', '2024-01-17 10:00:00'),
('MASSANGA Sylvie (Commerçante)', '2024-01-17 11:30:00'),
('BOUKAMBA Daniel (Chauffeur)', '2024-01-17 12:45:00'),
('MABIKA Grace (Étudiante)', '2024-01-17 14:20:00'),
('NTOUTOUME Paul (Ingénieur)', '2024-01-17 15:10:00'),
('MOUKAGNI Martine (Secrétaire)', '2024-01-17 16:30:00'),
('BIGANDA Joseph (Ouvrier)', '2024-01-17 17:45:00'),
('MBOUMBA-LONDO Patricia (Médecin)', '2024-01-17 18:20:00');

-- Sessions avec des commandes typiques
INSERT INTO sessions (id_table, id_client, statut_session, date_ouverture, date_fermeture) VALUES
(1, 23, 'OUVERTE', '2024-01-17 12:00:00', NULL),
(2, 24, 'FERMÉE', '2024-01-17 11:30:00', '2024-01-17 13:45:00'),
(3, 25, 'OUVERTE', '2024-01-17 18:00:00', NULL),
(4, 26, 'FERMÉE', '2024-01-17 10:15:00', '2024-01-17 12:30:00'),
(5, 27, 'OUVERTE', '2024-01-17 19:30:00', NULL);

-- Commandes avec menus et plats du jour
INSERT INTO commandes (id_session, statut_commande, date_commande) VALUES
(11, 'EN_ATTENTE', '2024-01-17 12:15:00'),
(12, 'SERVI', '2024-01-17 11:45:00'),
(13, 'ENVOYÉ', '2024-01-17 18:20:00'),
(14, 'SERVI', '2024-01-17 10:30:00'),
(15, 'EN_ATTENTE', '2024-01-17 19:45:00');

-- Détails des commandes avec menus
INSERT INTO commande_produits (id_commande, id_produit, quantite, prix_unitaire) VALUES
-- Commande 11 (Menu Libreville)
(11, 1, 1, 4500), -- Poulet Nyembwe
(11, 11, 1, 800), -- Riz Blanc
(11, 25, 1, 1200), -- Jus de Bissap
(11, 17, 1, 2000), -- Salade de Légumes

-- Commande 12 (Plat du Jour - Mardi)
(12, 2, 1, 3800), -- Poisson aux tomates
(12, 11, 1, 800), -- Riz Blanc
(12, 26, 1, 1000), -- Jus de Gingembre

-- Commande 13 (Menu Port-Gentil)
(13, 2, 1, 3800), -- Poisson Braisé
(13, 12, 1, 1000), -- Plantain Mûr
(13, 26, 1, 1000), -- Jus de Gingembre
(13, 20, 1, 2500), -- Soupe de Poisson

-- Commande 14 (Menu Étudiant)
(14, 3, 1, 3500), -- Sauce Gombo
(14, 11, 1, 800), -- Riz Blanc
(14, 27, 1, 1500), -- Jus de Tamarin

-- Commande 15 (Menu Famille)
(15, 1, 2, 4500), -- 2 Poulets Nyembwe
(15, 11, 2, 800), -- 2 Riz Blanc
(15, 12, 2, 1000), -- 2 Plantains Mûrs
(15, 25, 4, 1200); -- 4 Jus de Bissap

-- Paiements avec différentes méthodes
INSERT INTO paiements (id_commande, methode_paiement, montant_total, statut_paiement, code_validation, date_paiement) VALUES
(11, 'CARTE', 8500, 'EN_COURS', 'GAB12345', '2024-01-17 12:20:00'),
(12, 'ESPECES', 5600, 'EFFECTUÉ', 'GAB67890', '2024-01-17 13:40:00'),
(13, 'MOBILE_MONEY', 8300, 'EFFECTUÉ', 'GAB23456', '2024-01-17 18:25:00'),
(14, 'A_LA_CAISSE', 5800, 'EFFECTUÉ', 'GAB78901', '2024-01-17 12:25:00'),
(15, 'CARTE', 18000, 'EN_COURS', 'GAB34567', '2024-01-17 19:50:00');

-- Statistiques finales
SELECT 'Promotions et menus gabonais ajoutés avec succès!' as message;

-- Afficher les menus complets
SELECT 
    nom_produit as 'Menu Gabonais',
    description as 'Description',
    CONCAT(prix_cfa, ' FCFA') as 'Prix'
FROM produits 
WHERE actif = 1 AND nom_produit LIKE 'Menu%'
ORDER BY prix_cfa;

-- Afficher les plats du jour
SELECT 
    nom_produit as 'Plat du Jour',
    CONCAT(prix_cfa, ' FCFA') as 'Prix'
FROM produits 
WHERE actif = 1 AND nom_produit LIKE 'Plat du Jour%'
ORDER BY nom_produit;

-- Afficher les promotions actives
SELECT 
    nom_promotion as 'Promotion',
    description as 'Description',
    CONCAT(valeur_promotion, CASE WHEN type_promotion = 'POURCENTAGE' THEN '%' ELSE ' FCFA' END) as 'Valeur',
    DATE(date_debut) as 'Début',
    DATE(date_fin) as 'Fin'
FROM promotions 
WHERE active = 1
ORDER BY date_debut;
