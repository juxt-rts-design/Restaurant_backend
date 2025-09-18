-- Script principal pour installer toutes les données gabonaises
-- Exécuter ce script pour avoir une base de données complète avec des données typiques du Gabon

-- Avertissement
SELECT '=== INSTALLATION DES DONNÉES GABONAISES ===' as message;
SELECT 'Ce script va installer toutes les données typiques du Gabon' as info;
SELECT 'Temps estimé: 2-3 minutes' as duree;

-- 1. Installer les données de base
SOURCE gabon-data.sql;

-- 2. Installer les spécialités régionales
SOURCE gabon-specialties.sql;

-- 3. Installer les promotions et menus
SOURCE gabon-promotions.sql;

-- 4. Tester les données
SOURCE test-gabon-data.sql;

-- Message de fin
SELECT '=== INSTALLATION TERMINÉE ===' as message;
SELECT 'Votre base de données est maintenant prête avec des données typiques du Gabon!' as resultat;
SELECT 'Vous pouvez maintenant tester votre API de restauration interactive.' as prochaine_etape;
