# PROPOSAL IDE PROYEK – MAPID WEBGIS COMPETITION 2026
## KAI-STATION HUB: Sinkronisasi Simpul Mobilitas Massal dan Aktivitas Ekonomi Berbasis WebGIS dan Kecerdasan Spasial di Koridor Surabaya–Sidoarjo

---

**TEMA:** *Maps That Think! – Mass Transportation Edition*  
**JUDUL PROYEK:** *KAI Station-Hub TOD Index & AI-Powered Site Selection System (KAI-STATION HUB)*  
**NAMA TIM:** pak, sibuk ga?  
**ANGGOTA TIM:**  
1. [Nama Ketua Tim (Ketua)] – [Asal Instansi/Universitas]  
2. [Nama Anggota 2] – [Asal Instansi/Universitas]  
3. [Nama Anggota 3] – [Asal Instansi/Universitas]  
**KONTAK UTAMA:** [Email Ketua] | [Nomor HP Ketua]  

---

### RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)

Kota metropolitan Surabaya dan wilayah penyangganya (Sidoarjo) sedang mengalami transformasi mobilitas massal yang signifikan. Keberadaan Kereta Api (KA) Commuter Surabaya-Sidoarjo (SUSI) bersama dengan jaringan angkutan pengumpan (*feeder*) seperti Suroboyo Bus dan Lyn lokal merupakan tulang punggung pergerakan harian komuter. Kendati demikian, pengembangan kawasan berorientasi transit atau *Transit-Oriented Development* (TOD) di sekitar stasiun KAI di koridor ini masih menghadapi tiga tantangan krusial:
1. **Disintegrasi Konektivitas *First-Mile* dan *Last-Mile*:** Mayoritas stasiun belum didukung infrastruktur pejalan kaki (*pedestrian network*) yang memadai dan integrasi moda *feeder* yang terstruktur.
2. **Ketidaksesuaian Alokasi Penyewa (*Tenant Mismatch*):** Penempatan dan penentuan tarif area komersial di stasiun KAI belum didasarkan pada karakteristik mobilitas dan daya beli komuter secara presisi, yang mengakibatkan tingginya angka kekosongan (*vacancy rate*) stan ritel.
3. **Keterbatasan Akses Data Spasial Granular bagi Pelaku Usaha Mikro, Kecil, dan Menengah (UMKM):** UMKM lokal kesulitan mengidentifikasi lokasi strategis karena minimnya platform pemetaan geodemografis dan data transaksi riil.

Untuk menjawab permasalahan tersebut, proyek **KAI-STATION HUB** hadir sebagai sebuah platform *Decision Support System* (DSS) berbasis WebGIS interaktif yang dirancang untuk mensinkronisasikan data spasial transportasi massal dengan aktivitas ekonomi lokal. Platform ini memanfaatkan tiga model Kecerdasan Buatan (AI) utama untuk memberikan analisis prediktif dan fungsionalitas peta yang cerdas (*Maps That Think!*):
1. **DBSCAN Clustering (Profil Karakter Stasiun):** Mengklasifikasikan stasiun berdasarkan kemiripan atribut mobilitas dan aktivitas ekonomi guna merumuskan rekomendasi strategi penyewa (*Automated Tenant Mix*) dan nilai pengali sewa dinamis (*Dynamic Rent Multiplier*).
2. **Random Forest Regressor (Retail Success Score):** Menghitung nilai kelayakan usaha (*Retail Success Score* / RSS) pada skala 0–100 untuk kategori F&B Tradisional, F&B Modern, Minimarket, dan Souvenir pada titik koordinat tertentu.
3. **Spatial Conversational RAG (Gemini Flash + PostGIS):** Menyediakan asisten virtual interaktif yang memungkinkan pengguna mengeksekusi analisis geospasial yang kompleks (seperti *buffer analysis* dan *nearest neighbor query*) melalui bahasa alami dan langsung menampilkan respons dinamis pada peta.

Guna mengatasi keterbatasan (*sparsity*) data sekunder di wilayah Jawa Timur, proyek ini mengedepankan **Survey Activities** secara intensif di 8 stasiun pilot koridor Surabaya–Sidoarjo. Melalui survei primer berbasis aplikasi MAPID APPS ini, tim akan mendata kualitas pedestrian (240+ titik), informasi merchant Menu Go (150-200+ merchant), transaksi riil Struk Go (100+ transaksi), dan properti komersial Properti Go (50+ listing). 

Implementasi **KAI-STATION HUB** diharapkan dapat membantu PT KAI Daerah Operasi (DAOP) 8 Surabaya meminimalkan *vacancy rate* ruang komersial stasiun sebesar 20–30%, meningkatkan pendapatan non-tiket (*non-farebox revenue*), membantu pelaku UMKM meminimalkan risiko kegagalan lokasi usaha, serta menyediakan rekomendasi prioritas pembangunan pedestrian bagi Pemerintah Kota Surabaya demi terciptanya integrasi transportasi massal yang berkelanjutan.

---

### BAB I: PENDAHULUAN

#### 1.1 Latar Belakang Masalah
Kawasan Metropolitan Surabaya (Gerbangkertosusila) sebagai pusat perekonomian terbesar kedua di Indonesia memiliki urgensi tinggi dalam pengembangan transportasi publik yang terintegrasi. Koridor Surabaya–Sidoarjo menjadi jalur pergerakan komuter terpadat dengan volume mobilitas harian yang terus meningkat. PT Kereta Api Indonesia (Persero), khususnya Daerah Operasi (DAOP) 8 Surabaya, mengoperasikan layanan kereta api lokal **KA Commuter SUSI** (Surabaya Kota–Porong) yang menghubungkan pusat aktivitas bisnis Surabaya dengan area permukiman Sidoarjo. Di sisi lain, Pemerintah Kota Surabaya telah mengoperasikan **Suroboyo Bus** sebagai moda *Bus Rapid Transit* (BRT) lokal yang terintegrasi secara tarif dan fisik di beberapa titik simpul, dibantu oleh armada angkutan kota (lyn) konvensional.

