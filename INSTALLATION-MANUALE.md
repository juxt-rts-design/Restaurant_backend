# 📋 Installation Manuelle des Données Gabonaises

## 🚨 Problème avec PowerShell

Si vous rencontrez l'erreur `L'opérateur « < » est réservé à une utilisation future` dans PowerShell, voici plusieurs solutions :

## 🔧 Solutions

### Solution 1 : Scripts Automatiques (Recommandé)

#### Option A : Script PowerShell
```powershell
# Exécuter le script PowerShell
.\install-gabon-data.ps1
```

#### Option B : Script Batch
```cmd
# Exécuter le script batch
install-gabon-data.bat
```

### Solution 2 : Installation Manuelle

#### Étape 1 : Ouvrir phpMyAdmin ou MySQL Workbench

1. **Avec XAMPP/WAMP :**
   - Démarrer XAMPP/WAMP
   - Aller sur http://localhost/phpmyadmin
   - Sélectionner la base de données `restauration`

2. **Avec MySQL Workbench :**
   - Ouvrir MySQL Workbench
   - Se connecter à votre serveur MySQL
   - Ouvrir la base de données `restauration`

#### Étape 2 : Exécuter les scripts dans l'ordre

1. **Créer la base de données (si elle n'existe pas) :**
```sql
CREATE DATABASE IF NOT EXISTS restauration
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE restauration;
```

2. **Exécuter le script de base :**
   - Ouvrir le fichier `database/gabon-data.sql`
   - Copier tout le contenu
   - Coller dans l'éditeur SQL
   - Cliquer sur "Exécuter"

3. **Exécuter les spécialités :**
   - Ouvrir le fichier `database/gabon-specialties.sql`
   - Copier tout le contenu
   - Coller dans l'éditeur SQL
   - Cliquer sur "Exécuter"

4. **Exécuter les promotions :**
   - Ouvrir le fichier `database/gabon-promotions.sql`
   - Copier tout le contenu
   - Coller dans l'éditeur SQL
   - Cliquer sur "Exécuter"

5. **Tester les données :**
   - Ouvrir le fichier `database/test-gabon-data.sql`
   - Copier tout le contenu
   - Coller dans l'éditeur SQL
   - Cliquer sur "Exécuter"

### Solution 3 : Commandes PowerShell Correctes

Si vous voulez utiliser PowerShell directement :

```powershell
# Méthode 1 : Avec Get-Content
Get-Content database/gabon-data.sql | mysql -u root -p restauration

# Méthode 2 : Avec cmd
cmd /c "mysql -u root -p restauration < database/gabon-data.sql"

# Méthode 3 : Avec Start-Process
Start-Process -FilePath "mysql" -ArgumentList "-u", "root", "-p", "restauration" -RedirectStandardInput "database/gabon-data.sql" -Wait
```

### Solution 4 : Utiliser Git Bash

Si vous avez Git installé, utilisez Git Bash :

```bash
# Dans Git Bash
mysql -u root -p restauration < database/gabon-data.sql
mysql -u root -p restauration < database/gabon-specialties.sql
mysql -u root -p restauration < database/gabon-promotions.sql
mysql -u root -p restauration < database/test-gabon-data.sql
```

## 📊 Vérification de l'Installation

Après installation, vérifiez que les données sont bien présentes :

```sql
-- Vérifier les tables
SELECT COUNT(*) as nombre_tables FROM tables;

-- Vérifier les produits
SELECT COUNT(*) as nombre_produits FROM produits;

-- Vérifier les clients
SELECT COUNT(*) as nombre_clients FROM clients;

-- Vérifier les sessions
SELECT COUNT(*) as nombre_sessions FROM sessions;

-- Vérifier les commandes
SELECT COUNT(*) as nombre_commandes FROM commandes;

-- Vérifier les paiements
SELECT COUNT(*) as nombre_paiements FROM paiements;
```

## 🎯 Données Installées

Après installation réussie, vous devriez avoir :

- ✅ **10 tables** avec QR codes gabonais
- ✅ **50+ plats** traditionnels du Gabon
- ✅ **30+ clients** avec noms typiques
- ✅ **15+ sessions** de test
- ✅ **20+ commandes** d'exemple
- ✅ **15+ paiements** de test
- ✅ **10+ promotions** actives
- ✅ **7 menus** complets
- ✅ **7 plats** du jour

## 🚀 Test de l'API

Une fois les données installées :

1. **Démarrer le serveur :**
```bash
npm run dev
```

2. **Tester un QR code :**
```
http://localhost:3000/table/TBL001LIBREVILLE123456789
```

3. **Utiliser la collection Postman :**
   - Importer `postman-collection.json`
   - Tester les endpoints

## 🐛 Dépannage

### Erreur : "Base de données n'existe pas"
```sql
CREATE DATABASE restauration
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### Erreur : "Table n'existe pas"
Exécutez d'abord le script `database/init.sql` pour créer les tables.

### Erreur : "Accès refusé"
Vérifiez vos identifiants MySQL et permissions.

### Erreur : "Caractères non supportés"
Assurez-vous que votre base de données utilise l'encodage UTF-8.

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez que MySQL est installé et démarré
2. Vérifiez que la base de données `restauration` existe
3. Vérifiez vos permissions MySQL
4. Utilisez phpMyAdmin ou MySQL Workbench pour l'installation manuelle

---

**💡 Conseil :** L'installation manuelle via phpMyAdmin est la méthode la plus fiable sur Windows !
