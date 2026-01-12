// UI Management
class UIManager {
    constructor() {
        this.currentTheme = 'light';
        this.initializeEventListeners();
        this.initializePage();
    }

    // Initialize page
    initializePage() {
        // Hide loading screen after 1.5 seconds
        setTimeout(() => {
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
            }, 500);
        }, 1500);

        // Initialize stats counters
        this.updateStats();
        
        // Smooth scrolling for anchor links
        this.initSmoothScrolling();
        
        // Initialize method modals
        this.initMethodModals();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Navigation active state
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                navLinks.forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // File upload change
        const fileUpload = document.getElementById('fileUpload');
        if (fileUpload) {
            fileUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleFileUpload(file);
                }
            });
        }
    }

    // Toggle theme
    toggleTheme() {
        const body = document.body;
        const themeToggleIcon = document.querySelector('#themeToggle i');
        
        if (this.currentTheme === 'light') {
            body.classList.add('dark-theme');
            themeToggleIcon.classList.remove('fa-moon');
            themeToggleIcon.classList.add('fa-sun');
            this.currentTheme = 'dark';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            themeToggleIcon.classList.remove('fa-sun');
            themeToggleIcon.classList.add('fa-moon');
            this.currentTheme = 'light';
            localStorage.setItem('theme', 'light');
        }
    }

    // Smooth scrolling
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Initialize method modals
    initMethodModals() {
        // Method data for modals
        this.methodData = {
            caesar: {
                title: 'Caesar Cipher',
                description: 'Substitusi sederhana dengan pergeseran karakter',
                parameters: [
                    { name: 'shift', label: 'Shift Value', type: 'number', min: 1, max: 25, value: 3 }
                ]
            },
            vigenere: {
                title: 'Vigenère Cipher',
                description: 'Substitusi polialfabetik dengan kunci berulang',
                parameters: [
                    { name: 'key', label: 'Key', type: 'text', placeholder: 'Enter keyword' }
                ]
            },
            playfair: {
                title: 'Playfair Cipher',
                description: 'Substitusi bigram menggunakan matriks 5x5',
                parameters: [
                    { name: 'key', label: 'Key', type: 'text', placeholder: 'Enter keyword' }
                ]
            },
            affine: {
                title: 'Affine Cipher',
                description: 'Kombinasi perkalian dan penjumlahan modulo',
                parameters: [
                    { name: 'a', label: 'Multiplier (a)', type: 'number', min: 1, max: 25, value: 5 },
                    { name: 'b', label: 'Shift (b)', type: 'number', min: 0, max: 25, value: 8 }
                ]
            },
            hill: {
                title: 'Hill Cipher',
                description: 'Enkripsi blok dengan aljabar linear',
                parameters: [
                    { name: 'matrix', label: 'Encryption Matrix (2x2)', type: 'text', placeholder: 'e.g., 6 24 1 13' }
                ]
            },
            rsa: {
                title: 'RSA Algorithm',
                description: 'Kriptografi asimetris dengan kunci publik/privat',
                parameters: [
                    { name: 'keySize', label: 'Key Size', type: 'select', options: ['512', '1024', '2048'], value: '1024' }
                ]
            }
        };
    }

    // Initialize download buttons
    initDownloadButtons() {
        console.log('Initializing download buttons...');
        
        // Add download buttons to signature section
        const signatureButtonGroups = document.querySelectorAll('.signature-card .button-group');
        
        if (signatureButtonGroups.length > 0) {
            // Card 1 - Create Signature
            if (signatureButtonGroups[0]) {
                // Check if download buttons already exist
                if (!signatureButtonGroups[0].querySelector('.download-signature-btn')) {
                    const downloadSigBtn = this.createDownloadButton(
                        'Download Signature',
                        'fa-download',
                        'btn-secondary download-signature-btn',
                        () => {
                            if (typeof downloadSignature === 'function') {
                                downloadSignature();
                            } else {
                                alert('Download function not available. Please refresh the page.');
                            }
                        }
                    );
                    signatureButtonGroups[0].appendChild(downloadSigBtn);
                }
                
                if (!signatureButtonGroups[0].querySelector('.download-keys-btn')) {
                    const downloadKeysBtn = this.createDownloadButton(
                        'Download Keys',
                        'fa-key',
                        'btn-secondary download-keys-btn',
                        () => {
                            if (typeof downloadKeys === 'function') {
                                downloadKeys();
                            }
                        }
                    );
                    signatureButtonGroups[0].appendChild(downloadKeysBtn);
                }
            }
            
            // Card 2 - Verify Signature
            if (signatureButtonGroups[1]) {
                if (!signatureButtonGroups[1].querySelector('.download-verification-btn')) {
                    const downloadVerBtn = this.createDownloadButton(
                        'Download Hasil',
                        'fa-download',
                        'btn-secondary download-verification-btn',
                        () => {
                            if (typeof downloadVerification === 'function') {
                                downloadVerification();
                            }
                        }
                    );
                    signatureButtonGroups[1].appendChild(downloadVerBtn);
                }
            }
        }
        
        // Add download buttons to tools section
        this.addToolsDownloadButtons();
    }

    addToolsDownloadButtons() {
        // Add download buttons to tools section
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent || '';
            
            if (title.includes('Hash Generator')) {
                const form = card.querySelector('.tool-form');
                if (form && !form.querySelector('.download-hash-btn')) {
                    const downloadBtn = this.createDownloadButton(
                        'Download Hash',
                        'fa-download',
                        'btn-tool download-hash-btn',
                        () => {
                            if (typeof downloadHash === 'function') {
                                downloadHash();
                            }
                        }
                    );
                    form.appendChild(downloadBtn);
                }
            }
            else if (title.includes('Base64 Converter')) {
                const form = card.querySelector('.tool-form');
                if (form && !form.querySelector('.download-base64-btn')) {
                    const downloadBtn = this.createDownloadButton(
                        'Download',
                        'fa-download',
                        'btn-tool download-base64-btn',
                        () => {
                            if (typeof downloadBase64 === 'function') {
                                downloadBase64();
                            }
                        }
                    );
                    const toolButtons = form.querySelector('.tool-buttons');
                    if (toolButtons) {
                        toolButtons.appendChild(downloadBtn);
                    } else {
                        form.appendChild(downloadBtn);
                    }
                }
            }
            else if (title.includes('Random Key Generator')) {
                const form = card.querySelector('.tool-form');
                if (form && !form.querySelector('.download-randomkey-btn')) {
                    const downloadBtn = this.createDownloadButton(
                        'Download Key',
                        'fa-download',
                        'btn-tool download-randomkey-btn',
                        () => {
                            if (typeof downloadRandomKey === 'function') {
                                downloadRandomKey();
                            }
                        }
                    );
                    const generateBtn = form.querySelector('.btn-tool');
                    if (generateBtn && generateBtn.parentNode) {
                        generateBtn.parentNode.appendChild(downloadBtn);
                    } else {
                        form.appendChild(downloadBtn);
                    }
                }
            }
        });
    }

    createDownloadButton(text, icon, className, onClick) {
        const button = document.createElement('button');
        button.className = className;
        button.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
        button.onclick = onClick;
        return button;
    }

    handleFileUpload(file) {
        const fileSize = (file.size / 1024).toFixed(2);
        const fileInfo = document.getElementById('fileInfo');
        
        if (fileInfo) {
            fileInfo.innerHTML = `
                <strong>${file.name}</strong><br>
                <small>${fileSize} KB • ${file.type}</small>
            `;
            
            // Read file content for text files
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('documentInput').value += '\n\n' + e.target.result;
                };
                reader.readAsText(file);
            } else if (file.type === 'application/pdf') {
                document.getElementById('documentInput').value = 
                    `[PDF File: ${file.name}]\n` +
                    `Size: ${fileSize} KB\n` +
                    `Type: ${file.type}\n\n` +
                    `Note: PDF content cannot be displayed as text.\n` +
                    `The signature will be based on file metadata.`;
            }
        }
    }

    // Update statistics
    updateStats() {
        const algorithmCount = document.querySelectorAll('.method-card').length;
        const algorithmCountElement = document.getElementById('algorithmCount');
        if (algorithmCountElement) {
            algorithmCountElement.textContent = algorithmCount + '+';
        }
    }

    // Open method modal
    openMethodModal(method) {
        const modal = document.getElementById('methodModal');
        const modalTitle = document.getElementById('modalTitle');
        const methodContent = document.getElementById('methodContent');
        
        const methodInfo = this.methodData[method];
        if (!methodInfo) return;
        
        modalTitle.textContent = methodInfo.title;
        
        // Generate modal content
        let html = `
            <div class="method-modal-content">
                <div class="method-description">
                    <p>${methodInfo.description}</p>
                </div>
                <div class="method-form">
                    <div class="form-group">
                        <label for="methodInputText">Input Text:</label>
                        <textarea id="methodInputText" rows="4" placeholder="Enter text to encrypt/decrypt..."></textarea>
                    </div>
                    
                    <div class="method-parameters">
        `;
        
        // Add parameters
        methodInfo.parameters.forEach(param => {
            html += `<div class="form-group">`;
            html += `<label for="methodParam_${param.name}">${param.label}:</label>`;
            
            if (param.type === 'select') {
                html += `<select id="methodParam_${param.name}">`;
                param.options.forEach(option => {
                    html += `<option value="${option}" ${option === param.value ? 'selected' : ''}>${option}</option>`;
                });
                html += `</select>`;
            } else {
                const attrs = Object.entries(param)
                    .filter(([key, value]) => key !== 'name' && key !== 'label' && key !== 'type')
                    .map(([key, value]) => `${key}="${value}"`)
                    .join(' ');
                
                html += `<input type="${param.type}" id="methodParam_${param.name}" placeholder="${param.placeholder || ''}" ${attrs}>`;
            }
            
            html += `</div>`;
        });
        
        html += `
                    </div>
                    
                    <div class="form-group">
                        <div class="form-row">
                            <label>Action:</label>
                            <div class="radio-group">
                                <label>
                                    <input type="radio" name="methodAction" value="encrypt" checked> Encrypt
                                </label>
                                <label>
                                    <input type="radio" name="methodAction" value="decrypt"> Decrypt
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="method-buttons">
                        <button class="btn btn-primary" onclick="executeMethod('${method}')">
                            <i class="fas fa-play"></i> Execute
                        </button>
                        <button class="btn btn-secondary" onclick="clearMethodForm()">
                            <i class="fas fa-broom"></i> Clear
                        </button>
                    </div>
                    
                    <div class="method-result">
                        <label>Result:</label>
                        <div class="result-output" id="methodResultOutput">
                            <p class="placeholder">Result will appear here...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        methodContent.innerHTML = html;
        modal.style.display = 'flex';
        
        // Add animation
        setTimeout(() => {
            document.querySelector('.modal-content').classList.add('show');
        }, 10);
    }

    // Close method modal
    closeMethodModal() {
        const modal = document.getElementById('methodModal');
        const modalContent = document.querySelector('.modal-content');
        
        modalContent.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Initialize UI Manager
const uiManager = new UIManager();

// Method execution function
function executeMethod(method) {
    const inputText = document.getElementById('methodInputText').value;
    const action = document.querySelector('input[name="methodAction"]:checked').value;
    const isEncrypt = action === 'encrypt';
    
    if (!inputText) {
        alert('Please enter text to process');
        return;
    }
    
    let result = '';
    
    switch (method) {
        case 'caesar':
            const shift = parseInt(document.getElementById('methodParam_shift').value);
            result = caesarCipher(inputText, shift, isEncrypt);
            break;
            
        case 'vigenere':
            const key = document.getElementById('methodParam_key').value;
            if (!key) {
                alert('Please enter a key');
                return;
            }
            result = vigenereCipher(inputText, key, isEncrypt);
            break;
            
        case 'affine':
            const a = parseInt(document.getElementById('methodParam_a').value);
            const b = parseInt(document.getElementById('methodParam_b').value);
            result = affineCipher(inputText, a, b, isEncrypt);
            break;
            
        default:
            result = `Method ${method} simulation - ${isEncrypt ? 'Encrypted' : 'Decrypted'}: ${btoa(inputText).substring(0, 50)}...`;
    }
    
    // Display result
    const resultOutput = document.getElementById('methodResultOutput');
    resultOutput.innerHTML = `
        <div class="result-success">
            <i class="fas fa-check-circle"></i>
            <span>${isEncrypt ? 'Encryption' : 'Decryption'} successful!</span>
        </div>
        <div class="result-text">
            <strong>Input:</strong> ${inputText.substring(0, 100)}${inputText.length > 100 ? '...' : ''}<br>
            <strong>Output:</strong> ${result}
        </div>
    `;
    
    alert(`${method} ${action} successful!`);
}

// Clear method form
function clearMethodForm() {
    document.getElementById('methodInputText').value = '';
    document.getElementById('methodResultOutput').innerHTML = '<p class="placeholder">Result will appear here...</p>';
}

// Cipher functions
function caesarCipher(text, shift, encrypt = true) {
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

function vigenereCipher(text, key, encrypt = true) {
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

function affineCipher(text, a, b, encrypt = true) {
    function modInverse(a, m) {
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

// Export functions to global scope
window.openMethodModal = (method) => uiManager.openMethodModal(method);
window.closeMethodModal = () => uiManager.closeMethodModal();
window.executeMethod = executeMethod;
window.clearMethodForm = clearMethodForm;