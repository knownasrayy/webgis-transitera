
**MAPID WEBGIS COMPETITION #2 - 2026**
*Maps That Think! - Mass Transportation Edition*

**PRODUCT REQUIREMENT**

**DOCUMENT (PRD)**

WebGIS - Spatial Intelligence untuk Transportasi Massal

# TransitERA: A WebGIS-Based Decision Support System for Assessing TOD Readiness and Its Association with Land Value in Surabaya

| Nama Tim | **Pak, sibuk ga?** |
| :---- | :---- |
| **Judul Proyek** | TransitERA: A WebGIS-Based Decision Support System for Assessing TOD Readiness and Its Association with Land Value in Surabaya |
| **Institusi** | Institut Teknologi Sepuluh Nopember (ITS) |
| **Ketua Tim** | Muhammad Zulfan Fakhriza Al Azmi |
| **Kontak** | *(email / no. WhatsApp ketua tim)* |

**Anggota Tim**

| No. | Nama Lengkap | Peran dalam Tim |
| :---- | :---- | :---- |
| 1 | Muhammad Zulfan Fakhriza Al Azmi | Project Leader |
| 2 | Muhammad Mirza Wibisono | Business & Product Analyst |
| 3 | Hanaamira Pramesti | Data & Spatial Analyst |
| 4 | Rayhan Agnan Kusuma | UI/UX Designer |
| 5 | Rayka Dharma Pranandita | AI & WebGIS Developer |

---

## 1. Ringkasan Eksekutif

**TransitERA** adalah platform WebGIS interaktif berbasis *Decision Support System* yang dirancang untuk menilai kesiapan kawasan Transit-Oriented Development (TOD) dan keterkaitannya dengan nilai lahan di Kota Surabaya. Platform ini dibangun untuk menjawab permasalahan fragmentasi data spasial yang menghambat perencanaan kawasan TOD, khususnya di sekitar simpul transit Surabaya Regional Railway Line (SRRL) Gerbangkertasusila beserta angkutan penghubung WiraWiri Suroboyo dan Suroboyo Bus.

**Masalah utama** yang diselesaikan adalah tersebar dan tidak terhubungnya data-data penting perencanaan kawasan, seperti kepadatan penduduk, nilai lahan, harga properti, daya beli masyarakat, hingga risiko bencana, di berbagai instansi, sehingga pemerintah, investor, dan pelaku usaha kesulitan menentukan lokasi kawasan yang paling layak dikembangkan sebagai simpul TOD.

**Dataset** yang digunakan mencakup tiga kelompok: (1) data primer survei lapangan melalui MAPID Apps (Properti Go, Struk Go, Menu Go, dan Community Maps/Activity), (2) data sekunder dari MAPID Data Catalog (SES & Demografi, People Spending, Nighttime Light, POI, LST/UHI, Risiko Banjir), serta (3) data spasial publik (ZNT ATR/BPN, rute feeder WiraWiri/Suroboyo Bus, jaringan jalan OSMnx).

**Rencana Survey Activities** menargetkan pengumpulan **360 titik spasial valid** (100 Activity + 260 Mission) di koridor 5 stasiun utama SRRL Surabaya: Gubeng, Pasar Turi, Surabaya Kota/Semut, Wonokromo, dan Waru, pada periode 13–30 Agustus 2026.

**Analisis spasial** dilakukan menggunakan metode Analytical Hierarchy Process (AHP) berbasis kerangka 5D TOD untuk menghasilkan *TOD Readiness Score* pada unit Hexagonal Grid (H3), dilengkapi Spatial Durbin Model untuk mengestimasi keterkaitan skor TOD dengan NJOP bumi per meter persegi (%ΔNJOP).

**Peran AI** mencakup tiga fungsi utama: (1) klasifikasi tipologi kawasan secara otomatis menggunakan HDBSCAN dan XGBoost Classifier, (2) otomasi pemodelan ekonometrika untuk kalkulasi TOD Readiness Score dan inferensi regresi spasial secara real-time, serta (3) Asisten Spasial Interaktif (Spatial AI Assistant) berbasis Google Gemini API yang memanfaatkan Spatial Function Calling untuk menerjemahkan kueri bahasa alami pengguna menjadi kueri spasial dan pembaruan visual peta secara otomatis.

**Hasil utama** platform ini adalah dua insight terintegrasi: (1) TOD Readiness Score pada setiap grid H3 sebagai dasar evaluasi kesiapan dan prioritas pengembangan simpul transit, serta (2) profil kesesuaian properti yang memanfaatkan data transaksi Struk Go dan Menu Go sebagai proksi daya beli untuk membantu pelaku usaha/UMKM memilih lokasi yang presisi, sekaligus menyajikan estimasi premium nilai lahan bagi peluang investasi.

---

## 2. Tujuan Produk

### Problem Statement

1. **Kondisi saat ini:** Data-data pendukung perencanaan kawasan TOD di Surabaya, seperti kepadatan penduduk, nilai lahan, harga properti, daya beli, risiko bencana, dan konektivitas transit, masih terfragmentasi antarinstansi tanpa keterhubungan spasial. Peta digital yang ada saat ini umumnya hanya menampilkan titik-titik lokasi yang menumpuk dan belum mampu memberikan analisis kelayakan kawasan secara komprehensif.

2. **Pihak terdampak:** Pemerintah dan perencana kota yang kesulitan menentukan prioritas pengembangan simpul transit; investor dan pelaku usaha yang tidak memiliki basis data transparan untuk menilai kesesuaian lokasi komersial; serta masyarakat dan UMKM yang kerap salah menempatkan usaha karena hanya mengandalkan harga penawaran tanpa mempertimbangkan konektivitas dan daya beli kawasan.

3. **Dampak masalah:** Proses pengambilan keputusan investasi dan penataan ruang menjadi tidak optimal. Pelaku usaha, khususnya UMKM, mengalami *tenant mismatch*, yaitu penempatan usaha tidak sesuai dengan karakteristik kawasan. Alokasi anggaran pembangunan infrastruktur transit berpotensi tidak tepat sasaran.

4. **Mengapa WebGIS:** WebGIS mampu mengintegrasikan berbagai sumber data spasial terfragmentasi ke dalam satu platform visualisasi interaktif yang mudah dipahami, dilengkapi analisis spasial terstandarisasi (H3 Hexagonal Grid) dan asisten AI yang menerjemahkan kompleksitas data menjadi insight *actionable* bagi pengguna non-teknis.

### Tujuan

1. Menghasilkan *TOD Readiness Score* yang terukur dan konsisten untuk setiap sel wilayah H3 di sekitar simpul transit SRRL Surabaya, sebagai dasar evaluasi kesiapan kawasan TOD.

2. Menyajikan estimasi keterkaitan skor kesiapan TOD dengan nilai lahan (%ΔNJOP) melalui model regresi spasial, sehingga pengguna memperoleh gambaran potensi dampak ekonomi dari pengembangan simpul transit.

3. Menyediakan profil kesesuaian properti berbasis proksi daya beli (Struk Go & Menu Go) yang membantu pelaku usaha/UMKM menghindari *tenant mismatch* dalam keputusan lokasi.

4. Menghadirkan asisten spasial AI interaktif yang dapat diakses seluruh segmen pengguna untuk mengeksplorasi data, memperoleh insight, dan menerima rekomendasi kebijakan dalam bahasa alami.

### Value Proposition

1. **Pengguna utama:** Pemerintah/perencana kota, investor/pelaku usaha, dan masyarakat/UMKM yang membutuhkan informasi spasial terintegrasi untuk pengambilan keputusan terkait kawasan transit.

2. **Cara membantu:** Platform mengubah data spasial terfragmentasi menjadi skor kesiapan TOD yang terukur, estimasi premium nilai lahan, dan profil kesesuaian lokasi usaha, semuanya dalam satu antarmuka peta interaktif yang dapat dieksplorasi menggunakan bahasa alami.

3. **Manfaat:** Evaluasi kawasan TOD yang akurat dan transparan; identifikasi peluang investasi berbasis data; penempatan usaha yang presisi dan terhindar dari *mismatch*; serta partisipasi masyarakat melalui community maps.

