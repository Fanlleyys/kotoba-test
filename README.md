# Kotoba - Aplikasi Belajar Bahasa & Flashcard

Kotoba adalah aplikasi pembelajaran bahasa berbasis web yang modern, dirancang untuk membantu pengguna menghafal kosakata melalui metode *Spaced Repetition System (SRS)* dan gamifikasi. Aplikasi ini dibangun menggunakan React dan TypeScript, serta mendukung fitur Progressive Web App (PWA).

## 🌟 Fitur Utama

* **Sistem Repetisi Berjarak (SRS):** Menggunakan algoritma SM2 untuk mengoptimalkan jadwal peninjauan kartu agar ingatan lebih tahan lama.
* **Gamifikasi Pembelajaran:**
    * Sistem *Streak* harian.
    * Leveling dan perayaan kenaikan level (*LevelUpCelebration*).
    * Mini-games interaktif: **Kata Cannon** dan **Match Game**.
* **Manajemen Deck & Kartu:** Membuat, mengedit, dan mengatur kartu belajar.
* **Dukungan OCR:** Fitur *Optical Character Recognition* untuk memindai teks dari gambar dan mengubahnya menjadi kartu belajar.
* **Visualisasi Progres:** Dashboard lengkap dengan *Activity Heatmap*, *Accuracy Trend*, dan statistik mingguan.
* **Dukungan Bahasa Jepang:** Komponen khusus seperti `RubyText` untuk menampilkan Furigana.
* **Tema:** Dukungan mode gelap dan terang (*ThemePicker*).
* **PWA Ready:** Dapat diinstal di perangkat mobile layaknya aplikasi native.

## 🛠️ Teknologi yang Digunakan

Project ini dibangun menggunakan teknologi terkini:

* **Core:** [React](https://reactjs.org/) (v18+), [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Routing:** React Router
* **Backend/Services:**
    * [Firebase](https://firebase.google.com/) (Autentikasi & Database)
    * Local Storage (Penyimpanan lokal)
* **Deployment:** Dikonfigurasi untuk [Vercel](https://vercel.com/)

## 📋 Prasyarat

Sebelum memulai, pastikan kamu telah menginstal:

* [Node.js](https://nodejs.org/) (Versi 16 atau lebih baru)
* Package manager seperti `npm`, `yarn`, atau `pnpm`.

## 🚀 Instalasi & Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan project di lingkungan lokal:

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/username/kotoba-test.git](https://github.com/username/kotoba-test.git)
    cd kotoba-test
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Konfigurasi Environment Variables:**
    Buat file `.env` di root folder dan tambahkan konfigurasi Firebase (jika diperlukan untuk fitur cloud sync):
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    # ... tambahkan variabel lain sesuai kebutuhan
    ```

4.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173`.

5.  **Build untuk produksi:**
    ```bash
    npm run build
    ```

## 📂 Susunan Project

Berikut adalah gambaran umum struktur direktori project:

```text
kotoba-test/
├── public/              # Aset statis (ikon PWA, robots.txt)
├── src/
│   ├── components/      # Komponen UI yang dapat digunakan kembali
│   │   ├── ui/          # Komponen UI dasar (Charts, Toast, dll)
│   │   └── ...
│   ├── context/         # React Context (Auth, Study, Theme)
│   ├── game/            # Logika dan komponen Game (KataCannon, Engine)
│   ├── modules/         # Logika bisnis modular (Decks, Tasks, Gamification)
│   ├── pages/           # Halaman utama aplikasi (Dashboard, Study, Settings)
│   ├── services/        # Layanan eksternal (Firebase, OCR, Audio, SM2)
│   ├── styles/          # File CSS global dan spesifik
│   ├── App.tsx          # Komponen root
│   └── main.tsx         # Entry point aplikasi
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
💡 Contoh Penggunaan
Membuat Deck: Buka halaman "Decks", klik tombol tambah, dan beri nama deck baru.

Menambah Kartu: Masuk ke deck, tambahkan kartu baru dengan kata depan (Front) dan kata belakang (Back). Kamu juga bisa menggunakan fitur Impor.

Belajar (Study Mode): Klik tombol "Study". Aplikasi akan menampilkan kartu berdasarkan algoritma SRS. Geser atau klik tombol untuk menilai seberapa baik kamu mengingat kata tersebut.

Bermain Game: Buka menu Game untuk memainkan Kata Cannon untuk melatih kecepatan membaca dan reaksi.

🤝 Kontribusi
Kontribusi sangat diterima! Jika kamu ingin berkontribusi:

Fork repositori ini.

Buat branch fitur baru (git checkout -b fitur-keren-baru).

Commit perubahanmu (git commit -m 'Menambahkan fitur keren baru').

Push ke branch (git push origin fitur-keren-baru).

Buat Pull Request.

Lisensi
Project ini dilisensikan di bawah MIT License.

Plaintext

MIT License

Copyright (c) 2025 [Alfan Januar]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
