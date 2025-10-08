# Multi-stage build for production deployment
# This Dockerfile builds both frontend and backend in a single container

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Backend with static files
FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/main.py ./
COPY decision_tree.json ./

# Copy built frontend static files
COPY --from=frontend-build /app/frontend/dist /app/static

# Install additional package to serve static files
RUN pip install --no-cache-dir aiofiles

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