4. **Keunggulan solusi:** Integrasi empat komponen yang belum ditemukan secara terpadu di Indonesia: (a) agregasi spasial H3 yang menggantikan radius lingkaran konvensional, (b) skoring AHP dengan pendekatan 5D TOD, (c) profil kesesuaian properti berbasis transaksi riil, dan (d) asisten spasial AI berbasis Google Gemini dengan Spatial Function Calling. Semua didukung data primer lapangan dari ekosistem MAPID Apps dan data sekunder MAPID Data Catalog.

### Matriks Transformasi Dampak (*Outcome over Tool*)

Prinsip dasar TransitERA: **Pengguna tidak membeli kecanggihan tools GIS atau kompleksitas model AI, melainkan membeli hasil (*outcome*) berupa keputusan strategis yang cepat, akurat, dan minim risiko.**

| Dimensi Evaluasi | Kondisi Konvensional (*Before*) | Transformasi TransitERA (*After*) | Metrik Peningkatan |
| :--- | :--- | :--- | :--- |
| **Waktu Pengambilan Keputusan** | 2–3 minggu mengumpulkan data terpisah dari ATR/BPN, BPS, Dishub, dan listing web. | **< 30 menit** melalui dashboard terpadu dan query Asisten Spasial AI. | **Akselerasi efisiensi waktu > 95%** |
| **Akurasi Penentuan Lokasi UMKM** | Berbasis tebakan (*gut feeling*) dan harga listing sewa properti semata. | Berbasis proksi transaksi riil (*Struk Go & Menu Go*) dan tingkat konektivitas transit. | **Reduksi risiko *tenant mismatch* & kegagalan usaha** |
| **Dasar Penganggaran Infrastruktur Pejalan Kaki** | Bersifat kualitatif atau berbasis usulan parsial tanpa sintesis spasial. | Berbasis indikator terlemah 5D TOD pada unit H3 Grid terstandarisasi. | **Transparansi & justifikasi alokasi anggaran 100% data-driven** |
| **Aksesibilitas Data Spasial Kompleks** | Terbatas pada analis GIS bersertifikasi yang mengoperasikan software desktop. | Terbuka bagi seluruh stakeholder via *natural language interface* (Google Gemini API). | **Demokratisasi spatial intelligence ke level non-teknis** |

---

## 3. Ruang Lingkup Produk

### In-Scope

- Fitur utama: Peta interaktif H3 choropleth TOD Readiness Score, dashboard scorecard radar chart 5D, simulasi skenario intervensi, peta distribusi premium nilai lahan, Spatial AI Assistant.

- Dataset: Data primer MAPID Apps (Properti Go, Struk Go, Menu Go, Community Maps/Activity), data sekunder MAPID Data Catalog (SES & Demografi, People Spending, NTL, POI, LST/UHI, Risiko Banjir), dan data publik (ZNT ATR/BPN, Rute Feeder, Jaringan Jalan OSMnx).

- Analisis spasial: Network buffer analysis (zona 0–400m, 400–800m, 800–1.000m), agregasi H3 (resolusi 8–9), skoring AHP 5D TOD, Spatial Durbin Model, klasterisasi HDBSCAN + XGBoost Classifier.

- Visualisasi WebGIS: Basemap MAPID MAPS, overlay choropleth H3 untuk skor TOD dan %ΔNJOP, popup atribut per sel, layer control multi-layer, filter interaktif, tabel lokasi/informasi.

- Dashboard: Radar chart 5 dimensi TOD per simpul, scorecard numerik, simulasi skenario *what-if* (penambahan koridor feeder), grafik perbandingan antarsimpul.

- AI: Spatial AI Assistant (Google Gemini API via Function Calling), dengan input bahasa alami serta output manipulasi peta dan narasi teks; klasifikasi tipologi kawasan otomatis; pemodelan regresi real-time.

- Output utama: TOD Readiness Score, estimasi %ΔNJOP, profil kesesuaian lokasi usaha, rekomendasi kebijakan berbasis indikator terlemah kawasan.

- Export: Unduh ringkasan analisis per sel/simpul dalam format PDF/CSV.

### Out-of-Scope

- *Real-time train tracking* dan integrasi data operasional KAI secara langsung.

- Sistem notifikasi push/SMS kepada pengguna.

- Cakupan wilayah analisis di luar Kota Surabaya (replikasi ke kota lain ditunda ke tahap pasca-kompetisi).

- Integrasi pembayaran atau transaksi e-commerce properti.

- Pengembangan aplikasi mobile native (fokus pada responsive web).

- Analisis lanjutan yang memerlukan data confidential pemerintah (seperti data NJOP real-time dari Dispenda yang belum terbuka).

- Fitur kolaborasi multi-user real-time (collaborative editing).

---

## 4. User Persona

### Persona 1: Perencana Kota (Pemerintah)

- **Nama:** Ir. Budi Santoso, M.T.

- **Jabatan:** Kepala Seksi Perencanaan Transportasi, Dinas Perhubungan Kota Surabaya

- **Usia:** 47 tahun

- **Latar Belakang:** Lulusan Teknik Sipil dengan pengalaman 20 tahun di perencanaan kota. Bertanggung jawab atas evaluasi koridor transit dan pengajuan anggaran infrastruktur pejalan kaki di kawasan simpul transit.

- **Goals:** Menentukan prioritas anggaran pembangunan fasilitas pedestrian di simpul transit berdasarkan skor kesiapan kawasan TOD yang terukur dan dapat dipertanggungjawabkan.

- **Pain Points:** Data fragmentasi antarinstansi membuat laporan evaluasi simpul transit memakan waktu berminggu-minggu. Tidak ada indikator tunggal yang menyintesis seluruh dimensi kesiapan kawasan TOD. Kesulitan membandingkan potensi antarsimpul secara kuantitatif.

- **Needs:** Dashboard perbandingan antarsimpul transit, skor kesiapan TOD yang terstandardisasi, dan rekomendasi prioritas intervensi berdasarkan dimensi terlemah.

- **User Stories:**
  - *"Sebagai Perencana Kota, Saya ingin melihat TOD Readiness Score berbasis H3 Grid agar dapat menentukan prioritas anggaran pembangunan fasilitas pejalan kaki di simpul transit."*
  - *"Sebagai Perencana Kota, Saya ingin menjalankan simulasi skenario 'Jika koridor feeder WiraWiri diperpanjang ke Stasiun X' agar dapat memperkirakan dampaknya terhadap skor TOD dan nilai lahan."*
  - *"Sebagai Perencana Kota, Saya ingin bertanya kepada asisten AI 'Apa dimensi TOD terlemah di Stasiun Gubeng?' agar mendapat rekomendasi intervensi yang spesifik."*

---

### Persona 2: Investor / Pelaku Usaha

- **Nama:** Rina Wulandari, S.E.

- **Jabatan:** Property & Site Analyst, Developer Properti Swasta

- **Usia:** 34 tahun

- **Latar Belakang:** Lulusan Manajemen Bisnis dengan pengalaman 8 tahun di bidang analisis lokasi properti. Bertugas mengevaluasi potensi investasi lahan di sekitar koridor transit baru.

- **Goals:** Mengidentifikasi lokasi properti dengan potensi kenaikan nilai lahan tertinggi akibat pengembangan SRRL, serta memahami profil daya beli kawasan untuk menentukan jenis tenant yang sesuai.

- **Pain Points:** Data nilai lahan dan properti tersebar di berbagai platform listing (Rumah123, 99.co) tanpa konteks kesiapan kawasan transit. Tidak ada estimasi dampak transit terhadap apresiasi nilai lahan. Kerap mengalami *tenant mismatch* karena tidak mempertimbangkan daya beli lokal.

- **Needs:** Peta premium nilai lahan (%ΔNJOP) di sekitar simpul transit, profil kesesuaian properti berbasis Struk Go & Menu Go, dan filter berdasarkan jenis usaha dan tipe transaksi.

- **User Stories:**
  - *"Sebagai Investor Properti, Saya ingin melihat estimasi kenaikan NJOP per grid H3 di sekitar Stasiun Wonokromo agar dapat menilai peluang investasi lahan."*
  - *"Sebagai Pelaku Usaha F&B, Saya ingin mengetahui profil daya beli dan keramaian kawasan berdasarkan data Struk Go dan Menu Go agar dapat memilih lokasi yang sesuai dengan segmen pasar saya."*

---

### Persona 3: Masyarakat / UMKM

- **Nama:** Ahmad Fauzi

- **Jabatan:** Pemilik Warung Kopi (UMKM Kuliner)

- **Usia:** 29 tahun

