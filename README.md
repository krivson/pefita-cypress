# Pengujian Otomatis Pefita

## Deskripsi

Proyek ini adalah pengujian otomatis untuk aplikasi Pefita menggunakan Cypress. Pengujian ini mencakup berbagai skenario end-to-end untuk memastikan bahwa aplikasi berfungsi dengan baik dan sesuai dengan spesifikasi. Dengan Cypress, proyek ini bertujuan untuk menyediakan pengujian yang cepat, andal, dan mudah dipelihara.

## Instalasi

Untuk memulai dengan proyek ini, ikuti langkah-langkah berikut:

1. **Clone repositori ini:**

   ```bash
   git clone https://github.com/krivson/pefita-cypress.git
   ```

2. **Masuk ke direktori proyek:**

   ```bash
   cd pefita-cypress
   ```

3. **Instal dependensi:**

   ```bash
   npm install
   ```

   Ini akan menginstal Cypress serta dependensi lainnya yang diperlukan untuk proyek ini.

## Menjalankan Pengujian

Setelah instalasi, Anda dapat menjalankan pengujian dengan menggunakan perintah berikut:

- **Untuk mode interaktif:**

  ```bash
  npx cypress open
  ```

  Perintah ini akan membuka antarmuka Cypress, memungkinkan Anda untuk memilih dan menjalankan pengujian secara interaktif.

- **Untuk mode headless:**

  ```bash
  npx cypress run
  ```

  Perintah ini menjalankan pengujian di background tanpa antarmuka grafis, cocok untuk integrasi berkelanjutan (CI).

## Struktur Proyek

- `cypress/` - Folder yang berisi semua file terkait pengujian Cypress.
  - `e2e/` - Berisi file spesifikasi pengujian end-to-end.
  - `fixtures/` - Data uji statis yang digunakan dalam pengujian.
  - `support/` - File utilitas dan perintah tambahan yang digunakan dalam pengujian.

- `cypress.config.js` - File konfigurasi Cypress untuk pengaturan proyek.
- `cypress.env.json` - File env untuk Cypress.

## Menulis Pengujian

Pengujian ditulis dalam file JavaScript di folder `cypress/e2e/`. Gunakan API Cypress untuk mensimulasikan interaksi pengguna dan memverifikasi fungsionalitas aplikasi.

Contoh pengujian:

```javascript
describe('Halaman Utama Pefita', () => {
  it('Harus memuat halaman dengan benar', () => {
    cy.visit('/')
    cy.contains('Selamat datang di Pefita')
  })
})
```