-- Script d'initialisation de la base de données
-- Application de Restauration Interactive

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS restauration_interactive
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE restauration_interactive;

-- Table des clients (pas de compte, juste nom)
CREATE TABLE clients (
  id_client        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom_complet      VARCHAR(150) NOT NULL,
  date_enregistrement DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table des tables physiques du restaurant
CREATE TABLE tables (
  id_table         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom_table        VARCHAR(50) NOT NULL,
  capacite         INT UNSIGNED DEFAULT 0,
  qr_code          CHAR(24) NOT NULL UNIQUE,
  active           TINYINT(1) NOT NULL DEFAULT 1
);

-- Sessions de commande par table
CREATE TABLE sessions (
  id_session       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_table         BIGINT UNSIGNED NOT NULL,
  id_client        BIGINT UNSIGNED NOT NULL,
  statut_session   ENUM('OUVERTE','FERMÉE') NOT NULL DEFAULT 'OUVERTE',
  date_ouverture   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_fermeture   DATETIME NULL,
  FOREIGN KEY (id_table) REFERENCES tables(id_table),
  FOREIGN KEY (id_client) REFERENCES clients(id_client)
);

-- Menu des produits
CREATE TABLE produits (
  id_produit       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom_produit      VARCHAR(150) NOT NULL,
  description      TEXT,
  prix_cfa         INT UNSIGNED NOT NULL,
  stock_disponible INT UNSIGNED DEFAULT 0,
  actif            TINYINT(1) NOT NULL DEFAULT 1
);

-- Commandes
CREATE TABLE commandes (
  id_commande      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_session       BIGINT UNSIGNED NOT NULL,
  statut_commande  ENUM('EN_ATTENTE','ENVOYÉ','SERVI','ANNULÉ') NOT NULL DEFAULT 'EN_ATTENTE',
  date_commande    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_session) REFERENCES sessions(id_session)
);

-- Détails des produits commandés
CREATE TABLE commande_produits (
  id_ligne         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_commande      BIGINT UNSIGNED NOT NULL,
  id_produit       BIGINT UNSIGNED NOT NULL,
  quantite         INT UNSIGNED NOT NULL DEFAULT 1,
  prix_unitaire    INT UNSIGNED NOT NULL,
  FOREIGN KEY (id_commande) REFERENCES commandes(id_commande),
  FOREIGN KEY (id_produit) REFERENCES produits(id_produit)
);

-- Paiements
CREATE TABLE paiements (
  id_paiement      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_commande      BIGINT UNSIGNED NOT NULL,
  methode_paiement ENUM('ESPECES','MOBILE_MONEY','CARTE','A_LA_CAISSE') NOT NULL,
  montant_total    INT UNSIGNED NOT NULL,
  statut_paiement  ENUM('EN_COURS','EFFECTUÉ') NOT NULL DEFAULT 'EN_COURS',
  date_paiement    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  code_validation  CHAR(8) UNIQUE,
  FOREIGN KEY (id_commande) REFERENCES commandes(id_commande)
);

-- Index pour améliorer les performances
CREATE INDEX idx_tables_qr_code ON tables(qr_code);
CREATE INDEX idx_sessions_table ON sessions(id_table);
CREATE INDEX idx_sessions_client ON sessions(id_client);
CREATE INDEX idx_commandes_session ON commandes(id_session);
CREATE INDEX idx_commande_produits_commande ON commande_produits(id_commande);
CREATE INDEX idx_commande_produits_produit ON commande_produits(id_produit);
CREATE INDEX idx_paiements_commande ON paiements(id_commande);
CREATE INDEX idx_paiements_code ON paiements(code_validation);
CREATE INDEX idx_paiements_statut ON paiements(statut_paiement);
CREATE INDEX idx_produits_actif ON produits(actif);
CREATE INDEX idx_commandes_statut ON commandes(statut_commande);
CREATE INDEX idx_sessions_statut ON sessions(statut_session);

-- Insertion de données de test

-- Tables du restaurant
INSERT INTO tables (nom_table, capacite, qr_code) VALUES
('Table 1', 4, 'TBL001ABC123DEF456789'),
('Table 2', 2, 'TBL002XYZ789GHI012345'),
('Table 3', 6, 'TBL003MNO456PQR789012'),
('Table 4', 4, 'TBL004STU123VWX456789'),
('Table 5', 8, 'TBL005YZA789BCD012345'),
('Table 6', 2, 'TBL006EFG456HIJ789012'),
('Table 7', 4, 'TBL007KLM123NOP456789'),
('Table 8', 6, 'TBL008QRS789TUV012345');

