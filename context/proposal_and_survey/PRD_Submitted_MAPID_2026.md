# PRODUCT REQUIREMENT DOCUMENT (PRD) — ARSIP RESMI SUBMISSION
**WebGIS - Spatial Intelligence untuk Transportasi Massal**  
*MAPID WEBGIS COMPETITION #2-2026: Maps That Think! - Mass Transportation Edition*

---

## Informasi Proyek & Tim

| Parameter | Keterangan |
| :--- | :--- |
| **Nama Tim** | Pak, sibuk ga? |
| **Judul Proyek** | TransitERA: A WebGIS-Based Decision Support System for Assessing TOD Readiness and Its Association with Land Value in Surabaya |
| **Institusi** | Institut Teknologi Sepuluh Nopember (ITS) |
| **Ketua Tim** | Muhammad Zulfan Fakhriza Al Azmi |
| **Kontak** | +62 838-7929-0891 |

### Anggota Tim & Peran

| No. | Nama Lengkap | Peran dalam Tim |
| :---: | :--- | :--- |
| 1 | Muhammad Zulfan Fakhriza Al Azmi | Project Leader |
| 2 | Muhammad Mirza Wibisono | Business & Product Analyst |
| 3 | Hanaamira Pramesti | Data & Spatial Analyst |
| 4 | Rayhan Agnan Kusuma | UI/UX Designer |
| 5 | Rayka Dharma Pranandita | AI & WebGIS Developer |

---

## 1. Ringkasan Eksekutif

**TransitERA** adalah platform WebGIS interaktif berbasis *Decision Support System* yang dirancang untuk menilai kesiapan kawasan *Transit-Oriented Development* (TOD) dan keterkaitannya dengan nilai lahan di Kota Surabaya. Platform ini dibangun untuk menjawab permasalahan fragmentasi data spasial yang menghambat perencanaan kawasan TOD, khususnya di sekitar simpul transit *Surabaya Regional Railway Line* (SRRL) Gerbangkertasusila beserta angkutan penghubung WiraWiri Suroboyo dan Suroboyo Bus.

Masalah utama yang diselesaikan adalah tersebar dan tidak terhubungnya data-data penting perencanaan kawasan, seperti kepadatan penduduk, nilai lahan, harga properti, daya beli masyarakat, hingga risiko bencana di berbagai instansi. Kondisi ini membuat pemerintah, investor, dan pelaku usaha kesulitan menentukan lokasi kawasan yang paling layak dikembangkan sebagai simpul TOD.

Dataset yang digunakan mencakup tiga kelompok:
1. **Data Primer:** Survei lapangan melalui MAPID Apps (Properti Go, Struk Go, Menu Go, dan Community Maps/Activity).
2. **Data Sekunder:** MAPID Data Catalog (SES & Demografi, People Spending, Nighttime Light, POI, LST/UHI, Risiko Banjir).
3. **Data Spasial Publik:** ZNT ATR/BPN, rute feeder WiraWiri / Suroboyo Bus, jaringan jalan OSMnx.

---

## 2. Tujuan Produk

### Problem Statement
Pengembangan kawasan TOD di kota metropolitan seperti Surabaya tidak semata bergantung pada kesiapan sarana transportasi saja, tetapi juga pada pengelolaan informasi spasial dan penataan aktivitas ekonomi di sekitar simpul transit. Terdapat dua persoalan utama:
- **Fragmentasi Data Spasial Kawasan:** Data dasar penilaian kelayakan kawasan untuk simpul TOD seperti kepadatan penduduk, nilai lahan, harga properti, risiko bencana, dan lainnya masih terisolasi pada sumber instansi tanpa keterhubungan spasial. Akibatnya, menjadi hambatan besar dan menyulitkan evaluasi serta penentuan prioritas pengembangan kawasan secara komprehensif.
- **Ketiadaan Data Pembanding Transparan bagi Pelaku Usaha:** Ketiadaan data pembanding menyebabkan kesulitan bagi pelaku usaha (khususnya UMKM) dalam menilai kesesuaian lokasi komersial, karena keputusan sewa atau beli umumnya hanya mengandalkan harga penawaran tanpa mempertimbangkan konektivitas transit dan daya beli lokal. Hal ini berakibat pada besarnya *tenant mismatch* yang merugikan pelaku usaha.