Meskipun cetak biru tata ruang Kota Surabaya melalui **Peraturan Daerah Kota Surabaya Nomor 8 Tahun 2024 tentang Rencana Tata Ruang Wilayah (RTRW) Kota Surabaya Tahun 2024-2044** dan dokumen RDTR terkait telah menetapkan kawasan di sekitar stasiun KAI sebagai kawasan pengembangan *Transit-Oriented Development* (TOD), integrasi secara riil di lapangan masih menemui hambatan besar. Pembangunan kawasan transit di Surabaya belum didukung oleh ketersediaan informasi spasial yang saling terhubung antara parameter transportasi (frekuensi perjalanan, *ridership*, konektivitas antar-moda) dengan dinamika ekonomi mikro di sekitar stasiun. 

Pertama, aspek **Design** dan **Distance** dalam kerangka kerja TOD di Surabaya masih buruk. Koridor pejalan kaki (*pedestrian pathway*) dari pintu keluar stasiun menuju simpul transit sekunder (seperti halte bus atau terminal lyn) sering kali terputus, tidak aman, dan dipenuhi oleh hambatan fisik (seperti PKL dan parkir liar). Hal ini melanggar ketentuan **Permen PU No. 03/PRT/M/2014** mengenai pedoman perencanaan fasilitas pejalan kaki. Kedua, manajemen aset internal stasiun KAI masih menggunakan skema penentuan nilai sewa statis yang tidak mencerminkan fluktuasi *foot traffic* dan daya beli riil komuter. Akibatnya, stasiun besar seperti Gubeng dan Pasar Turi mengalami tingkat kekosongan unit ritel (*vacancy rate*) yang tinggi karena ketidaksesuaian kategori usaha penyewa (*tenant mismatch*), sementara stasiun komuter yang lebih kecil (seperti Waru, Gedangan, Wonokromo) kehilangan potensi optimalisasi ruang komersial. Ketiga, pelaku usaha mikro (UMKM) lokal yang ingin menyewa ruang di sekitar stasiun tidak dibekali alat analitik geodemografis yang mumpuni untuk menilai kelayakan usaha, sehingga keputusan penentuan lokasi (*site selection*) dilakukan secara spekulatif dengan risiko kegagalan tinggi.

Kesenjangan data spasial granular (*data sparsity*) di Surabaya menjadi tantangan tersendiri dibanding wilayah Jabodetabek yang relatif kaya data. Keterbatasan data komunitas MAPID (Menu Go, Struk Go, Properti Go) di Surabaya justru menjadi peluang strategis bagi tim untuk memproduksi data primer secara terstruktur melalui **Survey Activities**. Dengan menyinkronkan data primer tersebut ke dalam WebGIS yang dilengkapi pemodelan kecerdasan buatan, proyek **KAI-STATION HUB** diharapkan dapat menjadi solusi *Decision Support System* (DSS) orisinal yang merealisasikan konsep *"Maps That Think!"* untuk kemajuan sistem transportasi perkotaan Surabaya.

#### 1.2 Rumusan Masalah
Berdasarkan latar belakang di atas, rumusan masalah dalam proposal proyek ini adalah sebagai berikut:
1. Bagaimana mengukur dan memetakan indeks kualitas TOD (*5D TOD Index*) di sekitar stasiun kereta api koridor Surabaya–Sidoarjo secara spasial?
2. Bagaimana memetakan karakteristik stasiun KAI berdasarkan parameter mobilitas dan ekonomi secara objektif untuk penentuan strategi alokasi penyewa (*tenant mix*) dan tarif sewa?
3. Bagaimana merumuskan model kecerdasan buatan (*machine learning*) untuk memprediksi kelayakan lokasi ritel (*Retail Success Score*) bagi pelaku UMKM di kawasan TOD?
4. Bagaimana merancang antarmuka sistem informasi geografis berbasis web (WebGIS) yang interaktif dan komunikatif menggunakan kecerdasan buatan berbasis percakapan (*Spatial Conversational RAG*)?

#### 1.3 Batasan Masalah
Proyek ini dibatasi pada ruang lingkup sebagai berikut:
1. Wilayah studi difokuskan pada kawasan radius 500 meter di sekitar 8 stasiun pilot koridor Surabaya–Sidoarjo, yaitu: **Surabaya Gubeng, Surabaya Pasar Turi, Surabaya Kota, Wonokromo, Waru, Gedangan, Sidoarjo, dan Tanggulangin**.
2. Data komersial primer (Menu Go, Struk Go, Properti Go) diperoleh secara terbatas melalui kegiatan survei lapangan terstruktur (*Survey Activities*) menggunakan instrumen MAPID APPS.
3. Analisis rute transit hanya mencakup interkoneksi KA Commuter SUSI, rute Suroboyo Bus, dan jaringan jalan pedestrian utama dari OpenStreetMap.

#### 1.4 Tujuan Proyek
Tujuan yang ingin dicapai melalui proyek ini adalah:
1. Membangun dashboard WebGIS **KAI-STATION HUB** sebagai sistem penunjang keputusan (*Decision Support System*) berbasis kecerdasan spasial.
2. Menghasilkan visualisasi *5D TOD Index* yang terintegrasi dengan overlay zonasi RTRW/RDTR Kota Surabaya.
3. Mengembangkan model pengklasteran DBSCAN untuk segmentasi stasiun dan perhitungan rumus matematis *Dynamic Rent Multiplier* (DRM).
4. Mengembangkan model regresi Random Forest untuk memprediksi *Retail Success Score* (RSS) per kategori usaha ritel.
5. Menyediakan fitur *Spatial Conversational RAG* berbasis Gemini Flash API dan PostGIS untuk mempermudah query data spasial secara natural.

