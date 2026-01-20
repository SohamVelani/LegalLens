import cv2
import pytesseract
from pdf2image import convert_from_path
import numpy as np
from PIL import Image

# Windows tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text(file_path):
    """
    Safely extract text from PDF or image
    """
    images = []

    # 1️⃣ PDF → images
    if file_path.lower().endswith(".pdf"):
        pil_images = convert_from_path(file_path, dpi=300)
        for img in pil_images:
            images.append(np.array(img))
    else:
        img = cv2.imread(file_path)
        if img is not None:
            images.append(img)

    if not images:
        print("❌ OCR ERROR: No images extracted")
        return "", []

    full_text = ""
    blocks = []

    # 2️⃣ OCR each image
    for img in images:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        data = pytesseract.image_to_data(
            gray,
            output_type=pytesseract.Output.DICT,
            config="--oem 3 --psm 6"
        )

        for i in range(len(data["text"])):
            text = data["text"][i].strip()
            if text == "":
                continue

            conf = int(data["conf"][i]) if data["conf"][i].isdigit() else 0

            full_text += text + " "
            blocks.append({
                "text": text,
                "confidence": conf
            })

    return full_text.strip(), blocks