- **Latar Belakang:** Pelaku UMKM kuliner yang ingin membuka cabang baru di sekitar koridor transit Surabaya. Belum memiliki latar belakang GIS atau analisis data.

- **Goals:** Menemukan lokasi ideal untuk cabang baru warung kopi berdasarkan tingkat keramaian, daya beli, dan kedekatan dengan simpul transit.

- **Pain Points:** Hanya mengandalkan survei mandiri dan harga sewa sebagai pertimbangan. Tidak memiliki akses ke data komprehensif tentang karakteristik kawasan dan potensi demand.

- **Needs:** Antarmuka peta yang sederhana dan mudah dipahami, rekomendasi lokasi berbasis data dalam bahasa sehari-hari melalui asisten AI, serta visualisasi tingkat keramaian kawasan.

- **User Stories:**
  - *"Sebagai Pemilik UMKM Kuliner, Saya ingin bertanya ke AI 'Di mana lokasi terbaik untuk buka kedai kopi dekat stasiun?' agar mendapat rekomendasi berbasis data yang mudah dipahami."*
  - *"Sebagai Masyarakat, Saya ingin melaporkan kondisi trotoar rusak di sekitar halte feeder melalui fitur Community Maps agar data kondisi lapangan tetap aktual."*

---

### 4.4 Matriks Value Proposition Canvas (VPC) per Persona

Untuk memastikan keselarasan penuh (*Problem-Solution Fit*) sesuai arahan Coaching 3 (Pak Sena), berikut pemetaan Value Proposition Canvas untuk ketiga segmen pengguna TransitERA:

| Komponen VPC | Persona 1: Perencana Kota (Dishub Surabaya) | Persona 2: Property & Site Analyst (Investor) | Persona 3: Pemilik UMKM (Pelaku Usaha F&B) |
| :--- | :--- | :--- | :--- |
| **Customer Jobs** | • Evaluasi kesiapan koridor transit SRRL.<br>• Penetapan prioritas anggaran pejalan kaki.<br>• Pemodelan rute feeder pendukung. | • Analisis kelayakan akuisisi lahan komersial.<br>• Estimasi proyeksi apresiasi nilai properti.<br>• Penentuan segmen penyewa (*tenant mix*). | • Memilih lokasi pembukaan cabang usaha baru.<br>• Mengetahui daya beli & keramaian calon pelanggan.<br>• Mengurangi risiko kegagalan sewa tempat. |
| **Customer Pains** | • Data spasial terfragmentasi lintas dinas.<br>• Laporan evaluasi memakan waktu berminggu-minggu.<br>• Tidak ada skor kesiapan TOD tunggal yang saintifik. | • Buta dampak konektivitas transit terhadap nilai lahan.<br>• Data listing properti terisolasi tanpa konteks daya beli.<br>• Risiko *tenant mismatch* akibat asumsi sepihak. | • Modal terbatas & rentan bangkrut jika salah pilih lokasi.<br>• Hanya mengandalkan survei manual & harga sewa.<br>• Tidak paham software GIS desktop yang rumit. |
| **Customer Gains** | • Pengambilan keputusan berbasis data < 30 menit.<br>• Skor 5D TOD terstandarisasi per grid H3.<br>• Simulasi dampak perluasan feeder secara instan. | • Peta premium nilai lahan (%ΔNJOP) berbasis SDM.<br>• Profil daya beli riil (*Struk Go & Menu Go*).<br>• Justifikasi investasi yang kuat bagi pimpinan/klien. | • Rekomendasi titik strategis via Asisten AI bahasa alami.<br>• Informasi sebaran keramaian dan segmen harga lokal.<br>• Peningkatan peluang keberhasilan bisnis kuliner. |
| **Products & Services** | Platform WebGIS TransitERA + Dashboard Scorecard 5D + Modul Simulasi Skenario Intervensi. | Layer Choropleth H3 %ΔNJOP + Fitur Filter Properti & Daya Beli + Export Laporan Analitik. | Peta Interaktif Keramaian & Profil Daya Beli + Spatial AI Assistant (Google Gemini via Chat). |
| **Pain Relievers** | • Agregasi otomatis seluruh data ke grid H3.<br>• Sintesis AHP 5D instan dalam satu dashboard.<br>• Identifikasi otomatis dimensi indikator terlemah. | • Regresi Spatial Durbin Model untuk estimasi %ΔNJOP.<br>• Validasi transaksi riil dari data Struk Go.<br>• Filter terpadu harga pasar vs nilai NJOP. | • Chatbot spasial yang menerjemahkan kueri sehari-hari.<br>• Rekomendasi lokasi spesifik tanpa perlu olah data.<br>• Layer Community Maps untuk info kondisi lapangan. |
| **Gain Creators** | • Rekomendasi kebijakan otomatis berbasis AI.<br>• Transparansi alokasi anggaran infrastruktur.<br>• Komparasi visual antarsimpul transit via Radar Chart. | • Interval kepercayaan 95% untuk kalkulasi risiko.<br>• Wawasan *people spending* dan dinamika malam hari (NTL).<br>• Ekspor data format CSV/PDF siap presentasi. | • Panduan langkah pembukaan lokasi usaha.<br>• Akses gratis ke informasi spasial level korporasi.<br>• Pelibatan aspirasi via laporan warga di Community Maps. |

---

### 4.5 Evaluasi 5 Pertanyaan Kunci Dewan Juri (*Coaching 3 Challenge*)

Menjawab tantangan juri (Bapak Widya Sena Pradipta, VP PT KAI / Juri MAPID Catalyst 2025), berikut pembuktian keterhubungan masalah, bukti empiris, dan transformasi nilai pada TransitERA:

1. **Siapa user spesifik produk Anda? (*Target User Persona*)**
   * *Bukan masyarakat umum secara bias*, melainkan: (a) Kepala Seksi Perencanaan Transportasi Dishub Kota Surabaya, (b) Site & Investment Analyst pengembang properti swasta, dan (c) Pengusaha UMKM kuliner di koridor simpul transit SRRL Surabaya.
2. **Pekerjaan apa yang sebenarnya ingin diselesaikan oleh user? (*Customer Jobs*)**
   * Menilai kelayakan simpul transit untuk alokasi anggaran trotoar/feeder (Dishub), memproyeksikan kenaikan nilai investasi lahan akibat infrastruktur transit (Investor), dan memilih lokasi cabang usaha yang ramai serta sesuai daya beli (UMKM).
3. **Apa rasa sakit (*pain point*) paling menyiksa yang dihadapi user? (*Core Pain Point*)**
   * *Data fragmentation & decision latency*: Butuh waktu 2–3 minggu mengumpulkan data terpisah, tingginya risiko *tenant mismatch* yang menyebabkan modal UMKM hangus dalam 6 bulan pertama, serta ketidakmampuan membuktikan korelasi antara pembangunan transit dengan apresiasi nilai lahan secara kuantitatif.
4. **Apa bukti nyata bahwa masalah tersebut benar-benar terjadi? (*Evidence of Problem*)**
   * *Evidence 1*: Ketiadaan integrasi data ZNT ATR/BPN dengan rute Dishub Surabaya di portal terbuka.
   * *Evidence 2*: Tingkat *turnover* / tutupnya gerai komersial di ruko sekitar stasiun sekunder akibat ketidaksesuaian segmen harga dengan daya beli penumpang harian.
   * *Evidence 3*: Hasil survei awal Tim `#PakSibukGa` yang mendapati fasilitas pedestrian di stasiun tertentu terputus dalam radius 200 meter meski melayani ribuan komuter.
5. **Apa nilai (*value*) yang berubah secara terukur bagi user? (*Measurable Value Impact*)**
   * Efisiensi waktu analisis dari 3 minggu menjadi **< 30 menit (reduksi waktu 95%)**; penentuan lokasi usaha berbasis **transaksi riil (Struk Go & Menu Go)**; serta justifikasi penganggaran publik yang **100% didukung pemodelan ekonometrika spasial (AHP & SDM)**.

---

## 5. Dataset Dasar

*Dataset yang digunakan berasal dari data MAPID (Community Maps, Mission), data sekunder MAPID Data Catalog, dan data publik.*

