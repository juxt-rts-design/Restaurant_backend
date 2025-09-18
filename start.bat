@echo off
echo ========================================
echo   RESTAURATION INTERACTIVE - BACKEND
echo ========================================
echo.

echo [1/3] Installation des dependances...
call npm install
if %errorlevel% neq 0 (
    echo ERREUR: Echec de l'installation des dependances
    pause
    exit /b 1
)

echo.
echo [2/3] Verification de la configuration...
if not exist .env (
    echo ATTENTION: Fichier .env manquant
    echo Creation d'un fichier .env par defaut...
    echo # Configuration de la base de donnees > .env
    echo DB_HOST=localhost >> .env
    echo DB_USER=root >> .env
    echo DB_PASSWORD= >> .env
    echo DB_NAME=restauration_interactive >> .env
    echo DB_PORT=3306 >> .env
    echo. >> .env
    echo # Configuration du serveur >> .env
    echo PORT=3000 >> .env
    echo NODE_ENV=development >> .env
    echo. >> .env
    echo # JWT Secret >> .env
    echo JWT_SECRET=votre_secret_jwt_tres_securise_ici >> .env
    echo. >> .env
    echo # Configuration des QR codes >> .env
    echo QR_CODE_BASE_URL=http://localhost:3000/table >> .env
    echo. >> .env
    echo # Configuration des paiements >> .env
    echo MOBILE_MONEY_ENABLED=true >> .env
    echo Fichier .env cree avec des valeurs par defaut
    echo N'oubliez pas de modifier les valeurs selon votre configuration
)

echo.
echo [3/3] Demarrage du serveur...
echo.
echo ========================================
echo   SERVEUR EN COURS DE DEMARRAGE...
echo ========================================
echo.
echo URL: http://localhost:3000
echo QR Codes: http://localhost:3000/table/[QR_CODE]
echo API: http://localhost:3000/api
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

call npm run dev
