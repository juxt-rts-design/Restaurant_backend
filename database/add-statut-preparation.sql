-- Ajouter la colonne statut_preparation à la table commande_produits
ALTER TABLE commande_produits 
ADD COLUMN statut_preparation ENUM('EN_ATTENTE', 'EN_PREPARATION', 'PRET') DEFAULT 'EN_ATTENTE';

-- Mettre à jour les enregistrements existants
UPDATE commande_produits SET statut_preparation = 'EN_ATTENTE' WHERE statut_preparation IS NULL;
