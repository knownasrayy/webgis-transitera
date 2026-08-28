import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

CURATED_PROMPTS = [
    ("Tampilkan skor TOD di sekitar Stasiun Gubeng", "highlight_and_zoom", "gubeng"),
    ("Bandingkan skor TOD Gubeng dan Wonokromo", "compare_stations", "gubeng"),
    ("Apa dimensi TOD terlemah di Stasiun Pasar Turi?", "highlight_and_zoom", "pasar_turi"),
    ("Berapa estimasi kenaikan nilai tanah di sekitar Waru?", "highlight_and_zoom", "waru"),
    ("Tampilkan lokasi warung makan ramai di dekat stasiun", "filter_layer", None),
    ("Jika feeder WiraWiri diperpanjang ke Waru, apa dampaknya?", "show_scenario", "waru"),
    ("Di mana lokasi terbaik untuk buka kedai kopi dekat stasiun?", "site_recommendation", "wonokromo")
]

@pytest.mark.asyncio
async def test_ai_curated_prompts():
    """Seluruh 7 curated prompts wajib sukses dieksekusi (Success Rate >= 90%)."""
    transport = ASGITransport(app=app)
    success_count = 0
    
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        for prompt_text, expected_action, expected_station in CURATED_PROMPTS:
            response = await client.post("/api/ai/query", json={"prompt": prompt_text})
            assert response.status_code == 200
            
            res_data = response.json()
            assert res_data["status"] == "success"
            data = res_data["data"]
            
            assert "text_response" in data
            assert len(data["text_response"]) > 20
            assert data["action"] == expected_action
            
            if expected_station:
                assert data["target_station"] == expected_station
                
            success_count += 1
            
    success_rate = (success_count / len(CURATED_PROMPTS)) * 100
    assert success_rate >= 90.0, f"Success rate {success_rate}% di bawah target 90%"
