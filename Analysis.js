const mongoose = require('mongoose');

// Schema for individual risks (matches your Frontend UI)
const RiskSchema = new mongoose.Schema({
  type: String,         // "High Risk"
  model_source: String, // "SBERT Anomaly Detector"
  confidence: String,   // "98%"
  category: String,     // "Rent Revision"
  clause: String,       // "Clause 7.2"
  text: String,         // The risky text
  explanation: String,  // AI reasoning
  color: String         // red, amber, green
});

const AnalysisSchema = new mongoose.Schema({
  // Metadata
  originalName: { type: String, required: true }, // "contract.pdf"
  storedFilename: { type: String, required: true }, // "1738493_contract.pdf" (Unique name)
  filePath: { type: String, required: true },     // "uploads/1738493_contract.pdf"
  fileType: { type: String },                     // "application/pdf"
  
  // The AI Verdict
  verdict: {
    score: Number,
    status: String,
    summary: String,
    action: String
  },

  // The Risks Found
  risks: [RiskSchema],

  // PRIVACY: Auto-delete after 30 days [cite: 54]
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 2592000 // 30 Days in seconds
  }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);