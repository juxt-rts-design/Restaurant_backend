-- Ajouter la table des paniers pour permettre plusieurs paniers par session
CREATE TABLE paniers (
  id_panier         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_session        BIGINT UNSIGNED NOT NULL,
  nom_utilisateur   VARCHAR(100) NOT NULL,
  statut_panier     ENUM('ACTIF','FERMÉ') NOT NULL DEFAULT 'ACTIF',
  date_creation     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_fermeture    DATETIME NULL,
  FOREIGN KEY (id_session) REFERENCES sessions(id_session)
);

-- Ajouter la table des éléments de panier
CREATE TABLE panier_produits (
  id_ligne          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_panier         BIGINT UNSIGNED NOT NULL,
  id_produit        BIGINT UNSIGNED NOT NULL,
  quantite          INT UNSIGNED NOT NULL DEFAULT 1,
  prix_unitaire     INT UNSIGNED NOT NULL,
  date_ajout        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_panier) REFERENCES paniers(id_panier),
  FOREIGN KEY (id_produit) REFERENCES produits(id_produit)
);

-- Index pour améliorer les performances
CREATE INDEX idx_paniers_session ON paniers(id_session);
CREATE INDEX idx_paniers_utilisateur ON paniers(nom_utilisateur);
CREATE INDEX idx_panier_produits_panier ON panier_produits(id_panier);
CREATE INDEX idx_panier_produits_produit ON panier_produits(id_produit);