| Dataset | Sumber | Fungsi dalam Produk |
| :---- | :---- | :---- |
| **Community Maps (Activity)** | Data Primer: MAPID Apps (Survei Tim `#PakSibukGa`) | Catatan warga, foto kondisi trotoar, halte, konektivitas. Validasi kondisi fisik lapangan, partisipasi publik, dan data latih RAG Asisten Spasial AI. |
| **Properti Go** | Data Primer: MAPID Apps Mission | Jenis properti, harga penawaran, tipe transaksi (jual/sewa), foto. Validasi nilai pasar lahan terhadap skor kesiapan TOD (%ΔNJOP). |
| **Struk Go** | Data Primer: MAPID Apps Mission | Nilai transaksi merchant F&B, minimarket, & transportasi. Proksi tingkat aktivitas ekonomi & daya beli lokal (variabel *People Spending Proxy*). |
| **Menu Go** | Data Primer: MAPID Apps Mission | Lokasi UMKM kuliner, kisaran harga menu, tingkat keramaian. Variabel *Diversity* (percampuran guna lahan & skala harga usaha lokal). |
| **SES & Demografi** | Data Sekunder: MAPID Data Catalog | Kepadatan penduduk & tingkat kesejahteraan per kelurahan. Variabel *Density* dalam bobot AHP TOD. |
| **People Spending & Nighttime Light (NTL)** | Data Sekunder: MAPID Data Catalog | Intensitas NTL & agregat pengeluaran. Indikator intensitas aktivitas & dinamika kawasan malam hari. |
| **Jaringan Rel KAI & POI** | Data Sekunder: MAPID Data Catalog (Transportation, Education, Economy) | Jalur rel, stasiun eksisting, POI sekolah/perdagangan. Variabel *Destination Accessibility* & konektivitas. |
| **Land Surface Temperature (LST), Urban Heat Island (UHI), Risiko Banjir** | Data Sekunder: MAPID Data Catalog (Nature & Environment) | Faktor lingkungan. Variabel kontrol lingkungan (*disamenity*) dalam model regresi. |
| **Zona Nilai Tanah (ZNT), NJOP Bumi/m2** | Data Publik: ATR/BPN | Variabel terikat (*dependent variable*) model regresi spasial. |
| **Rute Feeder WiraWiri Suroboyo & Suroboyo Bus** | Data Publik: Dishub Surabaya / OSM | Rute, halte feeder. Variabel *Transit Connectivity* dalam AHP. |
| **Jaringan Jalan Pedestrian** | Data Publik: OpenStreetMap (via OSMnx) | Pedestrian & road network. Analisis *network walkability* & pembentukan buffer spasial. |

---

## 6. Rencana Survey Activities

### Lokasi

- **Wilayah survei:** Kawasan Metropolitan Surabaya, difokuskan pada koridor transit Surabaya Regional Railway Line (SRRL) Gerbangkertasusila serta koridor feeder WiraWiri Suroboyo dan Suroboyo Bus.

- **Simpul stasiun utama:**
  1. Stasiun Surabaya Gubeng
  2. Stasiun Pasar Turi
  3. Stasiun Surabaya Kota / Semut
  4. Stasiun Wonokromo
  5. Stasiun Waru

- **Delimitasi catchment (zonasi survei):**
  - 0–400 meter: Core Pedestrian Zone (inti)
  - 400–800 meter: Primary Catchment Zone (utama)
  - 800–1.000 meter: Sensitivity Zone

- **Tagar resmi survei:** `#PakSibukGa`

### Objek

**A. Data Activity (Community Maps) (Wajib), Target: 100 Titik Valid**

| Kategori Activity | Target | Objek yang Didokumentasikan | Relevansi dalam WebGIS & AI |
| :--- | :---: | :--- | :--- |
| Pedestrian & Walkability | 35 titik | Fisik trotoar, ketersediaan *ramp/tactile paving*, zebra cross, JPO, pencahayaan malam | Variabel *Design* dalam pembobotan 5D TOD (AHP Score) |
| Transit Integration & Multimodal | 30 titik | Lokasi halte WiraWiri/Suroboyo Bus, pangkalan ojol/angkot, titik *drop-off*, fasilitas parkir sepeda | Variabel *Destination Accessibility* & integrasi antarmoda |
| Hambatan Ruang & Disamenity | 20 titik | Trotoar terganggu PKL meluber, parkir liar, titik genangan air/banjir, penyempitan jalur | Variabel Kontrol Lingkungan (*Disamenity Factors*) |
| User Experience & Dynamics | 15 titik | Antrean bus/feeder jam sibuk, kepadatan ruang tunggu stasiun/halte, catatan kenyamanan pejalan kaki | Data latih RAG Asisten Spasial AI (Google Gemini) |

**B. Data Mission (Opsional), Target: 260 Titik Valid**

| Mission | Target | Objek | Manfaat Model |
| :--- | :---: | :--- | :--- |
| Properti Go | 100 titik | Properti dijual/disewakan (Rumah, Ruko, Kos, Tanah, Retail F&B) radius 0–1.000m simpul SRRL | Validasi variabel terikat nilai tanah riil pasar terhadap %ΔNJOP |
| Struk Go | 60 titik | Struk transaksi minimarket, F&B, dan transportasi (max 3 hari terakhir) | Indikator intensitas aktivitas ekonomi & daya beli lokal |
| Menu Go | 100 titik | Warung, kaki lima, kafe, resto, kisaran harga menu, tingkat keramaian | Variabel *Diversity* (percampuran guna lahan dan skala harga) |

### Output

Setiap titik survei menghasilkan atribut berikut:

- Nama objek/tempat dan kategori objek.
- Tanggal dan waktu survei.
- Alamat lokasi.
- Foto dokumentasi (diambil langsung di lokasi, real-time camera).
- Kondisi objek (narasi deskriptif untuk Activity, dropdown terstruktur untuk Mission).
- Catatan survei (bahasa sehari-hari, tanpa jargon teknis).
- Latitude & Longitude (GPS terkunci, presisi < 5 meter).
- Tagar `#PakSibukGa` (wajib untuk Activity).
- Informasi tambahan sesuai jenis survey (harga menu, nilai transaksi, jenis properti, dll.).

### Ketentuan Survey

- Data harus sesuai kondisi lapangan nyata.
- Koordinat harus sesuai lokasi objek (GPS terkunci akurat).
- Foto harus jelas dan tidak buram; diambil langsung di lokasi.
- Foto tidak boleh menampilkan wajah seseorang secara jelas atau plat nomor kendaraan.
- Data tidak boleh berasal dari sumber manipulasi seperti Google Street View atau internet.
- Data hasil survey perlu divalidasi bersama Koordinator Pendamping sebelum digunakan.
- Hindari pengunggahan data pada jam 16:00–17:00 WIB (maintenance server MAPID).
- Survei dilakukan berpasangan dengan mengutamakan keselamatan.

### Pemanfaatan Hasil Survey

- Melengkapi dataset dasar panitia dengan data primer lapangan yang aktual.
- Memvalidasi kondisi fisik fasilitas pedestrian dan transit di lapangan.
- Menambahkan titik data pada peta WebGIS sebagai layer interaktif.
- Menjadi input analisis spasial (variabel AHP, regresi, dan klasterisasi).
- Menjadi basis pengetahuan RAG untuk Asisten Spasial AI (narasi Activity → Gemini RAG).
- Menjadi dasar insight dan rekomendasi AI kepada pengguna.

---

## 7. Metode Pengolahan Data, AI, dan Analisis Spasial

### Data Processing

**Cleaning:**

- Pembersihan data duplikat dan entri tidak valid dari MAPID Apps (Activity & Mission).
- Normalisasi format atribut: standardisasi tipe data (koordinat, tanggal, kategori), harmonisasi naming convention, dan penanganan *missing values*.
- Anonimisasi PII: pembersihan informasi pribadi sensitif (nama, nomor telepon, plat nomor) dari data Struk Go & Properti Go sebelum masuk ke basis data terpusat.

**Validasi:**

- Cross-check koordinat GPS terhadap batas administrasi Kota Surabaya dan bounding box zona survei.
- Verifikasi titik bersama Koordinator Pendamping MAPID.
- Uji konsistensi data Mission melalui pencocokan foto dengan kategori yang dipilih.
- Validasi *bounding box* di frontend: menolak koordinat `[0,0]` atau koordinat di luar wilayah studi.

**Integrasi:**

