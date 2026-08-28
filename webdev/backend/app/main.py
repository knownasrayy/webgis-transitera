from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api.endpoints import spatial, station, chat

app = FastAPI(
    title="TransitERA API",
    description="Backend Spatial Analytics Engine for TransitERA WebGIS",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(spatial.router, tags=["Spatial"])
app.include_router(station.router, tags=["Station"])
app.include_router(chat.router, tags=["AI Chat"])

@app.get("/")
def root():
    return {"message": "Welcome to TransitERA Backend API. PostGIS & H3 Engine is running."}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
