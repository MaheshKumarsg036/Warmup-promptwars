# --- Build Stage (Frontend) ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# --- Final Stage (Backend + Shared) ---
FROM python:3.9-slim
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# Copy built frontend from build stage to a 'static' directory
COPY --from=frontend-builder /app/frontend/dist /app/static

# Modify main.py to serve static files locally within the container
# We will do this via code edit in the next step

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