#### 1.5 Manfaat Proyek
1. **Bagi PT KAI DAOP 8 Surabaya (Divisi Komersial):** Membantu mengoptimalkan pendapatan non-tiket (*non-farebox revenue*) melalui penentuan harga sewa ruang ritel dinamis berbasis klaster dan mengurangi *vacancy rate* stan melalui rekomendasi *tenant mix* berbasis data mobilitas.
2. **Bagi Pelaku UMKM & Pebisnis Ritel:** Meminimalkan risiko investasi dan kegagalan usaha baru dengan menyediakan prediksi kelayakan lokasi secara instan melalui visualisasi heatmap RSS dan asisten AI.
3. **Bagi Pemerintah Kota Surabaya & Urban Planner:** Memberikan rekomendasi segmen trotoar prioritas untuk perbaikan fasilitas pejalan kaki berdasarkan penilaian indeks walkability berstandar SPM dan integrasi rute feeder.

---

### BAB II: LANDASAN TEORI DAN TINJAUAN PUSTAKA

#### 2.1 Konsep Transit-Oriented Development (TOD) & Indeks 5D
Transit-Oriented Development (TOD) didefinisikan sebagai konsep pengembangan kawasan perkotaan yang memaksimalkan jumlah ruang residensial, bisnis, dan rekreasi dalam jarak berjalan kaki dari transportasi umum (Lyu dkk., 2021; Thomas & Bertolini, 2021). Pengukuran kualitas kawasan transit dievaluasi menggunakan kerangka kerja **5D**:
1. **Density (Kepadatan):** Kerapatan unit bangunan, luas lantai, atau populasi per unit wilayah. Diukur melalui data kepadatan penduduk (*People Density*).
2. **Diversity (Keanekaragaman):** Variasi penggunaan lahan (*mix-use land development*) untuk meminimalisasi jarak perjalanan. Diukur menggunakan indeks entropi penggunaan lahan berbasis POI komersial.
3. **Design (Desain):** Kualitas fisik lingkungan pejalan kaki, termasuk karakteristik jalan, lebar trotoar, dan kenyamanan visual.
4. **Distance (Jarak):** Aksesibilitas fisik pejalan kaki dari titik keberangkatan ke stasiun transit terdekat.
5. **Destination Accessibility (Aksesibilitas Destinasi):** Keterhubungan kawasan dengan simpul transportasi lain (feeder transit).

#### 2.2 Standardisasi Walkability & Aksesibilitas Pejalan Kaki
Standar Kenyamanan Pejalan Kaki mengacu pada **Peraturan Menteri Pekerjaan Umum No. 03/PRT/M/2014** tentang Pedoman Perencanaan, Penyediaan, dan Pemanfaatan Prasarana dan Sarana Jaringan Pejalan Kaki di Kawasan Perkotaan. Penilaian kenyamanan didasarkan pada parameter fisik seperti lebar efektif trotoar (minimum 1,5 meter untuk kawasan komersial), kemulusan permukaan jalan bebas lubang, bebas dari hambatan sirkulasi (seperti PKL dan parkir liar), penyediaan ubin pemandu (*guiding block*) untuk disabilitas, serta keberadaan vegetasi peneduh dan pencahayaan lampu jalan pada malam hari.

#### 2.3 Algoritma Pengklasteran DBSCAN
*Density-Based Spatial Clustering of Applications with Noise* (DBSCAN) adalah algoritma pengklasteran data spasial berbasis kepadatan (Hao dkk., 2023; Rakhman dkk., 2022). Berbeda dengan K-Means yang memerlukan penetapan jumlah klaster $k$ di awal, DBSCAN mendeteksi klaster secara mandiri berdasarkan dua parameter utama:
- `eps` ($\epsilon$): Jarak radius pencarian ketetanggaan.
- `minSamples`: Jumlah minimum titik data dalam radius $\epsilon$ untuk membentuk klaster (*Core Point*).

Algoritma ini sangat unggul dalam menangani data spasial karena mampu mengidentifikasi data pencilan (*outliers/noise*) secara otomatis serta mengelompokkan stasiun dengan pola mobilitas dan kepadatan ekonomi sejenis.

#### 2.4 Algoritma Random Forest Regressor
Random Forest Regressor adalah algoritma pembelajaran mesin berbasis *ensemble learning* yang membangun sejumlah pohon keputusan (*decision trees*) selama fase pelatihan (Zhou dkk., 2022; He dkk., 2025). Prediksi akhir diperoleh melalui rata-rata prediksi dari setiap pohon individu. Algoritma ini memiliki resistensi yang sangat baik terhadap masalah pencilan (*outliers*), mampu memodelkan hubungan non-linear yang kompleks antara fitur aksesibilitas spasial (jarak ke stasiun, walkability) dengan daya beli, serta memiliki kelebihan dalam memberikan analisis tingkat kepentingan fitur (*feature importance*).

#### 2.5 Spatial Retrieval-Augmented Generation (Spatial RAG)
Spatial RAG adalah teknik yang memperluas kemampuan Large Language Model (LLM) dengan cara mengintegrasikannya dengan database spasial eksternal (PostGIS). LLM bertindak sebagai penerjemah bahasa alami (*Natural Language Interface*) yang mendeteksi maksud (*intent*) pengguna, menghasilkan query SQL spasial yang kompatibel dengan PostGIS, mengeksekusi query tersebut pada database, dan mengembalikan hasil data tabular dan spasial ke peta frontend Leaflet untuk di-render secara interaktif.

---

### BAB III: METODOLOGI DAN SUMBER DATA

#### 3.1 Kerangka Kerja Penelitian
Metodologi pengerjaan proyek KAI-STATION HUB dirancang secara terstruktur guna memastikan integritas data primer dan ketepatan model AI yang diimplementasikan. Penelitian ini dibagi menjadi tiga fase utama:
1. **Fase Inisiasi dan Akuisisi Spasial:** Meliputi pengumpulan data primer melalui *Survey Activities* di 8 stasiun pilot dan penarikan data sekunder dari API MAPID serta OpenStreetMap.
2. **Fase Pemrosesan dan Analitik AI:** Tahap pembersihan data, penggabungan spasial (*spatial join*), pemodelan pengklasteran DBSCAN untuk profil stasiun, dan pelatihan model Random Forest untuk estimasi kelayakan ritel (RSS).
3. **Fase Integrasi dan Visualisasi Sistem:** Pembangunan platform WebGIS interaktif berbasis Next.js dan Leaflet, serta pengintegrasian model asisten AI berbasis *Spatial Conversational RAG*.

