import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from torch.utils.data import Dataset
import os
import shutil

# --- CONFIGURATION ---
MODEL_NAME = "law-ai/InLegalBERT"
OUTPUT_DIR = "./saved_models/clause_model"

# --- THE DATASET (50+ Curated Examples) ---
# We use this list to guarantee the script runs without needing external CSV files.
train_data = [
    # 0: TERMINATION
    ("The landlord may terminate this agreement with 30 days notice.", 0),
    ("This lease shall determine absolutely upon the expiry of the term.", 0),
    ("Either party can cancel this contract for breach of terms.", 0),
    ("The agreement will automatically end if rent is unpaid for 2 months.", 0),
    ("Lessor reserves the right to evict the lessee for illegal activities.", 0),
    ("Upon termination, the tenant must vacate the premises immediately.", 0),
    ("This contract is valid for 11 months and ends thereafter.", 0),
    ("Premature termination attracts a penalty of two months' rent.", 0),
    ("The owner has the right to rescind this contract at will.", 0),
    ("Termination of services requires a formal written letter.", 0),
    ("The lease terminates automatically on 31st March.", 0),
    ("Failure to comply with rules results in immediate cancellation.", 0),

    # 1: RENT & PAYMENT
    ("The monthly rent shall be INR 25,000 payable in advance.", 1),
    ("Tenant agrees to pay the rent via bank transfer by the 5th.", 1),
    ("Failure to pay rent may attract a penalty of 18%.", 1),
    ("The Licensee shall pay the Licensor a monthly fee of Rs 10,000.", 1),
    ("Rent is subject to a 5% escalation every year.", 1),
    ("All payments must be made via NEFT or RTGS only.", 1),
    ("Cheques should be made payable to the Landlord.", 1),
    ("Any delay in payment will incur a late fee of Rs 500 per day.", 1),
    ("The rent excludes electricity and water maintenance charges.", 1),
    ("Base rent is fixed for the first two years of the tenure.", 1),
    ("The lessee must pay rent on or before the 10th of each month.", 1),

    # 2: INDEMNITY & LIABILITY
    ("Tenant shall indemnify the Landlord against all losses and damages.", 2),
    ("The Landlord is not liable for theft or damage to Tenant's property.", 2),
    ("The Lessee agrees to hold the Lessor harmless from any claims.", 2),
    ("Any structural damage caused by the tenant must be reimbursed.", 2),
    ("The owner is not responsible for fire or natural calamities.", 2),
    ("Tenant takes full responsibility for any accidents on the premises.", 2),
    ("Indemnification covers all legal costs incurred by the owner.", 2),
    ("The tenant is liable for damages to fixtures and furniture.", 2),
    ("Lessor is not accountable for third-party disputes.", 2),
    ("The occupant assumes all risk associated with the property.", 2),

    # 3: NOTICE PERIOD
    ("A written notice of three months is required for early exit.", 3),
    ("The lock-in period is 12 months; no notice allowed during this time.", 3),
    ("Either party must serve a 60-day notice prior to vacating.", 3),
    ("Failure to serve notice will result in forfeiture of deposit.", 3),
    ("Notice period is waived if the building is deemed unsafe.", 3),
    ("One month notice is mandatory for lease renewal.", 3),
    ("The tenant must inform the landlord 30 days in advance.", 3),
    ("Short notice periods are not accepted under this agreement.", 3),
    ("Notice must be sent via Registered Post with Acknowledgement Due.", 3),
    ("The notice period commences from the 1st of the subsequent month.", 3),

    # 4: SECURITY DEPOSIT
    ("A security deposit equivalent to 6 months rent is required.", 4),
    ("The deposit will be refunded interest-free after vacating.", 4),
    ("Landlord may deduct repair costs from the security deposit.", 4),
    ("The advance amount is fully refundable upon handover of keys.", 4),
    ("Security deposit cannot be adjusted against the last month's rent.", 4),
    ("The tenant has paid Rs 1,00,000 as an interest-free security deposit.", 4),
    ("Deductions for painting will be made from the deposit.", 4),
    ("The balance of the deposit shall be returned within 15 days.", 4),
    ("No interest is payable on the security amount held by the owner.", 4),
    ("The deposit serves as security for the due performance of terms.", 4)
]

class LegalDataset(Dataset):
    def __init__(self, data, tokenizer):
        self.encodings = tokenizer([d[0] for d in data], truncation=True, padding=True, max_length=128)
        self.labels = [d[1] for d in data]

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

def train():
    print("🚀 Starting Training Process (Fine-Tuning InLegalBERT)...")
    
    # 1. Prepare Model & Tokenizer
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=5)
    
    dataset = LegalDataset(train_data, tokenizer)

    # 2. Training Arguments
    # Optimized for speed and accuracy on your machine
    training_args = TrainingArguments(
        output_dir='./results',
        num_train_epochs=10,              # Increased to 10 for better learning
        per_device_train_batch_size=4,    # Increased batch size slightly
        logging_dir='./logs',
        logging_steps=5,
        save_strategy="no",
        use_cpu=False if torch.cuda.is_available() else True
    )

    # 3. The Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset,
    )

    # 4. Train!
    print(f"🧠 Training on {len(train_data)} examples...")
    trainer.train()

    # 5. Save
    print(f"💾 Saving fine-tuned model to {OUTPUT_DIR}...")
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    
    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    print("✅ Training Complete. The 'Brain' is much smarter now.")

if __name__ == "__main__":
    train()