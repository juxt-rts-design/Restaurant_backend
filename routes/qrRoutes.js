const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const { validateQrCode } = require('../middleware/validation');
const { qrCodeRateLimit } = require('../middleware/security');

// Route pour afficher la page de la table (accessible via QR code)
router.get('/:qrCode', 
  qrCodeRateLimit,
  validateQrCode,
  async (req, res) => {
    try {
      const { qrCode } = req.params;
      
      // Vérifier si la table existe
      const table = await Table.getByQrCode(qrCode);
      if (!table) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Table non trouvée</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px; 
                background: #f5f5f5; 
              }
              .error { 
                background: white; 
                padding: 30px; 
                border-radius: 10px; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                max-width: 400px;
                margin: 0 auto;
              }
              .icon { font-size: 48px; color: #e74c3c; }
            </style>
          </head>
          <body>
            <div class="error">
              <div class="icon">❌</div>
              <h2>Table non trouvée</h2>
              <p>Cette table n'existe pas ou n'est pas active.</p>
            </div>
          </body>
          </html>
        `);
      }

      // Afficher la page de la table
      res.send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Table ${table.nom_table} - Menu</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .container { 
              max-width: 400px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 15px; 
              padding: 30px; 
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            .header { text-align: center; margin-bottom: 30px; }
            .table-name { 
              font-size: 24px; 
              font-weight: bold; 
              color: #333; 
              margin-bottom: 10px; 
            }
            .table-info { 
              color: #666; 
              font-size: 14px; 
            }
            .btn { 
              width: 100%; 
              padding: 15px; 
              background: #4CAF50; 
              color: white; 
              border: none; 
              border-radius: 8px; 
              font-size: 16px; 
              cursor: pointer; 
              margin-bottom: 15px;
              transition: background 0.3s;
            }
            .btn:hover { background: #45a049; }
            .btn-secondary { 
              background: #2196F3; 
            }
            .btn-secondary:hover { background: #1976D2; }
            .loading { 
              text-align: center; 
              color: #666; 
              font-style: italic; 
            }
            .error { 
              color: #e74c3c; 
              text-align: center; 
              margin-top: 20px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="table-name">Table ${table.nom_table}</div>
              <div class="table-info">Capacité: ${table.capacite} personnes</div>
            </div>
            
            <div id="content">
              <button class="btn" onclick="startOrder()">
                🍽️ Commencer à commander
              </button>
              
              <button class="btn btn-secondary" onclick="viewMenu()">
                📋 Voir le menu
              </button>
            </div>
            
            <div id="loading" class="loading" style="display: none;">
              Chargement...
            </div>
            
            <div id="error" class="error" style="display: none;"></div>
          </div>

          <script>
            const tableId = ${table.id_table};
            const qrCode = '${qrCode}';
            
            function showLoading() {
              document.getElementById('content').style.display = 'none';
              document.getElementById('loading').style.display = 'block';
              document.getElementById('error').style.display = 'none';
            }
            
            function showError(message) {
              document.getElementById('content').style.display = 'none';
              document.getElementById('loading').style.display = 'none';
              document.getElementById('error').style.display = 'block';
              document.getElementById('error').textContent = message;
            }
            
            function showContent() {
              document.getElementById('content').style.display = 'block';
              document.getElementById('loading').style.display = 'none';
              document.getElementById('error').style.display = 'none';
            }
            
            async function startOrder() {
              showLoading();
              
              try {
                const response = await fetch('/api/client/table/' + qrCode + '/session', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    nomComplet: prompt('Veuillez entrer votre nom complet:') || 'Client'
                  })
                });
                
                const data = await response.json();
                
                if (data.success) {
                  // Rediriger vers l'interface de commande
                  window.location.href = '/menu?session=' + data.data.session.id;
                } else {
                  showError(data.message);
                }
              } catch (error) {
                showError('Erreur de connexion. Veuillez réessayer.');
              }
            }
            
            async function viewMenu() {
              showLoading();
              
              try {
                const response = await fetch('/api/client/menu');
                const data = await response.json();
                
                if (data.success) {
                  // Afficher le menu
                  let menuHtml = '<h3>Menu du restaurant</h3>';
                  data.data.forEach(produit => {
                    menuHtml += \`
                      <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px;">
                        <strong>\${produit.nom_produit}</strong><br>
                        <small>\${produit.description || ''}</small><br>
                        <span style="color: #4CAF50; font-weight: bold;">\${produit.prix_cfa} FCFA</span>
                      </div>
                    \`;
                  });
                  
                  document.getElementById('content').innerHTML = menuHtml + 
                    '<button class="btn" onclick="location.reload()">Retour</button>';
                  showContent();
                } else {
                  showError('Erreur lors du chargement du menu');
                }
              } catch (error) {
                showError('Erreur de connexion. Veuillez réessayer.');
              }
            }
          </script>
        </body>
        </html>
      `);
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la page de table:', error);
      res.status(500).send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>Erreur</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: #f5f5f5; 
            }
            .error { 
              background: white; 
              padding: 30px; 
              border-radius: 10px; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              max-width: 400px;
              margin: 0 auto;
            }
            .icon { font-size: 48px; color: #e74c3c; }
          </style>
        </head>
        <body>
          <div class="error">
            <div class="icon">⚠️</div>
            <h2>Erreur du serveur</h2>
            <p>Une erreur est survenue. Veuillez réessayer plus tard.</p>
          </div>
        </body>
        </html>
      `);
    }
  }
);

module.exports = router;