- Penggabungan data Activity dan Mission dari GEO MAPID REST API ke PostgreSQL/PostGIS.
- Spatial join data survei dengan sel H3 Grid (resolusi 8–9) menggunakan fungsi `ST_Intersects`.
- Integrasi data sekunder MAPID Data Catalog (SES, NTL, LST, UHI, Risiko Banjir) ke dalam unit H3.
- Penggabungan data publik (ZNT ATR/BPN, rute feeder, jaringan jalan OSMnx) dalam satu basis data spasial.

### Spatial Analysis

| Metode Analisis | Data yang Digunakan | Tujuan | Output |
| :--- | :--- | :--- | :--- |
| **Network Buffer Analysis** | Jaringan jalan OSMnx, lokasi stasiun SRRL | Menentukan jangkauan pengaruh stasiun berdasarkan jarak berjalan kaki, menggantikan radius lingkaran konvensional | Zona catchment 0–400m, 400–800m, 800–1.000m per simpul transit |
| **Agregasi H3 Hexagonal Grid** | Seluruh variabel indikator | Menstandarisasi unit analisis spasial agar perbandingan antarkawasan konsisten dan bebas MAUP | Matriks data per sel H3 (resolusi 8–9) |
| **Standarisasi Indikator 5D TOD** | Density, Diversity, Design, Destination Accessibility, Distance to Transit | Mengubah variabel mentah menjadi indikator terstandarisasi siap AHP | Matriks indikator siap pembobotan |
| **Pembobotan AHP** | Matriks indikator 5D TOD, penilaian panel ahli | Menghasilkan bobot relatif dan skor kesiapan kawasan TOD | TOD Readiness Score (0–100) per sel H3, CR ≤ 0,10 |
| **Regresi Spasial (Spatial Durbin Model)** | TOD Readiness Score, ZNT NJOP, variabel kontrol | Menguji keterkaitan skor TOD dengan NJOP bumi/m2 | Koefisien regresi, estimasi %ΔNJOP per sel, interval kepercayaan 95% |
| **Analisis Simpul Proyeksi** | Skenario baseline vs pengembangan (penambahan feeder) | Membandingkan dampak intervensi terhadap skor TOD dan nilai lahan | Estimasi potensi perubahan TOD Score dan %ΔNJOP pasca-intervensi |

### AI Integration

**Alur Integrasi AI dalam WebGIS:**

```
+------------------------------------------------------------------+
|                        USER (Browser)                             |
|  [Prompt Bahasa Alami] --> [AI Chat Panel]                        |
+--------------------------------+---------------------------------+
                                 | HTTPS
                                 v
+------------------------------------------------------------------+
|                     FASTAPI BACKEND                               |
|                                                                   |
|  +----------------+   +--------------------+   +----------------+ |
|  | AI Router      |-->| Google Gemini API   |-->| Function Call  | |
|  | (Proxy)        |   | (JSON Function     |   | Dispatcher     | |
|  |                |   |  Calling)           |   |                | |
|  +----------------+   +--------------------+   +-------+--------+ |
|                                                         |         |
|  +------------------------------------------------------v------+ |
|  | Spatial Query Engine (PostGIS)                               | |
|  | - Text-to-SQL conversion                                    | |
|  | - H3 Grid queries                                           | |
|  | - AHP Score retrieval                                       | |
|  | - SDM inference                                             | |
|  +------------------------------------------------------+------+ |
|                                                         |         |
|  +------------------------------------------------------v------+ |
|  | Response Builder                                             | |
|  | - json_response: {action, target_layer, query_filter}       | |
|  | - text_response: narasi & rekomendasi human-readable        | |
|  +------------------------------------------------------+------+ |
+--------------------------------+---------------------------------+
                                 | HTTPS
                                 v
+------------------------------------------------------------------+
|                     FRONTEND (Next.js)                            |
|  - Render narasi di Chat Panel                                    |
|  - Eksekusi json_response: update peta, filter layer, zoom       |
|  - Visualisasi: choropleth H3, popup, chart update               |
+------------------------------------------------------------------+
```

**Tiga Fungsi Utama AI:**

1. **Klasifikasi Tipologi Kawasan (Offline/Preprocessing)**
   - **Input:** Variabel indikator per sel H3 (Density, Diversity, Design, Destination Accessibility, Distance to Transit).
   - **Proses:** HDBSCAN untuk klasterisasi awal tanpa presetting jumlah klaster, dilanjutkan XGBoost Classifier untuk klasifikasi supervised.
   - **Output:** 3 tipologi kawasan: *Commercial Transit Hub*, *Mixed-Use Residential Area*, dan *Low-Accessibility Feeder Zone* (F1-score target >= 0,85).

2. **Otomasi Pemodelan Ekonometrika (Backend Real-time)**
   - **Input:** TOD Readiness Score + variabel kontrol + skenario intervensi pengguna.
   - **Proses:** Kalkulasi skor AHP dan inferensi Spatial Durbin Model secara real-time melalui backend API.
   - **Output:** TOD Readiness Score (0–100), estimasi %ΔNJOP, perbandingan skenario baseline vs intervensi.

3. **Asisten Spasial Interaktif (User-Facing / Live WebGIS)**
   - **Input:** Kueri bahasa alami pengguna (contoh: *"Bandingkan skor TOD Gubeng dan Wonokromo"*).
   - **Proses:** Google Gemini API via JSON Function Calling → konversi ke spatial query PostGIS → eksekusi → rangkum hasil.
   - **Output:** Dua bagian respons: (a) `json_response` untuk pembaruan visual peta secara otomatis, dan (b) `text_response` berupa narasi kesimpulan dan rekomendasi kebijakan.

**Catatan penting AI (sesuai coaching Mas Mahrus):**

- API key AI disimpan di backend (environment variables), tidak pernah terekspos di frontend.
- Respons AI selalu dipisah menjadi `json_response` dan `text_response`.
- AI diposisikan sebagai *parameter generator / query builder*, bukan kalkulator koordinat mentah.
- Validasi *bounding box* diterapkan di frontend sebelum me-render data ke peta.
- Kuota token dioptimasi: data mentah masif tidak dikirim ke prompt; AI menghasilkan query filter yang dieksekusi lokal.
- Daftar *curated prompts* disediakan di UI WebGIS untuk memandu juri dan pengguna.

### Output

- **TOD Readiness Score:** Skor kesiapan kawasan 0–100 pada setiap sel H3 berdasarkan pembobotan AHP 5D, divisualisasikan sebagai choropleth dan radar chart.

- **Estimasi Premium Nilai Lahan:** %ΔNJOP per sel/simpul berdasarkan Spatial Durbin Model, lengkap dengan interval kepercayaan 95%.

- **Tipologi Kawasan:** Klasifikasi otomatis 3 tipe kawasan pada setiap sel H3.

- **Profil Kesesuaian Properti:** Rekomendasi kesesuaian jenis usaha berdasarkan proksi daya beli (Struk Go) dan karakteristik pasar (Menu Go).

- **Rekomendasi Kebijakan:** Prioritas intervensi berdasarkan indikator terlemah pada setiap kawasan, dihasilkan oleh Asisten AI.

---

## 8. Fitur Produk dan Acceptance Criteria

### 8.1 Prinsip Prioritisasi Fitur & Anti-Bloat Strategy (*Core Value Focus*)

Sesuai arahan evaluasi Coaching 3 mengenai **jebakan *Super-Apps* (fitur berlebih yang tidak menyelesaikan masalah inti)**, tim TransitERA menerapkan prinsip *Less is More*. Kami memangkas fitur-fitur sekunder yang tidak relevan dengan kebutuhan darurat/harian pengguna, serta memfokuskan 100% kapabilitas sistem pada **1 Core Decision Engine**:

```
[ CORE VALUE ENGINE TransitERA ]
H3 5D TOD Readiness & Land Value Association Engine + Spatial AI Assistant
                   |
     +-------------+-------------+
     |                           |
[ Dimensi Perencana/Investor ]   [ Dimensi UMKM/Warga ]
• H3 5D Scorecard & Radar Chart  • Proksi Daya Beli (Struk & Menu Go)
• Spatial Durbin Model (%ΔNJOP)  • Spatial AI Natural Language Assistant
• Simulasi Skenario Intervensi   • Community Maps Validation Layer
```

