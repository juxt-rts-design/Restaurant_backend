# 📝 Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentation complète avec exemples
- Tests automatisés avec GitHub Actions
- Guide de contribution détaillé

### Changed
- Amélioration de la validation des QR codes
- Optimisation des requêtes de base de données

## [1.0.0] - 2024-09-18

### Added
- ✨ **Version initiale** du backend de restauration interactive
- 🎯 **API REST complète** avec Express.js et Node.js
- 🍽️ **Gestion des tables** avec QR codes uniques
- 👥 **Système de clients** sans compte obligatoire
- 🛒 **Gestion des commandes** en temps réel
- 💳 **Paiements multiples** (Espèces, Mobile Money, Carte, À la caisse)
- 🔐 **Authentification JWT** sécurisée
- 📱 **Interface responsive** accessible via QR code
- 🍛 **Données gabonaises** typiques (plats, clients, tables)
- 📊 **Gestion des stocks** automatique
- 🛡️ **Sécurité avancée** (Helmet, Rate Limiting, Validation)
- 📖 **Documentation complète** avec exemples Postman
- 🧪 **Tests automatisés** et scripts de vérification

### Technical Details
- **Base de données** : MySQL 8.0+ avec schéma optimisé
- **Framework** : Express.js 4.x avec middlewares de sécurité
- **Authentification** : JWT avec secret configurable
- **Validation** : express-validator pour la validation des données
- **Sécurité** : Helmet.js, Rate Limiting, CORS configuré
- **QR Codes** : Génération et validation automatique
- **API** : RESTful avec codes de statut HTTP appropriés

### Database Schema
- **Tables** : `clients`, `tables`, `sessions`, `produits`, `commandes`, `commande_produits`, `paiements`
- **Relations** : Clés étrangères et contraintes d'intégrité
- **Indexes** : Optimisation des requêtes fréquentes
- **Charset** : UTF8MB4 pour support Unicode complet

### API Endpoints
- `GET /` - Informations API
- `GET /health` - État du serveur
- `GET /table/:qrCode` - Page table (QR Code)
- `GET /api/client/menu` - Menu des produits
- `POST /api/client/table/:qrCode/session` - Créer session client
- `POST /api/client/session/:id/commande` - Passer commande
- `POST /api/client/commande/:id/paiement` - Effectuer paiement
- `GET /api/caisse/commandes` - Commandes en attente (Caisse)
- `GET /api/manager/dashboard` - Tableau de bord (Manager)

### Security Features
- **Rate Limiting** : Protection contre les attaques par déni de service
- **Input Validation** : Sanitisation et validation de toutes les entrées
- **CORS** : Configuration sécurisée des origines croisées
- **Helmet.js** : Headers de sécurité HTTP
- **JWT** : Tokens sécurisés avec expiration
- **SQL Injection Protection** : Requêtes préparées avec MySQL2

### Gabonese Data Integration
- **Tables** : 10 tables avec noms de villes gabonaises
- **Produits** : 100+ plats typiques du Gabon
- **Clients** : Noms gabonais authentiques
- **Prix** : En FCFA (Franc CFA)
- **Spécialités** : Plats saisonniers et régionaux

### Development Tools
- **Nodemon** : Redémarrage automatique en développement
- **Postman Collection** : Tests API complets
- **Scripts de test** : Validation automatique
- **Documentation** : README détaillé avec exemples
- **Installation** : Scripts automatisés Windows/Linux

### Performance
- **Connection Pooling** : Gestion optimisée des connexions MySQL
- **Caching** : Mise en cache des données fréquemment utilisées
- **Compression** : Compression des réponses HTTP
- **Timeouts** : Gestion des timeouts de connexion

### Monitoring
- **Health Check** : Endpoint de surveillance de l'état
- **Logging** : Logs structurés pour le debugging
- **Error Handling** : Gestion d'erreurs centralisée
- **Metrics** : Métriques de performance

---

## Types de Changements

- **Added** : Nouvelles fonctionnalités
- **Changed** : Changements dans les fonctionnalités existantes
- **Deprecated** : Fonctionnalités qui seront supprimées
- **Removed** : Fonctionnalités supprimées
- **Fixed** : Corrections de bugs
- **Security** : Améliorations de sécurité

---

## Versioning

Ce projet utilise [Semantic Versioning](https://semver.org/). Pour les versions disponibles, voir les [tags sur ce repository](https://github.com/votre-username/restauration-interactive-backend/tags).

**Format** : `MAJOR.MINOR.PATCH`
- **MAJOR** : Changements incompatibles avec l'API
- **MINOR** : Nouvelles fonctionnalités compatibles
- **PATCH** : Corrections de bugs compatibles

---

## Migration Guide

### De v0.x vers v1.0.0

#### Breaking Changes
- Aucun changement breaking dans cette version initiale

#### New Features
- Toutes les fonctionnalités sont nouvelles dans v1.0.0

#### Configuration Changes
- Ajouter les variables d'environnement requises
- Configurer la base de données MySQL
- Installer les données gabonaises

---

## Support

Pour toute question concernant les versions :

- **GitHub Issues** : [Créer une issue](https://github.com/votre-username/restauration-interactive-backend/issues)
- **Documentation** : Voir le [README.md](README.md)
- **Email** : [votre-email@example.com]

---

**Dernière mise à jour** : 18 Septembre 2024
