// Test de validation simple
const { body, param, validationResult } = require('express-validator');

// Test de validation QR code
const validateQrCode = [
  param('qrCode')
    .isLength({ min: 20, max: 30 })
    .withMessage('QR code invalide')
];

// Test avec notre QR code
const qrCode = 'TBL001LIBREVILLE123456789';
console.log('QR Code à tester:', qrCode);
console.log('Longueur:', qrCode.length);

// Simuler la validation
const req = {
  params: { qrCode: qrCode }
};

// Exécuter la validation
Promise.all(validateQrCode.map(validation => validation.run(req)))
  .then(() => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      console.log('✅ Validation réussie');
    } else {
      console.log('❌ Validation échouée:');
      console.log(errors.array());
    }
  })
  .catch(err => {
    console.error('Erreur de validation:', err);
  });