* **Fitur yang Dipertahankan (*Core High-Value*)**:
  1. *H3 Choropleth TOD Score & %ΔNJOP*: Memberikan visualisasi terstandarisasi untuk perbandingan objektif.
  2. *Scorecard Radar Chart 5D & Simulasi What-If*: Menjawab kebutuhan penganggaran instan Dishub.
  3. *Profil Kesesuaian Lokasi Bisnis*: Membantu UMKM memilih lokasi berdasarkan data transaksi riil.
  4. *Spatial AI Assistant (Google Gemini)*: Memungkinkan eksplorasi data secara demokratis via natural language.
* **Fitur yang Dieliminasi/Ditunda (*Deprioritized Non-Core*)**:
  1. ❌ *3D City Mesh / Digital Twin*: Dieliminasi karena membebani bandwidth dan tidak menambah akurasi keputusan TOD.
  2. ❌ *Real-time Train Tracking*: Ditunda karena operasional harian kereta bukan domain evaluasi kesiapan kawasan.
  3. ❌ *AR Mapping*: Dieliminasi karena tidak memiliki relevansi analitik bagi perencana kota maupun pelaku usaha.

---

### 8.2 Matriks Fitur Produk dan Acceptance Criteria

| Fitur Produk | Acceptance Criteria |
| :---- | :---- |
| **Peta Interaktif H3 Choropleth:** Visualisasi TOD Readiness Score dan %ΔNJOP dalam sel H3 pada basemap MAPID MAPS. | Basemap MAPID MAPS berhasil ditampilkan. Sel H3 ter-render dengan gradasi warna berdasarkan skor TOD. Klik pada sel menampilkan popup atribut lengkap (skor, dimensi, tipologi). Zoom, pan, dan layer control berfungsi lancar di desktop & mobile. |
| **Dashboard Scorecard & Radar Chart:** Ringkasan skor 5D TOD per simpul transit dengan radar chart interaktif. | Radar chart 5 dimensi muncul saat simpul transit dipilih. Scorecard numerik menampilkan skor TOD keseluruhan dan per dimensi. Perbandingan antarsimpul dapat dilakukan secara visual. |
| **Simulasi Skenario Intervensi:** Fitur *what-if* untuk mensimulasikan dampak penambahan koridor feeder terhadap skor TOD dan %ΔNJOP. | Pengguna dapat memilih skenario intervensi dari dropdown. Hasil simulasi menampilkan perubahan skor TOD dan %ΔNJOP secara real-time. Perbandingan baseline vs skenario divisualisasikan berdampingan. |
| **Peta Distribusi Premium Nilai Lahan:** Visualisasi estimasi %ΔNJOP hasil Spatial Durbin Model. | Layer %ΔNJOP ter-render sebagai choropleth H3 dengan interval kepercayaan 95%. Filter berdasarkan range %ΔNJOP berfungsi. Popup menampilkan detail koefisien dan variabel kontrol. |
| **Spatial AI Assistant:** Asisten berbasis Google Gemini API yang memproses kueri bahasa alami menjadi aksi spasial dan narasi teks. | Input bahasa alami di chat panel menghasilkan respons dalam < 3 detik. Respons AI memuat `json_response` (update peta) dan `text_response` (narasi). Minimal 90% curated prompts berhasil dieksekusi dengan benar. API key tidak terekspos di client-side. |
| **Layer Filter & Search:** Filter data berdasarkan kategori, nilai skor, tipologi kawasan, dan pencarian lokasi. | Filter dropdown/checkbox mengubah tampilan layer secara instan. Search bar menemukan simpul/lokasi berdasarkan nama. Reset filter mengembalikan tampilan ke keadaan awal. |
| **Survey Activities Layer:** Visualisasi titik-titik data hasil survei lapangan (Activity & Mission). | Titik survei Activity dan Mission ter-render pada peta dengan ikon kategori yang berbeda. Klik titik menampilkan popup detail (foto, deskripsi, tanggal, koordinat). Filter berdasarkan kategori survei berfungsi. |
| **Export Ringkasan:** Unduh ringkasan analisis per sel/simpul dalam format PDF/CSV. | Tombol export menghasilkan file PDF/CSV yang berisi skor TOD, %ΔNJOP, dan rekomendasi. File dapat diunduh tanpa error. |
| **Halaman Metodologi & Sumber Data:** Penjelasan metode analisis, sumber data, dan batasan. | Halaman menjelaskan alur data → analisis → insight secara lengkap. Sumber data tercantum dengan tautan/referensi. |
| **Responsivitas Desktop & Mobile:** WebGIS dapat diakses di berbagai ukuran layar. | Layout menyesuaikan ukuran layar desktop dan mobile. Peta tetap nyaman digunakan di mobile. First Contentful Paint < 1,8 detik. |

---

## 9. Persyaratan Teknis

| Komponen | Teknologi |
| :---- | :---- |
| **Frontend** | Next.js (App Router, React 19, TypeScript), MapLibre GL JS (WebGL, format MVT), Tailwind CSS, Chart.js / Recharts |
| **Backend** | FastAPI (Python), Next.js API Routes (proxy AI) |
| **Database** | PostgreSQL 16 + PostGIS 3.4 (Supabase), Redis (in-memory cache untuk pre-computed scores) |
| **GIS / Analisis Spasial** | QGIS, PySAL (Spatial Durbin Model), GeoPandas, Uber H3 (h3-py / h3-js), OSMnx, Turf.js, XGBoost, HDBSCAN, Scikit-learn |
| **AI** | Google Gemini API (Free Tier, JSON Function Calling), RAG berbasis data Activity |
| **Deployment** | Vercel (frontend Next.js), Render (backend FastAPI), Supabase (PostgreSQL + PostGIS) |
| **Version Control** | GitHub (Private Repository) |
| **Basemap** | MAPID MAPS API (Street / Dark / Satellite) |
| **Data API** | GEO MAPID REST API (POST, X-API-KEY, GeoJSON Polygon filter, pagination offset) |

### Technology Architecture

```
+----------------------------------------------------------------------+
|                            USER (Browser)                             |
|   Desktop / Mobile - Responsive Web                                   |
+--------------------------------+-------------------------------------+
                                 |
                    +------------v-----------+
                    |   NEXT.JS FRONTEND     |  <-- Vercel
                    |   (React 19 + TS)      |
                    |                        |
                    |  +------------------+  |
                    |  | MapLibre GL JS   |  |  <-- MAPID MAPS Basemap
                    |  | (H3 Choropleth,  |  |
                    |  |  MVT Layers)     |  |
                    |  +------------------+  |
                    |  +------------------+  |
                    |  | AI Chat Panel    |  |
                    |  +------------------+  |
                    |  +------------------+  |
                    |  | Dashboard &      |  |
                    |  | Charts           |  |
                    |  +------------------+  |
                    +------------+-----------+
                                 | HTTPS / API Routes
                    +------------v-----------+
                    |   FASTAPI BACKEND      |  <-- Render
                    |                        |
                    |  +------------------+  |
                    |  | Spatial Query    |  |
                    |  | Engine           |  |
                    |  +--------+---------+  |
                    |           |             |
                    |  +--------v---------+  |
                    |  | AI Router /      |---------> Google Gemini API
                    |  | Proxy            |  |        (Function Calling)
                    |  +------------------+  |
                    |  +------------------+  |
                    |  | GEO MAPID API    |---------> GEO MAPID Server
                    |  | Client           |  |        (Survey Data Sync)
                    |  +------------------+  |
                    +------------+-----------+
                                 |
                    +------------v-----------+
                    |  POSTGRESQL + POSTGIS  |  <-- Supabase
                    |                        |
                    |  - H3 Grid Index       |
                    |  - TOD Scores (AHP)    |
                    |  - SDM Coefficients    |
                    |  - Survey Data         |
                    |  - Typology Labels     |
                    |  - ZNT / NJOP          |
                    |                        |
                    |  + Redis Cache         |
                    +------------------------+
```

---

## 10. User Flow / Wireframe

### User Flow

**Alur Utama Pengguna:**

