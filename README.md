# Digital Signature Web App (RSA-PSS & SHA-256)

Aplikasi web untuk pembuatan dan verifikasi tanda tangan digital menggunakan algoritma **RSA-PSS** dan fungsi hash **SHA-256**. Aplikasi ini dirancang untuk menjamin **keaslian**, **integritas**, dan **keabsahan** dokumen digital.

---

## 📌 Fitur Utama

* Generate pasangan kunci RSA (public & private key)
* Upload dokumen melalui web
* Pembuatan tanda tangan digital dengan RSA-PSS
* Verifikasi tanda tangan digital
* Menampilkan status valid / tidak valid
* Export kunci publik dan tanda tangan digital
* Sistem berbasis web (mudah digunakan)

---

## 🔐 Alur Sistem

1. Generate key (public & private key)
2. Upload dokumen ke web
3. Sistem membuat hash dokumen menggunakan SHA-256
4. Hash ditandatangani menggunakan RSA-PSS + private key
5. Sistem melakukan verifikasi tanda tangan
6. Output sistem:

   * Public key
   * Digital signature
   * Status valid / tidak valid

📎 Catatan:
Dokumen asli **tidak dikeluarkan sebagai output sistem** dan dikirimkan secara terpisah kepada penerima.

---

## 🧪 Proses Verifikasi di Sisi Penerima

Penerima memerlukan:

* Dokumen asli
* Public key
* Digital signature

Langkah:

1. Hash ulang dokumen dengan SHA-256
2. Dekripsi signature menggunakan public key
3. Bandingkan nilai hash
4. Tentukan status validitas

---

## ⚙️ Teknologi yang Digunakan

* HTML5
* CSS3
* JavaScript
* Web Crypto API / Library kriptografi
* Algoritma RSA-PSS
* Hash function SHA-256

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Clone repository

```bash
git clone https://github.com/Asep-Jelpa-Nasution/UAS_Cryptography
```

### 2. Masuk ke folder project

```bash
cd digital-signature-web-app
```

### 3. Jalankan menggunakan browser

Buka file:

```text
index.html
```

Atau gunakan local server (opsional):

```bash
python -m http.server
```

Lalu buka:

```text
http://localhost:8000
```

---

## 📤 Output Sistem

* `public_key.pem`
* `signature.txt`
* Status verifikasi (Valid / Tidak Valid)

---

## 🛡️ Analisis Keamanan Singkat

* SHA-256 tahan terhadap collision dan brute force
* RSA-PSS menggunakan padding acak → lebih aman dari RSA klasik
* Sistem mencegah:

  * Pemalsuan tanda tangan
  * Perubahan dokumen
  * Penyalahgunaan identitas

⚠️ Keamanan bergantung pada perlindungan private key.

---

## 📚 Referensi

* NIST FIPS 186-4 Digital Signature Standard
* RFC 8017 PKCS #1
* Handbook of Applied Cryptography

---

## 👤 Author

**Asep Jelpa Nasution**
Teknik Informatika

---

## 📄 Lisensi

Project ini dibuat untuk keperluan akademik (UAS) dan pembelajaran kriptografi.

Bebas digunakan dan dikembangkan untuk tujuan edukasi.

---

✨ *Feel free to contribute and improve this project!*
