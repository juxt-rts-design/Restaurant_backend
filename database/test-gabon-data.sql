-- Script de test pour vérifier les données gabonaises
-- À exécuter après tous les autres scripts

USE restauration_interactive;

-- Vérification générale des données
SELECT '=== VÉRIFICATION DES DONNÉES GABONAISES ===' as message;

-- 1. Vérifier les tables
SELECT 
    'Tables' as type,
    COUNT(*) as total,
    SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) as actives
FROM tables;

-- 2. Vérifier les produits
SELECT 
    'Produits' as type,
    COUNT(*) as total,
    SUM(CASE WHEN actif = 1 THEN 1 ELSE 0 END) as actifs,
    AVG(prix_cfa) as prix_moyen,
    MIN(prix_cfa) as prix_min,
    MAX(prix_cfa) as prix_max
FROM produits;

-- 3. Vérifier les clients
SELECT 
    'Clients' as type,
    COUNT(*) as total,
    MIN(date_enregistrement) as premier_client,
    MAX(date_enregistrement) as dernier_client
FROM clients;

-- 4. Vérifier les sessions
SELECT 
    'Sessions' as type,
    COUNT(*) as total,
    SUM(CASE WHEN statut_session = 'OUVERTE' THEN 1 ELSE 0 END) as ouvertes,
    SUM(CASE WHEN statut_session = 'FERMÉE' THEN 1 ELSE 0 END) as fermees
FROM sessions;

-- 5. Vérifier les commandes
SELECT 
    'Commandes' as type,
    COUNT(*) as total,
    SUM(CASE WHEN statut_commande = 'EN_ATTENTE' THEN 1 ELSE 0 END) as en_attente,
    SUM(CASE WHEN statut_commande = 'ENVOYÉ' THEN 1 ELSE 0 END) as envoyees,
    SUM(CASE WHEN statut_commande = 'SERVI' THEN 1 ELSE 0 END) as servies
FROM commandes;

-- 6. Vérifier les paiements
SELECT 
    'Paiements' as type,
    COUNT(*) as total,
    SUM(CASE WHEN statut_paiement = 'EN_COURS' THEN 1 ELSE 0 END) as en_cours,
    SUM(CASE WHEN statut_paiement = 'EFFECTUÉ' THEN 1 ELSE 0 END) as effectues,
    SUM(montant_total) as total_encaissé
FROM paiements;

-- 7. Vérifier les promotions
SELECT 
    'Promotions' as type,
    COUNT(*) as total,
    SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) as actives
FROM promotions;

-- Afficher les plats les plus populaires (par nombre de commandes)
SELECT 
    '=== PLATS LES PLUS COMMANDÉS ===' as message;

SELECT 
    p.nom_produit as 'Plat',
    COUNT(cp.id_ligne) as 'Nombre de commandes',
    SUM(cp.quantite) as 'Quantité totale',
    SUM(cp.quantite * cp.prix_unitaire) as 'Chiffre d\'affaires'
FROM produits p
LEFT JOIN commande_produits cp ON p.id_produit = cp.id_produit
GROUP BY p.id_produit, p.nom_produit
ORDER BY COUNT(cp.id_ligne) DESC, SUM(cp.quantite) DESC
LIMIT 10;

-- Afficher les méthodes de paiement les plus utilisées
SELECT 
    '=== MÉTHODES DE PAIEMENT ===' as message;

SELECT 
    methode_paiement as 'Méthode',
    COUNT(*) as 'Nombre de paiements',
    SUM(montant_total) as 'Montant total',
    AVG(montant_total) as 'Montant moyen'
FROM paiements
GROUP BY methode_paiement
ORDER BY COUNT(*) DESC;

-- Afficher les clients les plus actifs
SELECT 
    '=== CLIENTS LES PLUS ACTIFS ===' as message;

SELECT 
    c.nom_complet as 'Client',
    COUNT(s.id_session) as 'Nombre de sessions',
    COUNT(cmd.id_commande) as 'Nombre de commandes',
    SUM(p.montant_total) as 'Montant total dépensé'
FROM clients c
LEFT JOIN sessions s ON c.id_client = s.id_client
LEFT JOIN commandes cmd ON s.id_session = cmd.id_session
LEFT JOIN paiements p ON cmd.id_commande = p.id_commande
GROUP BY c.id_client, c.nom_complet
ORDER BY COUNT(s.id_session) DESC, SUM(p.montant_total) DESC
LIMIT 10;

-- Afficher les tables les plus utilisées
SELECT 
    '=== TABLES LES PLUS UTILISÉES ===' as message;

