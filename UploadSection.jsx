import React, { useRef, useState } from 'react';
import { Upload, Lock, FileType, X, CheckCircle, AlertCircle } from 'lucide-react';

const UploadSection = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  // --- HANDLERS ---
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const processFile = (file) => {
    if (!file) return;
    
    // Validate File Type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload PDF, PNG, or JPG.');
        return;
    }
    
    // Validate Size (10MB)
    if (file.size > 10 * 1024 * 1024) { 
        setError('File is too large (Max 10MB).');
        return;
    }
    
    setSelectedFile(file);
    setError('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation(); 
    setSelectedFile(null);
    setError('');
  };

  // --- THE TRIGGER ---
  // When user clicks "Analyze", we pass the file up to App.jsx
  const handleAnalyzeClick = (e) => {
    e.stopPropagation();
    if (selectedFile) {
        onFileSelect(selectedFile); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 animate-in fade-in duration-500">
      
      {/* Hero Text */}
      <div className="text-center max-w-2xl mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-6 uppercase tracking-wider border border-indigo-100 shadow-sm">
          <Lock className="w-3 h-3" /> No data stored permanently
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
          Contract analysis, <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">simplified & secure.</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed">
          Upload rental agreements, NDAs, or employment contracts. Our AI highlights risky clauses instantly.
        </p>
      </div>

      {/* Hidden Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.jpg,.png,.jpeg"
      />

      {/* ERROR MESSAGE (Polished UI) */}
      {error && (
        <div className="mb-6 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200 shadow-sm">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* VIEW 1: DROP ZONE */}
      {!selectedFile ? (
        <div 
          className={`group w-full max-w-xl h-72 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden
            ${isDragging 
              ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02] shadow-xl shadow-indigo-100' 
              : 'border-gray-200 bg-white hover:border-indigo-400 hover:shadow-2xl hover:shadow-gray-100 hover:-translate-y-1'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBoxClick}
        >
          <div className={`p-5 rounded-full mb-5 transition-colors duration-300 ${isDragging ? 'bg-indigo-200' : 'bg-indigo-50 group-hover:bg-indigo-100'}`}>
            <Upload className={`w-10 h-10 ${isDragging ? 'text-indigo-700' : 'text-indigo-600'}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Click to upload or drag & drop</h3>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <FileType size={14} /> PDF, JPG, or PNG (Max 10MB)
          </p>
        </div>
      ) : (
        // VIEW 2: FILE SELECTED CARD
        <div className="w-full max-w-xl bg-white rounded-3xl border border-indigo-100 shadow-2xl overflow-hidden animate-in zoom-in-50 duration-300">
            <div className="p-8 flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 text-indigo-600">
                    <FileType size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedFile.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                
                <div className="flex gap-3 w-full">
                    <button 
                        onClick={clearFile}
                        className="flex-1 py-3.5 px-6 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <X size={18} /> Remove
                    </button>
                    <button 
                        onClick={handleAnalyzeClick}
                        className="flex-[2] py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={20} /> Analyze Document
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;