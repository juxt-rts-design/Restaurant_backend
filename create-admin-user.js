const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

async function createAdminUser() {
  try {
    console.log('🔐 Création de l\'utilisateur administrateur...');

    // Vérifier si un admin existe déjà
    const [existingAdmins] = await pool.execute(
      'SELECT id_utilisateur FROM utilisateurs WHERE role = "ADMIN"'
    );

    if (existingAdmins.length > 0) {
      console.log('✅ Un administrateur existe déjà dans la base de données');
      return;
    }

    // Données de l'admin par défaut
    const adminData = {
      nom_utilisateur: 'Administrateur SaaS',
      email: 'admin@saas.com',
      mot_de_passe: 'admin123',
      role: 'ADMIN',
      restaurant_id: null // L'admin n'est pas lié à un restaurant spécifique
    };

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(adminData.mot_de_passe, 10);

    // Créer l'utilisateur admin
    const [result] = await pool.execute(`
      INSERT INTO utilisateurs (
        nom_utilisateur, 
        email, 
        mot_de_passe, 
        role, 
        restaurant_id, 
        statut, 
        date_creation
      ) VALUES (?, ?, ?, ?, ?, 'ACTIF', NOW())
    `, [
      adminData.nom_utilisateur,
      adminData.email,
      hashedPassword,
      adminData.role,
      adminData.restaurant_id
    ]);

    console.log('✅ Utilisateur administrateur créé avec succès !');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Mot de passe:', adminData.mot_de_passe);
    console.log('🆔 ID:', result.insertId);
    console.log('');
    console.log('🚀 Vous pouvez maintenant vous connecter à l\'interface d\'administration');
    console.log('🌐 URL: http://localhost:3002');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
  } finally {
    // Fermer le pool de connexions
    await pool.end();
  }
}

// Exécuter la création de l'admin
createAdminUser();