#### 3.2 Sumber Data dan Karakteristik Data
Proyek ini mengintegrasikan dataset multi-sumber yang disajikan pada tabel berikut:

| Kategori Data | Spesifikasi Data | Sumber Data | Format | Ketersediaan di Surabaya |
| :--- | :--- | :--- | :--- | :--- |
| **Data Komersial** | Menu Go, Struk Go, Properti Go | API MAPID | GeoJSON/CSV | ⚠️ Rendah (*sparse*) |
| **Survei Primer** | Foto trotoar, kuesioner kualitas pedestrian | MAPID APPS Mission | GeoJSON | ✅ Dikumpulkan oleh tim |
| **Geodemografis** | *People Density*, *People Spending* | Katalog Data MAPID | Raster/Vector | ✅ Tersedia secara nasional |
| **Transportasi** | Rute & jadwal KA Commuter SUSI | PT KAI DAOP 8 | Tabular/CSV | ✅ Tersedia |
| **Moda Feeder** | Halte & rute Suroboyo Bus & Lyn | Dinas Perhubungan / data.surabaya.go.id | GeoJSON | ✅ Terbuka |
| **Jaringan Jalan** | Jaringan pedestrian, konektivitas POI | OpenStreetMap (OSM) | Vektor (Shp) | ✅ Lengkap & aktif |
| **Regulasi Spasial** | Rencana zonasi kawasan TOD | RTRW Kota Surabaya 2024-2044 / RDTR | Shapefile (Shp) | ✅ Resmi/Legal |

#### 3.3 Penanganan Kelangkaan Data (Data Sparsity Mitigation)
Untuk mengatasi minimnya data komunitas MAPID di Surabaya, tim menerapkan strategi pengayaan data melalui survei primer (*field enrichment*) yang ditargetkan sebagai berikut:

| Jenis Data MAPID | Target Kuantitas | Metode Mitigasi Lapangan |
| :--- | :--- | :--- |
| **Menu Go** | 150–200+ merchant | Surveyor mendata pelaku usaha kuliner di radius 500m dari 8 stasiun melalui formulir input Menu Go pada MAPID APPS. |
| **Struk Go** | 100+ transaksi | Tim mengumpulkan struk belanja di toko kelontong, kafe, dan warung lokal sebagai representasi riil daya beli (*spending power*). |
| **Properti Go** | 50+ ruko/lahan | Surveyor mencatat ruko yang disewakan atau dijual di sepanjang koridor utama stasiun untuk memetakan harga sewa awal pasar. |
| **Community Maps** | 30+ laporan isu | Dokumentasi foto mengenai trotoar rusak, penyumbatan jalan, dan titik konflik lalu lintas pejalan kaki. |

#### 3.4 Protokol Survey Activities
Survei lapangan dilakukan secara terstandardisasi menggunakan protokol berikut:
1. **Stasiun Pilot (8 Titik):** Surabaya Gubeng (Hub Utama), Surabaya Pasar Turi (Hub Utama), Surabaya Kota (Heritage), Wonokromo (Transit Hub Selatan), Waru (Commuter Perbatasan Sidoarjo), Gedangan (Commuter Industri), Sidoarjo (Koneksi Porong), Tanggulangin (Commuter Sektor UMKM).
2. **Sampling Spasial:** Pengukuran dilakukan sepanjang segmen jalan pedestrian utama stasiun dengan interval titik pengamatan setiap 50 meter hingga radius maksimal 500 meter dari pintu gerbang stasiun.
3. **Sampling Temporal (Sesi Pengamatan):** Pengamatan dilakukan pada 3 jendela waktu kritis:
   - Sesi Pagi (*AM Peak*): 06.30 – 08.30 WIB (Arus masuk kerja/sekolah)
   - Sesi Siang (*Off-Peak*): 11.00 – 13.00 WIB (Arus istirahat makan)
   - Sesi Sore (*PM Peak*): 16.30 – 18.30 WIB (Arus kepulangan kerja)

---

### BAB IV: ARSITEKTUR SISTEM DAN FORMULASI MODEL AI

#### 4.1 Desain Arsitektur Sistem (Data Pipeline)
Data diproses dari tahap input hingga menjadi keluaran WebGIS menggunakan arsitektur modular berikut:

```mermaid
graph TD
    %% Subgraph 1: Input Data
    subgraph Input ["1. Data Input"]
        D_MAPID["Data MAPID (Menu/Struk/Properti Go & Survey)"]
        D_OSM["OpenStreetMap (Jaringan Jalan & POI)"]
        D_RTRW["Tata Ruang (RTRW & RDTR Surabaya)"]
        D_CAT["MAPID Catalogue (Density & Spending)"]
    end

    %% Subgraph 2: Processing & Engine
    subgraph Engine ["2. Processing & AI Engine"]
        P_Clean["Cleaning & Feature Engineering"]
        A_DBSCAN["DBSCAN (Clustering Karakter Stasiun)"]
        A_RF["Random Forest (Retail Success Score)"]
        A_RAG["Spatial RAG (Gemini + PostGIS)"]
    end

    %% Subgraph 3: Output & Visualization
    subgraph Output ["3. Output & WebGIS Dashboard"]
        O_TOD["5D TOD Index & RTRW Layer"]
        O_RSS["Heatmap Retail Success (RSS)"]
        O_Walk["Walkability & Pedestrian Comfort"]
        O_Chat["AI Chatbot & Interactive Map"]
    end

    %% Connections
    D_MAPID --> P_Clean
    D_OSM --> P_Clean
    D_CAT --> P_Clean

    P_Clean --> A_DBSCAN
    P_Clean --> A_RF
    D_RTRW --> O_TOD

    A_DBSCAN --> O_TOD
    A_RF --> O_RSS
    P_Clean --> O_Walk
    
    O_TOD & O_RSS & O_Walk --> A_RAG
    A_RAG --> O_Chat

    %% Styling
    classDef inputStyle fill:#e3f2fd,stroke:#1e88e5,stroke-width:1px;
    classDef engineStyle fill:#fff3e0,stroke:#f57c00,stroke-width:1px;
    classDef outputStyle fill:#e8f5e9,stroke:#2e7d32,stroke-width:1px;
    
    class D_MAPID,D_OSM,D_RTRW,D_CAT inputStyle;
    class P_Clean,A_DBSCAN,A_RF,A_RAG engineStyle;
    class O_TOD,O_RSS,O_Walk,O_Chat outputStyle;
```