### Tujuan
1. Menghasilkan **TOD Readiness Score** yang terukur dan konsisten untuk setiap sel wilayah H3 di sekitar simpul transit SRRL Surabaya sebagai dasar evaluasi kesiapan kawasan TOD.
2. Menyajikan estimasi keterkaitan skor kesiapan TOD dengan nilai lahan (**%ΔNJOP**) melalui model regresi spasial (*Spatial Durbin Model*), sehingga pengguna (khususnya pelaku usaha maupun investor) memperoleh gambaran potensi dampak ekonomi dari pengembangan simpul transit.
3. Menyediakan **profil kesesuaian properti** berbasis proksi daya beli (Struk Go, Menu Go, serta data sosio-ekonomi lainnya) yang membantu pelaku usaha/UMKM menghindari *tenant mismatch* dalam memutuskan lokasi usaha.
4. Menghadirkan **asisten spasial AI interaktif** berbasis Google Gemini dengan *Spatial Function Calling* yang dapat diakses seluruh pengguna untuk mengeksplorasi data, memperoleh *insight* baru, dan menerima rekomendasi dalam bahasa sehari-hari.

### Value Proposition
- **Pengguna Utama:** Pemerintah, investor/pelaku usaha, dan masyarakat/UMKM yang membutuhkan informasi spasial terintegrasi untuk pengambilan keputusan terkait kawasan transit.
- **Penyelesaian Masalah:** Mengubah data spasial yang terfragmentasi menjadi informasi spasial terintegrasi berupa skor kesiapan TOD yang terukur, estimasi nilai lahan, dan profil kesesuaian lokasi usaha dalam satu platform terpadu.
- **Manfaat Pengguna:** Evaluasi kawasan TOD yang akurat dan transparan, identifikasi peluang investasi berbasis data, penempatan lokasi usaha yang presisi, serta partisipasi masyarakat melalui *community maps*.
- **Keunggulan & Nilai Tambah:** Integrasi 4 inovasi utama:
  1. Agregasi spasial Uber H3 Grid System (resolusi 8–9) menggantikan radius lingkaran konvensional.
  2. Skoring AHP dengan pendekatan multidimensi 5D TOD (Density, Diversity, Design, Destination Accessibility, Distance to Transit).
  3. Profil kesesuaian properti berbasis transaksi riil (Struk Go & Menu Go).
  4. Asisten spasial AI interaktif (Google Gemini API via Function Calling / Text-to-SQL).

---

## 3. Ruang Lingkup Produk

### In-Scope
- **Fitur Utama:** Peta interaktif H3 choropleth TOD Readiness Score, dashboard scorecard radar chart 5D, simulasi skenario intervensi (*what-if analysis*), peta distribusi premium nilai lahan, dan Spatial AI Assistant.
- **Dataset:** Data primer MAPID Apps (Properti Go, Struk Go, Menu Go, Community Maps/Activity), data sekunder MAPID Data Catalog (SES & Demografi, People Spending, NTL, POI, LST/UHI, Risiko Banjir), dan data publik (ZNT ATR/BPN, Rute Feeder, Jaringan Jalan OSMnx).
- **Analisis Spasial:** *Network buffer analysis* (zona 0–400m, 400–800m, 800–1.000m), agregasi H3 (resolusi 8–9), skoring AHP 5D TOD, *Spatial Durbin Model* (SDM), dan klasterisasi HDBSCAN + XGBoost Classifier.
- **Visualisasi WebGIS:** Basemap MAPID MAPS, overlay choropleth H3 untuk skor TOD dan %ΔNJOP, popup atribut interaktif per sel, layer control multi-layer, filter interaktif, dan tabel informasi.
- **Dashboard:** Radar chart 5 dimensi TOD per simpul, scorecard numerik, simulasi skenario intervensi penambahan koridor feeder, dan grafik perbandingan antarsimpul.
- **AI Engine:** Spatial AI Assistant (Google Gemini API via Function Calling) dengan input natural language, output manipulasi peta otomatis dan narasi teks analitis, klasifikasi tipologi kawasan, serta estimasi regresi.
- **Output & Export:** TOD Readiness Score, estimasi %ΔNJOP, profil kesesuaian lokasi usaha, rekomendasi kebijakan berbasis indikator terlemah, dan ekspor ringkasan analisis dalam format PDF/CSV.

### Out-of-Scope
- Real-time train tracking dan integrasi langsung data operasional harian PT KAI.
- Integrasi sistem notifikasi push/SMS ke perangkat pengguna.
- Sistem transaksi atau payment gateway e-commerce sewa/beli properti.
- Pengembangan aplikasi mobile native iOS/Android (fokus pada *responsive web app*).
- Analisis lanjutan yang membutuhkan data konfidensial tertutup (misal data NJOP riil Dispenda yang belum dipublikasi).
- Fitur kolaborasi multi-user editing secara real-time (*collaborative editing*).
- 3D City Mesh / Digital Twin dan pemetaan AR (Augmented Reality).

---

## 4. User Persona & Kebutuhan

