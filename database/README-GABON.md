# 🇬🇦 Données Gabonaises pour la Restauration Interactive

## 📋 Description

Ce dossier contient tous les scripts SQL pour peupler votre base de données avec des données typiques du Gabon, incluant des plats traditionnels, des noms de clients, des promotions locales et des spécialités régionales.

## 🗂️ Fichiers disponibles

### Scripts principaux
- **`gabon-data.sql`** - Données de base (tables, clients, plats principaux)
- **`gabon-specialties.sql`** - Spécialités régionales et plats de fête
- **`gabon-promotions.sql`** - Promotions et menus spéciaux
- **`test-gabon-data.sql`** - Script de test et vérification
- **`install-gabon-data.sql`** - Script principal d'installation

## 🚀 Installation rapide

### Option 1 : Installation complète
```bash
# Exécuter le script principal
mysql -u root -p restauration < database/install-gabon-data.sql
```

### Option 2 : Installation étape par étape
```bash
# 1. Données de base
mysql -u root -p restauration < database/gabon-data.sql

# 2. Spécialités régionales
mysql -u root -p restauration < database/gabon-specialties.sql

# 3. Promotions et menus
mysql -u root -p restauration < database/gabon-promotions.sql

# 4. Test des données
mysql -u root -p restauration < database/test-gabon-data.sql
```

## 🍽️ Données incluses

### Tables du restaurant (10 tables)
- Table Libreville (4 places)
- Table Port-Gentil (6 places)
- Table Franceville (2 places)
- Table Oyem (4 places)
- Table Moanda (8 places)
- Table Lambarene (2 places)
- Table Koulamoutou (4 places)
- Table Tchibanga (6 places)
- Table Makokou (4 places)
- Table Bitam (2 places)

### Plats traditionnels gabonais (50+ plats)

#### Plats principaux
- **Poulet Nyembwe** - Poulet mijoté dans la sauce de noix de palme
- **Poisson Braisé** - Poisson frais braisé aux épices gabonaises
- **Sauce Gombo** - Sauce de gombo avec viande ou poisson
- **Poulet DG** - Poulet sauté aux légumes et plantain
- **Poisson à la Tomate** - Poisson cuit à la tomate et aux oignons
- **Sauce Arachide** - Sauce d'arachide avec viande
- **Poulet aux Épinards** - Poulet mijoté aux épinards locaux
- **Poisson Fumé** - Poisson fumé traditionnel

#### Spécialités régionales
- **Poulet Libreville** - Spécialité de la capitale
- **Poisson Capitale** - Style Libreville
- **Poulet Pétrolier** - Spécialité de Port-Gentil
- **Poisson du Port** - Spécialité côtière
- **Poulet de l'Est** - Spécialité de Franceville/Moanda
- **Poulet du Nord** - Spécialité d'Oyem/Bitam

#### Plats de fête
- **Poulet de Fête** - Poulet entier rôti aux épices
- **Poisson Royal** - Gros poisson braisé entier
- **Riz Parfumé aux Épices** - Riz cuit avec épices locales

#### Accompagnements
- **Riz Blanc** - Riz parfumé cuit à la vapeur
- **Plantain Mûr** - Plantain mûr cuit à la vapeur
- **Plantain Vert** - Plantain vert frit ou bouilli
- **Frites de Plantain** - Plantain coupé en frites

#### Boissons traditionnelles
- **Jus de Bissap** - Hibiscus rouge traditionnel
- **Jus de Gingembre** - Jus de gingembre frais
- **Jus de Tamarin** - Jus de tamarin acidulé
- **Jus de Mangue** - Jus de mangue fraîche
- **Jus de Kola** - Jus de noix de kola énergisant
- **Jus de Baobab** - Jus de fruit de baobab

#### Boissons chaudes
- **Café Gabonais** - Café robusta du Gabon
- **Thé aux Herbes** - Thé aux herbes médicinales
- **Chocolat Artisanal** - Chocolat chaud artisanal

### Clients gabonais (30+ clients)
Noms typiques avec prénoms et noms de famille gabonais :
- MBOUMBA Jean-Baptiste
- NDONG Mireille
- OBAME Pierre
- MASSANGA Marie-Claire
- BOUKAMBA Daniel
- MABIKA Grace
- NTOUTOUME Paul
- MOUKAGNI Sylvie
- BIGANDA Joseph
- MBOUMBA-LONDO Patricia
- Et bien d'autres...

