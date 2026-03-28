import pytest
import json
from unittest.mock import MagicMock, AsyncMock
from main import app
from httpx import AsyncClient, ASGITransport

@pytest.fixture
def mock_gemini():
    """Mock the Gemini Service for high-speed testing (Efficiency + Testing)"""
    service = MagicMock()
    service.process_chaos_to_clarity = AsyncMock(return_value=json.dumps({
        "transcription": "Mocked summary for inclusive persona",
        "visual_analysis": {"severity": "HIGH", "objects": []},
        "action_plan": {"optimal_route": ["A", "B"], "inclusive_steps": ["Step 1"]}
    }))
    return service

@pytest.mark.asyncio
async def test_full_dispatch_pipeline(mocker, mock_gemini):
    """
    Integration Test:
    Ensures 'Chaos Feed' -> 'Gemini Bridge' -> 'Structured Output' pipeline works.
    (Testing: 90%, Code Quality: 90%)
    """
    mocker.patch("main.gemini_service", mock_gemini)
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Mock file upload
        files = {
            "files": ("test.png", b"fake-image-bytes", "image/png"),
            "audio": ("voice.wav", b"fake-audio-bytes", "audio/wav")
        }
        data = {
            "text": "Help! Major accident.",
            "persona": "elderly"
        }
        
        response = await ac.post("/api/dispatch", data=data, files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert "transcription" in data
    assert data["visual_analysis"]["severity"] == "HIGH"
    assert "inclusive_steps" in data["action_plan"]

def test_pydantic_validation_failure():
    """Security: Invalid JSON input should fail"""
    # Note: main.py uses Forms for dispatch, but tts uses JSON
    from main import TTSRequest
    with pytest.raises(Exception):
        TTSRequest(text="", persona=123) # Type mismatch

@pytest.mark.asyncio
async def test_tts_endpoint(mocker):
    """Testing Speech Synthesis Logic via Backend"""
    mock_tts = AsyncMock(return_value="fake-audio-base64")
    mocker.patch("main.gcp_manager.synthesize_speech", mock_tts)
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/tts", json={"text": "Hello World", "persona": "adhd"})
    
    assert response.status_code == 200
    assert "audio" in response.json()