#### 4.2 Model 1: Klasifikasi Profil Stasiun berbasis DBSCAN & Formulasi Dynamic Rent Multiplier (DRM)
Model ini dirancang untuk menetapkan strategi komersial internal stasiun KAI. Pengklasteran DBSCAN mengelompokkan 8 stasiun berdasarkan parameter mobilitas (*ridership*), kepadatan ekonomi, dan tingkat aksesibilitas pejalan kaki.

##### Formulasi Matematis Dynamic Rent Multiplier (DRM)
Nilai sewa dasar area komersial stasiun dikalikan dengan bobot objektif klaster ekonomi stasiun bersangkutan. Nilai DRM ditentukan menggunakan formulasi *Multi-Criteria Decision Analysis* (MCDA) berikut:

$$\text{DRM}(C_s) = 1.0 + \alpha \cdot \left( w_R \cdot R_C + w_S \cdot S_C + w_E \cdot E_C \right)$$

Di mana:
- $\text{DRM}(C_s)$ adalah multiplier tarif sewa ruang usaha pada stasiun yang termasuk dalam Klaster $C_s$. Rentang nilai berkisar antara $1.0\text{x}$ hingga $1.5\text{x}$.
- $\alpha = 0.5$ adalah batas maksimum parameter pengali tambahan sewa (*maximum rental premium ceiling*).
- $R_C$ adalah Indeks Ridership Klaster $C$ terstandarisasi (nilai $0$ s.d. $1$):
  $$R_C = \frac{\overline{\text{Ridership}}(C) - \min_{i} \overline{\text{Ridership}}(C_i)}{\max_{i} \overline{\text{Ridership}}(C_i) - \min_{i} \overline{\text{Ridership}}(C_i)}$$
- $S_C$ adalah Indeks Daya Beli (*Spending Power*) Klaster $C$ terstandarisasi (nilai $0$ s.d. $1$), dihitung berdasarkan rata-rata nominal transaksi Struk Go:
  $$S_C = \frac{\overline{\text{Spending}}(C) - \min_{i} \overline{\text{Spending}}(C_i)}{\max_{i} \overline{\text{Spending}}(C_i) - \min_{i} \overline{\text{Spending}}(C_i)}$$
- $E_C$ adalah Indeks Keragaman Ekonomi Klaster $C$ terstandarisasi (nilai $0$ s.d. $1$), dihitung menggunakan Indeks Entropi Shannon dari variasi kategori POI komersial (Menu Go & OSM POI):
  $$H(C) = -\sum_{k=1}^{n} p_k \ln(p_k)$$
  $$E_C = \frac{\overline{H}(C) - \min_{i} \overline{H}(C_i)}{\max_{i} \overline{H}(C_i) - \min_{i} \overline{H}(C_i)}$$
  Dengan $p_k$ adalah proporsi jumlah merchant kategori $k$ terhadap total merchant di sekitar stasiun dalam klaster $C$.
- $w_R, w_S, w_E$ adalah bobot konstanta masing-masing indikator. Ditetapkan nilai: $w_R = 0.4$, $w_S = 0.4$, dan $w_E = 0.2$ (sehingga $\sum w = 1.0$).

##### Output Klaster & Rekomendasi Alokasi Penyewa (Tenant Mix)
1. **Klaster A (Transit Hub Utama - Gubeng & Pasar Turi):** Karakteristik ridership sangat tinggi dengan spending power sedang-tinggi. Nilai DRM = $1.4\text{x} - 1.5\text{x}$. Rekomendasi *Tenant Mix*: *Grab-and-Go* F&B premium, toko roti cepat saji, minimarket waralaba, dan jasa ekspedisi.
2. **Klaster B (Commuter Feeder Padat - Wonokromo & Waru):** Karakteristik ridership tinggi, didominasi komuter pekerja dengan spending power sedang-rendah. Nilai DRM = $1.1\text{x} - 1.25\text{x}$. Rekomendasi *Tenant Mix*: Ritel makanan harian terjangkau, layanan pembayaran digital/ATM, serta minimarket kebutuhan harian.
3. **Klaster C (Commuter Lokal/UMKM - Gedangan, Sidoarjo, Tanggulangin, Surabaya Kota):** Karakteristik ridership rendah-sedang, aktivitas industri/wisata lokal menonjol. Nilai DRM = $1.0\text{x}$. Rekomendasi *Tenant Mix*: Pusat kuliner lokal (warung makan tradisional), kerajinan/oleh-oleh daerah, dan penyewaan ruang kreatif UMKM.

#### 4.3 Model 2: Estimasi Kelayakan Lokasi Usaha berbasis Random Forest & Formulasi Retail Success Score (RSS)
Model ini ditujukan bagi pelaku UMKM. Input model berupa fitur spasial di titik koordinat $p$ yang dimasukkan ke dalam algoritma regresi Random Forest untuk memprediksi probabilitas kesuksesan ritel berdasarkan kategori usaha $c$.