### Persona 1 — Pemerintah (Perencana Kota)
- **Nama:** Raditya Haikal Islami Al Haqiqi (Kasi Perencanaan Transportasi, Dishub Surabaya)
- **Goals:** Menentukan prioritas alokasi anggaran fasilitas pedestrian di simpul transit berdasarkan skor kesiapan kawasan TOD yang terukur dan objektif.
- **Needs:** Dashboard perbandingan antarsimpul transit, skor kesiapan TOD terstandardisasi, dan rekomendasi prioritas intervensi pada dimensi terlemah.
- **User Stories:**
  - *"Sebagai Perencana Kota, saya ingin melihat TOD Readiness Score berbasis H3 Grid agar dapat menentukan prioritas anggaran pembangunan fasilitas pejalan kaki di simpul transit."*
  - *"Sebagai Perencana Kota, saya ingin menjalankan simulasi skenario 'Jika koridor feeder WiraWiri diperpanjang ke Stasiun X' agar dapat memperkirakan dampaknya terhadap skor TOD dan nilai lahan."*
  - *"Sebagai Perencana Kota, saya ingin bertanya kepada asisten AI 'Apa dimensi TOD terlemah di Stasiun Gubeng?' agar mendapat rekomendasi intervensi yang spesifik."*

### Persona 2 — Investor / Pelaku Usaha
- **Nama:** Haniful Lail Mubarok (Property & Site Analyst, Developer Swasta)
- **Goals:** Mengidentifikasi lokasi properti dengan potensi apresiasi nilai lahan tertinggi akibat proyek SRRL serta memahami profil daya beli lokal untuk menentukan segmentasi tenant.
- **Needs:** Peta premium nilai lahan (%ΔNJOP) di sekitar simpul transit, profil kesesuaian properti berbasis Struk Go & Menu Go, serta filter tipe transaksi dan segmen usaha.
- **User Stories:**
  - *"Sebagai Investor Properti, saya ingin melihat estimasi kenaikan NJOP per grid H3 di sekitar Stasiun Wonokromo agar dapat menilai peluang investasi lahan."*
  - *"Sebagai Pelaku Usaha F&B, saya ingin mengetahui profil daya beli dan keramaian kawasan berdasarkan data Struk Go dan Menu Go agar dapat memilih lokasi yang sesuai dengan segmen pasar saya."*

### Persona 3 — Commuter / Pelaku UMKM
- **Nama:** Tasya Adelia Putri (Pemilik Usaha F&B / UMKM Kuliner)
- **Goals:** Menemukan lokasi ideal untuk cabang baru warung kopi berdasarkan tingkat keramaian pejalan kaki, daya beli sekitar, dan kedekatan dengan simpul transit.
- **Needs:** Antarmuka peta yang ramah pengguna, rekomendasi lokasi berbasis data dalam bahasa sehari-hari melalui AI Assistant, dan visualisasi tingkat keramaian kawasan.
- **User Stories:**
  - *"Sebagai Pelaku UMKM, saya ingin bertanya ke AI 'Di mana lokasi ramai dekat stasiun yang cocok buat kedai kopi?' beserta rekomendasi rute dengan walkability tinggi."*
  - *"Sebagai Pengguna Transit, saya ingin mengetahui integrasi rute feeder terdekat dan keramaian kawasan secara real-time."*

---

## 5. Dataset Dasar

| Dataset | Sumber | Fungsi dalam Produk |
| :--- | :--- | :--- |
| **Halte di Kota Surabaya Tahun 2025** | MAPID Database | Memetakan sebaran titik perhentian angkutan pengumpan (*feeder*) WiraWiri Suroboyo dan Suroboyo Bus untuk mengukur konektivitas antarmoda. |
| **Stasiun di Kota Surabaya Tahun 2025** | MAPID Database | Menjadi titik simpul (*transit node*) utama SRRL (Gubeng, Pasar Turi, Semut, Wonokromo, Waru) untuk pembentukan zona *network walkability buffer* (0–400m, 400–800m, 800–1.000m) dan variabel *Distance to Transit*. |
| **Nighttime Light Kota Surabaya Tahun 2023** | MAPID Database | Menyajikan variasi intensitas pencahayaan malam hari berbasis poligon grid di Surabaya sebagai proksi tingkat aktivitas ekonomi nokturnal dan dinamika kawasan stasiun. |
| **Demografi di Kota Surabaya** | MAPID Database | Menyediakan batas wilayah administratif kecamatan/kelurahan serta kepadatan penduduk sebagai input variabel *Density*. |
| **Wilayah Risiko Banjir di Kota Surabaya** | MAPID Database | Menyajikan zonasi kerentanan genangan banjir sebagai variabel kontrol lingkungan (*disamenity factor*) pada model regresi spasial keterkaitan TOD dengan NJOP. |
| **Community Maps (Activity)** | MAPID Apps | Validasi kondisi aktual jalur pedestrian, *tactile paving*, fasilitas halte, dan hambatan pejalan kaki (variabel *Design*), sekaligus menjadi basis data pengetahuan RAG untuk Spatial AI Assistant. |

