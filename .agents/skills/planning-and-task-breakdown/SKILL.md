---
name: planning-and-task-breakdown
description: "Breaks TransitERA WebGIS work into ordered, verifiable tasks aligned with the 5.5-week M1-M8 sprint timeline. Covers dependency graph mapping, vertical slicing, acceptance criteria, and checkpoint-based verification."
---

# Planning and Task Breakdown (TransitERA)

Panduan dekomposisi pekerjaan menjadi task kecil, terverifikasi, dan terurut untuk **TransitERA WebGIS** — mengadaptasi prinsip dari [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) ke timeline sprint **5,5 minggu (M1–M8)**.

---

## 1. Prinsip Planning

### Enter Plan Mode First

Sebelum menulis kode, operasikan dalam read-only mode:

- Baca spec/PRD dan bagian codebase yang relevan
- Identifikasi pola dan konvensi yang ada
- Map dependensi antar komponen
- Catat risiko dan unknowns

**JANGAN menulis kode selama planning.** Output adalah plan document, bukan implementasi.

---

## 2. Dependency Graph TransitERA

```
PostgreSQL Schema (PostGIS)
    │
    ├── Data Pipeline (ETL: GEO MAPID → PostGIS)
    │       │
    │       ├── H3 Grid Indexing (h3-py)
    │       │       │
    │       │       ├── AHP 5D Scoring
    │       │       │       │
    │       │       │       └── SDM Regression
    │       │       │
    │       │       └── Typology Classification (HDBSCAN → XGBoost)
    │       │
    │       └── Survey Data Sync
    │
    ├── FastAPI Backend
    │       │
    │       ├── REST API Endpoints (/tod-score, /njop-premium)
    │       │       │
    │       │       └── Next.js API Client
    │       │               │
    │       │               └── Frontend Components (MapLibre, Dashboard)
    │       │
    │       └── Gemini AI Proxy (/ai/query)
    │               │
    │               └── AI Chat Panel (Frontend)
    │
    └── MAPID MAPS Basemap → MapLibre GL JS instance
```

Implementasi mengikuti dependency graph **bottom-up**: bangun fondasi dulu.

---

## 3. Slice Vertically (Bukan Horizontal)

**Buruk (horizontal slicing):**
```
Task 1: Setup seluruh database schema
Task 2: Build seluruh API endpoints
Task 3: Build seluruh UI components
Task 4: Connect semuanya
```

**Baik (vertical slicing):**
```
Task 1: Basemap MAPID MAPS + MapLibre render (schema → API → UI untuk peta dasar)
Task 2: H3 choropleth TOD Score (H3 grid → scoring → API → layer render)
Task 3: Dashboard scorecard (data per station → API → radar chart component)
Task 4: AI Chat basic (prompt → Gemini proxy → response render)
Task 5: Simulasi skenario (scenario model → API → UI comparison view)
```

Setiap vertical slice menghasilkan fungsionalitas yang bekerja dan testable.

---

## 4. Template Task

```markdown
## Task [N]: [Judul singkat deskriptif]

**Deskripsi:** Satu paragraf menjelaskan apa yang dicapai task ini.

**Acceptance criteria:**
- [ ] [Kondisi spesifik, testable]
- [ ] [Kondisi spesifik, testable]

**Verifikasi:**
- [ ] Tests pass: `pytest -k "test_name"` / `npx vitest run --grep "name"`
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: [deskripsi apa yang diverifikasi]

**Dependencies:** [Nomor task yang jadi dependensi, atau "None"]

**Files likely touched:**
- `src/path/to/file.ts`
- `tests/path/to/test.ts`

**Estimated scope:** [Small: 1-2 files | Medium: 3-5 files | Large: 5+ files]
```

---

## 5. Alignment dengan Timeline M1–M8

| Minggu | Fokus Sprint | Task Pattern |
|--------|-------------|-------------|
| **M1** (7–13 Aug) | Setup & PRD | Env setup, DB schema, data catalog import |
| **M2** (13–20 Aug) | Survey Batch 1 + Scaffolding | ETL pipeline, basemap render, project structure |
| **M3** (20–27 Aug) | Survey Batch 2 + Frontend Core | H3 choropleth, layer control, popup, filter |
| **M4** (27 Aug–3 Sep) | Spatial Analysis + Backend | AHP scoring, SDM regression, API endpoints |
| **M5** (3–7 Sep) | AI + Dashboard | Gemini Function Calling, radar chart, scorecard |
| **M6** (7–10 Sep) | Integration + Polish | E2E integration, mobile responsive, methodology page |
| **M7** (10–12 Sep) | QA + User Trial | PyTest, Lighthouse, curated prompt validation |
| **M8** (12–14 Sep) | Deploy + Submission | Vercel/Render deploy, stress test, documentation |

### Checkpoint Rules

Setelah setiap 2-3 tasks:
- [ ] Semua test lulus
- [ ] Aplikasi bisa di-build tanpa error
- [ ] Fitur yang sudah selesai berjalan end-to-end
- [ ] Tidak ada regresi pada fitur sebelumnya

---

## 6. Risk-First Ordering

Atur task sehingga:

1. **Dependencies terpenuhi** (bangun fondasi dulu)
2. **Setiap task meninggalkan sistem dalam working state**
3. **Verification checkpoints** setelah setiap 2-3 tasks
4. **High-risk tasks di awal** (fail fast):
   - MAPID MAPS basemap rendering (external dependency)
   - Gemini API Function Calling (external dependency)
   - PostGIS spatial queries (complex logic)
   - AHP consistency ratio validation (mathematical correctness)
