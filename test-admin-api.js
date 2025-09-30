const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

// Configuration axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let adminToken = '';

// Fonction pour tester la connexion
async function testConnection() {
  try {
    console.log('🔍 Test de connexion à l\'API...');
    const response = await api.get('/health');
    console.log('✅ Connexion réussie:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    return false;
  }
}

// Fonction pour tester la connexion admin
async function testAdminLogin() {
  try {
    console.log('\n🔐 Test de connexion administrateur...');
    
    const loginData = {
      email: 'admin@saas.com',
      password: 'admin123'
    };

    const response = await api.post('/api/admin/auth/login', loginData);
    
    if (response.data.success) {
      adminToken = response.data.data.token;
      console.log('✅ Connexion admin réussie !');
      console.log('👤 Utilisateur:', response.data.data.user.nom_utilisateur);
      console.log('🔑 Token reçu:', adminToken.substring(0, 20) + '...');
      return true;
    } else {
      console.error('❌ Échec de la connexion:', response.data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la connexion admin:', error.response?.data?.error || error.message);
    return false;
  }
}

// Fonction pour tester la vérification du token
async function testTokenVerification() {
  try {
    console.log('\n🔍 Test de vérification du token...');
    
    const response = await api.get('/api/admin/auth/verify', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Token valide !');
      console.log('👤 Utilisateur vérifié:', response.data.data.nom_utilisateur);
      return true;
    } else {
      console.error('❌ Token invalide:', response.data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du token:', error.response?.data?.error || error.message);
    return false;
  }
}

// Fonction pour tester le dashboard
async function testDashboard() {
  try {
    console.log('\n📊 Test du dashboard...');
    
    const response = await api.get('/api/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Dashboard chargé avec succès !');
      console.log('📈 Statistiques:', {
        total_restaurants: response.data.data.total_restaurants,
        restaurants_actifs: response.data.data.restaurants_actifs,
        total_utilisateurs: response.data.data.total_utilisateurs,
        commandes_30j: response.data.data.commandes_30j
      });
      return true;
    } else {
      console.error('❌ Erreur dashboard:', response.data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement du dashboard:', error.response?.data?.error || error.message);
    return false;
  }
}

// Fonction pour tester la récupération des restaurants
async function testGetRestaurants() {
  try {
    console.log('\n🏢 Test de récupération des restaurants...');
    
    const response = await api.get('/api/admin/restaurants', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Restaurants récupérés avec succès !');
      console.log('📊 Nombre de restaurants:', response.data.data.length);
      
      if (response.data.data.length > 0) {
        const restaurant = response.data.data[0];
        console.log('🏪 Premier restaurant:', {
          id: restaurant.id,
          nom: restaurant.nom,
          statut: restaurant.statut,
          plan: restaurant.plan
        });
      }
      return true;
    } else {
      console.error('❌ Erreur restaurants:', response.data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des restaurants:', error.response?.data?.error || error.message);
    return false;
  }
}

// Fonction pour tester la création d'un restaurant
async function testCreateRestaurant() {
  try {
    console.log('\n🏗️ Test de création d\'un restaurant...');
    
    const restaurantData = {
      nom: 'Restaurant Test Admin',
      slug: 'restaurant-test-admin',
      adresse: '123 Rue de Test, 75001 Paris',
      telephone: '+33 1 23 45 67 89',
      email: 'test@restaurant-admin.com',
      couleur_theme: '#FF6B6B',
      devise: 'EUR',
      fuseau_horaire: 'Europe/Paris',
      plan: 'BASIC',
      limite_commandes_mois: 1000,
      limite_utilisateurs: 5
    };
    
    const response = await api.post('/api/admin/restaurants', restaurantData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Restaurant créé avec succès !');
      console.log('🏪 Restaurant créé:', {
        id: response.data.data.id,
        nom: response.data.data.nom,
        slug: response.data.data.slug,
        statut: response.data.data.statut
      });
      return response.data.data.id;
    } else {
      console.error('❌ Erreur création restaurant:', response.data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création du restaurant:', error.response?.data?.error || error.message);
    return null;
  }
}

// Fonction pour tester la récupération des utilisateurs
async function testGetUsers() {
  try {
    console.log('\n👥 Test de récupération des utilisateurs...');
    
    const response = await api.get('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Utilisateurs récupérés avec succès !');
      console.log('📊 Nombre d\'utilisateurs:', response.data.data.length);
      
      if (response.data.data.length > 0) {
        const user = response.data.data[0];
        console.log('👤 Premier utilisateur:', {
          id: user.id_utilisateur,
          nom: user.nom_utilisateur,
          email: user.email,
          role: user.role
        });
      }
      return true;
    } else {
      console.error('❌ Erreur utilisateurs:', response.data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', error.response?.data?.error || error.message);
    return false;
  }
}

// Fonction pour tester la vérification de slug
async function testSlugCheck() {
  try {
    console.log('\n🔍 Test de vérification de slug...');
    
    const response = await api.get('/api/admin/restaurants/check-slug/test-slug-available', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Vérification de slug réussie !');
      console.log('📝 Slug disponible:', response.data.data.available);
      return true;
    } else {
      console.error('❌ Erreur vérification slug:', response.data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du slug:', error.response?.data?.error || error.message);
    return false;
  }
}

// Fonction principale de test
async function runAllTests() {
  console.log('🧪 DÉMARRAGE DES TESTS DE L\'API ADMIN');
  console.log('=====================================\n');

  const tests = [
    { name: 'Connexion API', fn: testConnection },
    { name: 'Connexion Admin', fn: testAdminLogin },
    { name: 'Vérification Token', fn: testTokenVerification },
    { name: 'Dashboard', fn: testDashboard },
    { name: 'Récupération Restaurants', fn: testGetRestaurants },
    { name: 'Création Restaurant', fn: testCreateRestaurant },
    { name: 'Récupération Utilisateurs', fn: testGetUsers },
    { name: 'Vérification Slug', fn: testSlugCheck }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      console.error(`❌ Erreur inattendue dans le test "${test.name}":`, error.message);
    }
  }

  console.log('\n📊 RÉSULTATS DES TESTS');
  console.log('======================');
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`❌ Tests échoués: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 TOUS LES TESTS SONT PASSÉS !');
    console.log('🚀 L\'API d\'administration est prête à être utilisée !');
  } else {
    console.log('\n⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
  }

  console.log('\n🌐 Interface d\'administration: http://localhost:3002');
  console.log('🔗 API Backend: http://localhost:3001');
}

// Exécuter les tests
runAllTests().catch(console.error);
