import React from 'react';
import { Shield } from 'lucide-react';

// Added onStartClick prop
const Navbar = ({ onHomeClick, onAboutClick, onStartClick }) => {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <button 
        onClick={onHomeClick} 
        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
      >
        <div className="bg-indigo-600 p-2 rounded-lg shadow-md shadow-indigo-200">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">LegalLens</span>
      </button>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <button onClick={onHomeClick} className="hover:text-indigo-600 transition">Home</button>
        <button onClick={onAboutClick} className="hover:text-indigo-600 transition">About Us</button>
        
        <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-wider border border-indigo-100">
          <Shield size={12} /> Privacy First
        </span>
        
        {/* Update: This button now triggers onStartClick */}
        <button 
          onClick={onStartClick}
          className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;