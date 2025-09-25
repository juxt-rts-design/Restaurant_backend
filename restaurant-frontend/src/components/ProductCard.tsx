import React from 'react';
import { Plus, Star, Clock, Flame } from 'lucide-react';

// Types
interface Product {
  id_produit: number;
  nom_produit: string;
  description: string;
  prix_cfa: number;
  stock_disponible: number;
  actif: boolean;
}

interface ProductCardProps {
  produit: Product;
  onAddToCart: (produit: Product, quantite: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ produit, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(produit, 1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  // Générer une image placeholder basée sur le nom du produit
  const getProductImage = (nomProduit: string) => {
    const imageMap: { [key: string]: string } = {
      'poulet': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=200&fit=crop',
      'poisson': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop',
      'boeuf': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300&h=200&fit=crop',
      'riz': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
      'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
      'salade': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
      'pâtes': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop',
      'soupe': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=200&fit=crop',
      'dessert': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop',
      'gâteau': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
      'glace': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop',
      'café': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop',
      'thé': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop',
      'jus': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=200&fit=crop',
      'eau': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300&h=200&fit=crop',
      'bière': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=200&fit=crop',
      'vin': 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=300&h=200&fit=crop',
      'cocktail': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=200&fit=crop',
      'ananas': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300&h=200&fit=crop',
      'mangue': 'https://images.unsplash.com/photo-1605027990121-1a3b5b5b5b5b?w=300&h=200&fit=crop',
      'banane': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop',
      'orange': 'https://images.unsplash.com/photo-1557800634-7bf3c73bfab5?w=300&h=200&fit=crop',
      'pomme': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop'
    };

    const nomLower = nomProduit.toLowerCase();
    for (const [key, image] of Object.entries(imageMap)) {
      if (nomLower.includes(key)) {
        return image;
      }
    }
    
    // Image par défaut
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop';
  };

  const isPopular = produit.prix_cfa > 3000;
  const isNew = produit.stock_disponible > 20;

  return (
    <div className="menu-card bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1 animate-fadeInUp">
      {/* Image du produit */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getProductImage(produit.nom_produit)}
          alt={produit.nom_produit}
          className="product-image w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {isPopular && (
            <div className="badge-popular px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 animate-bounce">
              <Flame className="w-3 h-3" />
              <span>Populaire</span>
            </div>
          )}
          {isNew && (
            <div className="badge-new px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 animate-pulse">
              <Star className="w-3 h-3" />
              <span>Nouveau</span>
            </div>
          )}
        </div>

        {/* Stock */}
        {produit.stock_disponible > 0 && produit.stock_disponible <= 5 && (
          <div className="badge-stock absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium">
            Plus que {produit.stock_disponible}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
            {produit.nom_produit}
          </h3>
          {produit.description && (
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {produit.description}
            </p>
          )}
        </div>

        {/* Prix et temps de préparation */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold gradient-text">
            {formatPrice(produit.prix_cfa)} FCFA
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>15-20 min</span>
          </div>
        </div>
        
        {/* Bouton d'ajout */}
        <div className="flex items-center justify-between">
          {!produit.actif || produit.stock_disponible === 0 ? (
            <div className="w-full text-center py-3 px-4 bg-gray-100 text-gray-500 rounded-lg font-medium">
              {!produit.actif ? 'Indisponible' : 'Rupture de stock'}
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="btn-primary w-full text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter au panier</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;