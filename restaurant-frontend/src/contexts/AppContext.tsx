import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Product {
  id_produit: number;
  nom_produit: string;
  description: string;
  prix_cfa: number;
  stock_disponible: number;
  actif: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Session {
  id_session: number;
  id_table: number;
  id_client: number;
  statut_session: 'OUVERTE' | 'FERMÉE';
  date_ouverture: string;
  date_fermeture?: string;
}

export interface AppState {
  cart: CartItem[];
  session: Session | null;
  products: Product[];
  loading: boolean;
  error: string | null;
}

export interface AppContextType extends AppState {
  addToCart: (product: Product, quantity?: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  setSession: (session: Session | null) => void;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Actions
type AppAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'UPDATE_CART_ITEM_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_SESSION'; payload: Session | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: AppState = {
  cart: [],
  session: null,
  products: [],
  loading: false,
  error: null,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.find(item => item.product.id_produit === product.id_produit);
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id_produit === product.id_produit
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      
      return {
        ...state,
        cart: [...state.cart, { product, quantity }],
      };
    }
    
    case 'UPDATE_CART_ITEM_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.product.id_produit !== productId),
        };
      }
      
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id_produit === productId
            ? { ...item, quantity }
            : item
        ),
      };
    }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id_produit !== action.payload.productId),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    
    case 'SET_SESSION':
      return {
        ...state,
        session: action.payload,
      };
    
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const updateCartItemQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_ITEM_QUANTITY', payload: { productId, quantity } });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setSession = (session: Session | null) => {
    dispatch({ type: 'SET_SESSION', payload: session });
  };

  const setProducts = (products: Product[]) => {
    dispatch({ type: 'SET_PRODUCTS', payload: products });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const value: AppContextType = {
    ...state,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    setSession,
    setProducts,
    setLoading,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};