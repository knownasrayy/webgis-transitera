import os
import json
import httpx
from typing import Dict, Any, Optional

class GeminiAgent:
    def __init__(self):
        # In a real app, this should be loaded from .env
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
        
        # Spatial tools that Gemini can call to manipulate the WebGIS UI
        self.tools = [
            {
                "name": "change_map_view",
                "description": "Changes the webgis map view to focus on a specific station or area.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "target_station": {
                            "type": "STRING",
                            "description": "The ID of the station (e.g. 'gubeng', 'wonokromo', 'pasar-turi')"
                        },
                        "choropleth_mode": {
                            "type": "STRING",
                            "description": "The layer mode to show on the map. Options: 'tod_score', 'njop_premium', 'typology'."
                        }
                    },
                    "required": ["target_station"]
                }
            },
            {
                "name": "analyze_tod_score",
                "description": "Explains the TOD score of a station and provides an analytical summary.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "station_id": {
                            "type": "STRING",
                            "description": "The ID of the station to analyze."
                        }
                    },
                    "required": ["station_id"]
                }
            }
        ]
        
    async def process_query(self, query: str, context: str) -> Dict[str, Any]:
        """
        Sends a query to Gemini with Function Calling tools enabled.
        """
        if not self.api_key:
            # Fallback mock response if no API key is provided
            return self._mock_response(query, context)
            
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{"text": f"Context: {context}\nUser Query: {query}"}]
            }],
            "tools": [{"functionDeclarations": self.tools}],
            "systemInstruction": {
                "parts": [{"text": "You are TransitERA Spatial AI, an expert in TOD and WebGIS. You help users analyze spatial data in Surabaya. Always use tools to trigger map changes when the user asks to see a station or layer."}]
            }
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}?key={self.api_key}",
                    headers=headers,
                    json=payload,
                    timeout=15.0
                )
                response.raise_for_status()
                data = response.json()
                
                return self._parse_gemini_response(data)
                
        except Exception as e:
            print(f"Gemini API Error: {e}")
            return self._mock_response(query, context)
            
    def _parse_gemini_response(self, data: Dict) -> Dict:
        """Parses the raw Gemini response into our structured format."""
        try:
            parts = data['candidates'][0]['content']['parts']
            
            # Check for function call
            for part in parts:
                if 'functionCall' in part:
                    func_name = part['functionCall']['name']
                    args = part['functionCall']['args']
                    
                    if func_name == 'change_map_view':
                        return {
                            "text_response": f"Tentu, saya memindahkan peta ke wilayah {args.get('target_station', '').title()}.",
                            "action": {
                                "type": "CHANGE_VIEW",
                                "target_station": args.get("target_station"),
                                "layer": args.get("choropleth_mode", "tod_score")
                            }
                        }
                        
            # If no function call, just return the text
            for part in parts:
                if 'text' in part:
                    return {
                        "text_response": part['text'],
                        "action": None
                    }
                    
        except KeyError:
            pass
            
        return self._mock_response("", "")

    def _mock_response(self, query: str, context: str) -> Dict[str, Any]:
        """Mock response for development when API key is not set."""
        if "gubeng" in query.lower() or "gubeng" in context.lower():
            target = "gubeng"
        elif "wonokromo" in query.lower():
            target = "wonokromo"
        else:
            target = "pasar-turi"
            
        return {
            "text_response": f"*(Simulasi Mode Tanpa API Key)*\n\nMenganalisis kueri Anda untuk stasiun **{target.title()}**. Skor TOD di area ini cukup baik dengan fokus pada kepadatan penduduk. Peta telah digeser ke lokasi tersebut.",
            "action": {
                "type": "CHANGE_VIEW",
                "target_station": target,
                "layer": "tod_score",
                "view_state": {
                    "center": [112.7521, -7.2654] if target == "gubeng" else [112.7383, -7.3014],
                    "zoom": 14.5,
                    "pitch": 45
                }
            }
        }
