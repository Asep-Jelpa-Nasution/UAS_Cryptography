const crypto = require('crypto');
const CryptoJS = require('crypto-js');

class CryptoController {
    constructor() {
        console.log('CryptoController initialized');
    }

    // Generate RSA Key Pair
    generateKeys(req, res) {
        try {
            console.log('Generating RSA key pair...');
            
            // Simulate RSA key generation
            // In production, use crypto.generateKeyPair
            const keys = {
                publicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1SU1LfVLPHCozMxH2Mo
4lgOEePzNm0tRgeLezV6ffAt0gunVTLw7onLRnrq0/IzW7yWR7QkrmBL7jTKEn5u
+qKhbwKfBstIs+bMY2Zkp18gnTxKLxoS2tFczGkPLPgizskuemMghRniWaoLcyeh
kd3qqGElvW/VDL5AaWTg0nLVkjRo9z+40RQzuVaE8AkAFmxZzow3x+VJYKdjykkJ
0iT9wCS0DRTXu269V264Vf/3jvredZiKRkgwlL9xNAwxXFg0x/XFw005UWVRIkdg
cKWTjpBP2dPwVZ4WWC+9aGVd+Gyn1o0CLelf4rEjGoXbAAEgAqeGUxrcIlbjXfbc
mwIDAQAB
-----END PUBLIC KEY-----`,
                privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKj
MzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvu
NMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZ
qgtzJ6GR3eqoYSW9b9UMvkBpZODSctWSNGj3P7jRFDO5VoTwCQAWbFnOjDfH5Ulg
p2PKSQnSJP3AJLQNFNe7br1XbrhV//eO+t51mIpGSDCUv3E0DDFcWDTH9cXDTTlR
ZVEiR2BwpZOO0E/Z0/BVnhZYL71oZV34bKfWjQIt6V/isSMRhdsAASACp4ZTGtwi
VuNd9tybAgMBAAECggEBAK1cBZQCkQGcF8J1Y5QOHPIAdmWUq6JahF6P9vC9R3pQ
XvG2FrF3Q1sZbIurUQaM7kZ6JjmtKbNp2COAxK0BZXqgVGVTp7FSPQ5ZQv8CJ2K4
cZJjK9eU6n6s8jZ7VvM1n7RwqWn3qHqJ1hW0sJY2s2S5N8mH5kZq1J2z3eL2r5r
kqJwQF8q2W1W3qjqJq1J2z3eL2r5rkqJwQF8q2W1W3qjqJq1J2z3eL2r5rkqJwQF
8q2W1W3qjqJq1J2z3eL2r5rkqJwQF8q2W1W3qjqJq1J2z3eL2r5rkqJwQF8q2W1W
3qjqJq1J2z3eL2r5rkqJwQF8q2W1W3qjqJq1J2z3eL2r5rkqJwQF8q2W1W3qjqJq
1J2z3eL2r5rkqJwQF8q2W1W3qjqJq1J2z3eL2r5rkqJwQF8q2W1W3qjqJq1J2z3e
-----END PRIVATE KEY-----`
            };

            res.json({
                success: true,
                message: 'RSA key pair generated successfully',
                keys: keys,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error generating keys:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate key pair',
                error: error.message
            });
        }
    }