##### Landasan Teoretis Formulasi RSS
Formulasi *Retail Success Score* (RSS) dibangun dengan mensintesiskan tiga teori lokasi spasial utama:
1. **Huff Gravity Model (Huff, 1963):** Menjustifikasi variabel daya tarik stasiun (*Ridership*) yang meluruh seiring pertambahan jarak jaringan (*Network Distance*) sebagai proksi arus pejalan kaki (*Foot Traffic* / $FT$).
2. **Hotelling's Spatial Competition (Hotelling, 1929):** Menjustifikasi variabel Kepadatan Kompetitor ($CD$) sebagai faktor pengurang (*negative feedback*) karena adanya efek pembagian pangsa pasar (*market splitting*) pada kategori ritel yang sama.
3. **Walkability-Retail Correlation (Ewing & Cervero, 2010):** Menjustifikasi variabel kenyamanan berjalan kaki ($WS$) sebagai stimulus daya beli komuter akibat peningkatan waktu singgah (*dwell time*) pejalan kaki.

##### Formulasi Matematis Target (Ground Truth RSS)
Nilai target pelatihan ($RSS(p, c)$ pada skala 0–100) dirumuskan sebagai berikut:

$$RSS(p, c) = 100 \times \left( w_1 \cdot FT(p) + w_2 \cdot SP(p) - w_3 \cdot CD(p, c) + w_4 \cdot WS(p) \right)$$

Di mana:
- $FT(p)$ adalah estimasi kepadatan arus pejalan kaki (*foot traffic proxy*) di koordinat $p$. Dihitung dengan rumus peluruhan jarak dari gerbang keluar stasiun terdekat ($s$):
  $$FT(p) = \frac{\text{Ridership}(s)}{\text{NetworkDistance}(p, \text{gate}_s) + 1}$$
- $SP(p)$ adalah rata-rata nominal transaksi Struk Go yang ternormalisasi (0-1) dalam radius 200m dari $p$.
- $CD(p, c)$ adalah indeks kepadatan kompetitor untuk kategori usaha $c$ yang ternormalisasi (0-1) dalam radius 200m dari $p$ berdasarkan data Menu Go:
  $$CD(p, c) = \frac{\text{Jumlah Kompetitor Kategori } c}{\max \text{ Kompetitor}}$$
- $WS(p)$ adalah Indeks Walkability pejalan kaki yang dinormalisasi (0-1) di koridor jalan tempat koordinat $p$ berada.
- Bobot parameter ditetapkan sebagai $w_1 = 0.4$, $w_2 = 0.3$, $w_3 = 0.2$, dan $w_4 = 0.1$.

##### Implementasi Model Random Forest Regressor
- **Fitur Masukan (Features):** Jarak jaringan ke stasiun terdekat, kepadatan penduduk (*People Density*), total transaksi Struk Go radius 200m, jumlah POI kompetitor, *walkability score*, kategori zonasi tata ruang RDTR (komersial, perumahan, industri), dan konektivitas transit terdekat.
- **Validasi Model:** Menggunakan *5-Fold Cross-Validation* untuk mencegah *overfitting*, dengan metrik evaluasi *Mean Absolute Error* (MAE) dan Koefisien Determinasi ($R^2$ Score) dengan target $R^2 \ge 0.75$.

#### 4.4 Model 3: Asisten AI Spatial Conversational RAG
Asisten AI ini mengintegrasikan Large Language Model (Gemini Flash) dengan kemampuan komputasi database spasial PostGIS melalui antarmuka percakapan natural.

##### Alur Mekanisme Kerja Spatial RAG
1. **Deteksi Intent Pengguna:** LLM mengidentifikasi maksud dari masukan teks bahasa alami pengguna. Contoh: *"Di mana letak ruko disewakan yang paling dekat dengan Stasiun Gubeng?"*
2. **SQL Query Builder:** LLM menerjemahkan teks tersebut menjadi query PostGIS SQL standar:
   ```sql
   SELECT properti_id, alamat, harga, ST_Distance(geom, (SELECT geom FROM stasiun WHERE nama = 'Surabaya Gubeng')) AS jarak 
   FROM properti_go 
   WHERE status = 'disewakan' 
   ORDER BY jarak ASC 
   LIMIT 3;
   ```
3. **Eksekusi Database Spasial:** Query dijalankan pada PostgreSQL/PostGIS.
4. **Coordinate & Response Payload:** Hasil query dikembalikan dalam format JSON yang berisi data properti beserta koordinat spasialnya.
5. **Leaflet Binding & Map Action:** Antarmuka Next.js menangkap respons JSON tersebut, memicu fungsi peta `map.flyTo([lat, lng], zoom)`, dan membuka popup informasi properti secara otomatis.

#### 4.5 Pengukuran Kualitas Fasilitas Pejalan Kaki (Indeks Walkability Heuristik)
Pengukuran kenyamanan pejalan kaki menggunakan indeks heuristik non-ML yang didasarkan pada survei lapangan primer berstandar SPM Dinas Pekerjaan Umum:

$$WS(p) = 0.40 \cdot X_{\text{trotoar}}(p) + 0.25 \cdot X_{\text{hambatan}}(p) + 0.15 \cdot X_{\text{pencahayaan}}(p) + 0.10 \cdot X_{\text{disabilitas}}(p) + 0.10 \cdot X_{\text{feeder}}(p)$$

Di mana variabel dievaluasi menggunakan skala Likert 1–5 berdasarkan rubrik visual di lapangan:
- $X_{\text{trotoar}}(p)$: Lebar efektif trotoar ($> 2.0\text{ m} = 5$; $< 0.5\text{ m} = 1$) dan kerataan permukaan.
- $X_{\text{hambatan}}(p)$: Ketiadaan hambatan fisik dari PKL, parkir liar, atau tumpukan material.
- $X_{\text{pencahayaan}}(p)$: Tingkat pencahayaan jalan di malam hari.
- $X_{\text{disabilitas}}(p)$: Ketersediaan jalur pemandu (*guiding block*) ramah disabilitas yang kontinu.
- $X_{\text{feeder}}(p)$: Jarak konektivitas berjalan kaki ke titik jemput angkutan umum/feeder terdekat.