---

## 6. Rencana Survey Activities

### Ringkasan Survei Lapangan
- **Fokus Area:** Koridor transit utama Kota Surabaya: **Stasiun Gubeng, Stasiun Wonokromo, dan Stasiun Pasar Turi** beserta koridor feeder WiraWiri / Suroboyo Bus.
- **Objek Survei:** Kondisi fisik stasiun, fasilitas halte/bus stop, jalur pedestrian (*guiding block*, hambatan trotoar), titik *drop-off* angkutan daring, serta sarana komersial pendukung ekonomi (mall, hotel, UMKM lokal).
- **Output:** Verifikasi kondisi eksisting secara real-time yang diunggah ke MAPID Apps (Activity & Mission) untuk memperkaya variabel *Design*, *Diversity*, dan basis data *knowledge retriever* AI.

### Tabel Data Hasil & Sampel Objek Survei Lapangan

| Nama Objek | Kategori Objek | Waktu Survei | Alamat | Koordinat | Catatan Hasil Lapangan |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **Klaska Residence** | Sarana pendukung ekonomi | 27-08-2026 | Jl. Jagir Wonokromo | -7.302051, 112.744110 | Properti hunian *mixed-use* vertikal yang mendukung aktivitas ekonomi dan komersial di sekitar stasiun. |
| **Area Pemukiman sekitar Stasiun Wonokromo** | Sarana aksesibilitas pejalan kaki | 27-08-2026 | Jl. Stasiun Wonokromo | -7.302840, 112.738229 | Area permukiman padat; aksesibilitas pejalan kaki membutuhkan penataan trotoar terintegrasi. |
| **Jembatan penyebrangan DTC Mall - Stasiun Wonokromo** | Sarana aksesibilitas pejalan kaki | 27-08-2026 | Jl. Stasiun Wonokromo | -7.302840, 112.738229 | Jembatan penyeberangan orang (JPO) penghubung langsung antara Stasiun Wonokromo dan Darmo Trade Center (DTC). |
| **Tenant pertokoan Stasiun Wonokromo** | Sarana pendukung ekonomi | 29-08-2026 | Jl. Stasiun Wonokromo | -7.302788, 112.738330 | Properti komersial/tenant UMKM di dalam dan sekitar stasiun dengan pangsa pasar penumpang komuter. |
| **UMKM Kerajinan Kayu dan Mebel** | Sarana pendukung ekonomi | 21-08-2026 | Jl. Semarang No.1, Tembok Dukuh, Bubutan (60173) | -7.250566, 112.729871 | Sentra UMKM pengrajin kayu dan gerobak di sekitar Stasiun Pasar Turi; proses pengerjaan dilakukan langsung *on-the-spot*. |
| **Fasilitas Pedestrian sekitar Taman Lansia** | Sarana aksesibilitas pejalan kaki | 24-08-2026 | Jl. Kalimantan No.12, Gubeng, Surabaya (60281) | -7.271345, 112.750080 | Jalur pedestrian dilengkapi *guiding block*, lampu jalan, dan *zebra cross*; namun masih terhambat motor parkir liar dekat bak sampah. |
| **Fasilitas Bus Stop Taman Lansia B** | Sarana transportasi umum | 24-08-2026 | Jl. Kalimantan No.5, RT.02/RW.05, Gubeng (60281) | -7.271002, 112.750542 | Fasilitas minim; hanya tiang rambu penanda tanpa atap peneduh, bangku tunggu, ataupun papan informasi rute/jadwal. |
| **Jalur Pejalan Kaki di Stasiun Pasar Turi** | Sarana aksesibilitas pejalan kaki | 21-08-2026 | Jl. Semarang No.1, Tembok Dukuh, Bubutan (60173) | -7.250566, 112.729871 | Trotoar belum dilengkapi jalur pemandu difabel (*blind line/guiding block*), mengurangi aksesibilitas penyandang disabilitas tunanetra. |
| **Fasilitas dan Kondisi Bus Stop Manyar Kerta Adi** | Sarana transportasi umum | 24-08-2026 | Manyar Sabrangan, Mulyorejo, Surabaya | -7.280581, 112.782380 | Hanya tiang penanda tanpa peneduh/kursi; posisi dekat lampu merah menyebabkan penyempitan lajur dan antrean saat bus berhenti. |
| **Gojek Pick Up Point Stasiun Pasar Turi** | Sarana transportasi umum | 24-08-2026 | Jl. Semarang No.1, Tembok Dukuh, Bubutan (60173) | -7.248369, 112.731659 | Zona penjemputan resmi ojek online di dalam area stasiun yang mempermudah perpindahan moda antartransportasi. |
| **Darmo Trade Center (DTC)** | Sarana pendukung ekonomi | 25-08-2026 | Jl. Wonokromo No.378-376, Jagir, Wonokromo (60244) | -7.302340, 112.738381 | Pusat perbelanjaan hibrida: pasar tradisional di lantai bawah dan mall modern (kuliner, perhiasan, bursa mobil bekas) di lantai atas. |
| **Fasum Jembatan Sawunggaling (Terminal Joyoboyo)** | Sarana fasilitas umum | 25-08-2026 | Jl. Joyoboyo, Sawunggaling, Wonokromo (60242) | -7.299434, 112.736511 | Dilengkapi tempat duduk publik di jembatan penghubung terminal intermoda, mendorong integrasi pejalan kaki dan transit. |
| **Jalur 1-2 Terminal Intermoda Joyoboyo (TIJ)** | Sarana transportasi umum | 25-08-2026 | Jl. Joyoboyo No.1, Sawunggaling, Wonokromo (60242) | -7.299287, 112.736323 | Jalur operasional bus dan angkutan kota; terdapat pos siaga Dishub dan unit pemadam kebakaran. |
| **Halte Bus Royal Plaza (Siang Hari)** | Sarana transportasi umum | 24-08-2026 | Royal Plaza, Wonokromo, Surabaya (60243) | -7.308582, 112.735194 | Halte beratap dengan fasilitas tempat duduk, okupansi pengguna aktif pada jam sibuk siang hari. |
| **Aktivitas Stasiun Gubeng (Siang Hari)** | Sarana transportasi umum | 30-08-2026 | Stasiun Gubeng Lama, Kec. Gubeng (60281) | -7.265331, 112.749388 | Tingkat kedatangan penumpang ramai; interior stasiun sudah ramah difabel (*guiding block*) dan memiliki ruang tunggu memadai. |
| **Grand City Mall Surabaya** | Sarana pendukung ekonomi | 30-08-2026 | Jl. Gubeng Pojok No.1, Ketabang, Genteng (60272) | -7.265331, 112.749388 | Pusat perbelanjaan dan konvensi berjarak <10 menit jalan kaki dari Stasiun Gubeng Lama. |
| **Bus Stop Sumatera A** | Sarana transportasi umum | 24-08-2026 | Ketabang, Genteng, Surabaya | -7.266642, 112.751144 | Bus stop minim peneduh dan bangku tunggu; area titik henti menyatu dengan trotoar pedestrian. |
| **Hotel Sahid Surabaya** | Sarana pendukung ekonomi | 24-08-2026 | Jl. Sumatera No.1-15, Pacar Keling, Tambaksari (60281) | -7.266642, 112.751144 | Akomodasi perhotelan strategis berjarak <5 menit jalan kaki dari Stasiun Gubeng dan tepat di depan Bus Stop Sumatera B. |
| **Drop Off Ojek Online Stasiun Gubeng** | Sarana transportasi umum | 30-08-2026 | Jl. Gerbong No.2, Pacar Keling, Tambaksari (60131) | -7.264625, 112.752866 | Zona *drop-off* khusus transportasi daring (Grab/Gojek) di pintu keluar stasiun untuk kelancaran *transfer mode*. |