    // Create Digital Signature
    createSignature(req, res) {
        try {
            const { document, privateKey } = req.body;
            
            console.log('Creating digital signature...');
            
            if (!document) {
                return res.status(400).json({
                    success: false,
                    message: 'Document text is required'
                });
            }
            
            // Generate SHA-256 hash
            const hash = CryptoJS.SHA256(document).toString();
            console.log('Generated hash:', hash.substring(0, 32) + '...');
            
            // Simulate RSA signing with private key
            const timestamp = Date.now();
            const signatureData = `${hash}:${timestamp}:${privateKey ? privateKey.substring(0, 50) : 'demo'}`;
            const signature = Buffer.from(signatureData).toString('base64');
            
            res.json({
                success: true,
                message: 'Digital signature created successfully',
                data: {
                    hash: hash,
                    signature: signature,
                    timestamp: timestamp,
                    algorithm: 'RSA-SHA256'
                }
            });
        } catch (error) {
            console.error('Error creating signature:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create digital signature',
                error: error.message
            });
        }
    }

    // Verify Digital Signature
    verifySignature(req, res) {
        try {
            const { document, signature, publicKey } = req.body;
            
            console.log('Verifying digital signature...');
            
            if (!document || !signature) {
                return res.status(400).json({
                    success: false,
                    message: 'Document and signature are required'
                });
            }
            
            // Generate SHA-256 hash of document
            const documentHash = CryptoJS.SHA256(document).toString();
            
            // Decode signature
            const decodedData = Buffer.from(signature, 'base64').toString();
            const [signatureHash, timestamp] = decodedData.split(':');
            
            // Verify hash match
            const isValid = signatureHash === documentHash;
            
            res.json({
                success: true,
                message: isValid ? 'Signature is valid' : 'Signature is invalid',
                data: {
                    isValid: isValid,
                    documentHash: documentHash,
                    signatureHash: signatureHash,
                    timestamp: timestamp ? new Date(parseInt(timestamp)).toISOString() : null,
                    verificationDate: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Error verifying signature:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to verify digital signature',
                error: error.message
            });
        }
    }

    // Encrypt data with specific method
    encrypt(req, res) {
        try {
            const { method } = req.params;
            const { text, key, shift = 3 } = req.body;
            
            console.log(`Encrypting with ${method}...`);
            
            if (!text) {
                return res.status(400).json({
                    success: false,
                    message: 'Text is required'
                });
            }
            
            let result;
            
            switch (method.toLowerCase()) {
                case 'caesar':
                    result = this.caesarCipher(text, parseInt(shift), true);
                    break;
                case 'vigenere':
                    if (!key) {
                        return res.status(400).json({
                            success: false,
                            message: 'Key is required for Vigenère cipher'
                        });
                    }
                    result = this.vigenereCipher(text, key, true);
                    break;
                case 'affine':
                    result = this.affineCipher(text, 5, 8, true);
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: `Method ${method} not supported`
                    });
            }
            
            res.json({
                success: true,
                message: `Encryption successful using ${method}`,
                data: {
                    method: method,
                    original: text,
                    encrypted: result,
                    parameters: { key, shift }
                }
            });
        } catch (error) {
            console.error(`Error encrypting with ${req.params.method}:`, error);
            res.status(500).json({
                success: false,
                message: 'Encryption failed',
                error: error.message
            });
        }
    }

    // Decrypt data with specific method
    decrypt(req, res) {
        try {
            const { method } = req.params;
            const { text, key, shift = 3 } = req.body;
            
            console.log(`Decrypting with ${method}...`);
            
            if (!text) {
                return res.status(400).json({
                    success: false,
                    message: 'Text is required'
                });
            }
            
            let result;
            
            switch (method.toLowerCase()) {
                case 'caesar':
                    result = this.caesarCipher(text, parseInt(shift), false);
                    break;
                case 'vigenere':
                    if (!key) {
                        return res.status(400).json({
                            success: false,
                            message: 'Key is required for Vigenère cipher'
                        });
                    }
                    result = this.vigenereCipher(text, key, false);
                    break;
                case 'affine':
                    result = this.affineCipher(text, 5, 8, false);
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: `Method ${method} not supported`
                    });
            }
            
            res.json({
                success: true,
                message: `Decryption successful using ${method}`,
                data: {
                    method: method,
                    original: text,
                    decrypted: result,
                    parameters: { key, shift }
                }
            });
        } catch (error) {
            console.error(`Error decrypting with ${req.params.method}:`, error);
            res.status(500).json({
                success: false,
                message: 'Decryption failed',
                error: error.message
            });
        }
    }

    // Generate Hash
    generateHash(req, res) {
        try {
            const { text, algorithm = 'sha256' } = req.body;
            
            console.log(`Generating ${algorithm} hash...`);
            
            if (!text) {
                return res.status(400).json({
                    success: false,
                    message: 'Text is required'
                });
            }
            
            let hash;
            switch (algorithm.toLowerCase()) {
                case 'sha256':
                    hash = CryptoJS.SHA256(text).toString();
                    break;
                case 'sha1':
                    hash = CryptoJS.SHA1(text).toString();
                    break;
                case 'md5':
                    hash = CryptoJS.MD5(text).toString();
                    break;
                default:
                    hash = CryptoJS.SHA256(text).toString();
            }
            
            res.json({
                success: true,
                message: `${algorithm.toUpperCase()} hash generated successfully`,
                data: {
                    algorithm: algorithm,
                    hash: hash,
                    length: hash.length
                }
            });
        } catch (error) {
            console.error('Error generating hash:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate hash',
                error: error.message
            });
        }
    }

    // Base64 Encode/Decode
    encodeBase64(req, res) {
        try {
            const { text } = req.body;
            
            console.log('Encoding to Base64...');
            
            if (!text) {
                return res.status(400).json({
                    success: false,
                    message: 'Text is required'
                });
            }
            
            const encoded = Buffer.from(text).toString('base64');
            
            res.json({
                success: true,
                message: 'Base64 encoded successfully',
                data: {
                    original: text,
                    encoded: encoded
                }
            });
        } catch (error) {
            console.error('Error encoding Base64:', error);
            res.status(500).json({
                success: false,
                message: 'Base64 encoding failed',
                error: error.message
            });
        }
    }

    decodeBase64(req, res) {
        try {
            const { text } = req.body;
            
            console.log('Decoding from Base64...');
            
            if (!text) {
                return res.status(400).json({
                    success: false,
                    message: 'Base64 text is required'
                });
            }
            
            const decoded = Buffer.from(text, 'base64').toString('utf8');
            
            res.json({
                success: true,
                message: 'Base64 decoded successfully',
                data: {
                    original: text,
                    decoded: decoded
                }
            });
        } catch (error) {
            console.error('Error decoding Base64:', error);
            res.status(500).json({
                success: false,
                message: 'Base64 decoding failed',
                error: error.message
            });
        }
    }

    // Generate Random Key
    generateRandomKey(req, res) {
        try {
            const { length = 32, type = 'hex' } = req.query;
            
            console.log(`Generating random ${type} key of length ${length}...`);
            
            const lengthValue = parseInt(length);
            if (lengthValue < 8 || lengthValue > 256) {
                return res.status(400).json({
                    success: false,
                    message: 'Key length must be between 8 and 256'
                });
            }
            
            let charset = '';
            switch (type.toLowerCase()) {
                case 'hex':
                    charset = '0123456789abcdef';
                    break;
                case 'base64':
                    charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                    break;
                case 'alphanumeric':
                    charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    break;
                default:
                    charset = '0123456789abcdef';
            }
            
            let result = '';
            const randomValues = new Uint8Array(lengthValue);
            crypto.randomFillSync(randomValues);
            
            for (let i = 0; i < lengthValue; i++) {
                result += charset[randomValues[i] % charset.length];
            }
            
            res.json({
                success: true,
                message: 'Random key generated successfully',
                data: {
                    length: lengthValue,
                    type: type,
                    key: result
                }
            });
        } catch (error) {
            console.error('Error generating random key:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate random key',
                error: error.message
            });
        }
    }

    // Helper Methods
    caesarCipher(text, shift, encrypt = true) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            
            if (char.match(/[a-z]/i)) {
                const code = text.charCodeAt(i);
                let base = code >= 65 && code <= 90 ? 65 : 97;
                let shifted = encrypt ? 
                    ((code - base + shift) % 26) + base :
                    ((code - base - shift + 26) % 26) + base;
                result += String.fromCharCode(shifted);
            } else {
                result += char;
            }
        }
        return result;
    }

    vigenereCipher(text, key, encrypt = true) {
        let result = '';
        const upperKey = key.toUpperCase();
        let keyIndex = 0;
        
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            
            if (char.match(/[a-z]/i)) {
                const code = text.charCodeAt(i);
                let base = code >= 65 && code <= 90 ? 65 : 97;
                let keyChar = upperKey[keyIndex % upperKey.length];
                let keyShift = keyChar.charCodeAt(0) - 65;
                
                if (!encrypt) {
                    keyShift = 26 - keyShift;
                }
                
                let shifted = ((code - base + keyShift) % 26) + base;
                result += String.fromCharCode(shifted);
                keyIndex++;
            } else {
                result += char;
            }
        }
        return result;
    }

    affineCipher(text, a, b, encrypt = true) {
        // Helper: find modular inverse
        function modInverse(a, m) {
            a = ((a % m) + m) % m;
            for (let x = 1; x < m; x++) {
                if ((a * x) % m === 1) {
                    return x;
                }
            }
            return 1;
        }
        
        let result = '';
        const m = 26;
        
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            
            if (char.match(/[a-z]/i)) {
                const code = text.charCodeAt(i);
                let base = code >= 65 && code <= 90 ? 65 : 97;
                let x = code - base;
                
                if (encrypt) {
                    let encrypted = ((a * x + b) % m) + base;
                    result += String.fromCharCode(encrypted);
                } else {
                    let aInverse = modInverse(a, m);
                    let decrypted = ((aInverse * (x - b + m)) % m) + base;
                    result += String.fromCharCode(decrypted);
                }
            } else {
                result += char;
            }
        }
        return result;
    }
        // Export file handler
    exportFile(req, res) {
        try {
            const { content, filename = 'download.txt', type = 'text/plain' } = req.body;
            
            console.log(`Exporting file: ${filename}`);
            
            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required'
                });
            }
            
            // Set headers for file download
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', type);
            
            // Send file content
            res.send(content);
            
        } catch (error) {
            console.error('Error exporting file:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to export file',
                error: error.message
            });
        }
    }

    // Upload and process PDF file
    uploadPDF(req, res) {
        try {
            // Note: For actual file upload, use multer middleware
            // This is a simplified version
            const { filename, content } = req.body;
            
            console.log(`Processing PDF: ${filename}`);
            
            if (!filename || !content) {
                return res.status(400).json({
                    success: false,
                    message: 'Filename and content are required'
                });
            }
            
            // Simulate PDF processing
            const hash = CryptoJS.SHA256(content).toString();
            const signature = Buffer.from(`${hash}:${Date.now()}`).toString('base64');
            
            res.json({
                success: true,
                message: 'PDF processed successfully',
                data: {
                    filename: filename,
                    hash: hash,
                    signature: signature,
                    size: content.length,
                    timestamp: new Date().toISOString()
                }
            });
            
        } catch (error) {
            console.error('Error processing PDF:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to process PDF',
                error: error.message
            });
        }
    }
}

module.exports = new CryptoController();
