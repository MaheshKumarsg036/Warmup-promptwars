import os
from vertexai.generative_models import GenerativeModel, Part, Image
import vertexai
from typing import List, Optional

class GeminiService:
    def __init__(self, project_id: str, location: str = "us-central1"):
        vertexai.init(project=project_id, location=location)
        self.model = GenerativeModel("gemini-2.5-flash")

    async def process_chaos_to_clarity(self, text: str, image_bytes_list: List[bytes], audio_bytes: Optional[bytes] = None, traffic_data: dict = None, weather_data: dict = None):
        """
        Orchestrates the 'Chaos-to-Clarity' prompt as requested.
        """
        
        # Simulated traffic/weather data into prompt context
        context_prompt = f"""
        Current System Context:
        - Traffic Density: {traffic_data.get('density', 'Unavailable')}
        - Weather Conditions: {weather_data.get('conditions', 'Unavailable')}
        - Road Closure Status: {traffic_data.get('closures', 'None reported')}
        """

        # Multimodal inputs
        contents = []
        
        # 1. Add images
        for i, img_bytes in enumerate(image_bytes_list):
            contents.append(Part.from_data(data=img_bytes, mime_type="image/jpeg"))

        # 2. Add audio (Simulated or actual)
        if audio_bytes:
             contents.append(Part.from_data(data=audio_bytes, mime_type="audio/webm")) # or wav

        # 3. Add textual prompt
        input_prompt = f"""
        Role: Universal Dispatch Bridge (AI Responder)
        Scenario: An emergency scene with multiple data streams.

        INPUTS:
        - Frantic Audio: {text if not audio_bytes else "Process attached audio stream"}
        - Blurry Visuals: Process attached image frames
        {context_prompt}

        TASK:
        1. Transcribe the frantic audio (even if bilingual or panicky).
        2. Analyze the images for:
           - Severity of incident
           - Casualties detected
           - Vehicle types (overturned, active hazard)
           - Bounding boxes for key hazards (hazard_type: [ymin, xmin, ymax, xmax])
        3. Consult the system context (traffic/weather) to propose the optimal route.
        4. Output a clean, structured JSON medical/dispatch payload.

        OUTPUT FORMAT (JSON exactly):
        {{
            "transcription": "Extracted text here...",
            "visual_analysis": {{
                "severity": "CRITICAL|HIGH|MEDIUM|LOW",
                "objects": [
                    {{"label": "Overturned Car", "box_2d": [y1, x1, y2, x2]}}
                ]
            }},
            "action_plan": {{
                "optimal_route": ["Point A", "Point B"],
                "traffic_delta": "Current traffic delay impact",
                "recommended_er": "Nearest ER contact id"
            }},
            "medical_payload": {{
              "patient_count": 0,
              "injuries": ["list"],
              "vitals_estimate": "based on visual/audio clues"
            }}
        }}

        Response:
        """
        contents.append(input_prompt)

        response = self.model.generate_content(contents)
        return response.text
