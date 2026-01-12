# Text Granularity Specification (v1.0)

## Definition
One training and inference sample corresponds to a single logical legal clause or paragraph.

## Granularity Rules
- Unit: Paragraph / Clause-level text
- Minimum length: 50 characters
- Maximum size: 512 tokens
- Preferred size: 1–3 sentences

## Rationale
Sentence-level granularity loses legal intent, while document-level granularity is too coarse.
Paragraph-level granularity preserves clause semantics and supports explainable risk analysis.

## Applies To
- Clause Classification (Legal-BERT)
- Risk Detection (SBERT similarity)
- Legal Q&A (RAG chunking)