---

### BAB V: ANTARMUKA WEBGIS DAN SKENARIO PENGGUNA

#### 5.1 Fungsionalitas Dashboard WebGIS
Sistem dikembangkan menggunakan kerangka kerja Next.js yang terintegrasi dengan pustaka Leaflet.js. Penggunaan basemap menggunakan **MAPID MAPS API** untuk menjamin visualisasi geospasial yang premium. Dashboard ini menggunakan mode gelap (*dark mode*) dengan visualisasi kontras tinggi untuk menonjolkan sebaran heatmap RSS dan koridor walkability pejalan kaki.

#### 5.2 Matriks Hak Akses Pengguna (Role-Based Access Control)
Untuk mengakomodasi berbagai kepentingan stakeholder, KAI-STATION HUB menerapkan hak akses bertingkat:

| Peran Pengguna (Role) | Tingkat Akses | Deskripsi Fitur Utama |
| :--- | :---: | :--- |
| **KAI DAOP 8 – Asset Manager** | Admin / Premium | Mengedit listing stan/properti internal stasiun, melihat visualisasi klaster stasiun (DBSCAN), memantau performa harga sewa dinamis (DRM), dan mengekspor data komersial stasiun. |
| **Pelaku Ritel / UMKM** | Registered User | Mengakses heatmap RSS (Retail Success Score) per kategori usaha, berinteraksi dengan AI Spatial Chatbot untuk konsultasi pemilihan lokasi, serta melihat harga properti komersial aktif. |
| **Urban Planner (Pemkot/Dishub)** | Partner Gov | Mengakses data prioritas perbaikan jalur pedestrian (*Walkability Score Map*), mengunduh laporan indeks konektivitas transit (TCI), serta melihat overlay regulasi RDTR. |
| **Komuter / Publik** | Guest User | Mencari kuliner terdekat dari stasiun (Menu Go) dan mencari jalur pejalan kaki teraman menuju halte feeder melalui AI Chatbot. |

#### 5.3 Skenario dan Alur Pengguna (User Flow)
Alur interaksi pengguna dengan platform divisualisasikan dalam diagram alur berikut:

```mermaid
graph TD
    Start([User Masuk ke Platform]) --> Role{Pilih Peran Akses}

    %% Pebisnis / UMKM Flow
    Role -->|Pebisnis / UMKM| B2_Filter[Filter Kategori Usaha & Budget]
    B2_Filter --> B2_Map[Tampilan Heatmap RSS & Peta Lokasi]
    B2_Map --> B2_Select[Pilih Stasiun & Lihat Statistik]
    B2_Select --> B2_Chat[Konsultasi dengan AI Chatbot]
    B2_Chat --> B2_Highlight[Saran Properti Ritel Optimal]

    %% KAI Asset Manager Flow
    Role -->|KAI Asset Manager| K_Dash[Dashboard Aset DAOP 8]
    K_Dash --> K_Cluster[Analisis Klaster Stasiun (DBSCAN)]
    K_Dash --> K_Ped[Pemetaan Kepadatan Pejalan Kaki]
    K_Cluster --> K_Recom[Rekomendasi Tenant-Mix & Multiplier DRM]
    K_Ped --> K_Walk[Rencana Aksi Pedestrian & Tata Ruang]

    %% City Planner Flow
    Role -->|Urban Planner Pemkot| C_TCI[Transit Connectivity Index (TCI)]
    C_TCI --> C_Walk[Walkability Priority Map]
    C_Walk --> C_Export[Ekspor Rekomendasi Pembangunan]

    %% Guest / Komuter Flow
    Role -->|Komuter / Guest| G_Query[Pencarian POI Kuliner / Akses Transit]
    G_Query --> G_Response[Rekomendasi AI & Navigasi Visual]

    %% Styling
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:1px;
    classDef b2b fill:#fff3e0,stroke:#f57c00,stroke-width:1px;
    classDef kai fill:#ede7f6,stroke:#5e35b1,stroke-width:1px;
    classDef gov fill:#e8f5e9,stroke:#2e7d32,stroke-width:1px;
    classDef guest fill:#e3f2fd,stroke:#1e88e5,stroke-width:1px;

    class B2_Filter,B2_Map,B2_Select,B2_Chat,B2_Highlight b2b;
    class K_Dash,K_Cluster,K_Ped,K_Recom,K_Walk kai;
    class C_TCI,C_Walk,C_Export gov;
    class G_Query,G_Response guest;
```

---

### BAB VI: KELAYAKAN TEKNIS, POTENSI DAMPAK, DAN SKALABILITAS

#### 6.1 Analisis Dampak Ekonomi dan Operasional
Implementasi WebGIS KAI-STATION HUB diproyeksikan memberikan dampak terukur bagi seluruh pemangku kepentingan:
- **Dampak bagi KAI DAOP 8:** Skema *Dynamic Rent Multiplier* (DRM) berbasis klaster spasial memproyeksikan peningkatan pendapatan sektor non-farebox sebesar 12–18% dari stasiun tipe Hub Utama. Optimalisasi *tenant mix* diprediksi menurunkan *vacancy rate* ruang komersial ritel stasiun sebesar 20–30% dalam waktu satu tahun operasional.
- **Dampak bagi UMKM:** Penentuan lokasi usaha melalui visualisasi spasial RSS memotong waktu analisis pemilihan lokasi (*site selection cycle*) dari rata-rata 14 hari survei konvensional menjadi di bawah 10 menit. Estimasi penurunan tingkat kegagalan usaha ritel baru mencapai 35% karena didasarkan pada data transaksi Struk Go yang presisi.
- **Dampak bagi Pemkot Surabaya:** Peta prioritas pedestrian mempercepat pengambilan keputusan perencanaan anggaran perbaikan trotoar Dinas PUPR Surabaya agar tepat sasaran di kawasan penunjang transit massal.

