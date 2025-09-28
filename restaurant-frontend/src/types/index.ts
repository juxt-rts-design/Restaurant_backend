// Types pour l'application de restauration

export interface Produit {
  id_produit: number;
  nom_produit: string;
  description: string;
  prix_cfa: number;
  stock_disponible: number;
  actif: boolean;
}

export interface Table {
  id_table: number;
  nom_table: string;
  capacite: number;
  qr_code: string;
  active: boolean;
}

export interface Client {
  id_client: number;
  nom_complet: string;
  date_enregistrement: string;
}

export interface Session {
  id_session: number;
  id_table: number;
  id_client: number;
  statut_session: 'OUVERTE' | 'FERMÉE';
  date_ouverture: string;
  date_fermeture?: string;
}

export interface SessionResponse {
  session: {
    id: number;
    client: string;
    table: string;
    dateOuverture: string;
  };
}

export interface PanierItem {
  id_ligne: number;
  id_produit: number;
  quantite: number;
  prix_unitaire: number;
  produit: Produit;
}

export interface Commande {
  id_commande: number;
  id_session: number;
  statut_commande: 'EN_ATTENTE' | 'ENVOYÉ' | 'SERVI' | 'ANNULÉ';
  date_commande: string;
}

export interface Paiement {
  id_paiement: number;
  id_commande: number;
  methode_paiement: 'ESPECES' | 'MOBILE_MONEY' | 'CARTE' | 'A_LA_CAISSE';
  montant_total: number;
  statut_paiement: 'EN_COURS' | 'EFFECTUÉ';
  date_paiement: string;
  code_validation?: string;
}

// Types pour les composants
export interface ProductCardProps {
  produit: Produit;
  onAddToCart: (produit: Produit, quantite: number) => void;
}

export interface CartItemProps {
  item: PanierItem;
  onUpdateQuantity: (idLigne: number, quantite: number) => void;
  onRemove: (idLigne: number) => void;
}

export interface PaymentMethodProps {
  method: 'ESPECES' | 'MOBILE_MONEY' | 'CARTE' | 'A_LA_CAISSE';
  selected: boolean;
  onSelect: (method: 'ESPECES' | 'MOBILE_MONEY' | 'CARTE' | 'A_LA_CAISSE') => void;
}

// Types pour l'API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CreateSessionRequest {
  nomComplet: string;
}

export interface AddToCartRequest {
  idProduit: number;
  quantite: number;
}

export interface UpdateQuantityRequest {
  quantite: number;
}

export interface CreatePaymentRequest {
  methodePaiement: 'ESPECES' | 'MOBILE_MONEY' | 'CARTE' | 'A_LA_CAISSE';
}

// Types supplémentaires pour la caisse
export interface CommandeWithDetails extends Commande {
  nom_complet: string;
  nom_table: string;
  produits: Array<{
    id_ligne: number;
    nom_produit: string;
    quantite: number;
    prix_unitaire: number;
  }>;
  total: number;
}

export interface SessionWithDetails extends Session {
  // Format de l'API : données directement dans l'objet session
  nom_complet?: string;
  nom_table?: string;
  // Format attendu par le frontend (optionnel)
  client?: Client;
  table?: Table;
}