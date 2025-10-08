#!/usr/bin/env python3
"""
FastAPI backend for interactive decision tree
Serves decision tree data
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import json
import os

app = FastAPI(title="Booth Recommendation Decision Tree API")

# CORS configuration - allow both localhost and production frontend
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite preview
]

# Add production frontend URL from environment variable if available
if frontend_url := os.getenv("FRONTEND_URL"):
    ALLOWED_ORIGINS.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load decision tree data
DATA_FILE = Path(__file__).parent.parent / "decision_tree.json"

# Mount static files if they exist (for Docker deployment)
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="static")

def load_tree_data():
    """Load and return the decision tree data"""
    with open(DATA_FILE, "r") as f:
        return json.load(f)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Decision Tree API"}

@app.get("/api/tree")
async def get_tree():
    """Return the complete decision tree structure"""
    return load_tree_data()

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=True)