---

## 7. Metode Pengolahan Data, AI, dan Analisis Spasial

### 1. Data Processing Pipeline
- **Cleaning:** Pembersihan duplikasi, normalisasi tipe data atribut, standardisasi koordinat GPS, imputasi missing values, dan anonimisasi PII (Struk Go & Properti Go).
- **Validasi:** Cross-check batas administrasi Surabaya, validasi bounding box di frontend & backend.
- **Integrasi:** Penarikan data via GEO MAPID REST API ke PostgreSQL/PostGIS, spatial join data lapangan ke sel Uber H3 Grid (resolusi 8–9), integrasi data sekunder MAPID Catalog & OpenStreetMap (OSMnx).

### 2. Spatial Analysis Framework
- **Network Buffer Analysis:** Mengukur radius pejalan kaki riil pada 3 zona: 0–400m, 400–800m, dan 800–1.000m.
- **Uber H3 Grid Indexing (Res 8–9):** Pembagian sel heksagonal seragam untuk eliminasi bias MAUP.
- **AHP 5D TOD Scoring (0–100):** Pembobotan 5 pilar (Density, Diversity, Design, Destination Accessibility, Distance to Transit) dengan Consistency Ratio $CR \le 0{,}10$.
- **Spatial Econometrics (Spatial Durbin Model - SDM):** Mengukur elastisitas skor TOD terhadap kenaikan nilai pasar tanah / NJOP (%ΔNJOP) dan efek limpahan spasial.
- **Tipologi Kawasan (HDBSCAN + XGBoost):** Pengelompokan sel ke dalam 3 tipologi: *Commercial Transit Hub*, *Mixed-Use Residential Area*, dan *Low-Accessibility Feeder Zone*.

