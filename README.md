# The Chaos-to-Clarity Dashboard

A high-tech emergency dispatch center visualization powered by **Gemini 1.5 Pro Multimodal**.

## Tech Stack
-   **Frontend:** React (Vite) + Tailwind CSS + Framer Motion
-   **Backend:** FastAPI (Python) + Vertex AI (Google Cloud)
-   **Infrastructure:** Google Cloud Run (Target)

## Architecture
-   **Left Panel:** "Messy Human" Input (Drag-and-drop images, Mic, Panicky text).
-   **Center Panel:** "Universal Bridge" (Real-time Gemini multimodal processing visualization).
-   **Right Panel:** "Actionable System" Output (Optimal routes, Medical JSON payload).

## Prerequisites
1.  Google Cloud Project with Vertex AI API enabled.
2.  Local credentials configured for Google Cloud (`gcloud auth application-default login`).
3.  Python 3.9+ and Node.js 18+.

## Running Locally

### 1. Backend
```powershell
cd backend
pip install -r requirements.txt
# Set your GCP Project ID
$env:GOOGLE_CLOUD_PROJECT="your-project-id"
python main.py
```

### 2. Frontend
```powershell
cd frontend
npm install
npm run dev
```

The Dashboard will be available at `http://localhost:5173`.
The Backend will be available at `http://localhost:8000`.
