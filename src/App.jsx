import React from 'react';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Decorative Gradient Blob */}
      <div className="fixed top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Antigravity</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Portfolio Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-6">
              <span className="text-sm font-bold text-slate-400 hover:text-indigo-600 cursor-default transition-colors">Market Analysis</span>
              <span className="text-sm font-bold text-slate-400 hover:text-indigo-600 cursor-default transition-colors">Global Assets</span>
            </nav>
            <div className="h-8 w-[1px] bg-slate-100 hidden md:block"></div>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                 <img src="https://ui-avatars.com/api/?name=Value+Fy&background=4F46E5&color=fff" alt="User" />
               </div>
               <span className="text-sm font-bold text-slate-700 hidden sm:block">Advisor Dashboard</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 pt-10 relative">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
