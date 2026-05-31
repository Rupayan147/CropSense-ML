# CropSense ML

## Project Overview
CropSense ML is an AI-powered rice leaf disease classifier that uses a trained MobileNetV2 model to predict disease classes from uploaded leaf images and return treatment guidance in a polished web dashboard.

## Features
- FastAPI prediction API for image upload and inference
- React + Vite + Tailwind CSS dashboard UI
- Upload preview, loading state, and reset flow
- Predicted disease, confidence score, and class probability breakdown
- Disease-specific treatment suggestions for major rice diseases

## Tech Stack
- Backend: FastAPI, TensorFlow/Keras, Pillow, NumPy
- Frontend: React, Vite, Tailwind CSS, lucide-react
- Model: MobileNetV2

## Dataset Source
- Kaggle Rice Leaf Disease Images

## How to Run Backend
1. Open a terminal in the backend folder.
2. Create and activate a virtual environment.
3. Install the Python dependencies.
4. Start the API server.

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

## How to Run Frontend
1. Open a terminal in the frontend folder.
2. Install dependencies.
3. Start the Vite development server.

```powershell
cd frontend
npm install
npm run dev
```

## API Endpoint
- `GET /` returns API status and class names.
- `POST /predict` accepts an image upload and returns prediction, confidence, treatment suggestion, and probabilities.

## Future Improvements
- Add inference history and analytics
- Support batch uploads
- Add model explainability visualizations
- Improve treatment recommendations with region-specific advisory data
