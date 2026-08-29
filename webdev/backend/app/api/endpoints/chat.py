from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Optional, Dict, Any

from app.ai.gemini_agent import GeminiAgent
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()
agent = GeminiAgent()
limiter = Limiter(key_func=get_remote_address)

class ChatRequest(BaseModel):
    prompt: str
    active_station: Optional[str] = "gubeng"
    active_persona: Optional[str] = "government"
    active_h3_index: Optional[str] = None

class ChatResponse(BaseModel):
    text_response: str
    action: Optional[Dict[str, Any]] = None

@router.post("/api/v1/ai/query", response_model=ChatResponse)
@limiter.limit("60/minute")
async def query_ai(request: Request, chat_request: ChatRequest):
    """
    Receives a natural language query from the frontend and proxies it
    to Gemini API with Spatial Function Calling capabilities.
    """
    
    # Construct context string for Gemini
    context = (
        f"Active Station: {chat_request.active_station}\n"
        f"Active Persona: {chat_request.active_persona}\n"
    )
    if chat_request.active_h3_index:
        context += f"Selected H3 Hexagon: {chat_request.active_h3_index}\n"
        
    # Process through Gemini Agent
    result = await agent.process_query(chat_request.prompt, context)
    
    return ChatResponse(
        text_response=result.get("text_response", "Maaf, saya tidak dapat memproses permintaan ini."),
        action=result.get("action")
    )
