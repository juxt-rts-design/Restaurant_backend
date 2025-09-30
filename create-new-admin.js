const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

async function createNewAdmin() {
  try {
    console.log('🔐 Création d\'un nouvel utilisateur administrateur...');

    // Données de l'admin
    const adminData = {
      nom_utilisateur: 'Admin SaaS',
      email: 'admin@saas.com',
      mot_de_passe: 'admin123',
      role: 'ADMIN',
      restaurant_id: null
    };

    // Supprimer l'ancien admin s'il existe
    await pool.execute('DELETE FROM utilisateurs WHERE email = ?', [adminData.email]);

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

    console.log('✅ Nouvel utilisateur administrateur créé avec succès !');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Mot de passe:', adminData.mot_de_passe);
    console.log('🆔 ID:', result.insertId);

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await pool.end();
  }
}

createNewAdmin();
