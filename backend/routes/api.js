const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');

// Digital Signature Routes
router.post('/generate-keys', (req, res) => cryptoController.generateKeys(req, res));
router.post('/create-signature', (req, res) => cryptoController.createSignature(req, res));
router.post('/verify-signature', (req, res) => cryptoController.verifySignature(req, res));

// Cryptography Methods Routes
router.post('/encrypt/:method', (req, res) => cryptoController.encrypt(req, res));
router.post('/decrypt/:method', (req, res) => cryptoController.decrypt(req, res));

// Utility Routes
router.post('/hash', (req, res) => cryptoController.generateHash(req, res));
router.post('/encode-base64', (req, res) => cryptoController.encodeBase64(req, res));
router.post('/decode-base64', (req, res) => cryptoController.decodeBase64(req, res));
router.get('/random-key', (req, res) => cryptoController.generateRandomKey(req, res));

// File Export Routes
router.post('/export-file', (req, res) => cryptoController.exportFile(req, res));
router.post('/upload-pdf', (req, res) => cryptoController.uploadPDF(req, res));

// Test route
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Cryptography API is working!',
        timestamp: new Date().toISOString(),
        endpoints: [
            '/api/generate-keys (POST)',
            '/api/create-signature (POST)',
            '/api/verify-signature (POST)',
            '/api/encrypt/:method (POST)',
            '/api/decrypt/:method (POST)',
            '/api/hash (POST)',
            '/api/encode-base64 (POST)',
            '/api/decode-base64 (POST)',
            '/api/random-key (GET)'
        ]
    });
});

module.exports = router;