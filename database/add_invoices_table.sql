-- Table pour stocker les factures archivées
CREATE TABLE IF NOT EXISTS factures_archivees (
    id_facture INT AUTO_INCREMENT PRIMARY KEY,
    numero_facture VARCHAR(100) UNIQUE NOT NULL,
    id_commande INT NOT NULL,
    id_session INT NOT NULL,
    id_client INT NOT NULL,
    nom_client VARCHAR(255) NOT NULL,
    nom_table VARCHAR(100) NOT NULL,
    date_facture DATETIME NOT NULL,
    date_commande DATETIME NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    methode_paiement VARCHAR(50),
    statut_paiement VARCHAR(50),
    code_validation VARCHAR(100),
    date_paiement DATETIME,
    produits_json JSON NOT NULL,
    totaux_json JSON NOT NULL,
    restaurant_info JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_numero_facture (numero_facture),
    INDEX idx_id_commande (id_commande),
    INDEX idx_id_client (id_client),
    INDEX idx_date_facture (date_facture),
    INDEX idx_nom_client (nom_client),
    INDEX idx_montant_total (montant_total),
    INDEX idx_methode_paiement (methode_paiement),
    INDEX idx_date_commande (date_commande)
);

-- Table pour les statistiques des factures (optionnel, pour des analyses rapides)
CREATE TABLE IF NOT EXISTS statistiques_factures (
    id_stat INT AUTO_INCREMENT PRIMARY KEY,
    date_jour DATE NOT NULL,
    nombre_factures INT DEFAULT 0,
    montant_total_jour DECIMAL(12,2) DEFAULT 0,
    paiements_caisse INT DEFAULT 0,
    paiements_mobile_money INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_date (date_jour),
    INDEX idx_date_jour (date_jour)
);