---

## 8. Fitur Produk dan Acceptance Criteria

### Core Value Focus ("Less is More")
Sesuai arahan Coaching #3, platform memfokuskan 100% kapabilitasnya pada **1 Core Decision Engine**:
- **Fitur Dipertahankan:**
  - H3 Choropleth TOD Score & %ΔNJOP.
  - Scorecard Radar Chart 5D & Simulasi What-If (alokasi anggaran cepat Dishub).
  - Profil Kesesuaian Lokasi Bisnis (pencocokan lokasi UMKM berbasis transaksi riil Struk/Menu Go).
  - Spatial AI Assistant powered by Google Gemini (eksplorasi data bahasa alami via Function Calling).
- **Fitur Dieliminasi:** 3D City Mesh, Real-time Train Tracking, AR Mapping (beban bandwidth tinggi, minim nilai analitik).

| Fitur Produk | Deskripsi & Acceptance Criteria |
| :--- | :--- |
| **Peta Interaktif H3 Choropleth** | Basemap MAPID MAPS ter-render sempurna; sel H3 tergradasi warna sesuai skor TOD; klik sel memunculkan popup atribut detail (skor, 5 dimensi, tipologi); interaksi zoom/pan/layer control mulus di desktop & mobile. |
| **Dashboard Scorecard & Radar Chart** | Radar chart 5 dimensi muncul saat simpul dipilih; scorecard menampilkan skor total & per dimensi; fitur komparasi visual antarsimpul berfungsi normal. |
| **Simulasi Skenario Intervensi** | Fitur *what-if* penambahan koridor feeder; kalkulasi skor TOD dan %ΔNJOP ter-update real-time; tampilan komparasi *baseline* vs *skenario* disajikan berdampingan. |
| **Peta Distribusi Premium Nilai Lahan** | Layer choropleth H3 %ΔNJOP ter-render dengan interval kepercayaan 95%; filter rentang nilai berfungsi; popup menampilkan koefisien regresi. |
| **Spatial AI Assistant** | Respons query < 3 detik; menghasilkan `json_response` (kontrol peta) dan `text_response` (narasi); tingkat keberhasilan curated prompts ≥ 90%; API key aman di server-side. |
| **Layer Filter & Search** | Filter dropdown & checkbox langsung memperbarui layer peta tanpa reload; search bar melompat ke lokasi yang dicari; tombol *reset filter* aktif. |
| **Survey Activities Layer** | Titik survei terplot dengan pin ikon kategori yang jelas; popup menampilkan foto dokumentasi, deskripsi, tanggal, dan koordinat; filter kategori survei aktif. |
| **Export Ringkasan** | Mengunduh file laporan format PDF/CSV yang memuat skor TOD, %ΔNJOP, dan rekomendasi kebijakan secara lengkap dan rapi. |
| **Halaman Metodologi & Data** | Menjelaskan alur data processing → spatial analysis → AI insight secara komprehensif; mencantumkan atribusi seluruh sumber dataset. |
| **Responsivitas Desktop & Mobile** | Layout adaptif; navigasi peta ergonomis pada layar sentuh ponsel; skor performa First Contentful Paint (FCP) < 1,8 detik. |

---

## 9. Persyaratan Teknis & Arsitektur

| Komponen | Teknologi yang Digunakan |
| :--- | :--- |
| **Frontend Framework** | Next.js (App Router, React 19, TypeScript), Tailwind CSS, Chart.js / Recharts |
| **WebGIS Engine** | MapLibre GL JS (WebGL rendering, format Vector Tiles / MVT) |
| **Backend API** | FastAPI (Python 3.11+), Next.js API Routes (Proxy AI & Auth) |
| **Database & Cache** | PostgreSQL 16 + PostGIS 3.4 (Supabase Managed), Redis Cache (Upstash) |
| **GIS & Spatial Analysis** | QGIS, PySAL (Spatial Durbin Model), GeoPandas, Uber H3 (`h3-py` / `h3-js`), OSMnx, Turf.js, Scikit-learn, XGBoost, HDBSCAN |
| **AI Integration** | Google Gemini API (Structured Outputs / JSON Function Calling), RAG basis data Activity |
| **Deployment & DevOps** | Vercel (Frontend Hosting & CI/CD), Render (FastAPI Backend Container), Supabase (PostGIS DB), GitHub Actions |
| **Basemap API** | MAPID MAPS API (Street, Dark, Satellite Vector Basemaps) |
| **Data Ingestion API** | GEO MAPID REST API (POST request, `X-API-KEY`, GeoJSON Polygon filtering, pagination) |

---

## 10. User Flow & Wireframe

