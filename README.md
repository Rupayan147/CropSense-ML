# CropSense ML

> ML-powered rice leaf disease classifier using a Kaggle dataset, MobileNetV2, FastAPI, and React.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Kaggle](https://img.shields.io/badge/Kaggle-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-111827?style=for-the-badge)
![Computer Vision](https://img.shields.io/badge/Computer%20Vision-0F172A?style=for-the-badge)

## Preview

![CropSense ML Preview](screenshots/preview.png)

Screenshots can be added inside the `screenshots/` folder to showcase the dashboard, prediction flow, and result view.

## Problem

Rice leaf diseases can reduce crop health and yield. Manual inspection is slow, inconsistent, and often requires expert knowledge. CropSense ML provides a simple AI-assisted interface to classify common rice leaf diseases from uploaded images.

## Solution

CropSense ML follows a lightweight end-to-end workflow:

Upload leaf image → FastAPI backend preprocesses the image → MobileNetV2 predicts the disease class → React frontend displays the result, confidence score, class probability breakdown, and treatment suggestion.

## Features

- Upload rice leaf image
- Preview selected image before prediction
- Predict disease class from a trained model
- View confidence score for the top prediction
- See probability breakdown for all supported classes
- Receive a treatment suggestion for the predicted disease
- FastAPI prediction API with image validation
- React dashboard UI with a clean upload and results flow
- Kaggle-trained MobileNetV2 model packaged with the backend

## Supported Classes

| Disease | Description | Output |
| --- | --- | --- |
| Bacterial blight | Bacterial infection that damages rice leaves and reduces plant vigor. | Detects bacterial blight and returns a targeted treatment suggestion. |
| Blast | Fungal disease that can create lesions on leaves and weaken crop health. | Detects blast and returns a targeted treatment suggestion. |
| Brown spot | Common fungal disease associated with brown lesions and poor crop performance. | Detects brown spot and returns a targeted treatment suggestion. |
| Tungro | Viral rice disease associated with stunting and yellowing. | Detects tungro and returns a targeted treatment suggestion. |

## ML Pipeline

Kaggle Dataset → Image Preprocessing → MobileNetV2 Transfer Learning → Model Evaluation → Saved Keras Model → FastAPI Inference → React Dashboard

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, Axios, Lucide React |
| Backend | FastAPI, Python, Uvicorn |
| ML | TensorFlow, Keras, MobileNetV2 |
| Image Processing | Pillow, NumPy |
| Dataset | Kaggle Rice Leaf Disease Images |

## Project Structure

```text
CropSense-ML/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── model/
│       ├── cropsense_mobilenetv2.keras
│       └── class_names.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── dataset/
│   └── dataset_link.txt
├── screenshots/
├── README.md
└── .gitignore
```

## Setup Instructions

### Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend URL: http://localhost:8000

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL: http://localhost:5173

## API Usage

### `GET /`

Returns API status and the loaded class names.

Example response:

```json
{
  "status": "ready",
  "message": "CropSense ML API is running.",
  "model_loaded": true,
  "class_names": ["Bacterial blight", "Blast", "Brown Spot", "Tungro"],
  "load_error": null
}
```

### `POST /predict`

Accepts an uploaded image file and returns the predicted class, confidence score, treatment suggestion, and probability breakdown.

Input:

- `file`: image file (`.jpg`, `.jpeg`, `.png`, or `.webp`)

Example response:

```json
{
  "prediction": "Blast",
  "confidence": 96.32,
  "treatment_suggestion": "Use resistant varieties, maintain balanced fertilization, avoid dense planting, and apply a fungicide program when conditions favor blast outbreaks.",
  "probabilities": [
    {
      "class_name": "Bacterial blight",
      "raw_class_name": "Bacterialblight",
      "probability": 0.01
    },
    {
      "class_name": "Blast",
      "raw_class_name": "Blast",
      "probability": 0.9632
    },
    {
      "class_name": "Brown Spot",
      "raw_class_name": "Brownspot",
      "probability": 0.02
    },
    {
      "class_name": "Tungro",
      "raw_class_name": "Tungro",
      "probability": 0.0068
    }
  ]
}
```

## Model Information

- Model: MobileNetV2
- Training platform: Kaggle
- Input size: 224 × 224
- Output: 4 rice disease classes
- Model file: `backend/model/cropsense_mobilenetv2.keras`

## Dataset

The dataset source is Kaggle and is used for rice leaf disease classification.

The full dataset is not uploaded to GitHub. The dataset reference is stored in `dataset/dataset_link.txt`.

## Limitations

- The model only supports 4 rice disease classes.
- It may misclassify healthy leaves or unknown plant diseases.
- Real-world field images may perform differently from Kaggle dataset images.
- This is an educational ML project, not medical or agriculture-certified diagnosis.

## Future Improvements

- Add Healthy / Unknown class
- Train with a larger external dataset
- Improve real-world generalization
- Add Grad-CAM explainability
- Add prediction history
- Add a Streamlit or Hugging Face demo
- Add cloud deployment
- Add a mobile-friendly capture flow

## Author

**Rupayan Biswas**

- GitHub: https://github.com/Rupayan147
- LinkedIn: https://www.linkedin.com/in/rupayan-uiux
- Portfolio: https://rups.framer.website/
- Email: rupsbiswas147@gmail.com
