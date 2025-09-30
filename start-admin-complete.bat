@echo off
echo 🏢 DÉMARRAGE COMPLET DE L'ADMINISTRATION SAAS
echo ============================================
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js détecté
echo.

REM Étape 1: Créer l'utilisateur admin
echo 🔐 Étape 1/4: Création de l'utilisateur administrateur...
node create-admin-user.js
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la création de l'utilisateur admin
    pause
    exit /b 1
)
echo.

REM Étape 2: Démarrer le serveur backend
echo 🚀 Étape 2/4: Démarrage du serveur backend...
start "Backend Restaurant" cmd /k "node server.js"
echo ✅ Serveur backend démarré sur le port 3001
echo.

REM Attendre que le serveur démarre
echo ⏳ Attente du démarrage du serveur (5 secondes)...
timeout /t 5 /nobreak >nul

REM Étape 3: Tester l'API admin
echo 🧪 Étape 3/4: Test de l'API d'administration...
node test-admin-api.js
echo.

REM Étape 4: Démarrer l'interface admin
echo 🎨 Étape 4/4: Démarrage de l'interface d'administration...
cd admin-frontend
if not exist "node_modules" (
    echo 📦 Installation des dépendances de l'interface admin...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors de l'installation des dépendances
        pause
        exit /b 1
    )
)

echo 🚀 Démarrage de l'interface d'administration...
start "Admin Interface" cmd /k "npm run dev"
cd ..

echo.
echo 🎉 DÉMARRAGE TERMINÉ !
echo ====================
echo.
echo 📱 Interface d'administration: http://localhost:3002
echo 🔗 API Backend: http://localhost:3001
echo.
echo 🔐 Identifiants de connexion:
echo    Email: admin@saas.com
echo    Mot de passe: admin123
echo.
echo 📋 Fonctionnalités disponibles:
echo    ✅ Dashboard avec statistiques
echo    ✅ Gestion des restaurants
echo    ✅ Gestion des utilisateurs
echo    ✅ Système de suspension
echo    ✅ Analytics et rapports
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >nul
