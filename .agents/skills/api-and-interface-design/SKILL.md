---
name: api-and-interface-design
description: "Guides stable API and interface design for TransitERA WebGIS. Covers FastAPI REST endpoints (TOD Score, NJOP premium, spatial queries), Gemini AI proxy pattern, contract-first design, consistent error semantics, boundary validation, and predictable naming conventions."
---

# API and Interface Design (TransitERA)

Panduan desain API dan interface untuk **TransitERA WebGIS** — mengadaptasi prinsip dari [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) ke stack **FastAPI + Next.js API Routes + Google Gemini Proxy**.

---

## 1. Prinsip Utama

### Contract First

Definisikan interface sebelum implementasi. Kontrak adalah spesifikasi — implementasi mengikuti.

```python
# FastAPI: Definisikan schema Pydantic terlebih dahulu
from pydantic import BaseModel, Field
from enum import Enum

class StationId(str, Enum):
    gubeng = "gubeng"
    pasar_turi = "pasar_turi"
    semut = "semut"
    wonokromo = "wonokromo"
    waru = "waru"

class TODScoreResponse(BaseModel):
    station_id: StationId
    station_name: str
    tod_readiness_score: float = Field(..., ge=0, le=100)
    density: float
    diversity: float
    design: float
    destination_accessibility: float
    distance_to_transit: float
    typology: str
    h3_indexes: list[str]

class NJOPPremiumResponse(BaseModel):
    station_id: StationId
    avg_njop_premium_pct: float
    ci_lower_pct: float
    ci_upper_pct: float
    affected_h3_count: int
```

### Consistent Error Semantics

Gunakan satu strategi error di seluruh API:

```python
from fastapi import HTTPException
from pydantic import BaseModel

class APIError(BaseModel):
    code: str       # Machine-readable: "VALIDATION_ERROR"
    message: str    # Human-readable: "Station ID tidak valid"
    details: dict | None = None

# Status code mapping untuk TransitERA:
# 400 → Client mengirim data tidak valid
# 404 → Stasiun / H3 cell tidak ditemukan
# 422 → Validasi gagal (koordinat di luar Surabaya bbox)
# 429 → Rate limit AI query (60 req/menit/IP)
# 500 → Server error (jangan expose internal details)
```

### Validate at Boundaries

Validasi di titik masuk sistem — trust internal code:

```python
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api")

@router.get("/tod-score/{station_id}", response_model=TODScoreResponse)
async def get_tod_score(station_id: StationId):
    """Mengambil skor TOD 5D untuk simpul stasiun tertentu."""
    result = await tod_service.get_score(station_id)
    if not result:
        raise HTTPException(status_code=404, detail={
            "code": "STATION_NOT_FOUND",
            "message": f"Stasiun '{station_id}' tidak ditemukan"
        })
    return result

@router.get("/njop-premium/{station_id}", response_model=NJOPPremiumResponse)
async def get_njop_premium(station_id: StationId):
    """Mengambil estimasi premium nilai lahan berbasis SDM."""
    return await sdm_service.get_premium(station_id)
```

---

## 2. Dual-Output Response Pattern (AI Proxy)

Setiap endpoint AI selalu mengembalikan dua bagian:

```python
class AIResponse(BaseModel):
    status: str = "success"
    data: dict = Field(default_factory=dict)

class AIData(BaseModel):
    action: str                    # "highlight_and_zoom", "filter_layer", "compare"
    target_layer: str | None       # "h3_tod_score", "h3_njop_premium"
    target_station: str | None
    view_state: dict | None        # {"center": [lon, lat], "zoom": 14.5}
    filter_query: dict | None
    chart_payload: dict | None     # Radar chart data
    text_response: str             # Narasi human-readable

@router.post("/ai/query")
async def ai_query(request: AIQueryRequest) -> AIResponse:
    """Proxy ke Gemini API — mengembalikan json_response + text_response."""
    # ... implementation
```

---

## 3. Naming Conventions

| Pattern | Konvensi | Contoh TransitERA |
|---------|---------|-------------------|
| REST endpoints | Plural nouns, no verbs | `GET /api/stations`, `GET /api/tod-scores/{id}` |
| Query params | camelCase | `?sortBy=todScore&minScore=70` |
| Response fields | snake_case (Python) | `tod_readiness_score`, `station_cluster` |
| Boolean fields | is/has/can prefix | `is_feeder_connected`, `has_pedestrian_path` |
| Enum values | snake_case | `"gubeng"`, `"pasar_turi"` |

---

## 4. Prefer Addition Over Modification

Extend interfaces tanpa breaking existing consumers:

```python
# ✅ Baik: Tambah field optional
class TODScoreResponse(BaseModel):
    # ... existing fields ...
    scenario_delta: float | None = None  # Ditambahkan nanti, optional
    intervention_type: str | None = None # Ditambahkan nanti, optional

# ❌ Buruk: Ubah tipe field atau hapus field yang sudah ada
```
