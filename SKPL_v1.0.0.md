# Spesifikasi Kebutuhan Perangkat Lunak (SKPL)

**Proyek:** Sistem Informasi Pemilihan Elektronik Berbasis Web  
**Perangkat Lunak:** SIPILIH  
**Versi:** v1.0.0  
**Tanggal Dokumen:** 29 Oktober 2025  
**Penyusun:** Ginanjar Aditiya Prianata & Farid Firdaus

---

## 1. Informasi Umum

Sistem SIPILIH adalah aplikasi berbasis web yang dirancang untuk memfasilitasi proses pemungutan suara secara elektronik. Sistem ini dibangun menggunakan framework **Next.js** dengan bahasa pemrograman utama **JavaScript**, serta dukungan **CSS** untuk tampilan antarmuka yang responsif.

Tujuan utama sistem adalah menyediakan proses pemilihan yang **transparan, aman, dan efisien**, serta memungkinkan pengelolaan data pemilih dan kandidat secara terintegrasi.

---

## 2. Tujuan Sistem

1. Memfasilitasi autentikasi pemilih dan admin secara daring.
2. Menyediakan fitur pemilihan kandidat yang aman dan efisien.
3. Mengelola data pemilih, kandidat, dan hasil pemilihan melalui modul administrasi.
4. Menyimpan dan menghitung hasil pemilihan secara akurat dan terjamin keamanannya.

---

## 3. Lingkup Sistem

**In-Scope:**

- Modul autentikasi pengguna (login, logout).
- Modul pemilihan kandidat (pemungutan suara dan tampilan hasil).
- Modul administrasi (pendaftaran pemilih, manajemen data kandidat, dan hasil pemilihan).
- Integrasi frontend-backend melalui API internal.
- Pengujian keamanan dasar (validasi input dan proteksi data).

**Out-of-Scope:**

- Registrasi pemilih oleh pengguna sendiri.
- Integrasi dengan sistem eksternal (misal OAuth atau e-government).
- Pengujian beban tinggi atau skala nasional.

---

## 4. Kebutuhan Fungsional (Functional Requirements)

| No  | Modul               | Kebutuhan Fungsional                                                                                                                         |
| --- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Pendaftaran Pemilih | Admin dapat mendaftarkan pemilih baru dengan memasukkan data wajib (nama, email, password sementara). Pemilih tidak dapat mendaftar sendiri. |
| 2   | Login               | Pemilih dan admin dapat masuk menggunakan kredensial yang valid. Sistem menolak kredensial salah.                                            |
| 3   | Logout              | Pengguna dapat keluar, dan session akan dihapus secara aman.                                                                                 |
| 4   | Pemilihan           | Pemilih dapat melihat daftar kandidat, memilih satu kandidat, dan suara tersimpan secara permanen.                                           |
| 5   | Hasil Pemilihan     | Sistem menampilkan hasil pemilihan secara real-time kepada admin dan ringkasan suara untuk pemilih.                                          |
| 6   | Administrasi        | Admin dapat menambah, mengubah, atau menghapus data kandidat dan pemilih. Admin dapat melihat laporan hasil pemilihan.                       |
| 7   | Validasi Data       | Semua input divalidasi (misal email valid, password minimal 8 karakter).                                                                     |
| 8   | Keamanan            | Password disimpan dengan hashing (SHA-256). Sistem membatasi akses berdasarkan peran (admin/pemilih).                                        |

---

## 5. Kebutuhan Non-Fungsional (Non-Functional Requirements)

| No  | Jenis           | Kebutuhan                                                                                                  |
| --- | --------------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | Performance     | Aplikasi harus responsif pada desktop dan perangkat mobile.                                                |
| 2   | Security        | Data pemilih, kandidat, dan suara harus tersimpan dengan aman. Sistem melindungi API dari akses tidak sah. |
| 3   | Usability       | Antarmuka harus mudah digunakan, navigasi jelas, tombol aksi intuitif.                                     |
| 4   | Compatibility   | Mendukung browser modern (Chrome, Firefox, Edge, Safari).                                                  |
| 5   | Maintainability | Struktur kode modular, memudahkan perbaikan dan penambahan fitur baru.                                     |

---

## 6. Batasan Sistem

- Pemilih tidak dapat melakukan registrasi sendiri; pendaftaran hanya melalui admin.
- Tidak ada integrasi dengan sistem eksternal pada versi 1.0.0.
- Tidak mengakomodasi load tinggi berskala nasional.
- Sistem mendukung pemilihan sederhana dengan satu pemilih satu suara.
