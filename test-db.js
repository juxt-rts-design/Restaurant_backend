const { pool } = require('./config/database');

async function testDatabase() {
  try {
    console.log('🔍 Test de la base de données...');
    
    // Test 1: Vérifier la connexion
    console.log('\n1. Test de connexion...');
    const connection = await pool.getConnection();
    console.log('✅ Connexion réussie');
    connection.release();
    
    // Test 2: Vérifier les tables
    console.log('\n2. Vérification des tables...');
    const [tables] = await pool.execute('SHOW TABLES');
    console.log('Tables disponibles:', tables.map(t => Object.values(t)[0]));
    
    // Test 3: Vérifier le contenu de la table 'tables'
    console.log('\n3. Contenu de la table "tables"...');
    const [tableRows] = await pool.execute('SELECT * FROM tables LIMIT 5');
    console.log('Premières 5 tables:', JSON.stringify(tableRows, null, 2));
    
    // Test 4: Rechercher spécifiquement le QR code
    console.log('\n4. Recherche du QR code TBL001LIBREVILLE123456789...');
    const [qrRows] = await pool.execute(
      'SELECT * FROM tables WHERE qr_code = ?', 
      ['TBL001LIBREVILLE123456789']
    );
    console.log('Résultat de la recherche:', JSON.stringify(qrRows, null, 2));
    
    // Test 5: Vérifier la structure de la table
    console.log('\n5. Structure de la table "tables"...');
    const [structure] = await pool.execute('DESCRIBE tables');
    console.log('Structure:', JSON.stringify(structure, null, 2));
    
    // Test 6: Compter les tables actives
    console.log('\n6. Nombre de tables actives...');
    const [activeCount] = await pool.execute('SELECT COUNT(*) as count FROM tables WHERE active = 1');
    console.log('Tables actives:', activeCount[0].count);
    
    // Test 7: Vérifier les produits
    console.log('\n7. Vérification des produits...');
    const [productCount] = await pool.execute('SELECT COUNT(*) as count FROM produits');
    console.log('Nombre de produits:', productCount[0].count);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

testDatabase();
