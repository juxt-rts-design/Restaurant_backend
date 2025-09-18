-- Script de vérification rapide des données gabonaises
-- Exécuter ce script pour vérifier que les données ont été insérées

USE restauration;

-- Vérification générale
SELECT '=== VÉRIFICATION DES DONNÉES GABONAISES ===' as message;

-- 1. Compter les tables
SELECT 
    'Tables' as type,
    COUNT(*) as nombre,
    'Tables du restaurant' as description
FROM tables;

-- 2. Compter les produits
SELECT 
    'Produits' as type,
    COUNT(*) as nombre,
    'Plats gabonais' as description
FROM produits;

-- 3. Compter les clients
SELECT 
    'Clients' as type,
    COUNT(*) as nombre,
    'Clients gabonais' as description
FROM clients;

-- 4. Compter les sessions
SELECT 
    'Sessions' as type,
    COUNT(*) as nombre,
    'Sessions de commande' as description
FROM sessions;

-- 5. Compter les commandes
SELECT 
    'Commandes' as type,
    COUNT(*) as nombre,
    'Commandes de test' as description
FROM commandes;

-- 6. Compter les paiements
SELECT 
    'Paiements' as type,
    COUNT(*) as nombre,
    'Paiements de test' as description
FROM paiements;

-- Afficher quelques plats gabonais
SELECT '=== QUELQUES PLATS GABONAIS ===' as message;

SELECT 
    nom_produit as 'Plat',
    CONCAT(prix_cfa, ' FCFA') as 'Prix',
    stock_disponible as 'Stock'
FROM produits 
WHERE actif = 1 
ORDER BY prix_cfa DESC 
LIMIT 5;

-- Afficher quelques clients
SELECT '=== QUELQUES CLIENTS ===' as message;

SELECT 
    nom_complet as 'Client',
    DATE_FORMAT(date_enregistrement, '%d/%m/%Y %H:%i') as 'Date d\'inscription'
FROM clients 
ORDER BY date_enregistrement DESC 
LIMIT 5;

-- Afficher les tables
SELECT '=== TABLES DU RESTAURANT ===' as message;

SELECT 
    nom_table as 'Table',
    capacite as 'Capacité',
    qr_code as 'QR Code',
    CASE WHEN active = 1 THEN 'Active' ELSE 'Inactive' END as 'Statut'
FROM tables 
ORDER BY nom_table;

-- Vérifier les sessions actives
SELECT '=== SESSIONS ACTIVES ===' as message;

SELECT 
    s.id_session as 'ID Session',
    c.nom_complet as 'Client',
    t.nom_table as 'Table',
    s.statut_session as 'Statut',
    DATE_FORMAT(s.date_ouverture, '%d/%m/%Y %H:%i') as 'Ouverte le'
FROM sessions s
JOIN clients c ON s.id_client = c.id_client
JOIN tables t ON s.id_table = t.id_table
WHERE s.statut_session = 'OUVERTE'
ORDER BY s.date_ouverture DESC;

-- Vérifier les commandes en attente
SELECT '=== COMMANDES EN ATTENTE ===' as message;

SELECT 
    c.id_commande as 'ID Commande',
    cl.nom_complet as 'Client',
    t.nom_table as 'Table',
    c.statut_commande as 'Statut',
    DATE_FORMAT(c.date_commande, '%d/%m/%Y %H:%i') as 'Commandée le'
FROM commandes c
JOIN sessions s ON c.id_session = s.id_session
JOIN clients cl ON s.id_client = cl.id_client
JOIN tables t ON s.id_table = t.id_table
WHERE c.statut_commande = 'EN_ATTENTE'
ORDER BY c.date_commande DESC;

-- Vérifier les paiements en cours
SELECT '=== PAIEMENTS EN COURS ===' as message;

SELECT 
    p.id_paiement as 'ID Paiement',
    cl.nom_complet as 'Client',
    t.nom_table as 'Table',
    p.methode_paiement as 'Méthode',
    CONCAT(p.montant_total, ' FCFA') as 'Montant',
    p.code_validation as 'Code',
    p.statut_paiement as 'Statut'
FROM paiements p
JOIN commandes c ON p.id_commande = c.id_commande
JOIN sessions s ON c.id_session = s.id_session
JOIN clients cl ON s.id_client = cl.id_client
JOIN tables t ON s.id_table = t.id_table
WHERE p.statut_paiement = 'EN_COURS'
ORDER BY p.date_paiement DESC;

-- Test de connexion à l'API
SELECT '=== INSTRUCTIONS POUR TESTER L\'API ===' as message;

SELECT 
    '1. Démarrer le serveur' as etape,
    'npm run dev' as commande
UNION ALL
SELECT 
    '2. Tester un QR code' as etape,
    'http://localhost:3000/table/TBL001LIBREVILLE123456789' as commande
UNION ALL
SELECT 
    '3. Récupérer le menu' as etape,
    'http://localhost:3000/api/client/menu' as commande
UNION ALL
SELECT 
    '4. État du serveur' as etape,
    'http://localhost:3000/health' as commande;

-- Message final
SELECT '=== VÉRIFICATION TERMINÉE ===' as message;
SELECT 'Si vous voyez des données ci-dessus, l\'installation a réussi !' as resultat;