```
[1. Landing Page]
    |
    +-- Overview masalah TOD Surabaya
    +-- Ringkasan insight utama (highlight stats)
    +-- CTA: "Jelajahi Peta" / "Tanya AI"
         |
         v
[2. Peta Interaktif Utama]
    |
    +-- Basemap MAPID MAPS + Overlay H3 Choropleth
    +-- Layer Control (TOD Score, %ΔNJOP, Tipologi, Survey Data)
    +-- Filter (Skor range, Kategori, Simpul Transit)
    +-- Search Bar (Cari simpul / lokasi)
    |
    +-- [Klik Sel H3] --> Popup Atribut Detail
    |                        |
    |                        +-- Skor TOD + 5 Dimensi
    |                        +-- %ΔNJOP + Interval Kepercayaan
    |                        +-- Tipologi Kawasan
    |                        +-- "Lihat Detail" --> Dashboard
    |
    +-- [Klik Simpul Transit] --> Dashboard Scorecard
    |                               |
    |                               +-- Radar Chart 5D
    |                               +-- Scorecard Numerik
    |                               +-- Grafik Perbandingan
    |                               +-- Simulasi Skenario
    |
    +-- [Buka AI Chat Panel] --> Spatial AI Assistant
                                   |
                                   +-- Input prompt bahasa alami
                                   +-- Quick prompt buttons (curated)
                                   |
                                   +-- AI Response:
                                   |   +-- Narasi teks (text_response)
                                   |   +-- Update peta otomatis (json_response)
                                   |       +-- Filter layer
                                   |       +-- Zoom to area
                                   |       +-- Highlight sel/simpul
                                   |
                                   +-- Follow-up prompt
         |
         v
[3. Halaman Pendukung]
    +-- Metodologi & Sumber Data
    +-- Survey Activities (Layer + Dokumentasi)
    +-- Rekomendasi Kebijakan
    +-- Export PDF/CSV
```

### Wireframe

*Wireframe detail sedang dikembangkan oleh anggota tim UI/UX Designer (Rayhan Agnan Kusuma). Berikut deskripsi rancangan umum antarmuka:*

**Layout Utama (Desktop):**

- **Header:** Logo TransitERA, navigasi utama (Peta, Dashboard, AI Assistant, Metodologi, Survei), toggle tema (Light/Dark).
- **Panel Kiri (Sidebar):** Layer control, filter dropdown/checkbox, search bar, dan legend warna choropleth.
- **Area Tengah (Peta):** Area utama peta interaktif MapLibre GL JS dengan overlay H3 choropleth. Basemap MAPID MAPS.
- **Panel Kanan (AI & Dashboard):** Collapsible panel berisi AI Chat, radar chart, scorecard, dan simulasi skenario.
- **Bottom Bar (Mobile):** Navigasi tab untuk Peta, Filter, AI, Dashboard.

**Layout Mobile:**

- Full-screen peta dengan bottom sheet draggable untuk akses filter, AI chat, dan dashboard.
- Tab navigasi di bagian bawah layar.

---

## 11. Timeline Development

*Periode pengembangan: 7 Agustus – 14 September 2026 (± 5,5 minggu efektif)*

| Minggu | Fokus Kegiatan | Target Output |
| :---- | :---- | :---- |
| **M1** (7–13 Agustus) | Penyusunan PRD Final, setup environment development (Next.js, FastAPI, Supabase/PostGIS), desain database schema, pengumpulan & integrasi data sekunder MAPID Catalog. | PRD final tersubmit, environment dev siap, schema DB PostgreSQL/PostGIS, data sekunder terintegrasi. |
| **M2** (13–20 Agustus) | **Survei Lapangan Batch 1** (Gubeng & Pasar Turi): 40 Activity + 100 Mission. Data cleaning & ETL pipeline. Mulai frontend scaffolding (Next.js + MapLibre + MAPID MAPS basemap). | 140 titik survei terkumpul, ETL pipeline operasional, basemap MAPID MAPS ter-render. |
| **M3** (20–27 Agustus) | **Survei Lapangan Batch 2** (Wonokromo, Waru, Surabaya Kota) + Batch 3 (Sensitivity Zone). Data QC & validasi. Pengembangan frontend: H3 choropleth, layer control, popup, filter. | 360 titik survei lengkap & valid, H3 choropleth ter-render di frontend, interaksi peta berfungsi. |
| **M4** (27 Aug–3 Sep) | Analisis spasial: network buffer, agregasi H3, standarisasi indikator 5D, pembobotan AHP, regresi SDM. Pengembangan backend API endpoint (skor TOD, %ΔNJOP, tipologi). | TOD Readiness Score & %ΔNJOP terhitung, API endpoint aktif, data tersedia via REST. |
| **M5** (3–7 September) | Integrasi AI: setup Google Gemini API, implementasi Function Calling, Spatial AI Assistant chat panel, RAG basis data Activity. Pengembangan dashboard: radar chart, scorecard, simulasi skenario. | AI Assistant responsif terhadap curated prompts, dashboard scorecard & radar chart berfungsi. |
| **M6** (7–10 September) | Integrasi end-to-end: AI ↔ peta ↔ dashboard. Polish UI/UX, responsivitas mobile. Halaman metodologi & survei. Export PDF/CSV. | Seluruh fitur terintegrasi, responsif desktop & mobile, halaman metodologi selesai. |
| **M7** (10–12 September) | Quality Assurance & User Validation: uji REST API (PyTest), uji konsistensi model (CR AHP <= 0,10), uji performa (Lighthouse >= 85), UAT AI Assistant (success rate >= 90% curated prompts), serta sesi uji coba langsung (*user trial*) bersama perwakilan target persona. | Seluruh pengujian lulus kriteria, feedback user trial terinkorporasi, bug-fix selesai. |
| **M8** (12–14 September) | Deployment final ke Vercel/Render/Supabase, stress testing, finalisasi dokumentasi PRD, persiapan submission link publik WebGIS. | WebGIS live & stabil di URL publik, PRD final & dokumentasi tersubmit. |

### 11.2 Protokol Validasi Empati & Uji Coba Pengguna (*Co-Creation & User Trial*)

Mengadopsi arahan Coaching 3 bahwa **kualitas & relevansi validasi jauh lebih penting daripada kuantitas responden**, tim TransitERA melaksanakan sesi uji coba tatap muka (*task-based user trial*) pada tahap prototipe (M6–M7):

| Target Persona | Format Pengujian | Skenario Pengujian (*Task*) | Kriteria Keberhasilan Validasi |
| :--- | :--- | :--- | :--- |
| **Perencana Transportasi Dishub** | Wawancara terstruktur + demonstrasi langsung. | Menemukan 3 simpul prioritas intervensi pejalan kaki & menjalankan simulasi rute feeder baru dalam < 15 menit. | Pengguna berhasil mengeksekusi simulasi tanpa bantuan teknis & menilai data relevan untuk nota dinas. |
| **Property & Site Analyst** | Uji coba mandiri (*guided trial*) dengan dataset ZNT. | Mengevaluasi kesesuaian harga listing Properti Go terhadap estimasi %ΔNJOP di sekitar Stasiun Gubeng. | Pengguna mengonfirmasi estimasi regresi masuk akal (*reasonable*) dibanding tren pasar properti riil. |
| **Pelaku UMKM Kuliner** | Pengujian antarmuka mobile via smartphone. | Mengetik pertanyaan bahasa alami di AI Chat Panel: *"Di mana lokasi ramai dekat stasiun yang cocok buat kedai kopi?"* | AI memberikan rekomendasi lokasi yang mudah dipahami dalam < 5 detik tanpa jargon teknis geospasial. |

---

## 12. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
| :---- | :---- | :---- |
| **Kuota token Gemini API habis** sebelum kompetisi selesai. | AI Assistant tidak dapat merespons kueri pengguna. | Menggunakan Google Gemini API free tier dengan monitoring kuota harian. Implementasi caching respons untuk prompt populer di Redis. Menyiapkan fallback ke model open-source (Groq / HuggingFace Inference API). |
| **Data survei lapangan tidak mencapai target** (360 titik) akibat kendala cuaca, waktu, atau akses lokasi. | Variabel analisis kurang representatif; model regresi kurang robust. | Memulai survei lebih awal (13 Agustus), membagi tim ke 3 zona geografis paralel, menyiapkan titik cadangan di zona alternatif. Memprioritaskan kualitas > kuantitas. |
| **Latensi API MAPID atau GEO MAPID tinggi** saat data request besar. | WebGIS lambat memuat layer data. | Pre-compute dan cache hasil analisis utama (TOD Score, %ΔNJOP) di PostGIS. Implementasi viewport-based loading (load data hanya pada area yang terlihat). Pagination untuk data Mission (100 titik/request). |
| **Konsistensi AHP gagal** (CR > 0,10) pada matriks pembobotan. | Skor TOD tidak valid dan tidak dapat dipublikasikan. | Iterasi matriks perbandingan berpasangan dengan panel ahli (3 anggota tim PWK). Uji CR pada setiap iterasi. Dokumentasikan proses iterasi sebagai bukti rigor. |
| **Halusinasi AI:** Gemini menghasilkan koordinat atau insight yang tidak akurat. | Data peta tidak valid; credibility WebGIS menurun. | Terapkan Strict JSON Schema / Structured Outputs. Posisikan AI sebagai parameter generator, bukan kalkulator koordinat. Validasi bounding box di frontend. RAG tertutup: hanya data dari PostGIS/GEO MAPID. |
| **API key terekspos di client-side.** | Keamanan API terancam; potensi penyalahgunaan kuota. | Seluruh panggilan API AI melalui proxy backend (FastAPI / Next.js API Routes). API key disimpan di environment variables (.env). Rate limit 60 request/menit/IP. |
| **Waktu pengembangan tidak cukup** (5,5 minggu efektif). | Fitur tidak lengkap saat submission. | Prioritaskan MVP: peta H3, skor TOD, AI Assistant. Fitur simulasi skenario dan export bersifat secondary. Gunakan Agile sprint mingguan dengan daily standup. |

