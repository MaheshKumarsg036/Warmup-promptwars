from pydantic import BaseModel
from typing import List, Optional

class EmergencyRequestBody(BaseModel):
    text_input: Optional[str] = None
    image_count: Optional[int] = 0
    audio_present: Optional[bool] = False

# This will represent the structured output from Gemini
class DispatchResponse(BaseModel):
    transcription: str
    visual_analysis: dict
    action_plan: dict
    medical_payload: dict
