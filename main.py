import torch

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid

import preprocess
import ocr_engine
from classifier import ClauseClassifier
from risk_detector import RiskDetector
import re
app = FastAPI()

# 1. Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Load Models
print("⏳ Loading AI Models... Please wait.")
classifier = ClauseClassifier()
judge = RiskDetector()
print("✅ LegalLens AI Service is Ready!")

@app.get("/")
def home():
    return {"status": "LegalLens AI is Active"}

@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):
    """
    The Master Pipeline:
    1. Save File -> 2. Preprocess -> 3. OCR -> 4. Classify -> 5. Detect Risk
    """
    request_id = str(uuid.uuid4())
    temp_filename = f"temp_{request_id}_{file.filename}"
    
    try:
        # Step 1: Save
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print(f"📄 Processing: {file.filename}")

        # Step 2: Preprocessing
        cleaned_image = preprocess.preprocess_image(temp_filename)
        
        # Step 3: OCR
        full_text, text_blocks = ocr_engine.extract_text(cleaned_image)
        print(f"🔍 OCR Found {len(text_blocks)} text blocks.")
        
        # Step 4 & 5: Analysis
        analyzed_risks = []
        
        for idx, block in enumerate(text_blocks):
            text = block['text']
            
            # Filter out tiny noise (page numbers, etc.)
            if len(text) < 5: continue

            # A. Classify
            category, confidence = classifier.classify_block(text)
            
            # DEBUG LOG (See what's happening in Terminal)
            print(f"   👉 Block: '{text[:20]}...' | Cat: {category} | Conf: {confidence}%")

            # --- IMPROVED LOGIC ---
            
            current_risk = None

            # Path 1: High Confidence AI Prediction
            # We lowered the threshold from 50 -> 35 to catch more clauses
            if confidence > 35: 
                current_risk = judge.analyze_risk(category, text)

            # Path 2: Safety Net (Keyword Check)
            # If AI missed it (low confidence), but text has "danger words", force a check.
            elif any(word in text.lower() for word in ['terminate', 'indemnify', 'increase', 'retain', 'evict', 'penalty']):
                print(f"   ⚠️ Keyword Triggered Safety Net for: {text[:15]}...")
                # Force the judge to look at it as a potential risk
                current_risk = judge.analyze_risk("Potential Clause", text)

            # If we found a risk in either path, save it
            if current_risk and current_risk['score'] > 0:
                analyzed_risks.append({
                    "id": idx + 1,
                    "category": category if confidence > 35 else "General Clause", # Fallback name
                    "text": text,
                    "confidence": f"{confidence}%",
                    "type": current_risk['level'],
                    "score": current_risk['score'],
                    "explanation": current_risk['explanation']
                })

        # Cleanup
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        
        print(f"✅ Found {len(analyzed_risks)} risks.")

        return {
            "filename": file.filename,
            "summary": f"Scanned {len(text_blocks)} text blocks. Found {len(analyzed_risks)} issues.",
            "risks": analyzed_risks
        }

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)