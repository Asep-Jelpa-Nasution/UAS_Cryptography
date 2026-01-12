// ===============================
// Main Initialization
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Cryptography Web App initialized');
    
    // Initialize download functions
    initDownloadFunctions();
    
    // Initialize file upload
    initFileUpload();
    
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1000);
});

// ===============================
// Utility: Download Text File
// ===============================
function downloadTextAsFile(text, filename) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===============================
// Download Functions
// ===============================
function initDownloadFunctions() {
    console.log('Initializing download functions...');
    
    // 1. Digital Signature
    window.downloadSignature = () => {
        const signature = document.getElementById('signatureInput');
        if (!signature || !signature.value.trim()) {
            alert('⚠️ Tidak ada tanda tangan untuk diunduh!');
            return;
        }
        
        const content = `===== DIGITAL SIGNATURE =====
        
Timestamp: ${new Date().toISOString()}
Algorithm: RSA-SHA256

SIGNATURE:
${signature.value}

==============================`;
        
        downloadTextAsFile(content, `digital_signature_${Date.now()}.sig`);
    };

    // 2. RSA Keys
    window.downloadKeys = () => {
        const privateKey = document.getElementById('privateKey');
        const publicKey = document.getElementById('publicKey');
        
        if (!privateKey || !publicKey || !privateKey.value.trim() || !publicKey.value.trim()) {
            alert('⚠️ Tidak ada kunci untuk diunduh!');
            return;
        }
        
        const content = `===== RSA KEY PAIR =====
        
Generated: ${new Date().toISOString()}
Algorithm: RSA-2048

PRIVATE KEY:
${privateKey.value}

PUBLIC KEY:
${publicKey.value}

WARNING: Keep private key secure!
==============================`;
        
        downloadTextAsFile(content, `rsa_keys_${Date.now()}.key`);
    };

    // 3. Verification Result
    window.downloadVerification = () => {
        const resultDiv = document.getElementById('verificationResult');
        if (!resultDiv) {
            alert('⚠️ Tidak ada hasil verifikasi!');
            return;
        }
        
        const content = `===== VERIFICATION RESULT =====
        
Timestamp: ${new Date().toISOString()}
Verified: Cryptography Web App

RESULT:
${resultDiv.innerText.trim()}

==============================`;
        
        downloadTextAsFile(content, `verification_result_${Date.now()}.txt`);
    };

    // 4. Hash Result
    window.downloadHash = () => {
        const resultDiv = document.getElementById('hashResult');
        const input = document.getElementById('hashInput');
        const algorithm = document.getElementById('hashAlgorithm');
        
        if (!resultDiv || !resultDiv.innerText.trim()) {
            alert('⚠️ Tidak ada hash untuk diunduh!');
            return;
        }
        
        const content = `===== HASH RESULT =====
        
Algorithm: ${algorithm.value.toUpperCase()}
Timestamp: ${new Date().toISOString()}

INPUT:
${input.value}

HASH:
${resultDiv.innerText.trim()}

==============================`;
        
        downloadTextAsFile(content, `${algorithm.value}_hash_${Date.now()}.txt`);
    };

    // 5. Base64 Result
    window.downloadBase64 = () => {
        const resultDiv = document.getElementById('base64Result');
        const input = document.getElementById('base64Input');
        
        if (!resultDiv || !resultDiv.innerText.trim()) {
            alert('⚠️ Tidak ada hasil Base64 untuk diunduh!');
            return;
        }
        
        const content = `===== BASE64 RESULT =====
        
Timestamp: ${new Date().toISOString()}

INPUT:
${input.value}

RESULT:
${resultDiv.innerText.trim()}

==============================`;
        
        downloadTextAsFile(content, `base64_${Date.now()}.txt`);
    };

    // 6. Random Key
    window.downloadRandomKey = () => {
        const resultDiv = document.getElementById('keyResult');
        
        if (!resultDiv || !resultDiv.innerText.trim()) {
            alert('⚠️ Tidak ada kunci untuk diunduh!');
            return;
        }
        
        const content = `===== RANDOM KEY =====
        
Generated: ${new Date().toISOString()}

KEY:
${resultDiv.innerText.trim()}

==============================`;
        
        downloadTextAsFile(content, `random_key_${Date.now()}.txt`);
    };
}

// ===============================
// File Upload Handler
// ===============================
function initFileUpload() {
    const upload = document.getElementById('fileUpload');
    const input = document.getElementById('documentInput');
    const info = document.getElementById('fileInfo');
    
    if (!upload || !input) return;
    
    upload.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        
        const sizeKB = (file.size / 1024).toFixed(2);
        if (info) {
            info.innerHTML = `<strong>${file.name}</strong><br>
                              <small>${sizeKB} KB • ${file.type}</small>`;
        }
        
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            const reader = new FileReader();
            reader.onload = ev => {
                input.value = `[File: ${file.name}]\n\n${ev.target.result}`;
            };
            reader.readAsText(file);
        } else if (file.type === 'application/pdf') {
            input.value = `[PDF File: ${file.name}]\nSize: ${sizeKB} KB\nType: ${file.type}\n\nNote: PDF content cannot be displayed as text.`;
        }
    });
}