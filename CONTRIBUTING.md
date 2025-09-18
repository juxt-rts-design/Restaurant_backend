# 🤝 Guide de Contribution

Merci de votre intérêt à contribuer au projet **Restauration Interactive Backend** ! 

## 📋 Comment Contribuer

### 1. 🍴 Fork et Clone

```bash
# Fork le projet sur GitHub, puis :
git clone https://github.com/votre-username/restauration-interactive-backend.git
cd restauration-interactive-backend
git remote add upstream https://github.com/original-owner/restauration-interactive-backend.git
```

### 2. 🌿 Créer une Branche

```bash
# Créer une nouvelle branche pour votre fonctionnalité
git checkout -b feature/nom-de-votre-fonctionnalite

# Ou pour un bugfix
git checkout -b fix/description-du-bug
```

### 3. 🔧 Développement

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Lancer les tests
npm test
```

### 4. ✅ Tests et Validation

Avant de soumettre votre contribution :

- [ ] **Tests passent** : `npm test`
- [ ] **API fonctionne** : `node test-server.js`
- [ ] **Code formaté** : `npm run format` (si disponible)
- [ ] **Linting OK** : `npm run lint` (si disponible)
- [ ] **Documentation mise à jour**

### 5. 📝 Commit et Push

```bash
# Ajouter vos changements
git add .

# Commit avec un message descriptif
git commit -m "feat: ajouter nouvelle fonctionnalité de paiement"

# Push vers votre fork
git push origin feature/nom-de-votre-fonctionnalite
```

### 6. 🔄 Pull Request

1. Aller sur GitHub
2. Cliquer sur "New Pull Request"
3. Remplir le template de PR
4. Assigner des reviewers si nécessaire

## 📏 Standards de Code

### 🎯 Conventions de Nommage

- **Variables** : `camelCase` (`nomClient`, `dateCommande`)
- **Fonctions** : `camelCase` (`creerSession`, `validerPaiement`)
- **Constantes** : `UPPER_SNAKE_CASE` (`JWT_SECRET`, `DB_HOST`)
- **Fichiers** : `camelCase.js` (`clientController.js`)

### 📝 Messages de Commit

Utilisez le format [Conventional Commits](https://www.conventionalcommits.org/) :

```
type(scope): description

feat(auth): ajouter authentification JWT
fix(api): corriger validation des QR codes
docs(readme): mettre à jour la documentation
style(controller): formater le code
refactor(database): optimiser les requêtes
test(api): ajouter tests unitaires
```

**Types disponibles :**
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage, point-virgules, etc.
- `refactor` : Refactoring
- `test` : Tests
- `chore` : Tâches de maintenance

### 🧪 Tests

```javascript
// Exemple de test
describe('ClientController', () => {
  it('devrait créer une session client', async () => {
    const req = {
      params: { qrCode: 'TBL001LIBREVILLE123456789' },
      body: { nomComplet: 'Test Client' }
    };
    const res = mockResponse();
    
    await ClientController.createSession(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Session créée avec succès'
    });
  });
});
```

## 🐛 Signaler un Bug

### 📋 Template de Bug Report

```markdown
## 🐛 Description du Bug

Description claire et concise du problème.

## 🔄 Étapes pour Reproduire

1. Aller à '...'
2. Cliquer sur '...'
3. Faire défiler vers '...'
4. Voir l'erreur

## 🎯 Comportement Attendu

Description claire de ce qui devrait se passer.

## 📸 Captures d'Écran

Si applicable, ajouter des captures d'écran.

## 🖥️ Environnement

- OS: [ex: Windows 10, macOS 12.0]
- Node.js: [ex: 18.17.0]
- MySQL: [ex: 8.0.33]
- Version du projet: [ex: 1.0.0]

## 📝 Logs

```
Coller les logs d'erreur ici
```

## 🔧 Solution Proposée

Si vous avez une idée de solution, décrivez-la ici.
```

## ✨ Proposer une Fonctionnalité

### 📋 Template de Feature Request

```markdown
## 🚀 Fonctionnalité Demandée

Description claire et concise de la fonctionnalité souhaitée.

## 💡 Motivation

Pourquoi cette fonctionnalité est-elle nécessaire ? Quel problème résout-elle ?

## 📝 Description Détaillée

Description complète de la fonctionnalité et de son comportement.

## 🎯 Cas d'Usage

Décrivez comment cette fonctionnalité serait utilisée.

## 🔄 Alternatives

Avez-vous considéré d'autres solutions ou fonctionnalités ?

## 📸 Mockups/Exemples

Si applicable, ajouter des mockups ou exemples.
```

## 🏷️ Labels et Priorités

### Labels Disponibles

- `bug` : Problème à corriger
- `enhancement` : Amélioration
- `feature` : Nouvelle fonctionnalité
- `documentation` : Documentation
- `good first issue` : Bon pour débuter
- `help wanted` : Aide demandée
- `priority: high` : Priorité haute
- `priority: medium` : Priorité moyenne
- `priority: low` : Priorité basse

## 📞 Support

- **GitHub Issues** : Pour bugs et fonctionnalités
- **Discussions** : Pour questions générales
- **Email** : [votre-email@example.com]

## 🙏 Remerciements

Merci à tous les contributeurs qui rendent ce projet meilleur !

---

**Happy Coding! 🚀**
