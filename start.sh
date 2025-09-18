#!/bin/bash

echo "========================================"
echo "   RESTAURATION INTERACTIVE - BACKEND"
echo "========================================"
echo

echo "[1/3] Installation des dépendances..."
npm install
if [ $? -ne 0 ]; then
    echo "ERREUR: Échec de l'installation des dépendances"
    exit 1
fi

echo
echo "[2/3] Vérification de la configuration..."
if [ ! -f .env ]; then
    echo "ATTENTION: Fichier .env manquant"
    echo "Création d'un fichier .env par défaut..."
    cat > .env << EOF
# Configuration de la base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=restauration_interactive
DB_PORT=3306

# Configuration du serveur
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=votre_secret_jwt_tres_securise_ici

# Configuration des QR codes
QR_CODE_BASE_URL=http://localhost:3000/table

# Configuration des paiements
MOBILE_MONEY_ENABLED=true
EOF
    echo "Fichier .env créé avec des valeurs par défaut"
    echo "N'oubliez pas de modifier les valeurs selon votre configuration"
fi

echo
echo "[3/3] Démarrage du serveur..."
echo
echo "========================================"
echo "   SERVEUR EN COURS DE DÉMARRAGE..."
echo "========================================"
echo
echo "URL: http://localhost:3000"
echo "QR Codes: http://localhost:3000/table/[QR_CODE]"
echo "API: http://localhost:3000/api"
echo
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo

npm run dev
