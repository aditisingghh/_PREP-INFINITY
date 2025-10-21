from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pdfplumber
import docx
import os
import io
from typing import List

app = FastAPI()

# Allow frontend access (change "*" to ["http://localhost:3000"] for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths to artifacts
MODEL_PATH = "role_model.pkl"
VECTORIZER_PATH = "vectorizer.pkl"
LABEL_ENCODER_PATH = "label_encoder.pkl"

# Load artifacts with error handling
try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    label_encoder = joblib.load(LABEL_ENCODER_PATH)
except Exception as e:
    raise RuntimeError(f"Failed loading model artifacts: {e}")

# Helper: Extract text from resume file
def extract_text_from_bytes(filename: str, content: bytes) -> str:
    ext = os.path.splitext(filename)[-1].lower()
    text = ""
    if ext == ".pdf":
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    elif ext in [".doc", ".docx"]:
        doc = docx.Document(io.BytesIO(content))
        text = " ".join([p.text for p in doc.paragraphs])
    else:
        raise ValueError("Unsupported file format. Only .pdf, .doc, .docx supported.")
    return text

# Prediction endpoint
@app.post("/predict")
async def predict_resume(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        text = extract_text_from_bytes(file.filename, content)
    except ValueError as ve:
        raise HTTPException(status_code=415, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {e}")
    finally:
        await file.close()

    # Vectorize and predict
    try:
        features = vectorizer.transform([text])
        predictions = model.predict_proba(features)[0]
        top_indices = predictions.argsort()[-5:][::-1]
        top_roles = label_encoder.inverse_transform(top_indices)
        top_probs = predictions[top_indices]
        roles_with_probs = [[str(r), float(round(p, 3))] for r, p in zip(top_roles, top_probs)]
        return {"roles": roles_with_probs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")

# Health check endpoint
@app.get("/")
def root():
    return {"status": "ok"}

# 🟢 ADD THIS TO RUN THE SERVER
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
