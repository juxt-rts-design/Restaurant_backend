-- Données de test simples pour l'API
USE restauration;

-- Insérer une table de test
INSERT IGNORE INTO tables (nom_table, capacite, qr_code, active) VALUES
('Table Test', 4, 'TBL001LIBREVILLE123456789', 1);

-- Insérer quelques produits de test
INSERT IGNORE INTO produits (nom_produit, description, prix_cfa, stock_disponible, actif) VALUES
('Poulet Braisé', 'Poulet grillé aux épices locales', 2500, 10, 1),
('Poisson Grillé', 'Poisson frais grillé aux légumes', 3000, 8, 1),
('Riz Jollof', 'Riz parfumé aux épices et aux légumes', 1500, 15, 1);

-- Vérifier les données
SELECT 'Tables:' as type, COUNT(*) as count FROM tables;
SELECT 'Produits:' as type, COUNT(*) as count FROM produits;
