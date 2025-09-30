const { pool } = require('./config/database');

async function checkRealData() {
  try {
    console.log('🔍 Vérification des vraies données...\n');
    
    // Vérifier les tables existantes
    const [tables] = await pool.execute('SHOW TABLES');
    console.log('📋 Tables disponibles:', tables);
    
    // Vérifier les commandes avec CA réel
    const [commandes] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT c.id_commande) as total_commandes,
        COALESCE(SUM(cp.prix_cfa * cp.quantite), 0) as total_ca_fcfa,
        COUNT(DISTINCT CASE WHEN DATE(c.date_commande) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN c.id_commande END) as commandes_30j,
        COALESCE(SUM(CASE WHEN DATE(c.date_commande) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN cp.prix_cfa * cp.quantite ELSE 0 END), 0) as ca_30j_fcfa
      FROM commandes c
      LEFT JOIN commande_produits cp ON c.id_commande = cp.id_commande
    `);
    console.log('💰 Commandes et CA (FCFA):', commandes);
    
    // Vérifier les utilisateurs par rôle
    const [users] = await pool.execute(`
      SELECT 
        role,
        COUNT(*) as count
      FROM utilisateurs 
      GROUP BY role
    `);
    console.log('👥 Utilisateurs par rôle:', users);
    
    // Vérifier les produits par restaurant
    const [produits] = await pool.execute(`
      SELECT 
        r.nom_restaurant,
        COUNT(p.id_produit) as nb_produits,
        COALESCE(AVG(p.prix_cfa), 0) as prix_moyen_fcfa
      FROM restaurants r
      LEFT JOIN produits p ON r.id_restaurant = p.id_restaurant
      GROUP BY r.id_restaurant, r.nom_restaurant
    `);
    console.log('🍽️ Produits par restaurant:', produits);
    
    // Top restaurants par CA
    const [topRestaurants] = await pool.execute(`
      SELECT 
        r.nom_restaurant,
        COUNT(DISTINCT c.id_commande) as nb_commandes,
        COALESCE(SUM(cp.prix_cfa * cp.quantite), 0) as ca_total_fcfa
      FROM restaurants r
      LEFT JOIN commandes c ON r.id_restaurant = c.id_restaurant
      LEFT JOIN commande_produits cp ON c.id_commande = cp.id_commande
      GROUP BY r.id_restaurant, r.nom_restaurant
      ORDER BY ca_total_fcfa DESC
      LIMIT 5
    `);
    console.log('🏆 Top restaurants par CA:', topRestaurants);
    
    await pool.end();
    console.log('\n✅ Vérification terminée !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkRealData();
