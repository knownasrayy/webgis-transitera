# Dokumentasi Resmi Platform & API MAPID (GEO MAPID & SINI)
*Sumber Resmi: https://mapid.co.id/docs/?language=ina*
*Diekstrak untuk keperluan pengembangan: TransitERA (MAPID WebGIS Competition 2026)*

---

## Daftar Isi
1. [Tentang GEO MAPID & Lisensi](#1-tentang-geo-mapid--lisensi)
2. [SINI — Location Intelligence & Multi-Criteria Decision Analysis](#2-sini--location-intelligence--multi-criteria-decision-analysis)
3. [Toolbox Geospasial GEO MAPID](#3-toolbox-geospasial-geo-mapid)
4. [Manajemen Layer, Simbologi, & Tabel Atribut](#4-manajemen-layer-simbologi--tabel-atribut)
5. [Form Builder & Survei Lapangan (FORM MAPID)](#5-form-builder--survei-lapangan-form-mapid)
6. [Business Intelligence (Spatial BI) & Charting](#6-business-intelligence-spatial-bi--charting)
7. [API & Integrasi Layanan (Map Services & Open API)](#7-api--integrasi-layanan-map-services--open-api)
8. [Katalog Basemap MAPID](#8-katalog-basemap-mapid)
9. [Kolaborasi, Proyek, & Publikasi](#9-kolaborasi-proyek--publikasi)

---

## 1. Tentang GEO MAPID & Lisensi

### Apa itu GEO MAPID?
GEO MAPID adalah platform geospasial berbasis web yang dirancang untuk membuat peta interaktif, menganalisis data spasial, dan mengambil keputusan berbasis lokasi. Platform ini menggabungkan pengelolaan data, kolaborasi tim, dan visualisasi tanpa memerlukan software GIS desktop berbayar/kompleks.

### Pilihan Lisensi
1. **Personal:** Untuk individu/peneliti. Fitur mencakup Map & Dashboard Editor, FORM MAPID (web survey), akses data spasial premium, dan basemaps (termasuk satellite & 3D). Add-on opsional: SINI AI & SINI DATA.
2. **Team / Collaboration:** Untuk tim/bisnis hingga 10 pengguna. Sudah mencakup semua fitur Personal + SINI AI & SINI DATA (termasuk kolaborasi workspace bersama).
3. **Enterprise:** Untuk organisasi besar. Mencakup seluruh fitur Team + opsi on-premise, integrasi API custom, dedicated data engineer, dan full access SINI AI/DATA.

---

## 2. SINI — Location Intelligence & Multi-Criteria Decision Analysis

SINI adalah *location intelligence assistant* di dalam ekosistem MAPID yang dirancang untuk analisis berbasis spasial dan pengambilan keputusan multi-kriteria (MCDA).

### Site Selection vs Site Analysis
* **Site Selection (Makro / Multi-Kandidat):**
  * *Tujuan:* Mengidentifikasi lokasi yang paling sesuai dari beberapa alternatif kandidat.
  * *Fokus:* Perbandingan antar-lokasi berdasarkan kriteria terbobot: aksesibilitas, demografi, ketersediaan infrastruktur, biaya, dan regulasi.
  * *Metodologi:* Multi-Criteria Decision Analysis (MCDA), scoring, dan perankingan berbasis GIS.
* **Site Analysis (Mikro / Deep-Dive Per Cell):**
  * *Tujuan:* Mendapatkan pemahaman mendalam tentang karakteristik spesifik dari lokasi yang sudah terpilih/masuk shortlist.
  * *Fokus:* Evaluasi detail pada level unit spasial (grid cell).
  * *Output Panel SINI:*
    1. **Grid Score (0–100):** Skor kesesuaian keseluruhan.
    2. **Parameter Breakdown:** Kontribusi masing-masing variabel/faktor.
    3. **Dampak Positif / Negatif:** Indikator pendorong vs penghambat.
    4. **Data Demografi & Populasi:** Kepadatan penduduk dan SES.
    5. **Jumlah POI per Kategori:** Fasilitas pendukung di sekitar titik.
    6. **Perbandingan dengan Grid Sekitar:** Benchmarking spasial lokal.

---

## 3. Toolbox Geospasial GEO MAPID

GEO MAPID menyediakan rangkaian tool geospasial siap pakai di dalam Map Editor:

### 1. Grid Tool (Grid Count Point)
* **Fungsi:** Membuat grid spasial di atas area poligon dan menghitung jumlah titik point (agregasi) di setiap sel.
* **Bentuk Grid:**
  * **Hexagon (Segi Enam):** Sangat ideal untuk distribusi spasial merata tanpa bias sudut.
  * **Square (Persegi):** Grid gridbox standar.
* **Parameter:** Ukuran grid (meter/km) atau jumlah pembagian grid.
* **Output:** Layer polygon grid dengan atribut hitungan point dan opsi gradasi warna (choropleth).

### 2. Isochrone (Isokron)
* **Fungsi:** Menghitung area jangkauan (*catchment area*) dari suatu titik pusat berdasarkan waktu tempuh atau jarak nyata.
* **Mode Transportasi:** `Walk` (Jalan Kaki), `Bike` (Sepeda), `Car` (Mobil), `Truck` (Truk).
* **Fitur Filter:** Mampu memfilter dan mengekstrak semua layer point yang berada di dalam area jangkauan isokron secara otomatis.

### 3. Elevation (Ketinggian / Profil Topografi)
* **Fungsi:** Menganalisis profil elevasi tanah di sepanjang garis jalur lintasan.
* **Parameter:** Digitasi jalur multi-titik dan penentuan *Number of Samples* (hingga 100 sample points).
* **Output:** Grafik profil ketinggian dan penyimpanan layer hasil sampling.

### 4. Distance (Pengukuran Jarak)
* **Fungsi:** Mengukur jarak Euclidean/multi-segmen antar titik di peta dan menyimpan garis pengukuran sebagai layer.

### 5. Routing
* **Fungsi:** Menghitung rute terbaik dari titik asal ke tujuan berdasarkan jaringan jalan dengan mode transportasi (Walk, Bike, Car, Truck).

### 6. Area & Radius Selection
* **Fungsi:** Memilih titik point di dalam radius lingkaran tertentu atau poligon custom, lalu menyimpannya sebagai subset layer baru.

---

## 4. Manajemen Layer, Simbologi, & Tabel Atribut

### Tipe Geometri yang Didukung
* `Point` (Titik)
* `LineString` (Garis/Jalur)
* `Polygon` (Area/Wilayah)

### Fitur Pengelolaan Layer
* **Simbologi:** Pengaturan warna, ukuran, ikon, opacity (titik), lebar garis & dash pattern (garis), serta fill color, stroke, dan transparansi (poligon).
* **Heatmap Mode:** Konversi data sebaran titik menjadi visualisasi densitas heatmap secara instan.
* **Tabel Atribut & Digitasi:** Pengeditan data atribut langsung melalui tabel dan penambahan geometri manual via editor peta.
* **Summary & Compact List:** Panel ringkas di sidebar kanan untuk memfilter kolom data dan menampilkan *card summary* atribut utama tanpa membuka tabel penuh.

---

## 5. Form Builder & Survei Lapangan (FORM MAPID)

FORM MAPID digunakan untuk merancang formulir pengumpulan data lapangan yang terhubung langsung dengan layer spasial di peta.

### Tipe Field Khusus Geospasial & Logika
* **Location & POI Fields:**
  * `Nearest Street`: Otomatis mencatat jalan terdekat.
  * `Nearest POI`: Otomatis mendeteksi POI terdekat.
  * `Counting POI` & `Custom Counting`: Menghitung jumlah fasilitas POI di sekitar koordinat survei.
  * `Administrative Lookup`: Otomatis mengisi Kelurahan, Kecamatan, Kota, dan Provinsi dari koordinat GPS.
* **Formula & Logika:**
  * `Calculate Dimension`: Menghitung luas/dimensi poligon otomatis.
  * `2D Referring` & `Simple Referring`: Merujuk ke nilai kolom lain untuk kalkulasi silang.
  * `Conditional Statement`: Menghasilkan nilai berdasarkan percabangan logika if-else.
  * `Math Operators`: Operasi matematika standar antar-kolom.
* **Input Khusus:** `Currency` (Mata Uang), `Slider / Range`, `Nested Table` (sub-data bertingkat dalam 1 objek), `Image` (foto kamera real-time), `Phone Number`.
* **Fitur `Edit Link Each Row`:** Menyediakan tautan unik untuk mengedit kembali entri data survei per baris tanpa membuka akses ke keseluruhan proyek.

---

## 6. Business Intelligence (Spatial BI) & Charting

GEO MAPID mengintegrasikan Business Intelligence langsung di antarmuka peta:
* **Tipe Grafik:** `Line Chart`, `Pie Chart`, `Doughnut Chart`, dan `Polar Area Chart`.
* **Mode Agregasi:**
  * *Single Text Column:* Menghitung frekuensi label kategori.
  * *Text + Number Column:* Menjumlahkan atau merata-ratakan nilai numerik per label kategori.
* **Interaktivitas:** Grafik terhubung dengan panel Summary dan dapat memfilter layer peta secara simultan.

---

## 7. API & Integrasi Layanan (Map Services & Open API)

### Format Data API
Seluruh data yang disajikan melalui MAPID API menggunakan standar **GeoJSON** (`FeatureCollection`) yang kompatibel dengan MapLibre GL JS, Leaflet, OpenLayers, Mapbox, dan PostGIS.

### Metode Permintaan API (`Hubungkan ke API`)
1. **GET:** Digunakan untuk mengambil data spasial read-only melalui URL dan query parameters.
2. **POST:** Digunakan untuk query spasial yang memerlukan parameter kompleks, autentikasi khusus, atau filtering area via *Request Body* (GeoJSON bounding polygon).

### Header & Autentikasi
* Format Header: `X-API-KEY: <TOKEN_KEY>`
* Akses API Key dikelola melalui menu **Map Services** di Dashboard GEO MAPID dengan metrik pencatatan *Total Requests*.

---

## 8. Katalog Basemap MAPID

| Tipe Basemap | Karakteristik Visual | Rekomendasi Penggunaan |
| :--- | :--- | :--- |
| **Street MAPID** | Menampilkan gedung 3D/2D, hierarki jalan, landmark, dan konteks perkotaan detail. | Analisis tata ruang perkotaan umum dan navigasi rute. |
| **Street MAPID (2D Building Only)** | Tampilan jalan bersih + footprint bangunan 2D minimalis. | Visualisasi data berdensitas tinggi agar peta tidak berat (*lightweight*). |
| **Dark MAPID** | Tema gelap kontras tinggi. | **Paling ideal untuk layer choropleth berwarna cerah (seperti Skor TOD & %ΔNJOP) dan heatmap.** |
| **Light MAPID** | Tema terang minimalis. | Peta siap presentasi, infografik, dan laporan formal. |
| **Satellite** | Citra satelit resolusi tinggi. | Validasi fisik tutupan lahan, koridor rel kereta, dan kondisi lingkungan nyata. |

---

## 9. Kolaborasi, Proyek, & Publikasi

* **Groups & Workspaces:** Manajemen kolaborasi tim dengan pembagian role (*Viewer* vs *Editor*) dan sentralisasi resource dataset.
* **Share Project (Viewer Mode):** Berbagi link peta interaktif mode baca-saja (*view-only*) kepada publik tanpa risiko manipulasi data.
* **Publication Tool:** Rich text editor (H1-H6, embed link, gambar, formatting) untuk mempublikasikan story map atau artikel riset berbasis geospasial.