#### 6.2 Perbandingan Kompetitif dan Nilai Orisinalitas (Mengapa Surabaya?)
Mayoritas penelitian akademis maupun platform WebGIS komersial sejenis masih terpusat di kawasan Jabodetabek (KRL Commuter Line dan MRT Jakarta). Hal ini menyebabkan terjadinya saturasi solusi spasial di kawasan ibukota. Di sisi lain, kawasan Metropolitan Surabaya memiliki potensi pasar dan urgensi penataan TOD yang sangat tinggi namun minim alat analitik yang terintegrasi. 

Dengan memfokuskan studi pada koridor Surabaya-Sidoarjo, KAI-STATION HUB memiliki keunggulan kompetitif sebagai **pelopor pertama (*first-mover*)** sistem analitik spasial TOD di Jawa Timur. Keberadaan tim lokal mempermudah pelaksanaan survei lapangan primer secara berkala demi menjamin keakuratan data spasial (Menu Go, Struk Go, Properti Go) yang kemudian diumpankan kembali untuk memperkaya basis data katalog nasional MAPID.

#### 6.3 Rencana Skalabilitas & Keberlanjutan Proyek
Arsitektur database PostGIS dan modul pemelajaran mesin (Random Forest dan DBSCAN) dirancang secara modular. Hal ini memudahkan replikasi sistem ke koridor kereta api perkotaan lainnya di Indonesia, seperti koridor KRL Yogyakarta-Solo, KA Commuter Bandung Raya, maupun rencana MRT/LRT Surabaya di masa mendatang. Keberlanjutan platform dijamin melalui skema kemitraan data B2B dengan PT KAI (penyediaan API data ridership dan manajemen sewa) serta skema berlangganan premium bagi pelaku usaha waralaba menengah ke atas (*Franchise Enterprise Plan*).

---

### BAB VII: KESIMPULAN DAN REKOMENDASI

#### 7.1 Kesimpulan
Proyek proposal **KAI-STATION HUB** menyajikan model integrasi antara parameter transportasi kereta komuter dengan aktivitas komersial lokal di koridor TOD Surabaya–Sidoarjo. Solusi berbasis WebGIS ini menjawab tantangan nyata yang dihadapi oleh PT KAI DAOP 8, pelaku UMKM, dan Pemerintah Kota Surabaya. 

Melalui pemanfaatan tiga model AI (DBSCAN Clustering, Random Forest Regressor, dan Spatial Conversational RAG) yang diperkaya dengan orisinalitas data primer hasil *Survey Activities*, sistem ini terbukti layak secara teknis untuk diimplementasikan secara komprehensif. Keunggulan lokasi Surabaya memberikan nilai tambah orisinalitas tinggi yang membedakan proyek ini dari solusi konvensional di wilayah Jabodetabek.

#### 7.2 Rekomendasi
Untuk pengembangan lebih lanjut, tim menyarankan beberapa rekomendasi berikut:
1. **Kemitraan Data Resmi:** Membuka jembatan integrasi data API ridership harian KAI secara langsung dengan PT KAI DAOP 8 Surabaya untuk menggantikan pemodelan estimasi ridership (*proxy ridership*).
2. **Optimasi Multi-Moda:** Menambahkan modul optimasi rute feeder terdekat menggunakan algoritma Dijkstra atau A* guna mempercepat perpindahan pejalan kaki dari stasiun KAI menuju halte Suroboyo Bus.
3. **Analisis Tren Waktu (Time-Series):** Memperluas pengumpulan data Struk Go secara musiman guna memodelkan fluktuasi belanja komuter saat hari kerja versus akhir pekan.

---

### DAFTAR PUSTAKA

1. Hao, Y., dkk. (2023). *DBSCAN clustering application in passenger distribution and urban mobility pattern detection*. Applied Sciences, 13(4), 2110.
2. He, X., dkk. (2025). *Application of Random Forest in retail site selection based on urban functional zones*. Land, 14(1), 112.
3. Kementerian Pekerjaan Umum dan Perumahan Rakyat. (2021). *Pedoman Teknis Perencanaan Fasilitas Pejalan Kaki di Kawasan Perkotaan*. Jakarta: Direktorat Jenderal Cipta Karya.
4. Lyu, G., dkk. (2021). *Developing a Node-Place-Design model for Transit-Oriented Development (TOD) indexing*. Journal of Transport Geography, 96, 103180.
5. Nugroho, A., dkk. (2023). *Evaluasi Integrasi Antarmoda dan Aksesibilitas Pejalan Kaki pada Stasiun Commuter Line Koridor Surabaya–Sidoarjo*. Jurnal Transportasi Multimoda, 21(1), 45-56.
6. OpenStreetMap Contributors. (2026). *Planet OSM database*. Retrieved from https://www.openstreetmap.org.
7. Pemerintah Kota Surabaya. (2024). *Peraturan Daerah Kota Surabaya Nomor 8 Tahun 2024 tentang Rencana Tata Ruang Wilayah (RTRW) Kota Surabaya Tahun 2024-2044*. Lembaran Daerah Kota Surabaya.
8. Priyanto, A. & Wahyuni, S. (2022). *Potensi Penerapan Konsep Transit Oriented Development (TOD) pada Stasiun Surabaya Gubeng*. Jurnal Teknik ITS, 11(2), 2301-9271.
9. Rakhman, A., dkk. (2022). *Analisis Klaster Kepadatan Penumpang Kereta Api Komuter Menggunakan Algoritma DBSCAN*. Jurnal Sistem Informasi, 11(2), 102-114.
10. Thomas, R., & Bertolini, L. (2021). *Defining Transit-Oriented Development (TOD) Indexing for Sustainable Cities*. Transport Reviews, 41(1), 25-47.
11. Zhou, Y., dkk. (2022). *Convenience store location prediction model based on hybrid MTS-Random Forest machine learning*. PLOS ONE, 17(8), e0271345.
