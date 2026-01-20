import React from 'react';
import { Shield, Zap, Eye, FileText, ArrowRight, Check, Lock } from 'lucide-react';

// Added onSampleClick prop
const LandingPage = ({ onStart, onSampleClick }) => {
  return (
    <div className="min-h-screen bg-white font-sans animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 text-xs font-bold mb-8 uppercase tracking-wider hover:border-indigo-300 transition-colors">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            v1.0 Now Live
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight">
            Review contracts <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              at the speed of AI.
            </span>
          </h1>
          
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Don't sign blindly. LegalLens instantly highlights risky clauses in rental agreements, NDAs, and employment offers.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 hover:scale-105 transition-all shadow-xl flex items-center gap-2"
            >
              Start Analysis For Free <ArrowRight size={18} />
            </button>
            
            {/* Sample Report Button */}
            <button 
              onClick={onSampleClick}
              className="px-8 py-4 bg-white text-gray-700 font-bold rounded-full border border-gray-200 hover:bg-gray-50 transition-all shadow-sm hover:border-indigo-300"
            >
              View Sample Report
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid (Same as before) */}
      <div className="py-24 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to sign safely</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="relative z-10">
                <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                  <Eye size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">X-Ray Vision for Contracts</h3>
                <p className="text-gray-500 max-w-md">
                  Our LayoutLMv3 model sees documents like a human does. It identifies headers, tables, and fine print that other tools miss.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-64 h-48 bg-gray-50 rounded-tl-3xl border-t border-l border-gray-100 p-4 group-hover:scale-105 transition-transform">
                <div className="space-y-3">
                  <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                  <div className="h-2 w-full bg-red-100 rounded border-l-2 border-red-500"></div>
                  <div className="h-2 w-5/6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group cursor-default transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-400 hover:-translate-y-1">
              
              {/* Hover Glare Effect */}
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-all duration-700 group-hover:left-[100%]"></div>
              
              <div className="relative z-10">
                <div className="mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 origin-left">
                  <Shield size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Privacy by Design</h3>
                <p className="text-indigo-100 text-sm leading-relaxed mb-6 group-hover:text-white transition-colors">
                  We don't train on your data. Documents are encrypted and auto-deleted after 30 days.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-indigo-500/50 w-fit px-3 py-1 rounded-full border border-indigo-400/30 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                  <Lock size={10} /> End-to-End Secure
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl group-hover:bg-indigo-400 transition-colors duration-500"></div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-green-600">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Answers</h3>
              <p className="text-gray-500 text-sm">
                Built-in RAG chatbot lets you ask "Can they raise my rent?" and get cited answers instantly.
              </p>
            </div>

            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Supported Documents</h3>
                <div className="flex gap-2 flex-wrap">
                  {['Rental Agreements', 'NDAs', 'Employment', 'Service Contracts'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <FileText className="text-gray-300 hidden md:block" size={48} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;