-- Produits du menu
INSERT INTO produits (nom_produit, description, prix_cfa, stock_disponible) VALUES
-- Entrées
('Salade César', 'Salade fraîche avec poulet grillé, parmesan et croûtons', 2500, 50),
('Soupe de légumes', 'Soupe maison aux légumes de saison', 1800, 30),
('Bruschetta', 'Pain grillé aux tomates et basilic', 2000, 25),
('Carpaccio de bœuf', 'Tranches fines de bœuf avec roquette et parmesan', 3500, 20),

-- Plats principaux
('Poulet rôti', 'Poulet entier rôti aux herbes avec légumes', 4500, 40),
('Poisson grillé', 'Filet de poisson frais grillé avec riz', 3800, 30),
('Pâtes carbonara', 'Pâtes crémeuses aux lardons et parmesan', 3200, 50),
('Risotto aux champignons', 'Risotto crémeux aux champignons de Paris', 3600, 25),
('Steak frites', 'Entrecôte de bœuf avec frites maison', 5500, 35),
('Burger classique', 'Burger avec frites et salade', 2800, 60),

-- Desserts
('Tiramisu', 'Dessert italien au café et mascarpone', 2000, 30),
('Tarte aux pommes', 'Tarte aux pommes avec crème anglaise', 1800, 25),
('Glace vanille', 'Boule de glace à la vanille', 1200, 40),
('Mousse au chocolat', 'Mousse au chocolat noir', 2200, 20),

-- Boissons
('Coca-Cola', 'Boisson gazeuse 33cl', 800, 100),
('Jus d\'orange', 'Jus d\'orange frais pressé', 1200, 50),
('Eau minérale', 'Eau minérale 50cl', 600, 80),
('Café', 'Café expresso', 1000, 200),
('Thé', 'Thé vert ou noir', 800, 150),
('Vin rouge', 'Verre de vin rouge de la maison', 2500, 60),
('Bière pression', 'Bière blonde pression 25cl', 1800, 80);

-- Clients de test
INSERT INTO clients (nom_complet) VALUES
('Jean Dupont'),
('Marie Martin'),
('Pierre Durand'),
('Sophie Bernard'),
('Michel Moreau'),
('Isabelle Petit'),
('Alain Roux'),
('Nathalie Simon');

