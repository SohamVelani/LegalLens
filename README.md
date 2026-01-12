# LegalLens – Intelligent Contract Risk Analyzer

LegalLens is a final-year capstone project that aims to help non-legal users understand and assess risks in legal contracts by automatically identifying, classifying, and explaining potentially harmful clauses using AI and NLP techniques.

---

## Project Status

**Phase 1: Design & Planning – Completed ✅**

The initial design and planning phase of the project has been completed. This phase focused on defining the system architecture, data strategy, and core design decisions before beginning implementation.

---

## Phase 1 Deliverables

The following key design decisions have been finalized and documented:

### 1. Clause Taxonomy
A fixed and versioned clause taxonomy has been defined to ensure consistent labeling across preprocessing, training, and inference.

- File: `clause_taxonomy_v1.json`
- Purpose: Defines the allowed clause categories for classification and risk analysis

### 2. Text Granularity Specification
The unit of text processing has been finalized to avoid ambiguity during preprocessing and model training.

- File: `text_granularity_v1.md`
- Decision: One training and inference sample corresponds to a single legal clause or paragraph

### 3. Data Split Strategy
A clear strategy for training, validation, and testing has been defined to prevent data leakage and ensure fair evaluation.

- File: `data_split_strategy_v1.md`
- Labeled data split: 70% Train / 15% Validation / 15% Test (stratified)
- Unlabeled data: Used only for representation learning and retrieval

---

## Datasets

The project uses publicly available legal datasets during the offline training phase (Google Colab):

- Indian Supreme Court Judgments (1950–2024)
- General Legal Text Corpus
- Indian Legal Contract Clauses Dataset

> Note: These datasets are used only for offline training and evaluation. User-uploaded documents are never used for model training.

---

## Privacy Considerations

- User documents are processed only during inference
- No user data is retained beyond a limited time window
- No user documents are used for future model training
- All design decisions follow a privacy-first approach

---

## Next Steps

**Phase 2: Data Engineering & Preprocessing**

- Exploratory data analysis (EDA)
- Text cleaning and normalization
- Paragraph-level segmentation
- Preparation of training-ready datasets
- Model training and evaluation

---

## Repository Structure (Early Stage)

