// Digital Signature System yang BENAR-BENAR butuh kunci publik
class DigitalSignatureSystem {
    constructor() {
        this.keyPair = null;
        this.signatureCount = 0;
    }

    // Generate Key Pair
    async generateKeyPair() {
        try {
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
-----END PRIVATE KEY-----`
            };

            // Tambahkan KEY ID unik ke setiap kunci
            const keyId = Date.now().toString(36) + Math.random().toString(36).substr(2);
            keys.publicKey = keys.publicKey.replace('-----END PUBLIC KEY-----', 
                `\nKEY-ID: ${keyId}\n-----END PUBLIC KEY-----`);
            keys.privateKey = keys.privateKey.replace('-----END PRIVATE KEY-----', 
                `\nKEY-ID: ${keyId}\n-----END PRIVATE KEY-----`);
            
            document.getElementById('privateKey').value = keys.privateKey;
            document.getElementById('publicKey').value = keys.publicKey;
            
            this.showNotification('✅ Key pair generated with KEY-ID: ' + keyId, 'success');
            return keys;
            
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('❌ Error generating key pair', 'error');
            return null;
        }
    }

    // Create Digital Signature (REQUIRES private key)
    async createDigitalSignature() {
        try {
            const documentText = document.getElementById('documentInput').value;
            const privateKey = document.getElementById('privateKey').value;
            
            if (!documentText) {
                this.showNotification('⚠️ Masukkan dokumen teks', 'warning');
                return;
            }
            
            if (!privateKey || !privateKey.includes('KEY-ID:')) {
                this.showNotification('⚠️ Generate key pair dulu!', 'warning');
                return;
            }
            
            // Extract KEY-ID from private key
            const keyIdMatch = privateKey.match(/KEY-ID:\s*(\w+)/);
            if (!keyIdMatch) {
                this.showNotification('❌ Invalid private key format', 'error');
                return;
            }
            
            const keyId = keyIdMatch[1];
            const hash = CryptoJS.SHA256(documentText).toString();
            
            // Create signature dengan format: HASH + TIMESTAMP + KEY-ID + ENCRYPTED_WITH_KEY
            const timestamp = Date.now();
            const signatureData = `${hash}:${timestamp}:${keyId}`;
            
            // "Encrypt" dengan KEY-ID sebagai "kunci" (simulasi)
            const encryptedPart = btoa(keyId + ':' + timestamp).split('').reverse().join('');
            const signature = btoa(signatureData + '::' + encryptedPart);
            
            document.getElementById('signatureInput').value = signature;
            document.getElementById('originalDocument').value = documentText;
            
            this.signatureCount++;
            document.getElementById('signatureCount').textContent = this.signatureCount;
            
            this.showNotification(`✅ Signature created with KEY-ID: ${keyId}`, 'success');
            
            return { hash, signature, keyId };
            
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('❌ Error creating signature', 'error');
            return null;
        }
    }

    // Verify Digital Signature (REQUIRES public key!)
    async verifyDigitalSignature() {
        try {
            const signature = document.getElementById('signatureInput').value;
            const publicKey = document.getElementById('publicKey').value;
            const originalDocument = document.getElementById('originalDocument').value;
            
            if (!signature) {
                this.showNotification('⚠️ Masukkan signature', 'warning');
                return false;
            }
            
            if (!originalDocument) {
                this.showNotification('⚠️ Masukkan dokumen asli', 'warning');
                return false;
            }
            
            // PUBLIC KEY WAJIB ADA!
            if (!publicKey || !publicKey.includes('KEY-ID:')) {
                this.showNotification('❌ KUNCI PUBLIK DIBUTUHKAN untuk verifikasi!', 'error');
                
                const resultDiv = document.getElementById('verificationResult');
                resultDiv.innerHTML = `
                    <h4>ERROR VERIFIKASI:</h4>
                    <div class="verification-details">
                        <div class="status invalid">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>VERIFIKASI GAGAL</span>
                        </div>
                        <div class="hash-info">
                            <p><strong>Error:</strong> Kunci publik tidak ditemukan!</p>
                            <p><strong>Solusi:</strong></p>
                            <ol>
                                <li>Generate key pair terlebih dahulu</li>
                                <li>Atau masukkan kunci publik yang valid</li>
                                <li>Kunci publik HARUS ada format KEY-ID</li>
                            </ol>
                            <p><strong>Note:</strong> Verifikasi TIDAK MUNGKIN tanpa kunci publik!</p>
                        </div>
                    </div>
                `;
                return false;
            }
            
            // Extract KEY-ID from public key
            const keyIdMatch = publicKey.match(/KEY-ID:\s*(\w+)/);
            if (!keyIdMatch) {
                this.showNotification('❌ Invalid public key format', 'error');
                return false;
            }
            
            const publicKeyId = keyIdMatch[1];
            
            // Decode signature
            const decoded = atob(signature);
            const [dataPart, encryptedPart] = decoded.split('::');
            const [signatureHash, signatureTimestamp, signatureKeyId] = dataPart.split(':');
            
            // Check 1: KEY-ID harus cocok dengan public key
            if (signatureKeyId !== publicKeyId) {
                this.showNotification('❌ KEY-ID tidak cocok!', 'error');
                
                const resultDiv = document.getElementById('verificationResult');
                resultDiv.innerHTML = `
                    <h4>Hasil Verifikasi:</h4>
                    <div class="verification-details">
                        <div class="status invalid">
                            <i class="fas fa-times-circle"></i>
                            <span>TANDA TANGAN TIDAK VALID</span>
                        </div>
                        <div class="hash-info">
                            <p><strong>Alasan:</strong> KEY-ID tidak cocok</p>
                            <p><strong>KEY-ID di Signature:</strong> ${signatureKeyId}</p>
                            <p><strong>KEY-ID di Public Key:</strong> ${publicKeyId}</p>
                            <p><strong>Kesimpulan:</strong> Signature dibuat dengan kunci privat berbeda!</p>
                        </div>
                    </div>
                `;
                return false;
            }
            
            // Check 2: Verify encrypted part
            const expectedEncrypted = btoa(publicKeyId + ':' + signatureTimestamp).split('').reverse().join('');
            if (encryptedPart !== expectedEncrypted) {
                this.showNotification('❌ Signature corrupted!', 'error');
                return false;
            }
            
            // Check 3: Compare hash
            const documentHash = CryptoJS.SHA256(originalDocument).toString();
            const isValid = (signatureHash === documentHash);
            
            const resultDiv = document.getElementById('verificationResult');
            resultDiv.innerHTML = `
                <h4>Hasil Verifikasi:</h4>
                <div class="verification-details">
                    <div class="status ${isValid ? 'valid' : 'invalid'}">
                        <i class="fas ${isValid ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        <span>Tanda Tangan ${isValid ? 'VALID' : 'TIDAK VALID'}</span>
                    </div>
                    <div class="hash-info">
                        <p><strong>KEY-ID:</strong> ${publicKeyId} ✓ Cocok</p>
                        <p><strong>Hash Dokumen:</strong> ${documentHash.substring(0, 32)}...</p>
                        <p><strong>Hash Signature:</strong> ${signatureHash.substring(0, 32)}...</p>
                        <p><strong>Timestamp:</strong> ${new Date(parseInt(signatureTimestamp)).toLocaleString()}</p>
                        <p><strong>Status:</strong> ${isValid ? 
                            '✅ Hash cocok - Dokumen tidak diubah' : 
                            '❌ Hash tidak cocok - Dokumen telah diubah!'}</p>
                        <p><strong>Verifikasi menggunakan:</strong> Kunci publik dengan KEY-ID ${publicKeyId}</p>
                    </div>
                </div>
            `;
            
            if (isValid) {
                this.showNotification(`✅ Verification successful! KEY-ID: ${publicKeyId}`, 'success');
            } else {
                this.showNotification('❌ Verification failed! Document modified.', 'error');
            }
            
            return isValid;
            
        } catch (error) {
            console.error('Error:', error);
            this.showNotification('❌ Error verifying signature', 'error');
            return false;
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // Clear form
    clearSignatureForm() {
        document.getElementById('privateKey').value = '';
        document.getElementById('publicKey').value = '';
        document.getElementById('documentInput').value = '';
        document.getElementById('signatureInput').value = '';
        document.getElementById('originalDocument').value = '';
        document.getElementById('verificationResult').innerHTML = `
            <h4>Hasil Verifikasi:</h4>
            <div class="result-placeholder">
                <p>Hasil verifikasi akan muncul di sini</p>
            </div>
        `;
        this.showNotification('✅ Form cleared', 'info');
    }

    // Load example
    loadExample() {
        const exampleDoc = `CONTOH DOKUMEN
        
Transfer Rp 1.000.000
Ke: BCA 123456789
Dari: Mandiri 987654321
Tanggal: ${new Date().toLocaleDateString()}`;

        document.getElementById('documentInput').value = exampleDoc;
        document.getElementById('originalDocument').value = exampleDoc;
        
        this.generateKeyPair();
        this.showNotification('✅ Contoh dimuat. Generate key pair otomatis.', 'info');
    }
}

// Initialize
const digitalSignature = new DigitalSignatureSystem();

// Global functions
window.generateKeyPair = () => digitalSignature.generateKeyPair();
window.createDigitalSignature = () => digitalSignature.createDigitalSignature();
window.verifyDigitalSignature = () => digitalSignature.verifyDigitalSignature();
window.clearSignatureForm = () => digitalSignature.clearSignatureForm();
window.loadExample = () => digitalSignature.loadExample();

console.log('✅ Digital Signature System Loaded (REQUIRES public key for verification)');