# WebDevelopment Workspace - TransitERA WebGIS

Direktori ini berisi *source code*, *build artifacts*, dan konfigurasi container untuk aplikasi WebGIS **TransitERA** (*Decision Support System for Assessing TOD Readiness and Its Association with Land Value in Surabaya*).

---

## 🏗️ Struktur Direktori

```
webdev/
├── docker-compose.yml        # Orchestration DB (PostGIS) + Backend (FastAPI) + Frontend (Next.js)
├── .env.example              # Template variabel lingkungan (API Keys, Database, Ports)
├── frontend/                 # WebGIS Frontend (Next.js 16, React 19, MapLibre GL JS, TailwindCSS)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
└── backend/                  # API Server & Spatial Engine (FastAPI, Uber H3, PySAL SDM, Gemini AI Proxy)
    ├── Dockerfile
    ├── requirements.txt
    └── app/
```

---

## 🚀 Cara Menjalankan Aplikasi

Terdapat dua cara untuk menjalankan Frontend dan Backend:
1. **Opsi 1: Menggunakan Docker Compose (Sangat Direkomendasikan)** — Siap pakai dalam 1 perintah, mengotomatisasi PostGIS DB, FastAPI, dan Next.js.
2. **Opsi 2: Menjalankan Secara Manual (Local Host)** — Menjalankan Frontend dan Backend di terminal terpisah.

---

### 🌟 Opsi 1: Menggunakan Docker Compose (Rekomendasi)

#### 1. Siapkan file `.env`
Salin template konfigurasi `.env.example` menjadi `.env` di dalam folder `webdev/`:
```bash
# Windows PowerShell / CMD
cd webdev
copy .env.example .env

# Linux / macOS / Git Bash
cd webdev
cp .env.example .env
```
> Isi nilai `MAPID_API_KEY` dan `GEMINI_API_KEY` di dalam file `.env` jika diperlukan.

#### 2. Jalankan seluruh stack dengan Docker Compose
```bash
docker compose up --build
```
Untuk menjalankan di latar belakang (*detached mode*):
```bash
docker compose up -d --build
```

#### 3. Akses Layanan:
- 🌐 **Frontend WebGIS**: [http://localhost:3030](http://localhost:3030)
- 🔌 **Backend API Root**: [http://localhost:8000](http://localhost:8000)
- 📖 **Backend Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 🗄️ **PostGIS Database**: `localhost:5432` (`user: postgres`, `password: postgres`, `db: transitera`)

#### 4. Menghentikan Docker:
```bash
docker compose down
```

---

### 💻 Opsi 2: Menjalankan Secara Manual (Local Host)

#### Prasyarat:
- **Node.js** v20+ & **npm**
- **Python** 3.11+ & **pip**

---

#### 1. Menjalankan Backend (FastAPI)

Buka terminal pertama:
```bash
# Masuk ke direktori backend
cd webdev/backend

# Buat virtual environment (opsional namun disarankan)
python -m venv .venv

# Aktivasi virtual environment
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# Windows CMD:
.\.venv\Scripts\activate.bat
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Jalankan server FastAPI
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Backend akan aktif di [http://localhost:8000](http://localhost:8000) dengan interactive Swagger UI di [http://localhost:8000/docs](http://localhost:8000/docs).

---

#### 2. Menjalankan Frontend (Next.js)

Buka terminal kedua:
```bash
# Masuk ke direktori frontend
cd webdev/frontend

# Install dependencies (jika belum)
npm install

# Jalankan development server
npm run dev
```
Frontend akan aktif di [http://localhost:3030](http://localhost:3030).

---

## 🧪 Testing

- **Frontend Tests (Vitest)**:
  ```bash
  cd webdev/frontend
  npm test
  ```
- **Backend Tests (PyTest)**:
  ```bash
  cd webdev/backend
  pytest
  ```