### Alur Utama Pengguna
1. **Landing Page:** Gambaran tantangan TOD Surabaya, ringkasan statistik & key insights, tombol CTA ("Jelajahi Peta" / "Tanya AI").
2. **Peta Interaktif Utama:** Basemap MAPID MAPS + overlay choropleth H3. Panel Kiri (Layer control, filter, search bar). Klik sel H3 memunculkan popup atribut detail skor 5D & %ΔNJOP.
3. **Dashboard Scorecard & Simulasi:** Radar chart 5D TOD per simpul stasiun, scorecard indikator terlemah, simulasi skenario intervensi (*what-if slider*).
4. **Spatial AI Assistant Panel:** Chat interaktif sisi kanan dengan quick curated prompts & input bahasa alami bebas; eksekusi dua arah (narasi analitis + map sync otomatis).
5. **Halaman Pendukung:** Metodologi & Sumber Data, Katalog Survey Activities, Export ringkasan (PDF/CSV).

---

## 11. Timeline Development (M1–M8)

| Minggu | Fokus Kegiatan | Target Output |
| :---: | :--- | :--- |
| **M1** | Environment setup (Next.js, FastAPI, PostGIS), desain schema DB, integrasi data sekunder MAPID. | Dev env siap, database schema terpasang, data sekunder tersinkronisasi. |
| **M2** | Survei Lapangan Batch 1 (Gubeng & Pasar Turi), ETL pipeline, frontend scaffolding (Next.js + MapLibre + MAPID Basemap). | Titik survei terverifikasi, ETL pipeline aktif, basemap MAPID berhasil di-render. |
| **M3** | Survei Lapangan Batch 2 (Wonokromo, Waru, Semut), frontend H3 choropleth, layer control, popup atribut, filter spasial. | Titik data survei lengkap, overlay H3 choropleth interaktif di peta, UI filter berfungsi. |
| **M4** | Analisis spasial mendalam: network buffer, agregasi H3, standardisasi 5D TOD, pembobotan AHP, regresi SDM, API endpoints FastAPI. | Skor TOD & %ΔNJOP terhitung untuk seluruh grid, backend REST API siap. |
| **M5** | Integrasi AI: Google Gemini Function Calling, Spatial AI chat panel, RAG basis data Activity, dashboard scorecard & radar chart 5D. | AI Assistant mampu merespons curated prompts dan mengontrol peta; dashboard aktif. |
| **M6** | Integrasi end-to-end (AI Assistant ↔ Peta ↔ Dashboard), polish UI/UX & responsivitas mobile, halaman metodologi, export PDF/CSV. | Seluruh modul terintegrasi, responsif di semua perangkat, modul ekspor aktif. |
| **M7** | QA & User Validation: PyTest FastAPI, validasi konsistensi AHP ($CR \le 0{,}10$), Lighthouse ($\ge 85$), UAT AI (akurasi $\ge 90\%$). | Seluruh kriteria acceptance lulus pengujian, bug-fix tuntas. |
| **M8** | Deployment final ke production (Vercel, Render, Supabase), stress testing, persiapan tautan publik WebGIS. | WebGIS live & stabil di URL publik, siap penilaian juri. |

---

## 12. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
| :--- | :--- | :--- |
| **Kuota token Gemini API habis.** | AI Assistant gagal merespons kueri. | Gunakan Google Gemini API free tier + monitoring kuota; siapkan failover otomatis ke model alternatif (Groq / HuggingFace Inference). |
| **Latensi API tinggi pada dataset spasial besar.** | Peta lambat / lag saat interaksi. | Pre-computation dan caching di PostGIS & Redis; terapkan viewport-based query dan pagination. |
| **Subjektivitas pembobotan AHP.** | Validitas skor TOD dipertanyakan. | Melibatkan akademisi PWK/Transportasi; uji konsistensi matriks perbandingan ($CR \le 0{,}10$). |
| **Halusinasi Model AI.** | Menghasilkan koordinat/insight tidak akurat. | Terapkan Strict JSON Schema; AI sebagai parameter generator (bukan kalkulator koordinat); validasi bounding box di frontend. |
| **Kebocoran API Key di frontend.** | Risiko keamanan & eksploitasi kuota. | Simpan API Key di backend proxy (.env); terapkan rate-limiting (maks. 60 req/menit/IP). |

---

## 13. Rencana Deployment

- **Frontend:** Vercel (Next.js), auto-deploy dari GitHub, CDN global, SSL/HTTPS default.
- **Backend API:** Render (FastAPI Python), Docker containerized deployment.
- **Database Spasial:** Supabase Cloud (Managed PostgreSQL 16 + PostGIS 3.4).
- **Caching:** Redis (Upstash / Render Redis) untuk in-memory cache skor kalkulasi H3.
- **CI/CD:** GitHub Actions untuk automated testing sebelum merge.
- **Target Reliabilitas:** Uptime $\ge 99\%$ selama periode penjurian.

