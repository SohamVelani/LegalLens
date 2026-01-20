import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, FileText, AlertTriangle, ArrowLeft } from 'lucide-react';

const ResultsDashboard = ({ analysisData, onReset }) => {
  const [displayedRisks, setDisplayedRisks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- THE "GEN-AI" TYPING EFFECT ---
  useEffect(() => {
    if (!analysisData || !analysisData.risks) return;

    if (currentIndex < analysisData.risks.length) {
      const timer = setTimeout(() => {
        setDisplayedRisks(prev => [...prev, analysisData.risks[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 800); // Reveal one risk every 0.8 seconds (Simulating AI "thinking")
      return () => clearTimeout(timer);
    }
  }, [currentIndex, analysisData]);

  // Calculate stats
  const riskCount = analysisData.risks.length;
  const highRisks = analysisData.risks.filter(r => r.type === "High Risk").length;
  const score = Math.max(0, 100 - (highRisks * 20) - (riskCount * 5));

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onReset} className="flex items-center text-gray-500 hover:text-indigo-600 transition">
          <ArrowLeft size={20} className="mr-2" /> Upload Another
        </button>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800">Contract Analysis</h2>
          <p className="text-sm text-gray-500">{analysisData.filename}</p>
        </div>
      </div>

      {/* SCORE CARD */}
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-indigo-50 mb-10 flex items-center justify-between">
        <div>
          <p className="text-gray-500 font-medium mb-1">Safety Score</p>
          <div className="text-5xl font-extrabold text-indigo-600">{score}/100</div>
        </div>
        <div className="flex gap-8">
            <div className="text-center">
                <span className="block text-2xl font-bold text-red-500">{highRisks}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Critical</span>
            </div>
            <div className="text-center">
                <span className="block text-2xl font-bold text-gray-700">{riskCount}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Total Issues</span>
            </div>
        </div>
      </div>

      {/* STREAMING RESULTS LIST */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
            <FileText size={20} /> AI Findings
        </h3>

        {displayedRisks.map((risk, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-xl border-l-4 shadow-sm bg-white animate-in slide-in-from-bottom-4 duration-500
              ${risk.type === 'High Risk' ? 'border-red-500' : 'border-yellow-500'}`}
          >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    {risk.type === 'High Risk' 
                        ? <ShieldAlert className="text-red-500" size={24} /> 
                        : <AlertTriangle className="text-yellow-500" size={24} />
                    }
                    <span className={`font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider
                        ${risk.type === 'High Risk' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-700'}`}>
                        {risk.category}
                    </span>
                </div>
                <span className="text-xs font-mono text-gray-400">Confidence: {risk.confidence}</span>
            </div>

            <p className="text-gray-800 font-medium text-lg mb-2">"{risk.text}"</p>
            <p className="text-gray-500 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                🤖 <strong>AI Analysis:</strong> {risk.explanation}
            </p>
          </div>
        ))}

        {/* LOADING INDICATOR (If still revealing) */}
        {currentIndex < analysisData.risks.length && (
            <div className="flex items-center gap-2 text-indigo-500 animate-pulse mt-4">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animation-delay-400"></div>
                <span className="text-sm font-medium">Analyzing next clause...</span>
            </div>
        )}
        
        {/* COMPLETION MESSAGE */}
        {currentIndex >= analysisData.risks.length && (
            <div className="flex items-center justify-center p-8 text-green-600 bg-green-50 rounded-xl border border-green-100 mt-8">
                <CheckCircle className="mr-2" /> Analysis Complete.
            </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDashboard;