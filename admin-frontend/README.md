# 🏢 Interface d'Administration SaaS - Restaurants

Interface d'administration moderne pour gérer la plateforme SaaS multi-restaurants.

## 🚀 **Démarrage Rapide**

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Backend restaurant-backenD en cours d'exécution sur le port 3001

### Installation
```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Accès
- **Interface Admin** : http://localhost:3002
- **API Backend** : http://localhost:3001

## 🎯 **Fonctionnalités**

### 📊 **Dashboard**
- Vue d'ensemble de la plateforme
- Statistiques en temps réel
- Top restaurants par performance
- Actions rapides

### 🏢 **Gestion des Restaurants**
- Création de nouveaux restaurants
- Modification des informations
- Gestion des statuts (Actif/Inactif/Suspendu)
- Système de suspension avec raisons
- Vérification de disponibilité des slugs

### 👥 **Gestion des Utilisateurs**
- Vue d'ensemble de tous les utilisateurs
- Filtrage par rôle et statut
- Gestion des permissions

### 📈 **Analytics** (En développement)
- Graphiques de performance
- Évolution du chiffre d'affaires
- Métriques d'utilisation

### ⚙️ **Paramètres** (En développement)
- Configuration de la sécurité
- Gestion des notifications
- Maintenance de la base de données

## 🛠️ **Technologies**

- **Frontend** : React 18 + TypeScript
- **Build Tool** : Vite
- **Styling** : Tailwind CSS
- **Icons** : Lucide React
- **HTTP Client** : Axios
- **Routing** : React Router DOM
- **Forms** : React Hook Form
- **Notifications** : React Hot Toast

## 📁 **Structure du Projet**

```
admin-frontend/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Layout/         # Layout principal
│   │   ├── RestaurantForm.tsx
│   │   └── SuspensionModal.tsx
│   ├── pages/              # Pages de l'application
│   │   ├── Dashboard.tsx
│   │   ├── Restaurants.tsx
│   │   ├── Users.tsx
│   │   └── ...
│   ├── services/           # Services API
│   │   └── adminApi.ts
│   ├── types/              # Types TypeScript
│   │   └── admin.ts
│   └── contexts/           # Contextes React
│       └── AdminContext.tsx
├── package.json
└── vite.config.ts
```

## 🔐 **Authentification**

L'interface utilise un système d'authentification JWT :
- Connexion avec email/mot de passe
- Token stocké dans localStorage
- Vérification automatique du token
- Redirection vers login si non authentifié

### Identifiants de démonstration
- **Email** : admin@saas.com
- **Mot de passe** : admin123

## 🌐 **API Endpoints**

L'interface communique avec le backend via les endpoints suivants :

### Authentification
- `POST /api/auth/login` - Connexion
- `GET /api/auth/verify` - Vérification du token

### Dashboard
- `GET /api/admin/dashboard` - Statistiques générales
- `GET /api/admin/dashboard/top-restaurants` - Top restaurants

### Restaurants
- `GET /api/admin/restaurants` - Liste des restaurants
- `POST /api/admin/restaurants` - Créer un restaurant
- `PUT /api/admin/restaurants/:id` - Modifier un restaurant
- `PATCH /api/admin/restaurants/:id/status` - Changer le statut
- `DELETE /api/admin/restaurants/:id` - Supprimer un restaurant

### Utilisateurs
- `GET /api/admin/users` - Liste des utilisateurs
- `GET /api/admin/restaurants/:id/users` - Utilisateurs d'un restaurant
- `POST /api/admin/users` - Créer un utilisateur
- `PUT /api/admin/users/:id` - Modifier un utilisateur
- `DELETE /api/admin/users/:id` - Supprimer un utilisateur

## 🎨 **Design System**

### Couleurs
- **Primary** : Bleu (#3B82F6)
- **Success** : Vert (#22C55E)
- **Warning** : Orange (#F59E0B)
- **Danger** : Rouge (#EF4444)

### Composants
- Boutons avec variants (primary, secondary, success, warning, danger)
- Cards avec ombres et bordures
- Inputs avec validation
- Badges pour les statuts
- Modals pour les actions importantes

## 🚀 **Déploiement**

### Build de production
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 🔧 **Développement**

### Scripts disponibles
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Preview du build
- `npm run lint` - Linting ESLint

### Configuration Vite
- Proxy vers l'API backend sur le port 3001
- Support TypeScript
- Hot reload activé
- Source maps en développement

## 📝 **Notes**

- L'interface est conçue pour être responsive
- Tous les composants sont en TypeScript
- Gestion d'erreurs avec notifications toast
- Loading states pour une meilleure UX
- Validation des formulaires côté client

## 🤝 **Contribution**

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 **Licence**

Ce projet est sous licence MIT.
