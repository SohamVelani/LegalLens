import cv2
import numpy as np
import os

def preprocess_image(image_path):
    """
    Stage 1: The Cleaner 
    Applies computer vision techniques to prepare the document for OCR.
    
    Steps taken from Research Report:
    1. Grayscale Conversion
    2. Denoising (Removing grain/dots)
    3. Binarization (High contrast Black & White)
    4. Deskewing (Straightening rotated images)
    """
    
    # 1. Load the Image
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at: {image_path}")
        
    img = cv2.imread(image_path)
    
    # 2. Convert to Grayscale
    # Color noise distracts the AI. We only need structure and text.
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 3. Denoise
    # Removes small "salt and pepper" noise from scanning/camera quality
    denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
    
    # 4. Binarization (Thresholding)
    # Turns the image strictly Black and White (no grey). 
    # This makes text pop out against the background.
    _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # 5. Deskewing (Rotation Correction)
    # If the user took a slanted photo, we calculate the angle and rotate it back.
    coords = np.column_stack(np.where(binary > 0))
    angle = cv2.minAreaRect(coords)[-1]
    
    # Adjust angle format for OpenCV
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
        
    # Rotate only if the skew is significant (> 0.5 degrees)
    if abs(angle) > 0.5:
        (h, w) = binary.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(binary, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        final_image = rotated
        print(f"🔄 Corrected skew by {angle:.2f} degrees.")
    else:
        final_image = binary
        print("✅ Image is already straight.")

    return final_image

# --- QUICK TEST BLOCK ---
# This allows us to test this file individually before building the rest.
if __name__ == "__main__":
    # Create a dummy test file to check if opencv works
    test_path = "test_doc.jpg"
    
    # Create a black image with some text if it doesn't exist
    if not os.path.exists(test_path):
        blank_image = np.zeros((500, 500, 3), np.uint8)
        cv2.putText(blank_image, 'LegalLens Test', (50, 250), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.imwrite(test_path, blank_image)
        print("created temporary test image.")

    try:
        processed = preprocess_image(test_path)
        print("Success! Preprocessing pipeline is working.")
        # Clean up
        if os.path.exists(test_path):
            os.remove(test_path)
    except Exception as e:
        print(f"Error: {e}")