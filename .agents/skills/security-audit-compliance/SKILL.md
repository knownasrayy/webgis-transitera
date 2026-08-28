---
name: security-audit-compliance
description: "Comprehensive security hardening and competition rubric audit for TransitERA WebGIS. Covers API key isolation, OWASP top 10 prevention, input validation, MAPID 2026 rubric compliance (8 modul PRD, Coaching 1/2/3), and automated security scanning scripts."
---

# Security, Audit & Compliance (TransitERA)

Panduan keamanan, audit kualitas, dan kepatuhan rubrik kompetisi MAPID WebGIS 2026 — mengintegrasikan best practices dari [addyosmani/agent-skills `security-and-hardening`](https://github.com/addyosmani/agent-skills) dengan checklist rubrik spesifik TransitERA.

---

## 1. Prinsip Keamanan Utama (Three-Tier Boundary)

### Selalu Lakukan (Tanpa Pengecualian)

- **Validasi semua input eksternal** di boundary API (route handler, form handler)
- **Parameterisasi semua database query** — jangan pernah concat user input ke SQL
- **Encode output** untuk mencegah XSS (gunakan framework auto-escaping React)
- **Gunakan HTTPS** untuk semua komunikasi eksternal
- **Set security headers** (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- **API Key Isolation**: `GEMINI_API_KEY`, `MAPID_API_KEY` **WAJIB** di `.env` server backend — **DILARANG KERAS** di client-side bundle
- **Jalankan audit dependensi** (`npm audit`, `pip audit`) sebelum setiap release

### Jangan Pernah Lakukan

- **Jangan commit secrets** ke version control (API keys, passwords, tokens)
- **Jangan log data sensitif** (passwords, tokens, full API keys)
- **Jangan percaya client-side validation** sebagai security boundary
- **Jangan gunakan `eval()` atau `innerHTML`** dengan user-provided data
- **Jangan expose stack traces** atau internal error details ke pengguna
- **Jangan disable security headers** untuk convenience

---

## 2. Konteks Keamanan Spesifik TransitERA

### API Key Isolation Pattern

```typescript
// ✅ BENAR: API key di backend environment variable
// File: backend/app/config.py (FastAPI)
import os
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MAPID_API_KEY = os.getenv("MAPID_API_KEY")

// ✅ BENAR: Frontend memanggil proxy backend, bukan Gemini langsung
// File: src/lib/api.ts (Next.js)
export async function queryAI(prompt: string) {
  const response = await fetch('/api/ai/query', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
  return response.json();
}

// ❌ SALAH: API key di frontend bundle
// const GEMINI_KEY = "AIzaSy..." // JANGAN PERNAH!
```

### Bounding Box Guardrail (Validasi Koordinat Surabaya)

```python
SURABAYA_BBOX = {
    "min_lon": 112.55,
    "max_lon": 112.85,
    "min_lat": -7.38,
    "max_lat": -7.18
}

def validate_coordinates(lon: float, lat: float) -> bool:
    return (SURABAYA_BBOX["min_lon"] <= lon <= SURABAYA_BBOX["max_lon"] and
            SURABAYA_BBOX["min_lat"] <= lat <= SURABAYA_BBOX["max_lat"])
```

### Validasi Input di FastAPI Boundary

```python
from pydantic import BaseModel, Field, validator

class AIQueryRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=500)
    viewport_bbox: list[float] | None = None

    @validator('viewport_bbox')
    def validate_bbox(cls, v):
        if v and len(v) != 4:
            raise ValueError('Bounding box harus berisi 4 koordinat [minLon, minLat, maxLon, maxLat]')
        return v

class AIQueryResponse(BaseModel):
    status: str
    data: dict
    text_response: str
    json_response: dict | None = None
```

---

## 3. Matriks Kepatuhan 8 Modul PRD (Coaching 1)

Verifikasi kelengkapan dokumen TransitERA_PRD.md:

- [ ] **Modul 1: Problem Statement & Value Proposition**: Masalah fragmentasi data simpul transit Surabaya, pihak terdampak, dan keunggulan 4 komponen solusi.
- [ ] **Modul 2: User Personas & User Stories**: 3 Persona spesifik (Dishub, Investor/Site Analyst, UMKM Kuliner) dengan format *As a... I want to... So that...*
- [ ] **Modul 3: Survey Activities Strategy**: Rencana 360 titik (100 Activity `#PakSibukGa` + 260 Mission) di 5 simpul SRRL.
- [ ] **Modul 4: Data Processing, AI, & Spatial Analysis**: Pipeline H3 Grid, AHP 5D TOD ($CR \le 0{,}10$), Spatial Durbin Model, dan Gemini Function Calling.
- [ ] **Modul 5: Scope Boundaries**: Penegasan fitur *In-Scope* vs *Out-of-Scope* (bebas dari *scope creep*).
- [ ] **Modul 6: System Architecture & User Flow**: Blueprint arsitektur Next.js, FastAPI, PostGIS, MapLibre, dan Gemini API.
- [ ] **Modul 7: Timeline & Risk Matrix**: Timeline 5,5 minggu Agile sprint + matriks 7 risiko dan mitigasi teknis.
- [ ] **Modul 8: Acceptance Criteria & QA**: 10 kriteria uji fitur terukur dengan status lolos verifikasi.

---

## 4. Kepatuhan Standar Teknis AI (Coaching 2 — Mas Mahrus)

- [ ] **API Key Security**: `GEMINI_API_KEY` tersimpan aman di `.env` server backend; tidak ada kebocoran di bundle client-side.
- [ ] **Dual Output Separation**: Setiap respons AI mengembalikan `json_response` (manipulasi peta) dan `text_response` (narasi/rekomendasi).
- [ ] **Strict Parameter Generator**: AI tidak menghitung koordinat vertex mentah, melainkan memanggil fungsi spasial deterministik.
- [ ] **Bounding Box Guardrail**: Terdapat validasi batas koordinat Surabaya (`112.55–112.85 E`, `-7.38–-7.18 S`).
- [ ] **Curated Prompt Presets**: Minimal 7 tombol quick prompt terpasang di antarmuka chat panel.

---

## 5. Kepatuhan Value Proposition & Juri (Coaching 3 — Pak Sena PT KAI)

- [ ] **Outcome over Tool**: Solusi membuktikan efisiensi pengambilan keputusan dari 3 minggu menjadi `< 30 menit`.
- [ ] **Problem-Solution Fit**: Matriks *Value Proposition Canvas* (VPC) lengkap untuk seluruh persona.
- [ ] **Tantangan 5 Pertanyaan Juri**: Terjawab lengkap dengan bukti empiris lapangan (*evidence*).
- [ ] **Anti-Bloat Strategy**: Memangkas fitur *gimmick* (3D city, real-time train tracking, AR) dan fokus pada **1 Core Decision Engine**.
- [ ] **User Trial Protocol**: Tersedia skenario pengujian prototipe bersama perwakilan target pengguna.

---

## 6. OWASP Top 10 Prevention Patterns (Konteks TransitERA)

### Injection Prevention (PostGIS Queries)

```python
# ❌ SALAH: SQL injection via string concat
query = f"SELECT * FROM h3_tod_analytics WHERE station_cluster = '{station_id}'"

# ✅ BENAR: Parameterized query
query = "SELECT * FROM h3_tod_analytics WHERE station_cluster = %s"
cursor.execute(query, (station_id,))
```

### XSS Prevention (AI Response Rendering)

```tsx
// ✅ BENAR: React auto-escaping
return <p>{aiResponse.text_response}</p>;

// ❌ SALAH: Rendering AI response sebagai raw HTML
return <div dangerouslySetInnerHTML={{ __html: aiResponse.text_response }} />;
```

---

## 7. Skrip Audit Otomatis (Pre-Submission)

Gunakan skrip Python untuk memverifikasi tidak ada kebocoran API Key di folder frontend sebelum build:

```python
import os
import re

FRONTEND_DIR = r"webdev/frontend/src"
SENSITIVE_PATTERNS = [
    r'AIzaSy[A-Za-z0-9-_]{33}',        # Google API Key
    r'mapid_[A-Za-z0-9]{32,}',          # MAPID Private Key
    r'postgres://.*:.*@',               # Direct DB Connection String
]

def scan_sensitive_leaks():
    leaks_found = 0
    for root, _, files in os.walk(FRONTEND_DIR):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.json')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    for pattern in SENSITIVE_PATTERNS:
                        if re.search(pattern, content):
                            print(f"[SECURITY ALERT] Kemungkinan kebocoran token di: {path}")
                            leaks_found += 1
    if leaks_found == 0:
        print("[AUDIT PASS] Frontend bersih dari kebocoran API Key sensitif.")
```
