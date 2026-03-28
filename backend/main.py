import os
from dotenv import load_dotenv

# Load .env variables into environment
load_dotenv()

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from typing import List, Optional
import json
import os

from services.gemini_service import GeminiService
from utils.traffic_weather import ExternalAPIs

app = FastAPI(title="Chaos-to-Clarity Backend")

# Serve the static React build if it exists (for Cloud Run)
STATIC_DIR = os.path.join(os.getcwd(), "static")
if os.path.exists(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="static")

@app.get("/", include_in_schema=False)
async def serve_index():
    if os.path.exists(os.path.join(STATIC_DIR, "index.html")):
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
    return {"message": "Development environment (API active)"}

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Service (Requires GOOGLE_CLOUD_PROJECT env var)
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "your-project-id")
gemini_service = GeminiService(project_id=PROJECT_ID)

@app.get("/")
async def health_check():
    return {"status": "ok", "service": "Chaos-to-Clarity Dashboard API"}

@app.post("/api/dispatch")
async def process_dispatch_data(
    text: Optional[str] = Form(None),
    images: List[UploadFile] = File(None),
    audio: Optional[UploadFile] = File(None)
):
    """
    Main multimodal endpoint for the Chaos-to-Clarity dashboard.
    """
    try:
        # Prepare inputs for Gemini
        image_bytes_list = []
        if images:
            for img in images:
                image_bytes_list.append(await img.read())

        audio_bytes = None
        if audio:
            audio_bytes = await audio.read()

        # Get context simulation
        traffic = ExternalAPIs.get_traffic_data()
        weather = ExternalAPIs.get_weather_data()

        # Call Gemini
        response_text = await gemini_service.process_chaos_to_clarity(
            text=text,
            image_bytes_list=image_bytes_list,
            audio_bytes=audio_bytes,
            traffic_data=traffic,
            weather_data=weather
        )

        # Gemini might return markdown JSON block, strip it
        clean_json = response_text.replace("```json", "").replace("```", "").strip()
        parsedResponse = json.loads(clean_json)

        return parsedResponse

    except Exception as e:
        print(f"Error processing dispatch: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