### Menus spéciaux
- **Menu Libreville** - Poulet Nyembwe + Riz + Jus de Bissap + Dessert
- **Menu Port-Gentil** - Poisson Braisé + Plantain + Jus de Gingembre + Dessert
- **Menu Franceville** - Sauce Gombo + Riz + Jus de Tamarin + Dessert
- **Menu Famille** - 2 Poulets + 2 Riz + 2 Plantains + 4 Boissons
- **Menu Étudiant** - Plat simple + Riz + Boisson
- **Menu Travailleur** - Plat principal + Riz + Boisson + Dessert

### Plats du jour
- **Lundi** - Poulet aux légumes + Riz
- **Mardi** - Poisson aux tomates + Riz
- **Mercredi** - Sauce arachide + Riz
- **Jeudi** - Poulet DG + Plantain
- **Vendredi** - Poisson fumé + Riz
- **Samedi** - Poulet de fête + Riz
- **Dimanche** - Poisson royal + Plantain

### Promotions typiques
- **Fête de l'Indépendance** - 15% de réduction
- **Jour de l'An** - 20% de réduction
- **Noël** - 25% de réduction
- **Mercredi Poulet** - 500 FCFA de réduction
- **Vendredi Poisson** - 400 FCFA de réduction
- **Dimanche Famille** - 12% de réduction
- **Déjeuner Express** - 1000 FCFA de réduction
- **Premier Client** - 10% de réduction
- **Anniversaire** - 15% de réduction

## 💰 Prix en FCFA

Les prix sont adaptés à l'économie gabonaise :
- **Plats de base** : 2 000 - 4 500 FCFA
- **Plats de fête** : 6 000 - 8 000 FCFA
- **Boissons** : 600 - 2 000 FCFA
- **Menus complets** : 6 000 - 18 000 FCFA
- **Plats du jour** : 2 800 - 4 200 FCFA

## 🧪 Test des données

Après installation, exécutez le script de test :
```bash
mysql -u root -p restauration < database/test-gabon-data.sql
```

Ce script affichera :
- Statistiques générales
- Plats les plus populaires
- Méthodes de paiement utilisées
- Clients les plus actifs
- Tables les plus utilisées
- Statistiques par jour
- Plats par catégorie
- Promotions actives

## 📊 Exemples de requêtes

### Plats les plus chers
```sql
SELECT nom_produit, prix_cfa 
FROM produits 
WHERE actif = 1 
ORDER BY prix_cfa DESC 
LIMIT 10;
```

### Boissons traditionnelles
```sql
SELECT nom_produit, prix_cfa 
FROM produits 
WHERE nom_produit LIKE '%Bissap%' 
   OR nom_produit LIKE '%Gingembre%' 
   OR nom_produit LIKE '%Tamarin%'
ORDER BY prix_cfa;
```

### Sessions actives
```sql
SELECT t.nom_table, c.nom_complet, s.date_ouverture
FROM sessions s
JOIN tables t ON s.id_table = t.id_table
JOIN clients c ON s.id_client = c.id_client
WHERE s.statut_session = 'OUVERTE';
```

## 🔄 Mise à jour des données

Pour ajouter de nouveaux plats ou clients :
1. Modifier le fichier `gabon-data.sql`
2. Réexécuter le script
3. Tester avec `test-gabon-data.sql`

## 🎯 Utilisation avec l'API

Une fois les données installées, vous pouvez :
1. Tester les QR codes avec les tables créées
2. Utiliser la collection Postman avec les données gabonaises
3. Voir les plats traditionnels dans le menu
4. Tester les promotions et menus spéciaux

## 📱 QR Codes disponibles

- `TBL001LIBREVILLE123456789` - Table Libreville
- `TBL002PORTGENTIL123456789` - Table Port-Gentil
- `TBL003FRANCEVILLE123456789` - Table Franceville
- `TBL004OYEM123456789012345` - Table Oyem
- `TBL005MOANDA123456789012345` - Table Moanda
- Et 5 autres tables...

## 🎉 Résultat final

Après installation, vous aurez :
- ✅ 10 tables avec QR codes
- ✅ 50+ plats traditionnels gabonais
- ✅ 30+ clients avec noms typiques
- ✅ 15+ sessions de test
- ✅ 20+ commandes d'exemple
- ✅ 15+ paiements de test
- ✅ 10+ promotions actives
- ✅ 7 menus complets
- ✅ 7 plats du jour

Votre API de restauration interactive est maintenant prête avec des données authentiques du Gabon ! 🇬🇦
