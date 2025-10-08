# Booth Recommendation System - Interactive Decision Framework

An interactive web application for demonstrating the decision-making process for implementing a booth recommendation system at AI tech expos.

## Features

- Interactive 3-phase decision tree with progressive reveal
- Feature menu with independent Yes/No toggles
- Modern gradient design with smooth animations
- Export configuration summary to text file
- Fully responsive design

## Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Framer Motion

**Backend:**
- FastAPI
- Python 3.11+

## Local Development

### Quick Start

```bash
./start.sh
```

Then open http://localhost:3000

### Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Deployment on Render

### Backend Deployment

1. Create new Web Service on Render
2. Connect your repository
3. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables:**
     - `FRONTEND_URL` = your frontend URL (e.g., https://your-app.onrender.com)

### Frontend Deployment

1. Create new Static Site on Render
2. Connect your repository
3. Configure:
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
   - **Environment Variables:**
     - `VITE_API_URL` = your backend URL (e.g., https://your-api.onrender.com)

4. Update `frontend/src/App.jsx` to use environment variable:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
   fetch(`${API_URL}/api/tree`)
   ```

## Project Structure

```
boothguru/
├── backend/
│   ├── main.py              # FastAPI server
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom hooks
│   │   └── styles/         # Global styles
│   └── package.json
├── decision_tree.json       # Decision tree data
├── start.sh                 # Local development script
└── README.md
```

## Customization

Edit `decision_tree.json` to modify:
- Questions and options
- Phase structure
- Node descriptions
- Decision flow logic

## License

MIT
