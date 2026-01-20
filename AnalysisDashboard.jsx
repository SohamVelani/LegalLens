import React, { useState, useEffect } from 'react';
import { 
  FileText, Activity, MessageSquare, X, ChevronRight, Shield, 
  AlertTriangle, CheckCircle, Lightbulb, ScanLine, Info, 
  BrainCircuit, ZoomIn, ZoomOut, Maximize2 
} from 'lucide-react';

const AnalysisDashboard = ({ file, onHomeClick, isSample = false, analysisData }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);

  // 1. Create a clean preview URL for real files
  useEffect(() => {
    if (file && !isSample) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup to avoid memory leaks
    }
  }, [file, isSample]);

  const displayFile = file || { name: "Rental_Agreement_Sample.pdf" };

  // --- 2. LOGIC: Switch between Sample, Real, or Loading Data ---
  let verdict, risks;

  if (isSample) {
    // A. Hardcoded Sample Data
    verdict = {
      score: 65,
      status: "Caution Advised",
      summary: "High deviation from standard Indian rental templates detected. Primary risks involve financial liability and termination conditions.",
      action: "Negotiate Clause 7.2 (Rent Revision) and Clause 4.1 (Deposit)."
    };
    risks = [
       { id: 1, type: 'High Risk', model_source: 'SBERT Anomaly Detector', confidence: '98%', category: 'Rent Revision', clause: 'Clause 7.2', text: 'Rent may be increased by 20% annually without prior notice.', explanation: 'Unilateral rent increase >10% without notice is statistically rare.', color: 'red' },
       { id: 2, type: 'Medium Risk', model_source: 'Legal-BERT Classifier', confidence: '85%', category: 'Deposit Retention', clause: 'Clause 4.1', text: 'Landlord may retain deposit for general wear and tear.', explanation: 'Vague terminology. Standard norms require "damages beyond normal wear".', color: 'amber' },
       { id: 3, type: 'Safe', model_source: 'Rule-Based Check', confidence: '100%', category: 'Termination', clause: 'Clause 9.0', text: 'Either party may terminate with 2 months notice.', explanation: 'Standard Notice Period.', color: 'green' }
    ];
  } else if (analysisData) {
    // B. REAL DATA FROM BACKEND (Dynamic Calculation)
    const rawRisks = analysisData.risks || [];
    
    // 1. Calculate Score Dynamically
    const highRiskCount = rawRisks.filter(r => r.type === "High Risk").length;
    const mediumRiskCount = rawRisks.length - highRiskCount;
    const calculatedScore = Math.max(0, 100 - (highRiskCount * 20) - (mediumRiskCount * 5));

    // 2. Determine Status & Action based on score
    let derivedStatus = "Safe to Sign";
    let derivedAction = "No major issues found.";
    
    if (calculatedScore < 60) {
        derivedStatus = "Critical Issues";
        derivedAction = "Legal review strongly recommended before signing.";
    } else if (calculatedScore < 85) {
        derivedStatus = "Caution Advised";
        derivedAction = "Negotiate highlighted clauses.";
    }

    // 3. Populate Verdict Object
    verdict = {
      score: calculatedScore,
      status: derivedStatus,
      summary: analysisData.summary || `Found ${highRiskCount} critical issues and ${mediumRiskCount} warnings in this document.`,
      action: derivedAction
    };

    // 4. Map Backend Risks to UI Format (Adding colors & icons)
    risks = rawRisks.map((risk, index) => ({
        id: index,
        type: risk.type, // 'High Risk' or 'Medium Risk'
        model_source: 'LegalLens AI', // Or specific model if backend sends it
        confidence: risk.confidence,
        category: risk.category,
        clause: `Segment ${index + 1}`, // Fallback if backend doesn't send clause numbers
        text: risk.text,
        explanation: risk.explanation,
        // UI Logic for Colors
        color: risk.type === 'High Risk' ? 'red' : 'amber' 
    }));

  } else {
    // C. Fallback (Loading or Error)
    verdict = { score: 0, status: "Analyzing...", summary: "Waiting for AI results...", action: "Please wait." };
    risks = [];
  }

  // --- UI RENDER (EXACTLY AS PROVIDED) ---
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 font-sans">
      
      {/* Sample Banner */}
      {isSample && (
        <div className="bg-indigo-600 text-white text-center text-sm font-bold py-2 shadow-md relative z-10 shrink-0">
          Viewing Sample Report. No file was uploaded.
        </div>
      )}
      
      {/* Main Content Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* LEFT COLUMN: The "Pretty" Document Viewer */}
        <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-200 overflow-hidden flex flex-col h-full relative group ring-1 ring-gray-100">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white/90 backdrop-blur-sm z-20">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-50 p-2 rounded-lg">
                 <FileText className="w-4 h-4 text-indigo-600" /> 
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm truncate max-w-[200px]">{displayFile.name}</h3>
                <p className="text-[10px] text-gray-400 font-medium">LayoutLMv3 Processing • 1.2MB</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 animate-pulse">
                <ScanLine size={10}/> Analyzing
              </span>
              <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>
              <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"><ZoomOut size={14}/></button>
              <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"><ZoomIn size={14}/></button>
              <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"><Maximize2 size={14}/></button>
            </div>
          </div>
          
          {/* Viewer Container */}
          <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col items-center">
            
            {/* SCANNING LASER OVERLAY */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
               <div className="w-full h-1 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)] absolute animate-scan"></div>
            </div>

            {/* REAL FILE VIEWER */}
            {!isSample && fileUrl && (
              <div className="w-full h-full relative">
                 <iframe 
                   src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                   className="w-full h-full custom-scrollbar block"
                   title="PDF Viewer"
                 />
                 <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-0"></div>
              </div>
            )}

            {/* SAMPLE REPORT VIEWER */}
            {isSample && (
              <div className="w-full h-full overflow-y-auto custom-scrollbar p-8">
                <div className="bg-white shadow-2xl min-h-[800px] w-full max-w-[600px] mx-auto p-12 text-xs text-gray-800 select-none relative transition-transform origin-top duration-500 border border-gray-100">
                  <div className="text-center mb-10">
                    <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2 uppercase tracking-widest inline-block border-b-2 border-gray-900 pb-2">Rental Agreement</h1>
                    <p className="text-gray-400 font-serif italic mt-2">Ref: #2026-LL-IND</p>
                  </div>
                  <div className="space-y-8 font-serif leading-relaxed text-justify text-gray-600">
                    <p><span className="font-bold text-gray-900">THIS AGREEMENT</span> is made on this 14th day of January, 2026, BETWEEN the Landlord mentioned in Schedule A AND the Tenant mentioned in Schedule B.</p>
                    <div className="h-4 bg-gray-100 w-full rounded-sm"></div>
                    
                    <div className="relative pl-6 py-2 bg-amber-50/50 rounded-r-lg border-l-4 border-amber-400">
                      <p className="font-bold text-gray-900 mb-1 text-sm">4. DEPOSIT & CHARGES</p>
                      <p className="text-gray-800">4.1 Landlord may retain deposit for general wear and tear.</p>
                    </div>

                    <div className="h-4 bg-gray-100 w-5/6 rounded-sm"></div>

                    <div className="relative pl-6 py-2 bg-red-50/50 rounded-r-lg border-l-4 border-red-500">
                      <p className="font-bold text-gray-900 mb-1 text-sm">7. RENT REVISION</p>
                      <p className="text-gray-800">7.2 Rent may be increased by 20% annually without prior notice.</p>
                    </div>

                    <div className="h-4 bg-gray-100 w-full rounded-sm"></div>
                    <div className="relative mt-4"><p className="font-bold text-gray-900 mb-1">9. TERMINATION</p><p>9.0 Either party may terminate with 2 months notice.</p></div>
                    
                    <div className="flex justify-between mt-20 pt-10 border-t border-gray-200">
                      <div className="text-center"><div className="h-10 w-40 bg-gray-50 border-b-2 border-gray-300 mb-2"></div><p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Landlord</p></div>
                      <div className="text-center"><div className="h-10 w-40 bg-gray-50 border-b-2 border-gray-300 mb-2"></div><p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Tenant</p></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Analysis & Explainability */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full overflow-hidden">
          
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Total Risk Score</div>
              <div className="text-3xl font-extrabold text-amber-500 flex items-center gap-2">
                {verdict.score}<span className="text-sm text-gray-400 font-medium">/100</span>
                <Activity className="w-5 h-5 opacity-50" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Clauses Analyzed</div>
              <div className="text-3xl font-extrabold text-indigo-600">{risks.length}</div>
            </div>
          </div>

          {/* AI Verdict Box */}
          <div className="bg-indigo-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden shrink-0">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-3">
                 <div className="bg-indigo-700 p-1.5 rounded-lg"><Lightbulb size={16} className="text-yellow-300"/></div>
                 <h3 className="font-bold text-sm tracking-wide">AI VERDICT: {verdict.status}</h3>
               </div>
               <p className="text-indigo-100 text-xs leading-relaxed mb-4 border-b border-indigo-700 pb-3">{verdict.summary}</p>
               <div>
                 <p className="text-[10px] uppercase font-bold text-indigo-300 mb-1">Recommended Action:</p>
                 <p className="text-xs font-medium text-white flex items-start gap-2"><CheckCircle size={14} className="mt-0.5 text-green-400 shrink-0"/> {verdict.action}</p>
               </div>
             </div>
          </div>

          {/* Risk Breakdown List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-gray-800">Clause Analysis</h3>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 flex items-center gap-1">
                <BrainCircuit size={12}/> Models Active
              </span>
            </div>
            <div className="overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {risks.map((risk) => (
                <div key={risk.id} className={`p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer group relative
                  ${risk.color === 'red' ? 'bg-red-50/50 border-red-100 hover:border-red-200' : 
                    risk.color === 'amber' ? 'bg-amber-50/50 border-amber-100 hover:border-amber-200' : 
                    'bg-green-50/50 border-green-100 hover:border-green-200'}`}>
                  
                  <div className="absolute top-4 right-4 text-[10px] text-gray-400 font-mono">
                    {risk.confidence} Confidence
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider
                        ${risk.color === 'red' ? 'bg-red-200 text-red-800' : 
                          risk.color === 'amber' ? 'bg-amber-200 text-amber-800' : 
                          'bg-green-200 text-green-800'}`}>
                        {risk.type}
                      </span>
                      <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                          • {risk.model_source}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{risk.category}</h4>
                  <p className="text-xs text-gray-500 font-mono mb-3 bg-white/50 p-1 rounded inline-block border border-gray-100">{risk.clause}</p>
                  <div className="flex gap-3 items-start">
                    <div className={`mt-1 min-w-[3px] h-full rounded-full ${
                      risk.color === 'red' ? 'bg-red-400' : risk.color === 'amber' ? 'bg-amber-400' : 'bg-green-400'
                    }`}></div>
                    <div className="space-y-2">
                        <p className="text-xs text-gray-800 italic">"{risk.text}"</p>
                        <p className="text-xs text-gray-600 leading-relaxed bg-white p-2 rounded border border-gray-100 shadow-sm">
                          <span className="font-bold text-indigo-600 block text-[10px] uppercase mb-1 flex items-center gap-1">
                            <Info size={10}/> AI Rationale
                          </span> 
                          {risk.explanation}
                        </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Widget */}
        <div className={`fixed bottom-6 right-6 flex flex-col items-end z-50 transition-all ${chatOpen ? 'w-80 md:w-96' : 'w-auto'}`}>
          {chatOpen && (
            <div className="mb-4 w-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-96 animate-in slide-in-from-bottom-10 fade-in duration-300">
              <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shadow-md shrink-0">
                <span className="font-bold text-sm flex items-center gap-2"><Shield size={14}/> LegalLens Assistant</span>
                <button onClick={() => setChatOpen(false)} className="hover:bg-indigo-500 p-1 rounded transition-colors"><X size={16} /></button>
              </div>
              <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-4 custom-scrollbar">
                <div className="bg-white border border-gray-200 self-start p-3 rounded-2xl rounded-tl-none text-xs text-gray-700 shadow-sm max-w-[90%]">
                  Hello! I've analyzed <span className="font-semibold text-indigo-600">{displayFile.name}</span>. I found potential risks. Ask me anything!
                </div>
              </div>
              <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <input type="text" placeholder="Ask a legal question..." className="bg-transparent text-sm w-full outline-none text-gray-700 placeholder-gray-400"/>
                  <button className="text-indigo-600 hover:text-indigo-800 p-1"><ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          )}
          <button onClick={() => setChatOpen(!chatOpen)} className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl shadow-indigo-200 hover:scale-105 transition-all flex items-center gap-2 group active:scale-95"><MessageSquare className="w-6 h-6" />{!chatOpen && <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-medium whitespace-nowrap pl-0 group-hover:pl-2">Ask AI</span>}</button>
        </div>
      </main>
    </div>
  );
};

export default AnalysisDashboard;