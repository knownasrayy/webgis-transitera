---
name: debugging-and-error-recovery
description: "Systematic root-cause debugging for TransitERA WebGIS. Covers structured triage for MapLibre WebGL errors, Gemini API Function Calling failures, PostGIS spatial query issues, H3 rendering glitches, and the Stop-the-Line rule for error recovery."
---

# Debugging and Error Recovery (TransitERA)

Panduan debugging sistematis untuk **TransitERA WebGIS** — mengadaptasi prinsip dari [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) ke konteks error yang umum terjadi pada stack MapLibre + FastAPI + Gemini API + PostGIS.

---

## 1. The Stop-the-Line Rule

Ketika terjadi sesuatu yang tidak diharapkan:

```
1. STOP menambahkan fitur atau melakukan perubahan
2. PRESERVE bukti (error output, log, langkah reproduksi)
3. DIAGNOSE menggunakan triage checklist
4. FIX root cause
5. GUARD agar tidak terulang
6. RESUME hanya setelah verifikasi lulus
```

**Jangan lewatkan test yang gagal atau build yang rusak untuk mengerjakan fitur berikutnya.** Error menumpuk.

---

## 2. Triage Checklist (TransitERA Context)

### Step 1: Reproduce

Buat failure terjadi secara reliabel:

```
Bisa reproduksi failure?
├── YA → Lanjut ke Step 2
└── TIDAK
    ├── Kumpulkan konteks lebih (log, environment details)
    ├── Coba reproduksi di environment minimal
    └── Jika benar-benar non-reproducible, dokumentasikan & monitor
```

### Step 2: Localize

Tentukan di MANA failure terjadi berdasarkan layer TransitERA:

```
Layer mana yang bermasalah?
├── MapLibre / Frontend
│   ├── Console error? → Cek browser DevTools Console
│   ├── Peta blank/putih? → Cek MAPID API key, style URL, CORS
│   ├── H3 cells tidak muncul? → Cek GeoJSON source, layer paint rules
│   └── Animasi lag? → Cek WebGL memory, feature count
├── FastAPI / Backend
│   ├── 500 Internal Error? → Cek server logs, traceback
│   ├── 422 Validation? → Cek Pydantic schema vs request body
│   └── Timeout? → Cek PostGIS query performance, Gemini latency
├── Gemini API
│   ├── Function Call tidak terpanggil? → Cek tool definition schema
│   ├── Hallucinated coordinates? → Cek bounding box guardrail
│   ├── Rate limit 429? → Cek kuota harian free tier
│   └── Response format salah? → Cek Strict JSON Schema enforcement
├── PostGIS / Database
│   ├── Query lambat? → Cek EXPLAIN ANALYZE, index GIST
│   ├── H3 index mismatch? → Cek resolusi (8 vs 9), string format
│   └── Data kosong? → Cek ETL pipeline, GEO MAPID API sync
└── Test itu sendiri
    └── Test benar menguji hal yang tepat? (false negative?)
```

### Step 3: Reduce

Buat minimal failing case:

- Hapus kode/config yang tidak terkait sampai hanya bug yang tersisa
- Sederhanakan input ke contoh terkecil yang memicu failure
- Strip test ke minimum yang mereproduksi masalah

### Step 4: Fix the Root Cause

Perbaiki masalah dasar, bukan gejala:

```
Gejala: "Peta menampilkan H3 cell di laut"

Fix gejala (buruk):
  → Filter out cells di frontend berdasarkan koordinat

Fix root cause (baik):
  → Perbaiki polygon intersect query di PostGIS yang tidak
    mengecualikan area perairan dari spatial join
```

### Step 5: Guard

Tambahkan test yang mencegah regresi:

```python
# Guard: Test bahwa H3 cells hanya di area daratan Surabaya
def test_h3_cells_within_surabaya_boundary():
    cells = get_all_h3_cells()
    for cell in cells:
        centroid = h3.h3_to_geo(cell["h3_index"])
        assert validate_coordinates(centroid[1], centroid[0]), \
            f"H3 cell {cell['h3_index']} berada di luar batas Surabaya"
```

---

## 3. Error Patterns Spesifik TransitERA

### Gemini API Function Calling Errors

```python
# Pattern: Gemini tidak memanggil function yang diharapkan
# Diagnosis: Cek apakah prompt cukup spesifik untuk trigger tool
# Fix: Tambahkan contoh few-shot di system prompt

# Pattern: Gemini mengembalikan parameter yang salah
# Diagnosis: Cek enum values di tool definition vs yang direturn
# Fix: Gunakan Strict JSON Schema (response_mime_type="application/json")
```

### MapLibre WebGL Context Lost

```typescript
// Pattern: Peta blank setelah tab browser di-background lama
// Diagnosis: WebGL context hilang saat tab tidak aktif
// Fix: Tangani event 'webglcontextlost' dan re-initialize

map.getCanvas().addEventListener('webglcontextlost', (event) => {
  event.preventDefault();
  console.warn('WebGL context lost — reinitializing map...');
  // Trigger re-render atau notify user
});
```

### PostGIS Spatial Join Timeout

```sql
-- Pattern: Query H3 spatial join timeout pada dataset besar
-- Diagnosis: EXPLAIN ANALYZE menunjukkan sequential scan
-- Fix: Pastikan GIST index ada di kolom geometry

CREATE INDEX IF NOT EXISTS idx_h3_geom ON h3_tod_analytics USING GIST(geom);
ANALYZE h3_tod_analytics;
```

---

## 4. Bisection untuk Regression Bugs

```bash
# Temukan commit mana yang memperkenalkan bug
git bisect start
git bisect bad                    # Commit saat ini rusak
git bisect good <known-good-sha> # Commit ini masih berfungsi
# Git akan checkout midpoint commits; jalankan test di setiap commit
git bisect run pytest -k "failing_test"
```
