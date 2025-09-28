import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';
import { 
  ShoppingCart, 
  Search, 
  CheckCircle,
  ArrowLeft,
  Menu,
  X,
  Plus,
  Minus,
  Filter
} from 'lucide-react';
import MenuCategory from '../components/MenuCategory';
import ProductCard from '../components/ProductCard';

// Types pour simuler les données
interface Product {
  id_produit: number;
  nom_produit: string;
  description: string;
  prix_cfa: number;
  stock_disponible: number;
  actif: boolean;
}


const ClientPage: React.FC = () => {
  const { qrCode } = useParams<{ qrCode: string }>();
  const navigate = useNavigate();
  const { 
    cart, 
    addToCart, 
    updateCartItemQuantity, 
    removeFromCart, 
    clearCart,
    loading,
    setLoading 
  } = useAppContext();
  
  const [menu, setMenu] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'MOBILE_MONEY' | 'A_LA_CAISSE' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempCustomerName, setTempCustomerName] = useState('');
  const [addingToCart, setAddingToCart] = useState<Set<number>>(new Set());

  // Fonction pour afficher les notifications
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    loadMenu();
  }, [qrCode]); // Load menu when qrCode changes

  useEffect(() => {
    loadMenu(); // Load menu on component mount
  }, []); // Empty dependency array for mount

  // Afficher le modal de nom au chargement si pas de nom défini
  useEffect(() => {
    if (!customerName.trim()) {
      setShowNameModal(true);
    }
  }, [customerName]);

  useEffect(() => {
    // Recharger le menu quand la recherche change
    const timeoutId = setTimeout(() => {
      loadMenu();
    }, 500); // Délai de 500ms pour éviter trop de requêtes

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    // Filtrer les produits quand la catégorie change
    if (allProducts.length > 0) {
      filterProducts(allProducts);
    }
  }, [selectedCategory, searchQuery]);

   const loadMenu = async () => {
     setLoading(true);
     try {
       const response = await apiService.getMenu(searchQuery);
       console.log('Réponse API menu:', response);
       if (response.success && response.data) {
         setAllProducts(response.data);
         filterProducts(response.data);
       } else {
         console.error('Erreur API menu:', response.error);
         setAllProducts([]);
         setMenu([]);
       }
     } catch (error) {
       console.error('Erreur lors du chargement du menu:', error);
       // En cas d'erreur, garder le menu vide
       setAllProducts([]);
       setMenu([]);
     } finally {
       setLoading(false);
     }
   };

   // Fonction pour déterminer la catégorie d'un produit
   const getProductCategory = (product: Product): string => {
     const nom = product.nom_produit.toLowerCase();
     
     if (nom.includes('poulet') || nom.includes('boeuf') || nom.includes('viande') || nom.includes('porc')) {
       return 'viande';
     }
     if (nom.includes('poisson') || nom.includes('crevette') || nom.includes('crabe')) {
       return 'poisson';
     }
     if (nom.includes('riz') || nom.includes('pâtes') || nom.includes('couscous') || nom.includes('pizza') || nom.includes('burger')) {
       return 'plats';
     }
     if (nom.includes('salade') || nom.includes('légumes') || nom.includes('crudités')) {
       return 'plats';
     }
     if (nom.includes('café') || nom.includes('thé') || nom.includes('chocolat') || nom.includes('infusion')) {
       return 'boissons';
     }
     if (nom.includes('jus') || nom.includes('smoothie') || nom.includes('eau') || nom.includes('soda')) {
       return 'boissons';
     }
     if (nom.includes('bière') || nom.includes('vin') || nom.includes('cocktail') || nom.includes('alcool')) {
       return 'alcool';
     }
     if (nom.includes('dessert') || nom.includes('gâteau') || nom.includes('tarte') || nom.includes('glace') || nom.includes('crème')) {
       return 'desserts';
     }
     if (nom.includes('ananas') || nom.includes('mangue') || nom.includes('banane') || nom.includes('orange') || nom.includes('pomme')) {
       return 'fruits';
     }
     if (nom.includes('chips') || nom.includes('biscuit') || nom.includes('cracker') || nom.includes('popcorn')) {
       return 'snacks';
     }
     if (nom.includes('spécial') || nom.includes('maison') || nom.includes('signature')) {
       return 'spécialités';
     }
     
     return 'plats'; // Catégorie par défaut
   };

   // Fonction pour filtrer les produits par catégorie et recherche
   const filterProducts = (products: Product[]) => {
     let filtered = products;

     // Filtrer par catégorie
     if (selectedCategory !== 'tous') {
       filtered = filtered.filter(product => getProductCategory(product) === selectedCategory);
     }

     // Filtrer par recherche
     if (searchQuery) {
       const query = searchQuery.toLowerCase();
       filtered = filtered.filter(product => 
         product.nom_produit.toLowerCase().includes(query) ||
         product.description?.toLowerCase().includes(query)
       );
     }

     setMenu(filtered);
   };

   // Obtenir les catégories disponibles avec le nombre de produits
   const getCategories = () => {
     const categories: { [key: string]: number } = { 'tous': allProducts.length };
     
     allProducts.forEach(product => {
       const category = getProductCategory(product);
       categories[category] = (categories[category] || 0) + 1;
     });

     return Object.entries(categories)
       .filter(([_, count]) => count > 0)
       .map(([name, count]) => ({ name, count }));
   };

   const loadCart = async (sessionId: number) => {
     try {
       const response = await apiService.getCart(sessionId);
       if (response.success && response.data) {
         // Convertir les données du panier pour correspondre au format attendu
         const cartItems = response.data.panier.map((item: any) => ({
           product: {
             id_produit: item.id_produit,
             nom_produit: item.nom_produit,
             description: item.description || '',
             prix_cfa: item.prix_unitaire,
             stock_disponible: item.stock_disponible || 0,
             actif: true
           },
           quantity: item.quantite
         }));
         // Mettre à jour le contexte avec les données du panier
         clearCart();
         cartItems.forEach((item: any) => {
           addToCart(item.product, item.quantity);
         });
       }
     } catch (error) {
       console.error('Erreur lors du chargement du panier:', error);
     }
   };

  const handleAddToCart = async (produit: Product, quantite: number = 1) => {
    console.log('Ajout au panier:', produit.nom_produit, 'Quantité:', quantite);
    
    // Protection contre les clics multiples
    if (addingToCart.has(produit.id_produit)) {
      console.log('Ajout en cours pour ce produit, ignoré');
      return;
    }
    
    // Vérifier que le nom est défini
    if (!customerName.trim()) {
      showNotification('error', 'Veuillez d\'abord saisir votre nom');
      setShowNameModal(true);
      return;
    }
    
    try {
      // Marquer le produit comme en cours d'ajout
      setAddingToCart(prev => new Set(prev).add(produit.id_produit));
      
      // Créer une session seulement si on n'en a pas déjà une
      if (qrCode && !currentSession) {
        console.log('Création de session pour:', customerName, 'QR Code:', qrCode);
        const sessionResponse = await apiService.createSession(qrCode, { nomComplet: customerName.trim() });
        console.log('Réponse création session:', sessionResponse);
        
        if (sessionResponse.success && sessionResponse.data) {
          console.log('Données de session reçues:', sessionResponse.data);
          const sessionData = {
            id_session: sessionResponse.data.session.id,
            nom_complet: customerName.trim(),
            nom_table: qrCode,
            date_ouverture: sessionResponse.data.session.dateOuverture
          };
          console.log('Session data créée:', sessionData);
          setCurrentSession(sessionData);
        } else if (sessionResponse.error && sessionResponse.error.includes('déjà active')) {
          // Si une session existe déjà, essayer de la récupérer
          console.log('Session déjà active, tentative de récupération...');
          const existingSessionResponse = await apiService.getActiveSession(qrCode);
          if (existingSessionResponse.success && existingSessionResponse.data) {
            const sessionData = {
              id_session: existingSessionResponse.data.session.id,
              nom_complet: customerName.trim(),
              nom_table: qrCode,
              date_ouverture: existingSessionResponse.data.session.dateOuverture
            };
            console.log('Session existante récupérée:', sessionData);
            setCurrentSession(sessionData);
          } else {
            showNotification('error', 'Impossible de récupérer la session existante');
            return;
          }
        } else {
          showNotification('error', 'Erreur lors de la création de session: ' + sessionResponse.error);
          return;
        }
      }
      
      // Utiliser la session existante
      if (!currentSession) {
        showNotification('error', 'Aucune session active');
        return;
      }
      
      console.log('Session actuelle pour ajout panier:', currentSession);
      console.log('ID de session utilisé:', currentSession.id_session);
      
      // Ajouter au panier via l'API
      const cartResponse = await apiService.addToCart(currentSession.id_session, {
        idProduit: produit.id_produit,
        quantite: quantite
      });
      console.log('Réponse ajout panier:', cartResponse);
      
      if (cartResponse.success) {
        // Recharger le panier
        await loadCart(currentSession.id_session);
        showNotification('success', `${produit.nom_produit} ajouté au panier !`);
      } else {
        showNotification('error', 'Erreur lors de l\'ajout au panier: ' + cartResponse.error);
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      showNotification('error', 'Erreur lors de l\'ajout au panier: ' + (error.message || 'Erreur inconnue'));
    } finally {
      // Retirer le produit de la liste des ajouts en cours
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(produit.id_produit);
        return newSet;
      });
    }
  };

  const handleValidateOrder = async () => {
    if (cart.length === 0 || !currentSession) return;
    
    setIsProcessing(true);
    try {
      // Préparer les items du panier pour l'envoi
      const panierItems = cart.map(item => ({
        id_produit: item.product.id_produit,
        quantite: item.quantity
      }));
      
      console.log('Frontend - ID Session utilisé:', currentSession.id_session);
      console.log('Frontend - Panier items:', panierItems);
      
      const response = await apiService.validateOrder(currentSession.id_session, panierItems);
      if (response.success) {
        setShowPayment(true);
        showNotification('success', 'Commande validée et envoyée à la cuisine !');
      } else {
        showNotification('error', 'Erreur lors de la validation de la commande: ' + response.error);
      }
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      showNotification('error', 'Erreur lors de la validation de la commande');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !currentSession) return;
    
    setIsProcessing(true);
    try {
      const response = await apiService.createPayment(currentSession.id_session, {
        methodePaiement: selectedPaymentMethod
      });
      
      if (response.success) {
        showNotification('success', `Commande validée avec paiement ${selectedPaymentMethod}!`);
        clearCart();
        setShowPayment(false);
        setShowPaymentOptions(false);
        setSelectedPaymentMethod(null);
        setTimeout(() => navigate('/'), 2000);
      } else {
        showNotification('error', 'Erreur lors du paiement: ' + response.error);
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      showNotification('error', 'Erreur lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  // Fonctions pour le modal de nom
  const handleConfirmName = async () => {
    if (!tempCustomerName.trim()) {
      showNotification('error', 'Le nom est obligatoire pour commander');
      return;
    }
    
    setCustomerName(tempCustomerName.trim());
    setShowNameModal(false);
    showNotification('success', `Bienvenue ${tempCustomerName.trim()} ! Vous pouvez maintenant commander.`);
  };

  const handleCancelName = () => {
    setShowNameModal(false);
    setTempCustomerName('');
    // Rediriger vers l'accueil si l'utilisateur annule
    navigate('/');
  };

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (!currentSession) return;
    
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    try {
      // Trouver l'ID de ligne dans le panier (on va utiliser une approche simplifiée)
      // En réalité, il faudrait stocker l'ID de ligne retourné par l'API
      const cartItem = cart.find(item => item.product.id_produit === productId);
      if (cartItem) {
        // Pour l'instant, on met à jour localement et on synchronise avec l'API
        updateCartItemQuantity(productId, newQuantity);
        
        // TODO: Implémenter la mise à jour via l'API quand on aura l'ID de ligne
        // await apiService.updateQuantity(cartItem.id_ligne, { quantite: newQuantity });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
    }
  };

  const handleRemoveFromCart = async (productId: number) => {
    if (!currentSession) return;
    
    try {
      // Pour l'instant, on supprime localement
      removeFromCart(productId);
      
      // TODO: Implémenter la suppression via l'API quand on aura l'ID de ligne
      // const cartItem = cart.find(item => item.product.id_produit === productId);
      // if (cartItem) {
      //   await apiService.removeFromCart(cartItem.id_ligne);
      // }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.prix_cfa * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Le filtrage est maintenant géré par l'API

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  Menu du Restaurant
                </h1>
                {qrCode && (
                  <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded hidden sm:inline-block">
                    Table: {qrCode.substring(0, 8)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {/* Search - visible sur tablette et desktop */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32 sm:w-48 lg:w-64"
                />
              </div>
              
              {/* Cart button */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search mobile */}
      <div className="md:hidden px-4 py-3 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un plat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Nos Catégories</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>{menu.length} produit{menu.length > 1 ? 's' : ''}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 overflow-x-auto pb-2">
            {getCategories().map(({ name, count }) => (
              <MenuCategory
                key={name}
                category={name}
                isActive={selectedCategory === name}
                onClick={() => setSelectedCategory(name)}
                count={count}
              />
            ))}
          </div>
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {menu.map((produit) => (
            <ProductCard
              key={produit.id_produit}
              produit={produit}
              onAddToCart={handleAddToCart}
              isAddingToCart={addingToCart.has(produit.id_produit)}
            />
          ))}
        </div>
        
         {menu.length === 0 && !loading && (
          <div className="text-center py-12">
            <Menu className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600">Essayez de modifier votre recherche</p>
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Cart header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                <h2 className="text-base sm:text-lg font-semibold">Panier ({getCartItemCount()})</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              
              {/* Cart items */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                 {cart.map((item) => (
                   <div key={item.product.id_produit} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                     <div className="flex-1 min-w-0">
                       <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.product.nom_produit}</h4>
                       <p className="text-xs sm:text-sm text-gray-600">{formatPrice(item.product.prix_cfa)} FCFA</p>
                     </div>
                     <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                       <button
                         onClick={() => handleUpdateQuantity(item.product.id_produit, item.quantity - 1)}
                         className="p-1 rounded hover:bg-gray-200"
                       >
                         <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                       </button>
                       <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.quantity}</span>
                       <button
                         onClick={() => handleUpdateQuantity(item.product.id_produit, item.quantity + 1)}
                         className="p-1 rounded hover:bg-gray-200"
                       >
                         <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                       </button>
                       <button
                         onClick={() => handleRemoveFromCart(item.product.id_produit)}
                         className="p-1 rounded hover:bg-red-100 text-red-600 ml-1 sm:ml-2"
                       >
                         <X className="w-3 h-3 sm:w-4 sm:h-4" />
                       </button>
                     </div>
                   </div>
                 ))}
                
                {cart.length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Votre panier est vide</p>
                  </div>
                )}
              </div>
              
              {/* Cart footer */}
              {cart.length > 0 && (
                <div className="border-t p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center text-base sm:text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-blue-600">{formatPrice(getTotalPrice())} FCFA</span>
                  </div>
                  
                  <button
                    onClick={handleValidateOrder}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Valider la commande</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowPayment(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-sm sm:max-w-md w-full p-4 sm:p-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✅</span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Commande envoyée !</h2>
                <p className="text-sm text-gray-600">Votre commande a été transmise à la cuisine</p>
              </div>
              
              <div className="flex space-x-3 mb-4">
                <button
                  onClick={() => {
                    setShowBillPreview(true);
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>🛒</span>
                  <span className="text-sm font-medium">Continuer la commande</span>
                </button>
                <button
                  onClick={() => {
                    setShowPaymentOptions(true);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>💳</span>
                  <span className="text-sm font-medium">Passer au paiement</span>
                </button>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Annuler
                </button>
              </div>
              
              {showPaymentOptions && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Choisir le mode de paiement</h3>
                
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {[
                  { id: 'MOBILE_MONEY', label: 'Mobile Money', icon: '📱' },
                  { id: 'A_LA_CAISSE', label: 'Payer à la caisse', icon: '🏪' }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id as any)}
                    className={`w-full p-3 border rounded-lg text-left flex items-center space-x-3 transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium">{method.label}</span>
                  </button>
                ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowPaymentOptions(false);
                        setSelectedPaymentMethod(null);
                      }}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={!selectedPaymentMethod || isProcessing}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      {isProcessing ? 'Traitement...' : 'Confirmer le paiement'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'aperçu de la facture */}
      {showBillPreview && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowBillPreview(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-sm sm:max-w-md w-full p-4 sm:p-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📋</span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Aperçu de votre facture</h2>
                <p className="text-sm text-gray-600">Voici le récapitulatif de votre commande actuelle</p>
              </div>
              
              {/* Détails de la facture */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.product.id_produit} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{item.product.nom_produit} x{item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.product.prix_cfa * item.quantity)} FCFA</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-2 mt-3">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total actuel:</span>
                    <span className="text-lg text-blue-600">{formatPrice(getTotalPrice())} FCFA</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowBillPreview(false);
                    setShowPayment(false);
                    clearCart();
                    showNotification('success', 'Vous pouvez maintenant ajouter de nouveaux produits !');
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Continuer
                </button>
                <button
                  onClick={() => {
                    setShowBillPreview(false);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour saisir le nom */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCancelName} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Votre nom
                </h2>
                <button
                  onClick={handleCancelName}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Bienvenue ! Veuillez entrer votre nom complet pour accéder au menu et commander.
                </p>
                <input
                  type="text"
                  value={tempCustomerName}
                  onChange={(e) => setTempCustomerName(e.target.value)}
                  placeholder="Votre nom complet"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleConfirmName()}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelName}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmName}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : notification.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <p className="font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPage;