@echo off
echo 🇬🇦 Installation des données gabonaises pour la restauration interactive
echo.

REM Vérifier si MySQL est installé
where mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL n'est pas trouvé dans le PATH.
    echo Veuillez installer MySQL ou ajouter le chemin MySQL au PATH.
    echo.
    echo Solutions possibles :
    echo 1. Installer MySQL depuis https://dev.mysql.com/downloads/mysql/
    echo 2. Ou utiliser XAMPP/WAMP qui inclut MySQL
    echo 3. Ou ajouter MySQL au PATH système
    echo.
    echo Chemin typique MySQL : C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
    echo.
    echo Alternative : Utilisez phpMyAdmin ou MySQL Workbench pour exécuter les scripts SQL manuellement.
    pause
    exit /b 1
)

echo ✅ MySQL trouvé
echo.

REM Demander les informations de connexion
set /p host="Host MySQL (défaut: localhost): "
if "%host%"=="" set host=localhost

set /p user="Utilisateur MySQL (défaut: root): "
if "%user%"=="" set user=root

set /p password="Mot de passe MySQL: "

set /p database="Nom de la base de données (défaut: restauration): "
if "%database%"=="" set database=restauration

echo.
echo Configuration :
echo   Host: %host%
echo   Utilisateur: %user%
echo   Base de données: %database%
echo.

REM Vérifier la connexion
echo 🔍 Vérification de la connexion...
echo SELECT 1; | mysql -h %host% -u %user% -p%password% %database% >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Impossible de se connecter à la base de données.
    echo Vérifiez vos informations de connexion.
    pause
    exit /b 1
)
echo ✅ Connexion réussie !
echo.

REM Exécuter les scripts
echo 🚀 Début de l'installation des données gabonaises...
echo.

echo 📄 Exécution des données de base gabonaises...
mysql -h %host% -u %user% -p%password% %database% < database\gabon-data.sql
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'exécution de gabon-data.sql
    pause
    exit /b 1
)
echo ✅ Données de base exécutées avec succès !
echo.

echo 📄 Exécution des spécialités régionales...
mysql -h %host% -u %user% -p%password% %database% < database\gabon-specialties.sql
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'exécution de gabon-specialties.sql
    pause
    exit /b 1
)
echo ✅ Spécialités régionales exécutées avec succès !
echo.

echo 📄 Exécution des promotions et menus...
mysql -h %host% -u %user% -p%password% %database% < database\gabon-promotions.sql
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'exécution de gabon-promotions.sql
    pause
    exit /b 1
)
echo ✅ Promotions et menus exécutés avec succès !
echo.

echo 📄 Exécution du test des données...
mysql -h %host% -u %user% -p%password% %database% < database\test-gabon-data.sql
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'exécution de test-gabon-data.sql
    pause
    exit /b 1
)
echo ✅ Test des données exécuté avec succès !
echo.

echo 🎉 Installation terminée avec succès !
echo.
echo Vos données gabonaises sont maintenant installées :
echo   ✅ 10 tables avec QR codes
echo   ✅ 50+ plats traditionnels gabonais
echo   ✅ 30+ clients avec noms typiques
echo   ✅ Sessions et commandes de test
echo   ✅ Promotions et menus spéciaux
echo.
echo Vous pouvez maintenant démarrer votre serveur :
echo   npm run dev
echo.
echo Et tester avec les QR codes :
echo   http://localhost:3000/table/TBL001LIBREVILLE123456789
echo.
pause
