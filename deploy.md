# 🚀 Guide de Déploiement

## Déploiement en Production

### 1. Préparation du serveur

#### Serveur Ubuntu/Debian
```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js (version 18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer MySQL
sudo apt install mysql-server -y

# Installer PM2 pour la gestion des processus
sudo npm install -g pm2

# Installer Nginx (optionnel, pour reverse proxy)
sudo apt install nginx -y
```

#### Serveur CentOS/RHEL
```bash
# Installer Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Installer MySQL
sudo yum install mysql-server -y

# Installer PM2
sudo npm install -g pm2
```

### 2. Configuration de la base de données

```bash
# Sécuriser MySQL
sudo mysql_secure_installation

# Créer la base de données
mysql -u root -p < database/init.sql

# Créer un utilisateur dédié (recommandé)
mysql -u root -p
```

```sql
-- Dans MySQL
CREATE USER 'restaurant_user'@'localhost' IDENTIFIED BY 'mot_de_passe_securise';
GRANT ALL PRIVILEGES ON restauration_interactive.* TO 'restaurant_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Configuration de l'application

```bash
# Cloner le projet
git clone <votre-repo> /opt/restauration-api
cd /opt/restauration-api

# Installer les dépendances
npm install --production

# Créer le fichier .env
sudo nano .env
```

Configuration `.env` pour la production :
```env
# Configuration de la base de données
DB_HOST=localhost
DB_USER=restaurant_user
DB_PASSWORD=mot_de_passe_securise
DB_NAME=restauration_interactive
DB_PORT=3306

# Configuration du serveur
PORT=3000
NODE_ENV=production

# JWT Secret (GÉNÉRER UN SECRET FORT)
JWT_SECRET=votre_secret_jwt_tres_securise_pour_la_production

# Configuration des QR codes
QR_CODE_BASE_URL=https://votre-domaine.com/table

# Configuration des paiements
MOBILE_MONEY_ENABLED=true

# Configuration CORS
CORS_ORIGINS=https://votre-domaine.com,https://www.votre-domaine.com
```

### 4. Démarrage avec PM2

```bash
# Créer un fichier de configuration PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'restauration-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Créer le dossier de logs
mkdir logs

# Démarrer l'application
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save
pm2 startup
```

### 5. Configuration Nginx (Reverse Proxy)

```bash
# Créer la configuration Nginx
sudo nano /etc/nginx/sites-available/restauration-api
```

Configuration Nginx :
```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    # Certificats SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    # Configuration SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Headers de sécurité
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy vers l'application Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gestion des fichiers statiques
    location /static/ {
        alias /opt/restauration-api/public/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/restauration-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Certificat SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtenir le certificat
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Vérifier le renouvellement automatique
sudo certbot renew --dry-run
```

### 7. Configuration du pare-feu

```bash
# UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Firewalld (CentOS)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 8. Monitoring et logs

```bash
# Vérifier le statut de l'application
pm2 status
pm2 logs restauration-api

# Monitoring en temps réel
pm2 monit

# Redémarrer l'application
pm2 restart restauration-api

# Mettre à jour l'application
git pull
npm install --production
pm2 restart restauration-api
```

### 9. Sauvegarde de la base de données

```bash
# Script de sauvegarde quotidienne
cat > /opt/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
DB_NAME="restauration_interactive"

mkdir -p $BACKUP_DIR

mysqldump -u restaurant_user -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Garder seulement les 7 derniers backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /opt/backup-db.sh

# Ajouter au crontab
echo "0 2 * * * /opt/backup-db.sh" | sudo crontab -
```

### 10. Variables d'environnement de production

```env
# .env.production
NODE_ENV=production
PORT=3000

# Base de données
DB_HOST=localhost
DB_USER=restaurant_user
DB_PASSWORD=mot_de_passe_tres_securise
DB_NAME=restauration_interactive
DB_PORT=3306

# Sécurité
JWT_SECRET=secret_jwt_ultra_securise_pour_production_2024

# URLs
QR_CODE_BASE_URL=https://votre-domaine.com/table
CORS_ORIGINS=https://votre-domaine.com,https://www.votre-domaine.com

# Paiements
MOBILE_MONEY_ENABLED=true

# Logs
LOG_LEVEL=info
LOG_FILE=/opt/restauration-api/logs/app.log

# Monitoring
ENABLE_METRICS=true
```

## Déploiement avec Docker

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Changer les permissions
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_USER=restaurant_user
      - DB_PASSWORD=secure_password
      - DB_NAME=restauration_interactive
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=restauration_interactive
      - MYSQL_USER=restaurant_user
      - MYSQL_PASSWORD=secure_password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mysql_data:
```

### Déploiement Docker
```bash
# Construire et démarrer
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

## Checklist de déploiement

- [ ] Serveur configuré avec Node.js 18+
- [ ] MySQL installé et configuré
- [ ] Base de données créée avec les données initiales
- [ ] Fichier .env configuré pour la production
- [ ] Application testée localement
- [ ] PM2 configuré et application démarrée
- [ ] Nginx configuré comme reverse proxy
- [ ] Certificat SSL installé
- [ ] Pare-feu configuré
- [ ] Monitoring en place
- [ ] Sauvegardes automatiques configurées
- [ ] Tests de charge effectués
- [ ] Documentation mise à jour

## Maintenance

### Mises à jour
```bash
# Mise à jour de l'application
cd /opt/restauration-api
git pull
npm install --production
pm2 restart restauration-api

# Mise à jour du système
sudo apt update && sudo apt upgrade -y
```

### Monitoring
```bash
# Vérifier les logs
pm2 logs restauration-api --lines 100

# Vérifier l'utilisation des ressources
pm2 monit

# Vérifier le statut de la base de données
mysql -u restaurant_user -p -e "SHOW PROCESSLIST;"
```

### Dépannage
```bash
# Redémarrer tous les services
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart mysql

# Vérifier les erreurs
pm2 logs --err
sudo journalctl -u nginx -f
sudo journalctl -u mysql -f
```
