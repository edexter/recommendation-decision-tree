# Docker Deployment Guide

## Prerequisites

1. Install Docker Desktop for Windows
2. Enable WSL2 integration in Docker Desktop settings
3. Login to DockerHub: `docker login`

## Build and Push to DockerHub

### Step 1: Navigate to project directory
```bash
cd boothguru
```

### Step 2: Build the Docker image
Replace `YOUR_DOCKERHUB_USERNAME` with your DockerHub username:

```bash
docker build -t YOUR_DOCKERHUB_USERNAME/recommendation-decision-tree:latest .
```

### Step 3: Test the image locally (optional)
```bash
docker run -p 8000:8000 YOUR_DOCKERHUB_USERNAME/recommendation-decision-tree:latest
```

Then open http://localhost:8000 in your browser

### Step 4: Push to DockerHub
```bash
docker push YOUR_DOCKERHUB_USERNAME/recommendation-decision-tree:latest
```

## Deploy to Render

1. Go to https://render.com/
2. Create new **Web Service**
3. Choose **Deploy an existing image from a registry**
4. Enter your Docker image: `YOUR_DOCKERHUB_USERNAME/recommendation-decision-tree:latest`
5. Set:
   - **Port:** 8000
   - **Health Check Path:** `/`
6. Click **Create Web Service**

Your app will be live at: `https://your-app-name.onrender.com`

## Notes

- The Docker image is a **single container** that includes both frontend and backend
- Frontend is built as static files and served by FastAPI
- The app serves the frontend at `/` and API at `/api/tree`
- Port 8000 is exposed for the application
- Image size is optimized with multi-stage build (~200MB)

## Troubleshooting

If Docker commands fail in WSL:
1. Open Windows PowerShell or CMD as Administrator
2. Navigate to the project folder using Windows path
3. Run the docker commands from there
