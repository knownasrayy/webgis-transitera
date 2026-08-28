---
name: test-driven-development
description: "Drives development with tests for TransitERA WebGIS. Covers the RED-GREEN-REFACTOR cycle, PyTest for FastAPI backend (spatial queries, AHP validation CR ≤ 0.10), Vitest for Next.js frontend components, Gemini AI response validation (≥ 90% curated prompt success), and the Prove-It bug fix pattern."
---

# Test-Driven Development (TransitERA)

Panduan pengembangan berbasis tes untuk **TransitERA WebGIS** — mengadaptasi prinsip TDD dari [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) ke stack **PyTest (backend) + Vitest (frontend)**.

---

## 1. Siklus TDD

```
    RED                GREEN              REFACTOR
 Write a test    Write minimal code    Clean up the
 that fails  ──→  to make it pass  ──→  implementation  ──→  (repeat)
      │                  │                    │
      ▼                  ▼                    ▼
   Test FAILS        Test PASSES         Tests still PASS
```

### Discover the Stack First

Sebelum menulis test pertama, kenali tooling project:

- **Backend (Python)**: `pytest`, `pytest-asyncio`, konfigurasi di `pyproject.toml`
- **Frontend (TypeScript)**: `vitest`, konfigurasi di `vitest.config.ts`
- **Focused test**: `pytest -k "test_name"` (backend), `npx vitest run --grep "test name"` (frontend)
- **Full suite**: `pytest` (backend), `npx vitest run` (frontend)

---

## 2. Contoh TDD: Backend (PyTest)

### Test AHP Consistency Ratio

```python
# tests/test_ahp.py
import numpy as np
import pytest
from app.spatial.ahp import calculate_ahp_weights

def test_ahp_consistency_ratio_within_threshold():
    """CR harus ≤ 0.10 untuk matriks pembobotan 5D TOD yang valid."""
    # RED: Test ini mendefinisikan kontrak bahwa CR harus ≤ 0.10
    pairwise_matrix = np.array([
        [1,   3,   5,   7,   9],
        [1/3, 1,   3,   5,   7],
        [1/5, 1/3, 1,   3,   5],
        [1/7, 1/5, 1/3, 1,   3],
        [1/9, 1/7, 1/5, 1/3, 1],
    ])
    
    weights, cr = calculate_ahp_weights(pairwise_matrix)
    
    assert cr <= 0.10, f"CR = {cr:.4f} melebihi threshold 0.10"
    assert len(weights) == 5
    assert abs(sum(weights) - 1.0) < 1e-6, "Bobot harus berjumlah 1.0"

def test_ahp_rejects_inconsistent_matrix():
    """Matriks yang sangat inkonsisten harus menghasilkan CR > 0.10."""
    inconsistent_matrix = np.array([
        [1,   9,   1/9, 9,   1/9],
        [1/9, 1,   9,   1/9, 9],
        [9,   1/9, 1,   9,   1/9],
        [1/9, 9,   1/9, 1,   9],
        [9,   1/9, 9,   1/9, 1],
    ])
    
    _, cr = calculate_ahp_weights(inconsistent_matrix)
    assert cr > 0.10
```

### Test TOD Score API Endpoint

```python
# tests/test_api_tod.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_get_tod_score_valid_station():
    """Endpoint harus mengembalikan skor TOD untuk stasiun valid."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/tod-score/gubeng")
    
    assert response.status_code == 200
    data = response.json()
    assert "tod_readiness_score" in data
    assert 0 <= data["tod_readiness_score"] <= 100

@pytest.mark.asyncio
async def test_get_tod_score_invalid_station():
    """Endpoint harus mengembalikan 422 untuk stasiun tidak valid."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/tod-score/stasiun_tidak_ada")
    
    assert response.status_code == 422
```

---

## 3. Contoh TDD: Frontend (Vitest)

```typescript
// __tests__/RadarChart5D.test.tsx
import { render, screen } from '@testing-library/react';
import { RadarChart5D } from '@/components/dashboard/RadarChart5D';
import { describe, it, expect } from 'vitest';

const mockData = [
  { dimension: 'Density', score: 82.5, benchmark: 70.0 },
  { dimension: 'Diversity', score: 74.0, benchmark: 65.0 },
  { dimension: 'Design', score: 58.2, benchmark: 60.0 },
  { dimension: 'Destination', score: 79.1, benchmark: 72.0 },
  { dimension: 'Distance', score: 88.0, benchmark: 75.0 },
];

describe('RadarChart5D', () => {
  it('renders station name in the heading', () => {
    render(<RadarChart5D stationName="Gubeng" data={mockData} />);
    expect(screen.getByText(/Gubeng/i)).toBeDefined();
  });

  it('renders 5 dimension labels', () => {
    render(<RadarChart5D stationName="Gubeng" data={mockData} />);
    expect(screen.getByText('Density')).toBeDefined();
    expect(screen.getByText('Design')).toBeDefined();
  });
});
```

---

## 4. Prove-It Pattern (Bug Fix)

Ketika bug dilaporkan, **jangan langsung perbaiki**. Tulis test yang mereproduksi bug terlebih dahulu:

```
Bug report arrives
       │
       ▼
  Write a test that demonstrates the bug
       │
       ▼
  Test FAILS (confirming the bug exists)
       │
       ▼
  Implement the fix
       │
       ▼
  Test PASSES (proving the fix works)
       │
       ▼
  Run full test suite (no regressions)
```

---

## 5. Test Pyramid (TransitERA)

```
          ╱╲
         ╱  ╲         E2E Tests (~5%)
        ╱    ╲        Curated prompt success rate ≥ 90%
       ╱──────╲
      ╱        ╲      Integration Tests (~15%)
     ╱          ╲     API endpoint + PostGIS queries
    ╱────────────╲
   ╱              ╲   Unit Tests (~80%)
  ╱                ╲  AHP weights, coordinate validation, data transforms
 ╱──────────────────╲
```

### Acceptance Criteria Tests (dari PRD)

| Test Category | Metric Target | Command |
|---|---|---|
| AHP Consistency | CR ≤ 0.10 | `pytest -k "test_ahp"` |
| AI Curated Prompts | Success rate ≥ 90% (7 prompts) | `pytest -k "test_ai_prompts"` |
| Lighthouse Performance | Score ≥ 85 | `npx lighthouse --output json` |
| FCP Target | < 1.8 detik | Lighthouse audit |
| Bounding Box Validation | Reject coords outside Surabaya | `pytest -k "test_bbox"` |
