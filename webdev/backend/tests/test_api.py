import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_list_stations():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/stations")
    assert response.status_code == 200
    stations = response.json()
    assert len(stations) == 5
    station_ids = [s["id"] for s in stations]
    assert "gubeng" in station_ids
    assert "waru" in station_ids

@pytest.mark.asyncio
async def test_get_tod_score_valid_station():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/tod-score/gubeng")
    assert response.status_code == 200
    data = response.json()
    assert data["station_id"] == "gubeng"
    assert data["tod_readiness_score"] == 84.5
    assert "scores" in data
    assert data["scores"]["density"] == 88.0

@pytest.mark.asyncio
async def test_get_tod_score_invalid_station():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/tod-score/invalid_station_xyz")
    assert response.status_code == 422 # Validation error for Enum

@pytest.mark.asyncio
async def test_get_h3_grid():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/h3-grid?station=gubeng")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) > 0
    assert data["features"][0]["geometry"]["type"] == "Polygon"

@pytest.mark.asyncio
async def test_get_njop_premium():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/njop-premium/waru")
    assert response.status_code == 200
    data = response.json()
    assert data["station_id"] == "waru"
    assert data["avg_njop_premium_pct"] == 8.2
