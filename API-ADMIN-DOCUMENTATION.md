# 🏢 Documentation API d'Administration SaaS

## 📋 **Vue d'ensemble**

L'API d'administration permet de gérer la plateforme SaaS multi-restaurants avec des fonctionnalités complètes de gestion des restaurants, utilisateurs, et analytics.

---

## 🔐 **Authentification**

### Connexion Admin
```http
POST /api/admin/auth/login
```

**Body:**
```json
{
  "email": "admin@saas.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id_utilisateur": 1,
      "nom_utilisateur": "Administrateur SaaS",
      "email": "admin@saas.com",
      "role": "ADMIN",
      "restaurant_id": null,
      "statut": "ACTIF"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Vérification Token
```http
GET /api/admin/auth/verify
Authorization: Bearer {token}
```

---

## 📊 **Dashboard**

### Statistiques Générales
```http
GET /api/admin/dashboard
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_restaurants": 15,
    "restaurants_actifs": 12,
    "restaurants_premium": 8,
    "total_utilisateurs": 45,
    "utilisateurs_actifs": 42,
    "managers": 15,
    "commandes_30j": 1250,
    "commandes_7j": 320,
    "ca_30j": 45600,
    "ca_7j": 12800
  }
}
```

### Top Restaurants
```http
GET /api/admin/dashboard/top-restaurants
Authorization: Bearer {token}
```

---

## 🏢 **Gestion des Restaurants**

### Lister Tous les Restaurants
```http
GET /api/admin/restaurants
Authorization: Bearer {token}
```

### Récupérer un Restaurant
```http
GET /api/admin/restaurants/{id}
Authorization: Bearer {token}
```

### Créer un Restaurant
```http
POST /api/admin/restaurants
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nom": "Restaurant Le Gourmet",
  "slug": "restaurant-le-gourmet",
  "adresse": "123 Rue de la Paix, 75001 Paris",
  "telephone": "+33 1 23 45 67 89",
  "email": "contact@legourmet.com",
  "couleur_theme": "#3B82F6",
  "devise": "EUR",
  "fuseau_horaire": "Europe/Paris",
  "plan": "BASIC",
  "limite_commandes_mois": 1000,
  "limite_utilisateurs": 5
}
```

### Modifier un Restaurant
```http
PUT /api/admin/restaurants/{id}
Authorization: Bearer {token}
```

### Changer le Statut
```http
PATCH /api/admin/restaurants/{id}/status
Authorization: Bearer {token}
```

**Body:**
```json
{
  "statut": "SUSPENDU"
}
```

### Supprimer un Restaurant
```http
DELETE /api/admin/restaurants/{id}
Authorization: Bearer {token}
```

### Vérifier la Disponibilité d'un Slug
```http
GET /api/admin/restaurants/check-slug/{slug}?exclude={id}
Authorization: Bearer {token}
```

---

## 👥 **Gestion des Utilisateurs**

### Lister Tous les Utilisateurs
```http
GET /api/admin/users
Authorization: Bearer {token}
```

### Utilisateurs d'un Restaurant
```http
GET /api/admin/restaurants/{id}/users
Authorization: Bearer {token}
```

### Créer un Utilisateur
```http
POST /api/admin/users
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nom_utilisateur": "Jean Dupont",
  "email": "jean.dupont@restaurant.com",
  "mot_de_passe": "motdepasse123",
  "role": "MANAGER",
  "restaurant_id": 1
}
```

### Modifier un Utilisateur
```http
PUT /api/admin/users/{id}
Authorization: Bearer {token}
```

### Supprimer un Utilisateur
```http
DELETE /api/admin/users/{id}
Authorization: Bearer {token}
```

---

## 📈 **Analytics**

### Analytics d'un Restaurant
```http
GET /api/admin/restaurants/{id}/analytics
Authorization: Bearer {token}
```

### Analytics Globales
```http
GET /api/admin/analytics/global
Authorization: Bearer {token}
```

---

## 🛡️ **Sécurité**

### Middleware d'Authentification
- Tous les endpoints (sauf login) nécessitent un token JWT valide
- Le token doit être inclus dans l'en-tête `Authorization: Bearer {token}`
- Vérification automatique du rôle ADMIN

### Gestion des Erreurs
```json
{
  "success": false,
  "error": "Message d'erreur détaillé"
}
```

### Codes de Statut HTTP
- `200` - Succès
- `201` - Création réussie
- `400` - Données invalides
- `401` - Non authentifié
- `403` - Accès refusé
- `404` - Ressource non trouvée
- `500` - Erreur serveur

---

## 🧪 **Tests**

### Script de Test Automatique
```bash
node test-admin-api.js
```

### Tests Inclus
- ✅ Connexion API
- ✅ Authentification admin
- ✅ Vérification token
- ✅ Dashboard
- ✅ Gestion restaurants
- ✅ Gestion utilisateurs
- ✅ Vérification slug

---

## 🚀 **Démarrage Rapide**

### 1. Créer l'utilisateur admin
```bash
node create-admin-user.js
```

### 2. Démarrer le serveur
```bash
node server.js
```

### 3. Tester l'API
```bash
node test-admin-api.js
```

### 4. Démarrer l'interface admin
```bash
cd admin-frontend
npm install
npm run dev
```

---

## 📱 **Interface d'Administration**

### URL d'Accès
- **Interface Admin**: http://localhost:3002
- **API Backend**: http://localhost:3001

### Identifiants par Défaut
- **Email**: admin@saas.com
- **Mot de passe**: admin123

### Fonctionnalités
- 📊 Dashboard avec statistiques en temps réel
- 🏢 Gestion complète des restaurants
- 👥 Gestion des utilisateurs
- ⚠️ Système de suspension avec raisons
- 📈 Analytics et rapports
- 🔧 Configuration des plans d'abonnement

---

## 🔧 **Configuration**

### Variables d'Environnement
```env
JWT_SECRET=your-secret-key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=restaurant_saas
```

### Plans d'Abonnement
- **BASIC**: 1000 commandes/mois, 5 utilisateurs
- **PREMIUM**: 5000 commandes/mois, 20 utilisateurs  
- **ENTERPRISE**: 50000 commandes/mois, 100 utilisateurs

---

## 📞 **Support**

Pour toute question ou problème :
1. Vérifiez les logs du serveur
2. Consultez la documentation
3. Testez avec le script de test automatique
4. Vérifiez la configuration de la base de données
