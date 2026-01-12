# Data Split Strategy (v1.0)

## Dataset Types
- Unlabeled datasets (SC Judgments, General Legal Corpus) are used for language modeling and retrieval only and are not split into train/validation/test.
- The labeled Indian Contract Clauses dataset is used for supervised training and evaluation.

## Split Ratios (Labeled Data)
- Training set: 70%
- Validation set: 15%
- Test set: 15%

## Splitting Rules
- Stratified split by clause label
- Cleaning and deduplication performed before splitting
- Test set is held out and used only for final evaluation

## Rationale
This strategy ensures fair evaluation, prevents data leakage, and aligns with standard supervised learning practices.
