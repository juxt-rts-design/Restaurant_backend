const { pool } = require('./config/database');

async function checkAdminUsers() {
  try {
    console.log('🔍 Vérification des utilisateurs administrateurs...');
    
    const [users] = await pool.execute(
      'SELECT id_utilisateur, nom_utilisateur, email, role, statut FROM utilisateurs WHERE role = "ADMIN"'
    );
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur administrateur trouvé');
    } else {
      console.log(`✅ ${users.length} utilisateur(s) administrateur trouvé(s):`);
      users.forEach(user => {
        console.log(`   - ID: ${user.id_utilisateur}`);
        console.log(`   - Nom: ${user.nom_utilisateur}`);
        console.log(`   - Email: ${user.email}`);
        console.log(`   - Rôle: ${user.role}`);
        console.log(`   - Statut: ${user.statut}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await pool.end();
  }
}

checkAdminUsers();
