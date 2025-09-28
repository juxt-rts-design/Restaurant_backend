const mysql = require('mysql2/promise');

async function checkDatabases() {
  try {
    console.log('🔍 Vérification des bases de données disponibles...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    });
    
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('📋 Bases de données disponibles:');
    databases.forEach(db => {
      const dbName = Object.values(db)[0];
      console.log(`  - ${dbName}`);
    });
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkDatabases();
