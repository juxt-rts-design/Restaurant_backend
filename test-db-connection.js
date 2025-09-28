const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
  try {
    console.log('🔍 Test de connexion à la base de données...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'restauration_interactive',
      port: 3306
    });
    
    console.log('✅ Connexion à la base de données réussie !');
    
    // Test d'une requête simple
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM clients');
    console.log('✅ Nombre de clients dans la base:', rows[0].count);
    
    // Test d'une requête sur les tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('✅ Tables disponibles:', tables.map(t => Object.values(t)[0]));
    
    await connection.end();
    console.log('✅ Test terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 La base de données "restauration_interactive" n\'existe pas');
      console.log('💡 Essayez de créer la base de données ou vérifiez le nom');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 MySQL n\'est pas démarré ou n\'écoute pas sur le port 3306');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Problème d\'authentification MySQL');
    }
  }
}

testDatabaseConnection();
