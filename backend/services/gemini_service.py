import os
from vertexai.generative_models import GenerativeModel, Part, Image
import vertexai
from typing import List, Optional

class GeminiService:
    def __init__(self, project_id: str, location: str = "us-central1"):
        vertexai.init(project=project_id, location=location)
        self.model = GenerativeModel("gemini-2.5-flash")

    async def process_chaos_to_clarity(self, text: str, image_bytes_list: List[bytes], audio_bytes: Optional[bytes] = None, pdf_bytes_list: List[bytes] = None, traffic_data: dict = None, weather_data: dict = None, persona: str = "standard"):
        """
        Tailors the summary for special abilities (ADHD, Autism, Elderly) and handles PDF analysis.
        """
        
        # Accessibility-specific prompt instructions
        persona_instructions = {
            "adhd": "Summarize for ADHD: Use short bullet points, bolding key terms. Keep sentences extremely concise to maintain focus.",
            "autism": "Summarize for Autism: Use clear, direct, and literal language. Avoid idioms or overwhelming data. Focus on logical sequences.",
            "elderly": "Summarize for Elderly: Use high-contrast terminology. Focus on safety and simple steps. Assume larger fonts will be used.",
            "standard": "Provide a professional, technical emergency dispatch summary."
        }

        # Multimodal inputs
        contents = []
        
        # 1. Add images
        for img_bytes in image_bytes_list:
            contents.append(Part.from_data(data=img_bytes, mime_type="image/jpeg"))

        # 2. Add PDFs
        if pdf_bytes_list:
            for pdf_bytes in pdf_bytes_list:
                contents.append(Part.from_data(data=pdf_bytes, mime_type="application/pdf"))

        # 3. Add audio
        if audio_bytes:
             contents.append(Part.from_data(data=audio_bytes, mime_type="audio/webm"))

        # 4. Add textual prompt
        input_prompt = f"""
        Role: Universal Inclusive Dispatch Bridge 
        Context: The user has provided data streams (Photos/PDFs/Audio). 
        Goal: Analyze available streams and provide 'Actionable Clarity' tailored for {persona}.

        ACCESSIBILITY FOCUS ({persona.upper()}): {persona_instructions.get(persona, persona_instructions['standard'])}

        INPUT STREAMS:
        - Audio/Text Overlay: {text if text else "Listen to attached stream" if audio_bytes else "NOT PROVIDED"}
        - Visual/Document Data: Processes attached MULTIMODAL media. 

        CRITICAL TASK:
        - If a PDF is attached, analyze the text/metadata within the document.
        - If photos are attached, analyze the scene.
        - Combine all knowledge to create a structured dispatch summary. 
        - Even if audio is 'NOT PROVIDED', do NOT report an error. Instead, focus 100% on the PDF/Photo intelligence.

        OUTPUT FORMAT (JSON exactly):
        {{
            "transcription": "Tailored situation summary (if audio is absent, summarize important PDF data here)...",
            "visual_analysis": {{
                "severity": "CRITICAL|HIGH|MEDIUM|LOW",
                "objects": [{{"label": "string", "box_2d": [y1, x1, y2, x2]}}]
            }},
            "action_plan": {{
                "optimal_route": ["Point A", "Point B"],
                "inclusive_steps": ["Step 1 for persona", "Step 2 for persona"]
            }},
            "medical_payload": {{
              "summary": "Simplified for {persona} use",
              "key_data": "JSON valid technical data"
            }}
        }}

        Response:
        """
        contents.append(input_prompt)

        response = self.model.generate_content(contents)
        return response.text
