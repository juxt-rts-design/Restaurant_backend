-- Table pour stocker les paramètres système
CREATE TABLE IF NOT EXISTS system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertion des paramètres par défaut
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category, is_public) VALUES
-- Paramètres généraux
('platform_name', 'Restaurant SaaS Platform', 'string', 'Nom de la plateforme', 'general', TRUE),
('platform_url', 'https://restaurant-saas.com', 'string', 'URL de la plateforme', 'general', TRUE),
('support_email', 'support@restaurant-saas.com', 'string', 'Email de support', 'general', TRUE),
('maintenance_mode', 'false', 'boolean', 'Mode maintenance', 'general', FALSE),
('max_restaurants', '1000', 'number', 'Nombre maximum de restaurants', 'general', FALSE),
('session_timeout', '30', 'number', 'Timeout de session en minutes', 'general', FALSE),

-- Paramètres de sécurité
('password_min_length', '8', 'number', 'Longueur minimale des mots de passe', 'security', FALSE),
('require_special_chars', 'true', 'boolean', 'Exiger des caractères spéciaux', 'security', FALSE),
('two_factor_enabled', 'false', 'boolean', 'Authentification à deux facteurs', 'security', FALSE),
('session_expiry', '24', 'number', 'Expiration des sessions en heures', 'security', FALSE),

-- Paramètres de notifications
('email_notifications', 'true', 'boolean', 'Notifications par email', 'notifications', FALSE),
('sms_notifications', 'false', 'boolean', 'Notifications par SMS', 'notifications', FALSE),
('push_notifications', 'true', 'boolean', 'Notifications push', 'notifications', FALSE),
('new_restaurant_alert', 'true', 'boolean', 'Alerte nouveau restaurant', 'notifications', FALSE),
('payment_alert', 'true', 'boolean', 'Alerte paiement', 'notifications', FALSE),
('system_alert', 'true', 'boolean', 'Alerte système', 'notifications', FALSE),

-- Paramètres de facturation
('currency', 'FCFA', 'string', 'Devise de la plateforme', 'billing', TRUE),
('basic_plan_price', '50000', 'number', 'Prix du plan basique en FCFA', 'billing', TRUE),
('premium_plan_price', '150000', 'number', 'Prix du plan premium en FCFA', 'billing', TRUE),
('enterprise_plan_price', '500000', 'number', 'Prix du plan entreprise en FCFA', 'billing', TRUE),
('trial_days', '14', 'number', 'Nombre de jours d\'essai gratuit', 'billing', TRUE),

-- Statistiques système
('total_restaurants', '0', 'number', 'Nombre total de restaurants', 'stats', FALSE),
('total_users', '0', 'number', 'Nombre total d\'utilisateurs', 'stats', FALSE),
('total_revenue_fcfa', '0', 'number', 'Revenus totaux en FCFA', 'stats', FALSE),
('last_backup', NULL, 'string', 'Dernière sauvegarde', 'database', FALSE),
('database_size_mb', '0', 'number', 'Taille de la base en MB', 'database', FALSE);

-- Table pour les clés API
CREATE TABLE IF NOT EXISTS api_keys (
    id INT PRIMARY KEY AUTO_INCREMENT,
    key_name VARCHAR(100) NOT NULL,
    key_value VARCHAR(255) UNIQUE NOT NULL,
    key_type ENUM('admin', 'restaurant', 'public') DEFAULT 'admin',
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    last_used TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES utilisateurs(id_utilisateur) ON DELETE SET NULL
);

-- Clé API par défaut
INSERT INTO api_keys (key_name, key_value, key_type, permissions, created_by) VALUES
('Clé API principale', CONCAT('sk_live_', SUBSTRING(MD5(RAND()), 1, 32)), 'admin', '["read", "write", "delete"]', 1);