---

## 13. Rencana Deployment

| Komponen | Rencana |
| :---- | :---- |
| **Hosting** | **Vercel** (frontend Next.js), free tier, auto-deploy dari GitHub. **Render** (backend FastAPI), free tier, containerized deployment. |
| **Database** | **Supabase** (PostgreSQL 16 + PostGIS 3.4), free tier, managed database dengan spatial extension. **Redis** (Upstash atau Render Redis), caching pre-computed scores. |
| **Repository** | **GitHub:** Private repository selama kompetisi, dengan branch protection dan CI/CD via GitHub Actions → Vercel/Render auto-deploy. |

**Rencana Akses Publik:**

- WebGIS akan di-deploy ke subdomain yang disediakan panitia MAPID atau custom domain via Vercel.
- Seluruh data sensitif (API keys) disimpan di environment variables Vercel/Render.
- SSL/HTTPS aktif secara default melalui Vercel dan Render.
- Target uptime: 99% selama periode penilaian dan presentasi final.

---

## 14. Lampiran

### Lampiran 1. Referensi Dataset

| Kategori | Dataset | Sumber & Akses |
| :--- | :--- | :--- |
| MAPID Data Catalog: Social | SES & Demografi (Kepadatan Penduduk) | `mapid.co.id/data-catalog` via Import Data GEO MAPID |
| MAPID Data Catalog: Economy | People Spending | `mapid.co.id/data-catalog` |
| MAPID Data Catalog: Nature & Env | Nighttime Light (NTL) | `mapid.co.id/data-catalog` |
| MAPID Data Catalog: Nature & Env | Land Surface Temperature (LST) | `mapid.co.id/data-catalog` |
| MAPID Data Catalog: Nature & Env | Urban Heat Island (UHI) | `mapid.co.id/data-catalog` |
| MAPID Data Catalog: Nature & Env | Wilayah Risiko Banjir | `mapid.co.id/data-catalog` |
| MAPID Data Catalog: Transportation | Jaringan Rel KAI | `mapid.co.id/data-catalog` |
| Data Publik | ZNT (Zona Nilai Tanah), NJOP | ATR/BPN (BHUMI) |
| Data Publik | Rute Feeder WiraWiri & Suroboyo Bus | Dishub Kota Surabaya / OpenStreetMap |
| Data Publik | Jaringan Jalan Pedestrian | OpenStreetMap via OSMnx |

### Lampiran 2. Daftar Curated Prompts AI Assistant

Berikut daftar contoh prompt dengan tingkat keberhasilan (*success rate*) tertinggi untuk memandu dewan juri saat penilaian:

| No | Contoh Prompt | Fungsi yang Dipicu | Output yang Diharapkan |
| :---: | :--- | :--- | :--- |
| 1 | "Tampilkan skor TOD di sekitar Stasiun Gubeng" | `get_tod_score(station="gubeng")` | Zoom ke Gubeng, highlight H3 cells, tampilkan skor |
| 2 | "Bandingkan skor TOD Gubeng dan Wonokromo" | `compare_stations(a="gubeng", b="wonokromo")` | Radar chart perbandingan 5D, narasi perbedaan |
| 3 | "Apa dimensi TOD terlemah di Stasiun Pasar Turi?" | `get_weakest_dimension(station="pasar_turi")` | Highlight dimensi terlemah + rekomendasi intervensi |
| 4 | "Berapa estimasi kenaikan nilai tanah di sekitar Waru?" | `get_njop_premium(station="waru")` | Choropleth %ΔNJOP + narasi interval kepercayaan |
| 5 | "Tampilkan lokasi warung makan ramai di dekat stasiun" | `filter_layer(layer="menu_go", kondisi="ramai")` | Filter titik Menu Go, zoom ke area relevan |
| 6 | "Jika feeder WiraWiri diperpanjang ke Waru, apa dampaknya?" | `simulate_scenario(scenario="extend_feeder_waru")` | Perbandingan baseline vs skenario, delta skor |
| 7 | "Di mana lokasi terbaik untuk buka kedai kopi dekat stasiun?" | `site_recommendation(type="coffee_shop")` | Rekomendasi sel H3 berdasarkan daya beli + keramaian |

### Lampiran 3. Alur Komunikasi Antarkomponen (Data Pipeline)

```
+--------------+     +---------------+     +----------------+
| MAPID APPS   |---->| GEO MAPID     |---->| FastAPI ETL    |
| (Survei      |     | REST API      |     | Pipeline       |
|  Lapangan)   |     |               |     |                |
+--------------+     +---------------+     +-------+--------+
                                                    |
     +-------------------+                          |
     | Data Sekunder     |                          |
     | MAPID Catalog     |--------------------------+
     | + Data Publik     |                          |
     +-------------------+                          |
                                                    v
                                          +-----------------+
                                          | PostgreSQL      |
                                          | + PostGIS       |
                                          | (Supabase)      |
                                          |                 |
                                          | - Raw data      |
                                          | - H3 Grid       |
                                          | - TOD Scores    |
                                          | - SDM Results   |
                                          | - Survey Data   |
                                          +--------+--------+
                                                   |
                            +----------------------+---------------------+
                            |                      |                     |
                            v                      v                     v
                  +-------------+        +-------------+       +-------------+
                  | FastAPI     |        | Gemini API  |       | Next.js     |
                  | REST API   |        | (Function   |       | Frontend    |
                  | Endpoints  |        |  Calling)   |       | (MapLibre)  |
                  +------+------+        +------+------+       +------+------+
                         |                      |                     |
                         +----------------------+---------------------+
                                                |
                                                v
                                      +-----------------+
                                      |    USER         |
                                      |   (Browser)     |
                                      +-----------------+
```

### Lampiran 4. Daftar Pustaka

1. Abdullah, R., Xavier, B.D., Namgung, H., Varghese, V. and Fujiwara, A. (2024) 'Managing transit-oriented development: A comparative analysis of expert groups and multi-criteria decision making methods', *Sustainable Cities and Society*, 115, 105871.

2. Cattaneo, C. and Foreman, T. (2023) 'Climate change, international migration, and interstate conflicts', *Ecological Economics*, 211, 107890.

3. Jiang, Y., Gu, P., Cao, Z. and Chen, Y. (2020) 'Impact of transit-oriented development on residential property values around urban rail stations', *Transportation Research Record*, 2674(4), pp. 362-372.

4. Saaty, T.L. (2008) 'Decision making with the analytic hierarchy process', *International Journal of Services Sciences*, 1(1), pp. 83-98.

5. Singh, Y.J., Fard, P., Zuidgeest, M., Brussel, M. and van Maarseveen, M. (2014) 'Measuring transit oriented development: A spatial multi criteria assessment approach for the City Region Arnhem and Nijmegen', *Journal of Transport Geography*, 35, pp. 130-143.

6. Shimizutani, S., Suzuki, T. and Yamada, E. (2026) 'The impact of urban transportation investment on property values: Evidence from the Jakarta Mass Rapid Transit', *Asian Development Review*, 43(1), pp. 77-114.

---

*Dokumen ini disusun oleh Tim "Pak, sibuk ga?", Institut Teknologi Sepuluh Nopember (ITS), MAPID WebGIS Competition 2026.*
