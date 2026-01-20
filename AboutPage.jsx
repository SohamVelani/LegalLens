import React from 'react';
import { Shield, Users, Zap, Search, ArrowRight, FileText, CheckCircle } from 'lucide-react';

const AboutPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-50 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-6 uppercase tracking-wider">
            <Users size={12} /> For the People
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
            Legal clarity, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">without the hourly rate.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            We believe you shouldn't need a law degree to understand what you're signing. 
            LegalLens uses advanced AI to scan your documents, highlight risks, and explain them in plain English.
          </p>
          <button 
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-200"
          >
            Scan a Document Now <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* The Problem & Solution Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The "Hidden Clause" Problem</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              In today's digital economy, we sign dozens of contracts—rental agreements, job offers, service policies—often without reading them. 
              <span className="font-semibold text-gray-800"> Why? Because hiring a lawyer for every document is expensive and time-consuming.</span>
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              This leaves many of us vulnerable to hidden clauses like excessive deposits, unfair termination rules, or automatic renewals.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-red-100 p-2 rounded-lg h-fit"><FileText className="text-red-600" size={20}/></div>
                <div>
                  <h4 className="font-bold text-gray-800">Complex Legalese</h4>
                  <p className="text-sm text-gray-500">Documents full of jargon designed to confuse non-experts.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-amber-100 p-2 rounded-lg h-fit"><Search className="text-amber-600" size={20}/></div>
                <div>
                  <h4 className="font-bold text-gray-800">Hidden Risks</h4>
                  <p className="text-sm text-gray-500">Unfavorable terms buried in pages of text.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h3 className="text-2xl font-bold text-indigo-900 mb-6">Our Solution</h3>
            <ul className="space-y-6">
              {[
                "Instant AI Analysis: Upload a photo or PDF and get results in seconds.",
                "Clause-Level Risk Detection: We don't just summarize; we flag specific risky paragraphs.",
                "Plain English Explanations: We translate 'legalese' into simple language you can understand.",
                "Privacy First: Your documents are never used for training and are auto-deleted in 30 days."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="text-indigo-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Trust LegalLens?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We combine cutting-edge AI with strict ethical standards to ensure you get safe, reliable insights.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors">
              <div className="bg-indigo-500/20 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
                <Zap className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Speed & Efficiency</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Skip the appointment wait times. Get an immediate review of your contract so you can sign (or negotiate) with confidence today.
              </p>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors">
              <div className="bg-indigo-500/20 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
                <Shield className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Privacy Guarantee</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We respect your data. Your documents are encrypted, processed in a stateless environment, and permanently deleted after 30 days.
              </p>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors">
              <div className="bg-indigo-500/20 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
                <Search className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Transparent AI</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                No "black box" decisions. We show you exactly which clause triggered a risk alert and explain why it deviates from standard norms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;