---

## 14. Lampiran

### Diagram Arsitektur Alur Sistem End-to-End & AI
```text
+---------------------------------------------------------------------------------------+
|                              DATA COLLECTION & ETL PIPELINE                           |
|  [MAPID Apps: Properti/Struk/Menu] + [MAPID Catalog: SES/NTL/Banjir] + [Open Data]    |
|                                          │                                            |
|                                          ▼                                            |
|                         Data Cleaning, Geocoding & Validation                         |
|                                          │                                            |
|                                          ▼                                            |
|             Preprocessing & Aggregation: Network Buffer -> Uber H3 (Res 8-9)          |
|                                          │                                            |
|                                          ▼                                            |
|              Unified Spatial Database (PostgreSQL + PostGIS / GEO MAPID DB)           |
+------------------------------------------┬--------------------------------------------+
                                           │
                                           ▼
+---------------------------------------------------------------------------------------+
|                          SERVER-SIDE & ANALYTICS ENGINE (FASTAPI)                     |
|                                                                                       |
|  ┌─────────────────────┐    ┌──────────────────────────┐    ┌──────────────────────┐  |
|  │    AHP Modeling     │    │ Spatial Durbin Model SDM │    │ HDBSCAN + XGBoost    │  |
|  │ (TOD Score: 0-100)  │    │  (Land Value %ΔNJOP)     │    │ (Typology Clustering)│  |
|  └──────────┬──────────┘    └────────────┬─────────────┘    └──────────┬───────────┘  |
|             └────────────────────────────┼─────────────────────────────┘              |
|                                          ▼                                            |
|                  FastAPI Python Server & Spatial Query Engine                         |
|                                          │                                            |
|                 ┌────────────────────────┴────────────────────────┐                   |
|                 ▼                                                 ▼                   |
|      [Redis Pre-computed Cache]                [Google Gemini Spatial AI Engine]      |
|                                                (Function Calling & Intent Parser)     |
+------------------------------------------┬--------------------------------------------+
                                           │ HTTPS / JSON API
                                           ▼
+---------------------------------------------------------------------------------------+
|                           USER INTERFACE & SPATIAL AI (FRONTEND)                      |
|                           Next.js (App Router, React 19, TypeScript)                  |
|                                                                                       |
|  ┌───────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐  |
|  │  Interactive Map      │  │  Dashboard & Scorecard  │  │   Spatial AI Assistant  │  |
|  │  MapLibre GL JS       │  │  Radar Chart 5D TOD,    │  │   Natural Language Chat,│  |
|  │  Uber H3 Choropleth,  │  │  What-if Simulation,    │  │   Bi-directional Map    │  |
|  │  MAPID Vector Basemap │  │  Weakest Dim Indicator  │  │   Sync & Query Handler  │  |
|  └───────────────────────┘  └─────────────────────────┘  └─────────────────────────┘  |
|                                          ▲                                            |
|                                          │                                            |
|         [Stakeholder: Government (PWK) / Business & Investor / Commuter UMKM]         |
+---------------------------------------------------------------------------------------+
```

### Curated Prompts AI Assistant

| No | Contoh Prompt | Fungsi yang Dipicu | Output yang Diharapkan |
| :---: | :--- | :--- | :--- |
| 1 | "Tampilkan skor TOD di sekitar Stasiun Gubeng" | `get_tod_score(station="gubeng")` | Zoom ke Gubeng, highlight H3 cells, tampilkan skor 5D |
| 2 | "Bandingkan skor TOD Gubeng dan Wonokromo" | `compare_stations(a="gubeng", b="wonokromo")` | Radar chart perbandingan 5D, narasi perbedaan |
| 3 | "Apa dimensi TOD terlemah di Stasiun Pasar Turi?" | `get_weakest_dimension(station="pasar_turi")` | Highlight dimensi terlemah + rekomendasi intervensi |
| 4 | "Berapa estimasi kenaikan nilai tanah di sekitar Wonokromo?" | `get_njop_premium(station="wonokromo")` | Choropleth %ΔNJOP + narasi interval kepercayaan |
| 5 | "Tampilkan lokasi warung makan ramai di dekat stasiun" | `filter_layer(layer="menu_go", kondisi="ramai")` | Filter titik Menu Go, zoom ke area relevan |
| 6 | "Jika feeder WiraWiri diperpanjang ke Waru, apa dampaknya?" | `simulate_scenario(scenario="extend_feeder_waru")` | Perbandingan baseline vs skenario, delta skor |
| 7 | "Di mana lokasi terbaik untuk buka kedai kopi dekat stasiun?" | `site_recommendation(type="coffee_shop")` | Rekomendasi sel H3 berdasarkan daya beli + keramaian |
