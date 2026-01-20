from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import os

class ClauseClassifier:
    def __init__(self):
        # We look for the model YOU just trained
        self.model_path = "./saved_models/clause_model"
        
        # Fallback to base model if training didn't happen (prevents crash)
        if not os.path.exists(self.model_path):
            print("⚠️ Trained model not found. Using base InLegalBERT (Untrained).")
            print("👉 PLEASE RUN 'python train_classifier.py' FIRST.")
            self.model_name = "law-ai/InLegalBERT"
        else:
            print("🧠 Loading Fine-Tuned Model from: " + self.model_path)
            self.model_name = self.model_path

        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name)
        
        # These labels match the IDs from your training script
        self.id2label = {0: "Termination", 1: "Rent", 2: "Indemnity", 3: "Notice", 4: "Deposit"}

    def classify_block(self, text):
        """
        Uses the Neural Network to predict the class.
        No if-statements, just pure probability.
        """
        # 1. Convert text to numbers
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
        
        # 2. Feed to Model
        with torch.no_grad():
            outputs = self.model(**inputs)
        
        # 3. Get Probabilities (Softmax)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
        # 4. Find the winner
        confidence, predicted_id = torch.max(probs, dim=1)
        
        predicted_label = self.id2label.get(predicted_id.item(), "General")
        confidence_score = round(confidence.item() * 100, 2)

        return predicted_label, confidence_score

# --- TEST BLOCK ---
if __name__ == "__main__":
    classifier = ClauseClassifier()
    
    # New text the model has NEVER seen (to test generalization)
    test_text = "The lessee is obligated to remit payment by the first week of every month."
    
    label, conf = classifier.classify_block(test_text)
    print(f"\nText: {test_text}")
    print(f"Prediction: {label} (Confidence: {conf}%)")
    
    test_text_2 = "This contract can be voided if the tenant destroys property."
    label, conf = classifier.classify_block(test_text_2)
    print(f"\nText: {test_text_2}")
    print(f"Prediction: {label} (Confidence: {conf}%)") 