import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

# 7 curated prompts dari PRD Section 8 — semua harus menghasilkan response valid
CURATED_PROMPTS = [
    # (prompt, expected_action, expected_station)
    ("Tampilkan skor TOD di sekitar Stasiun Gubeng",        "highlight_and_zoom",  "gubeng"),
    ("Bandingkan skor TOD Gubeng dan Wonokromo",            "compare_stations",    "gubeng"),
    ("Apa dimensi TOD terlemah di Stasiun Pasar Turi?",    "highlight_and_zoom",  "pasar_turi"),
    ("Berapa estimasi kenaikan nilai tanah di sekitar Waru?", "highlight_and_zoom", "waru"),
    ("Tampilkan lokasi warung makan ramai di dekat stasiun", "filter_layer",       None),
    ("Jika feeder WiraWiri diperpanjang ke Waru, apa dampaknya?", "show_scenario", "waru"),
    ("Di mana lokasi terbaik untuk buka kedai kopi dekat stasiun?", "site_recommendation", "wonokromo"),
]


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


@pytest.mark.asyncio
async def test_ai_curated_prompts(client):
    """Seluruh 7 curated prompts wajib sukses (Success Rate >= 90%)."""
    success_count = 0

    for prompt_text, expected_action, expected_station in CURATED_PROMPTS:
        response = await client.post("/api/ai/query", json={"prompt": prompt_text})
        assert response.status_code == 200, f"HTTP error for prompt: {prompt_text!r}"

        res_data = response.json()
        assert res_data["status"] == "success", f"Status error for: {prompt_text!r}"

        data = res_data["data"]
        assert "text_response" in data
        assert len(data["text_response"]) > 20, "Response text tropendek"
        assert data["action"] == expected_action, \
            f"Expected action '{expected_action}', got '{data['action']}' for: {prompt_text!r}"

        if expected_station:
            assert data["target_station"] == expected_station, \
                f"Expected station '{expected_station}', got '{data['target_station']}' for: {prompt_text!r}"

        success_count += 1

    success_rate = (success_count / len(CURATED_PROMPTS)) * 100
    assert success_rate >= 90.0, f"Success rate {success_rate:.0f}% di bawah target 90%"


@pytest.mark.asyncio
async def test_ai_query_basic_response_structure(client):
    """Response AI harus selalu memiliki struktur yang valid."""
    response = await client.post(
        "/api/ai/query",
        json={"prompt": "Tampilkan informasi stasiun Gubeng"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "data" in data
    assert "text_response" in data["data"]
    assert "action" in data["data"]


@pytest.mark.asyncio
async def test_ai_query_short_prompt_rejected(client):
    """Prompt yang terlalu pendek harus ditolak dengan 422."""
    response = await client.post("/api/ai/query", json={"prompt": "x"})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_ai_query_default_fallback(client):
    """Prompt random harus tetap mengembalikan response default yang valid."""
    response = await client.post(
        "/api/ai/query",
        json={"prompt": "Lorem ipsum dolor sit amet consectetur"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["data"]["text_response"]) > 20
