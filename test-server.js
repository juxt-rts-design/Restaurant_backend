// Script de test simple pour vérifier le serveur
const http = require('http');

const baseUrl = 'http://localhost:3000';

// Fonction pour faire une requête HTTP
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Tests
async function runTests() {
  console.log('🧪 Test du serveur de Restauration Interactive');
  console.log('===============================================\n');

  try {
    // Test 1: État du serveur
    console.log('1. Test de l\'état du serveur...');
    const health = await makeRequest('/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response:`, health.data);
    console.log('');

    // Test 2: Informations API
    console.log('2. Test des informations API...');
    const info = await makeRequest('/');
    console.log(`   Status: ${info.status}`);
    console.log(`   Response:`, info.data);
    console.log('');

    // Test 3: Menu
    console.log('3. Test du menu...');
    const menu = await makeRequest('/api/client/menu');
    console.log(`   Status: ${menu.status}`);
    if (menu.data.success) {
      console.log(`   Nombre de produits: ${menu.data.data.length}`);
      console.log(`   Premier produit: ${menu.data.data[0]?.nom_produit || 'Aucun'}`);
    } else {
      console.log(`   Erreur: ${menu.data.message}`);
    }
    console.log('');

    // Test 4: QR Code
    console.log('4. Test du QR code...');
    const qrCode = await makeRequest('/table/TBL001LIBREVILLE123456789');
    console.log(`   Status: ${qrCode.status}`);
    if (qrCode.status === 200) {
      console.log('   ✅ QR code accessible (page HTML)');
    } else {
      console.log('   ❌ QR code non accessible');
    }
    console.log('');

    // Test 5: Création de session
    console.log('5. Test de création de session...');
    const session = await makeRequest('/api/client/table/TBL001LIBREVILLE123456789/session', 'POST', {
      nomComplet: 'Test Client'
    });
    console.log(`   Status: ${session.status}`);
    if (session.data.success) {
      console.log('   ✅ Session créée avec succès');
      console.log(`   ID Session: ${session.data.data.session.id}`);
    } else {
      console.log('   ❌ Erreur de création de session');
      console.log(`   Erreur: ${session.data.message}`);
      if (session.data.errors) {
        console.log('   Détails des erreurs:');
        session.data.errors.forEach(error => {
          console.log(`     - ${error.msg}`);
        });
      }
    }
    console.log('');

    // Test 6: Validation des données
    console.log('6. Test de validation (nom vide)...');
    const validation = await makeRequest('/api/client/table/TBL001LIBREVILLE123456789/session', 'POST', {
      nomComplet: ''
    });
    console.log(`   Status: ${validation.status}`);
    if (validation.status === 400) {
      console.log('   ✅ Validation fonctionne (erreur attendue)');
    } else {
      console.log('   ❌ Validation ne fonctionne pas');
    }
    console.log('');

    console.log('🎉 Tests terminés !');
    console.log('\n📋 Résumé:');
    console.log('- Si tous les tests passent, votre API fonctionne correctement');
    console.log('- Si des tests échouent, vérifiez la configuration de la base de données');
    console.log('- Assurez-vous que le serveur est démarré avec: npm run dev');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    console.log('\n🔧 Solutions possibles:');
    console.log('1. Vérifiez que le serveur est démarré: npm run dev');
    console.log('2. Vérifiez que le port 3000 est libre');
    console.log('3. Vérifiez la configuration de la base de données');
  }
}

// Exécuter les tests
runTests();
