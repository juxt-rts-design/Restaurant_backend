# 🧪 Guide de Test Rapide

## 🚀 Démarrage Express

### 1. Installation et configuration
```bash
# Installer les dépendances
npm install

# Copier le fichier de configuration
cp env.example .env

# Modifier .env selon votre configuration MySQL
# DB_PASSWORD=votre_mot_de_passe_mysql

# Initialiser la base de données
mysql -u root -p < database/init.sql
```

### 2. Démarrer le serveur
```bash
# Mode développement
npm run dev

# Ou mode production
npm start
```

## 📋 Tests Postman

### Import de la collection
1. Ouvrir Postman
2. Cliquer sur "Import"
3. Sélectionner le fichier `postman-collection.json`
4. Cliquer sur "Import"

### Configuration des variables
Dans Postman, aller dans la collection "Restauration Interactive API" → Variables :
- `baseUrl` = `http://localhost:3000`
- `qrCode` = `TBL001ABC123DEF456789`
- `sessionId` = (vide, sera rempli automatiquement)
- `jwtToken` = (vide, pour les tests authentifiés)

## 🎯 Tests Essentiels

### Test 1 : Vérification du serveur
```
GET {{baseUrl}}/health
```
**Résultat attendu :** Status 200, message "Serveur opérationnel"

### Test 2 : Scanner QR Code
```
GET {{baseUrl}}/table/{{qrCode}}
```
**Résultat attendu :** Page HTML avec interface de commande

### Test 3 : Créer une session
```
POST {{baseUrl}}/api/client/table/{{qrCode}}/session
Body: {"nomComplet": "Test Client"}
```
**Résultat attendu :** Status 201, session créée avec ID

### Test 4 : Récupérer le menu
```
GET {{baseUrl}}/api/client/menu
```
**Résultat attendu :** Status 200, liste des produits

### Test 5 : Ajouter au panier
```
POST {{baseUrl}}/api/client/session/{{sessionId}}/cart
Body: {"idProduit": 1, "quantite": 2}
```
**Résultat attendu :** Status 200, produit ajouté au panier

### Test 6 : Valider la commande
```
POST {{baseUrl}}/api/client/session/{{sessionId}}/order/validate
```
**Résultat attendu :** Status 200, commande validée

### Test 7 : Créer un paiement
```
POST {{baseUrl}}/api/client/session/{{sessionId}}/payment
Body: {"methodePaiement": "CARTE"}
```
**Résultat attendu :** Status 201, paiement créé avec code de validation

## 🔍 Vérifications Base de Données

### Vérifier les données insérées
```sql
-- Vérifier les tables
SELECT * FROM tables;

-- Vérifier les produits
SELECT * FROM produits;

-- Vérifier les sessions
SELECT * FROM sessions;

-- Vérifier les commandes
SELECT * FROM commandes;

-- Vérifier les paiements
SELECT * FROM paiements;
```

## 🐛 Dépannage Rapide

### Erreur : "Cannot connect to database"
```bash
# Vérifier que MySQL est démarré
sudo systemctl status mysql

# Redémarrer MySQL si nécessaire
sudo systemctl restart mysql

# Vérifier la configuration dans .env
cat .env
```

### Erreur : "Port 3000 already in use"
```bash
# Trouver le processus utilisant le port
lsof -i :3000

# Tuer le processus
kill -9 $(lsof -t -i:3000)

# Ou utiliser un autre port
PORT=3001 npm run dev
```

### Erreur : "Table doesn't exist"
```bash
# Réinitialiser la base de données
mysql -u root -p -e "DROP DATABASE IF EXISTS restauration;"
mysql -u root -p < database/init.sql
```

### Erreur : "JWT Secret not defined"
```bash
# Vérifier le fichier .env
cat .env | grep JWT_SECRET

# Ajouter le JWT secret si manquant
echo "JWT_SECRET=M@thematique2003" >> .env
```

## 📊 Tests de Performance

### Test de charge simple
```bash
# Installer Apache Bench
sudo apt install apache2-utils

# Test de charge sur l'endpoint de santé
ab -n 100 -c 10 http://localhost:3000/health

# Test de charge sur le menu
ab -n 200 -c 20 http://localhost:3000/api/client/menu
```

### Test de charge sur QR codes
```bash
# Test avec plusieurs QR codes
ab -n 50 -c 5 http://localhost:3000/table/TBL001ABC123DEF456789
ab -n 50 -c 5 http://localhost:3000/table/TBL002XYZ789GHI012345
```

## 🎯 Checklist de Test

### ✅ Tests Fonctionnels
- [ ] Serveur démarre sans erreur
- [ ] Base de données connectée
- [ ] QR code accessible
- [ ] Session client créée
- [ ] Menu récupéré
- [ ] Produit ajouté au panier
- [ ] Commande validée
- [ ] Paiement créé
- [ ] Code de validation généré

### ✅ Tests de Sécurité
- [ ] Rate limiting fonctionne
- [ ] Validation des données
- [ ] Headers de sécurité
- [ ] CORS configuré
- [ ] Nettoyage des entrées

### ✅ Tests de Performance
- [ ] Temps de réponse < 500ms
- [ ] Gestion de 100 requêtes simultanées
- [ ] Pas de fuites mémoire
- [ ] Connexions DB fermées correctement

## 📱 Test Mobile

### Tester sur mobile
1. Démarrer le serveur
2. Trouver l'IP de votre machine : `ipconfig` (Windows) ou `ifconfig` (Linux/Mac)
3. Accéder depuis mobile : `http://[VOTRE_IP]:3000/table/TBL001ABC123DEF456789`
4. Tester l'interface responsive

### Test avec différents navigateurs
- Chrome
- Firefox
- Safari
- Edge

## 🔄 Tests de Régression

### Scénario complet
1. Scanner QR code
2. Créer session
3. Ajouter 3 produits différents
4. Modifier quantités
5. Valider commande
6. Créer paiement
7. Valider paiement (côté caisse)
8. Vérifier en base de données

### Test de données volumineuses
```sql
-- Insérer 1000 clients de test
INSERT INTO clients (nom_complet) 
SELECT CONCAT('Client Test ', i) 
FROM (SELECT @row := @row + 1 AS i FROM information_schema.tables, (SELECT @row := 0) r LIMIT 1000) t;
```

## 📈 Monitoring

### Vérifier les logs
```bash
# Logs du serveur
pm2 logs restauration-api

# Logs de la base de données
sudo tail -f /var/log/mysql/error.log
```

### Métriques importantes
- Temps de réponse moyen
- Nombre de requêtes par seconde
- Utilisation mémoire
- Connexions DB actives
- Erreurs 4xx/5xx

## 🎉 Tests Réussis

Si tous les tests passent, votre API est prête pour :
- ✅ Développement frontend
- ✅ Tests d'intégration
- ✅ Déploiement en staging
- ✅ Tests utilisateurs

---

**💡 Conseil :** Gardez ce guide à portée de main pendant le développement !