-- Sessions de test (quelques sessions fermées pour l'historique)
INSERT INTO sessions (id_table, id_client, statut_session, date_ouverture, date_fermeture) VALUES
(1, 1, 'FERMÉE', '2024-01-15 12:00:00', '2024-01-15 14:30:00'),
(2, 2, 'FERMÉE', '2024-01-15 13:15:00', '2024-01-15 15:00:00'),
(3, 3, 'OUVERTE', '2024-01-15 18:00:00', NULL);

-- Commandes de test
INSERT INTO commandes (id_session, statut_commande, date_commande) VALUES
(1, 'SERVI', '2024-01-15 12:15:00'),
(2, 'SERVI', '2024-01-15 13:30:00'),
(3, 'EN_ATTENTE', '2024-01-15 18:10:00');

-- Détails des commandes
INSERT INTO commande_produits (id_commande, id_produit, quantite, prix_unitaire) VALUES
-- Commande 1 (Table 1, fermée)
(1, 1, 2, 2500), -- 2 Salades César
(1, 5, 1, 4500), -- 1 Poulet rôti
(1, 15, 2, 800), -- 2 Coca-Cola

-- Commande 2 (Table 2, fermée)
(2, 2, 1, 1800), -- 1 Soupe de légumes
(2, 6, 1, 3800), -- 1 Poisson grillé
(2, 16, 1, 1200), -- 1 Jus d'orange

-- Commande 3 (Table 3, en attente)
(3, 3, 1, 2000), -- 1 Bruschetta
(3, 7, 2, 3200), -- 2 Pâtes carbonara
(3, 17, 1, 600); -- 1 Eau minérale

-- Paiements de test
INSERT INTO paiements (id_commande, methode_paiement, montant_total, statut_paiement, code_validation) VALUES
(1, 'CARTE', 10100, 'EFFECTUÉ', 'ABC12345'),
(2, 'ESPECES', 6800, 'EFFECTUÉ', 'DEF67890'),
(3, 'MOBILE_MONEY', 9000, 'EN_COURS', 'GHI23456');

-- Vues utiles pour les rapports

-- Vue des commandes avec détails
CREATE VIEW vue_commandes_detaillees AS
SELECT 
  c.id_commande,
  c.statut_commande,
  c.date_commande,
  s.id_session,
  s.id_table,
  t.nom_table,
  s.id_client,
  cl.nom_complet,
  SUM(cp.quantite * cp.prix_unitaire) as total_commande
FROM commandes c
JOIN sessions s ON c.id_session = s.id_session
JOIN tables t ON s.id_table = t.id_table
JOIN clients cl ON s.id_client = cl.id_client
LEFT JOIN commande_produits cp ON c.id_commande = cp.id_commande
GROUP BY c.id_commande, c.statut_commande, c.date_commande, s.id_session, s.id_table, t.nom_table, s.id_client, cl.nom_complet;

-- Vue des ventes par jour
CREATE VIEW vue_ventes_journalieres AS
SELECT 
  DATE(p.date_paiement) as date_vente,
  COUNT(*) as nombre_paiements,
  SUM(p.montant_total) as total_ventes,
  p.methode_paiement,
  COUNT(CASE WHEN p.statut_paiement = 'EFFECTUÉ' THEN 1 END) as paiements_effectues,
  SUM(CASE WHEN p.statut_paiement = 'EFFECTUÉ' THEN p.montant_total ELSE 0 END) as montant_effectue
FROM paiements p
GROUP BY DATE(p.date_paiement), p.methode_paiement;

-- Vue des produits les plus vendus
CREATE VIEW vue_produits_populaires AS
SELECT 
  p.id_produit,
  p.nom_produit,
  p.prix_cfa,
  SUM(cp.quantite) as quantite_vendue,
  SUM(cp.quantite * cp.prix_unitaire) as chiffre_affaires
FROM produits p
JOIN commande_produits cp ON p.id_produit = cp.id_produit
JOIN commandes c ON cp.id_commande = c.id_commande
WHERE c.statut_commande IN ('ENVOYÉ', 'SERVI')
GROUP BY p.id_produit, p.nom_produit, p.prix_cfa
ORDER BY quantite_vendue DESC;

-- Procédures stockées utiles

-- Procédure pour fermer une session et ses commandes
DELIMITER //
CREATE PROCEDURE FermerSession(IN session_id BIGINT)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Fermer la session
  UPDATE sessions 
  SET statut_session = 'FERMÉE', date_fermeture = NOW() 
  WHERE id_session = session_id;
  
  -- Marquer les commandes en attente comme annulées
  UPDATE commandes 
  SET statut_commande = 'ANNULÉ' 
  WHERE id_session = session_id AND statut_commande = 'EN_ATTENTE';
  
  COMMIT;
END //
DELIMITER ;

-- Procédure pour mettre à jour le stock après une commande
DELIMITER //
CREATE PROCEDURE MettreAJourStock(IN commande_id BIGINT)
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE prod_id BIGINT;
  DECLARE qte INT;
  DECLARE cur CURSOR FOR 
    SELECT id_produit, quantite 
    FROM commande_produits 
    WHERE id_commande = commande_id;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  
  OPEN cur;
  
  read_loop: LOOP
    FETCH cur INTO prod_id, qte;
    IF done THEN
      LEAVE read_loop;
    END IF;
    
    UPDATE produits 
    SET stock_disponible = stock_disponible - qte 
    WHERE id_produit = prod_id;
  END LOOP;
  
  CLOSE cur;
END //
DELIMITER ;

-- Triggers pour automatiser certaines tâches

-- Trigger pour mettre à jour le stock quand une commande est envoyée
DELIMITER //
CREATE TRIGGER tr_commande_envoyee
AFTER UPDATE ON commandes
FOR EACH ROW
BEGIN
  IF NEW.statut_commande = 'ENVOYÉ' AND OLD.statut_commande != 'ENVOYÉ' THEN
    CALL MettreAJourStock(NEW.id_commande);
  END IF;
END //
DELIMITER ;

-- Trigger pour générer automatiquement un code de validation pour les paiements
DELIMITER //
CREATE TRIGGER tr_generer_code_validation
BEFORE INSERT ON paiements
FOR EACH ROW
BEGIN
  IF NEW.code_validation IS NULL THEN
    SET NEW.code_validation = UPPER(SUBSTRING(MD5(CONCAT(NEW.id_commande, NOW())), 1, 8));
  END IF;
END //
DELIMITER ;

-- Affichage des informations de la base de données
SELECT 'Base de données initialisée avec succès!' as message;
SELECT COUNT(*) as nombre_tables FROM tables;
SELECT COUNT(*) as nombre_produits FROM produits;
SELECT COUNT(*) as nombre_clients FROM clients;
