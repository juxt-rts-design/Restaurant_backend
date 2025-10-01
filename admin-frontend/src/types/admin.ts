// Types pour l'interface d'administration SaaS

export interface Restaurant {
  id: number;
  nom: string;
  slug: string;
  adresse: string;
  telephone: string;
  email: string;
  logo_url?: string;
  couleur_theme: string;
  devise: string;
  fuseau_horaire: string;
  statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
  plan: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  limite_commandes_mois: number;
  limite_utilisateurs: number;
  date_creation: string;
  date_mise_a_jour: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id_utilisateur: number;
  nom_utilisateur: string;
  email: string;
  telephone?: string;
  role: 'ADMIN' | 'MANAGER' | 'CAISSIER' | 'CUISINIER';
  statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
  restaurant_id?: number;
  date_creation: string;
  derniere_connexion?: string;
  cree_par?: number;
}

export interface RestaurantStats {
  restaurants: {
    total_restaurants: number;
    restaurants_actifs: number;
    restaurants_suspendus: number;
    restaurants_premium: number;
    restaurants_enterprise: number;
  };
  factures: {
    total_factures: number;
    factures_30j: number;
    factures_7j: number;
    ca_total_fcfa: number;
    ca_30j_fcfa: number;
    ca_7j_fcfa: number;
  };
  utilisateurs: {
    total_utilisateurs: number;
    utilisateurs_actifs: number;
    managers: number;
    caissiers: number;
    cuisiniers: number;
    admins: number;
  };
  produits: {
    total_produits: number;
    produits_actifs: number;
    produits_rupture: number;
  };
}

export interface TopRestaurant {
  id: number;
  nom: string;
  plan: string;
  statut: string;
  nb_utilisateurs: number;
  nb_factures: number;
  ca_total_fcfa: number;
  ca_30j_fcfa: number;
}

export interface CreateRestaurantRequest {
  nom: string;
  slug: string;
  adresse: string;
  telephone: string;
  email: string;
  couleur_theme?: string;
  devise?: string;
  fuseau_horaire?: string;
  plan: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  limite_commandes_mois?: number;
  limite_utilisateurs?: number;
}

export interface UpdateRestaurantRequest extends Partial<CreateRestaurantRequest> {
  statut?: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
}

export interface CreateUserRequest {
  nom_utilisateur: string;
  email: string;
  mot_de_passe: string;
  role: 'ADMIN' | 'MANAGER' | 'CAISSIER' | 'CUISINIER';
  restaurant_id?: number | null;
  statut?: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
}

export interface UpdateUserRequest {
  nom_utilisateur?: string;
  email?: string;
  role?: 'ADMIN' | 'MANAGER' | 'CAISSIER' | 'CUISINIER';
  statut?: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
  restaurant_id?: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Types pour les graphiques et analytics
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface RestaurantAnalytics {
  restaurant: Restaurant;
  stats: {
    commandes_30j: number;
    ca_30j: number;
    utilisateurs_actifs: number;
    sessions_actives: number;
  };
  evolution: TimeSeriesData[];
  top_produits: ChartData[];
}
