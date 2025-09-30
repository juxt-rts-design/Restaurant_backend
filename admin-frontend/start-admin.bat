@echo off
echo 🏢 Démarrage de l'interface d'administration SaaS...
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier si npm est disponible
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm n'est pas disponible. Veuillez réinstaller Node.js
    pause
    exit /b 1
)

echo ✅ Node.js et npm sont installés
echo.

REM Installer les dépendances si nécessaire
if not exist "node_modules" (
    echo 📦 Installation des dépendances...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors de l'installation des dépendances
        pause
        exit /b 1
    )
    echo ✅ Dépendances installées
    echo.
)

REM Démarrer le serveur de développement
echo 🚀 Démarrage du serveur d'administration...
echo.
echo 📱 Interface d'administration : http://localhost:3002
echo 🔗 API Backend : http://localhost:3001
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

npm run dev
