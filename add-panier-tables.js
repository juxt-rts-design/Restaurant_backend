const mysql = require('mysql2/promise');
const fs = require('fs');

async function addPanierTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restauration'
  });

  try {
    const sql = fs.readFileSync('./database/add-panier-table.sql', 'utf8');
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('✅ Exécuté:', statement.substring(0, 50) + '...');
      }
    }
    
    console.log('🎉 Tables paniers ajoutées avec succès !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

addPanierTables();
