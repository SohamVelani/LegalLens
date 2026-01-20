import re

class RiskDetector:
    def __init__(self):
        print("⚖️  Risk Detector (The Judge) Initialized...")
        
        # Risk thresholds based on Indian Market Standards
        self.THRESHOLDS = {
            "notice_period_min": 30,      # Less than 30 days is risky
            "lock_in_period_max": 12,     # More than 12 months is risky
            "security_deposit_max": 3,    # More than 3 months rent is risky
            "rent_increase_max": 10       # More than 10% per year is risky
        }

    def extract_number(self, text):
        """Helper to find numbers (like '2 months', '10%') in text"""
        # Finds digits, even if they are like "two" or "2" (simplified for now to digits)
        matches = re.findall(r'\d+', text)
        if matches:
            return float(matches[0])
        return 0

    def analyze_risk(self, label, text):
        """
        Input: Clause Label (e.g. 'Notice'), Clause Text
        Output: Risk Score (0-100), Level, Explanation
        """
        text_lower = text.lower()
        risk_score = 0
        reasons = []
        
        # --- RULE 1: NOTICE PERIOD RISKS  ---
        if label == "Notice":
            days = self.extract_number(text)
            # If identified as months, convert to days
            if "month" in text_lower:
                days = days * 30
                
            if 0 < days < self.THRESHOLDS["notice_period_min"]:
                risk_score = 85
                reasons.append(f"Notice period of {int(days)} days is too short (Standard: 30+ days).")
            elif "waived" in text_lower or "immediate" in text_lower:
                risk_score = 95
                reasons.append("Clause suggests Notice Period can be waived/immediate (High Risk).")
            else:
                reasons.append("Notice period appears standard.")

        # --- RULE 2: SECURITY DEPOSIT RISKS  ---
        elif label == "Deposit":
            months = self.extract_number(text)
            if "rupees" in text_lower or "rs" in text_lower:
                # If it's a raw number like 100000, we can't judge without rent amount.
                reasons.append("Check if deposit amount > 3x monthly rent.")
            elif months > self.THRESHOLDS["security_deposit_max"]:
                risk_score = 80
                reasons.append(f"Security deposit of {int(months)} months is high (Standard: 2-3 months).")
            elif "non-refundable" in text_lower:
                risk_score = 100
                reasons.append("Deposit is marked as 'Non-Refundable'. This is illegal in many jurisdictions.")

        # --- RULE 3: INDEMNITY & LIABILITY  ---
        elif label == "Indemnity":
            if "all losses" in text_lower or "any damage" in text_lower:
                risk_score = 75
                reasons.append("Broad indemnity clause: Makes you liable for 'all' damages, even accidental.")
            if "tenant's cost" in text_lower:
                risk_score = 60
                reasons.append("Forces tenant to pay for repairs that might be structural.")

        # --- RULE 4: TERMINATION  ---
        elif label == "Termination":
            if "at will" in text_lower or "without cause" in text_lower:
                risk_score = 90
                reasons.append("Landlord can terminate 'at will' (Unstable tenancy).")
            if "forfeit" in text_lower:
                risk_score = 80
                reasons.append("Clause mentions forfeiture of deposit on termination.")

        # --- DEFAULT LOW RISK ---
        if risk_score == 0:
            return {"score": 10, "level": "Low Risk", "explanation": "Clause appears standard."}
        elif risk_score < 70:
            return {"score": risk_score, "level": "Medium Risk", "explanation": " ".join(reasons)}
        else:
            return {"score": risk_score, "level": "High Risk", "explanation": " ".join(reasons)}

# --- TEST BLOCK ---
if __name__ == "__main__":
    judge = RiskDetector()
    
    test_cases = [
        ("Notice", "The tenant must provide 7 days notice before leaving."),
        ("Deposit", "A security deposit of 6 months rent is required."),
        ("Termination", "Landlord can terminate this lease at will without reason."),
        ("Notice", "30 days written notice is required.")
    ]
    
    print("\n--- ⚖️  JUDGEMENT DAY ---")
    for lbl, txt in test_cases:
        result = judge.analyze_risk(lbl, txt)
        print(f"\nClause: {lbl}")
        print(f"Text: {txt}")
        print(f"Verdict: {result['level']} (Score: {result['score']})")
        print(f"Reason: {result['explanation']}")