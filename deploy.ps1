# --- Chaos-to-Clarity Deployment Script ---

$PROJECT_ID = "new-project-373516"
$SERVICE_NAME = "chaos-to-clarity-dashboard"
$REGION = "us-central1"

echo "Deploying to Google Cloud Run ($PROJECT_ID)..."

# Ensure gcloud is set to the correct project
gcloud config set project $PROJECT_ID

# Deploy using the Dockerfile in the current directory
gcloud run deploy $SERVICE_NAME `
    --source . `
    --region $REGION `
    --allow-unauthenticated `
    --set-env-vars="GOOGLE_CLOUD_PROJECT=$PROJECT_ID" `
    --platform managed

echo "Deployment completed!"
