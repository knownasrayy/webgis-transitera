import os
import re
import json
import logging
from typing import Dict, Any, Optional
import httpx

from app.core.config import settings
from app.schemas.ai import AIQueryRequest, AIResponse, AIData
from app.ai.tools import SPATIAL_TOOLS
from app.ai.dispatcher import dispatch_spatial_function

logger = logging.getLogger(__name__)

# Intent pattern matcher for curated prompts and robust offline/fallback mode
def match_fallback_intent(prompt: str) -> tuple[str, Dict[str, Any]]:
    p = prompt.lower()
    
    # 1. Compare stations
    if ("bandingkan" in p or "compare" in p) and ("gubeng" in p or "wonokromo" in p or "pasar turi" in p or "semut" in p or "waru" in p):
        stations_found = []
        for s in ["gubeng", "pasar_turi", "semut", "wonokromo", "waru"]:
            clean_s = s.replace("_", " ")
            if clean_s in p or s in p:
                stations_found.append(s)
        st_a = stations_found[0] if len(stations_found) > 0 else "gubeng"
        st_b = stations_found[1] if len(stations_found) > 1 else "wonokromo"
        return "compare_stations", {"station_a": st_a, "station_b": st_b}
        
    # 2. Weakest dimension / rekomendasi dimensi terlemah
    if "terlemah" in p or "dimensi terlemah" in p or "weakest" in p or "kekurangan" in p:
        st_id = "pasar_turi"
        for s in ["gubeng", "pasar_turi", "semut", "wonokromo", "waru"]:
            if s in p or s.replace("_", " ") in p:
                st_id = s
                break
        return "get_weakest_dimension", {"station_id": st_id}
        
    # 3. NJOP Premium / Kenaikan nilai tanah
    if "njop" in p or "nilai tanah" in p or "kenaikan" in p or "premium" in p:
        st_id = "waru"
        for s in ["gubeng", "pasar_turi", "semut", "wonokromo", "waru"]:
            if s in p or s.replace("_", " ") in p:
                st_id = s
                break
        return "get_njop_premium", {"station_id": st_id}
        
    # 4. Filter layer / warung ramai / survey
    if "warung" in p or "ramai" in p or "menu" in p or "kuliner" in p or "filter" in p:
        if "kedai kopi" in p or "buka" in p or "lokasi terbaik" in p:
            return "site_recommendation", {"business_type": "coffee_shop", "target_station": "all"}
        return "filter_layer", {"target_layer": "survey_mission_menu", "kondisi": "ramai"}
        
    # 5. Simulate scenario / Feeder extension / what if
    if "feeder" in p or "perpanjang" in p or "simulasi" in p or "jika" in p or "skenario" in p:
        return "simulate_scenario", {"scenario_id": "extend_feeder_waru"}
        
    # 6. Site recommendation / Rekomendasi lokasi usaha
    if "lokasi terbaik" in p or "rekomendasi" in p or "coffee" in p or "kopi" in p:
        return "site_recommendation", {"business_type": "coffee_shop", "target_station": "wonokromo"}
        
    # 7. Station TOD score (e.g. "Tampilkan skor TOD di sekitar Stasiun Gubeng")
    for s in ["gubeng", "pasar_turi", "semut", "wonokromo", "waru"]:
        if s in p or s.replace("_", " ") in p:
            return "get_tod_score", {"station_id": s}
            
    if "skor tod" in p or "tod score" in p or "kesiapan tod" in p:
        return "get_tod_score", {"station_id": "gubeng"}
        
    return "default", {}

async def process_ai_query(request: AIQueryRequest) -> AIResponse:
    """
    Memproses kueri bahasa alami dari pengguna menggunakan Gemini API
    atau fallback parameter generator yang aman.
    """
    api_key = settings.GEMINI_API_KEY
    prompt = request.prompt.strip()
    
    # Try calling Google Gemini API if API key is provided
    if api_key and api_key != "your_gemini_api_key_here":
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            
            gemini_tools = [{
                "function_declarations": SPATIAL_TOOLS
            }]
            
            system_instruction = (
                "Anda adalah Asisten Spasial AI untuk TransitERA WebGIS di Surabaya. "
                "Tugas Anda menerjemahkan pertanyaan pengguna terkait kesiapan TOD, komparasi 5 stasiun "
                "(Gubeng, Pasar Turi, Semut, Wonokromo, Waru), estimasi %ΔNJOP, atau filter survei menjadi pemanggilan fungsi yang tepat."
            )
            
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "system_instruction": {"parts": [{"text": system_instruction}]},
                "tools": gemini_tools
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    result = resp.json()
                    candidates = result.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        for part in parts:
                            if "functionCall" in part:
                                fn = part["functionCall"]
                                fn_name = fn.get("name")
                                fn_args = fn.get("args", {})
                                ai_data = dispatch_spatial_function(fn_name, fn_args)
                                return AIResponse(status="success", data=ai_data)
        except Exception as e:
            logger.warning(f"Gemini API request failed, falling back to local engine: {e}")
            
    # Fallback to local rule-based intent router
    fn_name, fn_args = match_fallback_intent(prompt)
    if fn_name != "default":
        ai_data = dispatch_spatial_function(fn_name, fn_args)
    else:
        ai_data = dispatch_spatial_function("default", {})
        
    return AIResponse(status="success", data=ai_data)