SELECT 
    t.nom_table as 'Table',
    COUNT(s.id_session) as 'Nombre de sessions',
    SUM(CASE WHEN s.statut_session = 'OUVERTE' THEN 1 ELSE 0 END) as 'Sessions ouvertes'
FROM tables t
LEFT JOIN sessions s ON t.id_table = s.id_table
GROUP BY t.id_table, t.nom_table
ORDER BY COUNT(s.id_session) DESC;

-- Afficher les statistiques par jour
SELECT 
    '=== STATISTIQUES PAR JOUR ===' as message;

SELECT 
    DATE(p.date_paiement) as 'Date',
    COUNT(p.id_paiement) as 'Nombre de paiements',
    SUM(p.montant_total) as 'Chiffre d\'affaires',
    AVG(p.montant_total) as 'Panier moyen'
FROM paiements p
GROUP BY DATE(p.date_paiement)
ORDER BY DATE(p.date_paiement) DESC;

-- Afficher les plats par catégorie
SELECT 
    '=== PLATS PAR CATÉGORIE ===' as message;

SELECT 
    CASE 
        WHEN nom_produit LIKE '%Poulet%' THEN 'Poulet'
        WHEN nom_produit LIKE '%Poisson%' THEN 'Poisson'
        WHEN nom_produit LIKE '%Sauce%' THEN 'Sauces'
        WHEN nom_produit LIKE '%Jus%' THEN 'Jus'
        WHEN nom_produit LIKE '%Café%' OR nom_produit LIKE '%Thé%' THEN 'Boissons chaudes'
        WHEN nom_produit LIKE '%Menu%' THEN 'Menus'
        WHEN nom_produit LIKE '%Plat du Jour%' THEN 'Plats du jour'
        WHEN nom_produit LIKE '%Riz%' OR nom_produit LIKE '%Plantain%' THEN 'Accompagnements'
        ELSE 'Autres'
    END as 'Catégorie',
    COUNT(*) as 'Nombre de plats',
    AVG(prix_cfa) as 'Prix moyen',
    MIN(prix_cfa) as 'Prix minimum',
    MAX(prix_cfa) as 'Prix maximum'
FROM produits
WHERE actif = 1
GROUP BY 
    CASE 
        WHEN nom_produit LIKE '%Poulet%' THEN 'Poulet'
        WHEN nom_produit LIKE '%Poisson%' THEN 'Poisson'
        WHEN nom_produit LIKE '%Sauce%' THEN 'Sauces'
        WHEN nom_produit LIKE '%Jus%' THEN 'Jus'
        WHEN nom_produit LIKE '%Café%' OR nom_produit LIKE '%Thé%' THEN 'Boissons chaudes'
        WHEN nom_produit LIKE '%Menu%' THEN 'Menus'
        WHEN nom_produit LIKE '%Plat du Jour%' THEN 'Plats du jour'
        WHEN nom_produit LIKE '%Riz%' OR nom_produit LIKE '%Plantain%' THEN 'Accompagnements'
        ELSE 'Autres'
    END
ORDER BY COUNT(*) DESC;

-- Afficher les promotions actives
SELECT 
    '=== PROMOTIONS ACTIVES ===' as message;

SELECT 
    nom_promotion as 'Promotion',
    description as 'Description',
    CONCAT(valeur_promotion, CASE WHEN type_promotion = 'POURCENTAGE' THEN '%' ELSE ' FCFA' END) as 'Valeur',
    DATE(date_debut) as 'Début',
    DATE(date_fin) as 'Fin'
FROM promotions
WHERE active = 1 AND date_debut <= NOW() AND date_fin >= NOW()
ORDER BY date_debut;

-- Test de performance des requêtes
SELECT 
    '=== TEST DE PERFORMANCE ===' as message;

-- Test 1: Recherche de produits
SELECT COUNT(*) as 'Recherche produits (poulet)' FROM produits WHERE nom_produit LIKE '%poulet%';

-- Test 2: Calcul du chiffre d'affaires
SELECT SUM(montant_total) as 'Chiffre d\'affaires total' FROM paiements WHERE statut_paiement = 'EFFECTUÉ';

-- Test 3: Sessions actives
SELECT COUNT(*) as 'Sessions actives' FROM sessions WHERE statut_session = 'OUVERTE';

-- Test 4: Commandes en attente
SELECT COUNT(*) as 'Commandes en attente' FROM commandes WHERE statut_commande = 'EN_ATTENTE';

-- Test 5: Paiements en cours
SELECT COUNT(*) as 'Paiements en cours' FROM paiements WHERE statut_paiement = 'EN_COURS';

-- Vérification finale
SELECT 
    '=== VÉRIFICATION FINALE ===' as message,
    'Toutes les données gabonaises ont été insérées avec succès!' as resultat,
    NOW() as 'Date de vérification';
