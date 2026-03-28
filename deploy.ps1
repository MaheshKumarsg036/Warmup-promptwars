# --- Chaos-to-Clarity Deployment Script (Docker Version) ---

$PROJECT_ID = "new-project-373516"
$SERVICE_NAME = "chaos-to-clarity-dashboard"
$REGION = "us-central1"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "Deploying to Google Cloud Run ($PROJECT_ID) via Docker Build..."

# 1. Ensure gcloud is set to the correct project
gcloud config set project $PROJECT_ID

# 2. Authenticate Docker with Google Container Registry
gcloud auth configure-docker --quiet

# 3. Build the Docker image locally
echo "Building Docker image..."
docker build -t $IMAGE_NAME .

# 4. Push the image to GCR
echo "Pushing image to GCR..."
docker push $IMAGE_NAME

# 5. Deploy the image to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME `
    --image $IMAGE_NAME `
    --region $REGION `
    --allow-unauthenticated `
    --set-env-vars="GOOGLE_CLOUD_PROJECT=$PROJECT_ID" `
    --platform managed

echo "Deployment completed!"
