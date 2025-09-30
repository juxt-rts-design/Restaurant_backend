// Middleware pour filtrer automatiquement les données par restaurant_id
const restaurantFilter = (req, res, next) => {
  // Ajouter restaurant_id aux paramètres de requête si l'utilisateur est authentifié
  if (req.user && req.user.restaurantId) {
    req.restaurantId = req.user.restaurantId;
  }
  
  next();
};

// Middleware pour les requêtes de création (INSERT)
const addRestaurantIdToBody = (req, res, next) => {
  if (req.user && req.user.restaurantId) {
    req.body.restaurant_id = req.user.restaurantId;
  }
  next();
};

// Middleware pour les requêtes de mise à jour (UPDATE)
const addRestaurantIdToUpdate = (req, res, next) => {
  if (req.user && req.user.restaurantId) {
    req.body.restaurant_id = req.user.restaurantId;
  }
  next();
};

// Helper pour construire les clauses WHERE avec restaurant_id
const buildRestaurantWhereClause = (baseWhere = '', restaurantId) => {
  if (!restaurantId) return baseWhere;
  
  const restaurantCondition = `restaurant_id = ${restaurantId}`;
  
  if (!baseWhere) {
    return `WHERE ${restaurantCondition}`;
  }
  
  return `${baseWhere} AND ${restaurantCondition}`;
};

// Helper pour construire les clauses JOIN avec restaurant_id
const buildRestaurantJoinClause = (restaurantId) => {
  if (!restaurantId) return '';
  return `AND restaurant_id = ${restaurantId}`;
};

module.exports = {
  restaurantFilter,
  addRestaurantIdToBody,
  addRestaurantIdToUpdate,
  buildRestaurantWhereClause,
  buildRestaurantJoinClause
};
const restaurantFilter = (req, res, next) => {
  // Ajouter restaurant_id aux paramètres de requête si l'utilisateur est authentifié
  if (req.user && req.user.restaurantId) {
    req.restaurantId = req.user.restaurantId;
  }
  
  next();
};

// Middleware pour les requêtes de création (INSERT)
const addRestaurantIdToBody = (req, res, next) => {
  if (req.user && req.user.restaurantId) {
    req.body.restaurant_id = req.user.restaurantId;
  }
  next();
};

// Middleware pour les requêtes de mise à jour (UPDATE)
const addRestaurantIdToUpdate = (req, res, next) => {
  if (req.user && req.user.restaurantId) {
    req.body.restaurant_id = req.user.restaurantId;
  }
  next();
};

// Helper pour construire les clauses WHERE avec restaurant_id
const buildRestaurantWhereClause = (baseWhere = '', restaurantId) => {
  if (!restaurantId) return baseWhere;
  
  const restaurantCondition = `restaurant_id = ${restaurantId}`;
  
  if (!baseWhere) {
    return `WHERE ${restaurantCondition}`;
  }
  
  return `${baseWhere} AND ${restaurantCondition}`;
};

// Helper pour construire les clauses JOIN avec restaurant_id
const buildRestaurantJoinClause = (restaurantId) => {
  if (!restaurantId) return '';
  return `AND restaurant_id = ${restaurantId}`;
};

module.exports = {
  restaurantFilter,
  addRestaurantIdToBody,
  addRestaurantIdToUpdate,
  buildRestaurantWhereClause,
  buildRestaurantJoinClause
};
