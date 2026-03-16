import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditModelPortfolio({ modelAllocation, onSave }) {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (modelAllocation) {
      setAllocations(modelAllocation.map(m => ({ ...m })));
    }
  }, [modelAllocation]);

  const handleChange = (fundId, value) => {
    const numValue = parseFloat(value) || 0;
    setAllocations(prev => prev.map(a => 
      a.fundId === fundId ? { ...a, allocationPct: numValue } : a
    ));
    setSuccess('');
    setError('');
  };

  const total = allocations.reduce((sum, a) => sum + a.allocationPct, 0);
  const isBalanced = Math.abs(total - 100) < 0.01;

  const handleSave = async () => {
    if (!isBalanced) {
      setError('Total allocation must be exactly 100%.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/model-portfolio`, {
        allocations: allocations.map(a => ({ fundId: a.fundId, allocationPct: a.allocationPct }))
      });
      if (response.data.success) {
        setSuccess('Model portfolio updated successfully!');
        // Small delay to show success before navigating back/refreshing
        setTimeout(() => {
          if (onSave) onSave();
        }, 800);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update model portfolio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 p-10 border border-slate-100 max-w-2xl mx-auto animate-in zoom-in duration-500">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Edit Investment Strategy</h2>
        <p className="text-slate-500">Adjust target percentages for the Wealth Builder 2025 plan</p>
      </div>
      
      <div className="space-y-6">
        {allocations.map((fund) => (
          <div key={fund.fundId} className="flex items-center gap-6 group">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-0.5 group-hover:text-indigo-600 transition-colors">
                {fund.fundName}
              </label>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{fund.fundId}</div>
            </div>
            <div className="w-40 relative">
              <input 
                type="number" 
                value={fund.allocationPct}
                onChange={(e) => handleChange(fund.fundId, e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-5 pr-10 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-black text-slate-700 text-lg"
                step="0.1"
                min="0"
                max="100"
              />
              <span className="absolute right-5 top-4 text-slate-400 font-bold">%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-slate-50">
        <div className="flex justify-between items-center mb-8 px-2">
          <div className="space-y-1">
             <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Aggregate Allocation</div>
             <div className="text-3xl font-black text-slate-900 tracking-tighter">
               {total.toFixed(1)}%
             </div>
          </div>
          <div className={`p-3 rounded-2xl ${isBalanced ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} transition-colors`}>
            {isBalanced ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-2xl text-sm font-bold border border-rose-100 animate-in shake duration-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-bold border border-emerald-100 animate-in fade-in duration-300 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
             {success}
          </div>
        )}

        <button 
          onClick={handleSave}
          disabled={loading || !isBalanced}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-black py-4 rounded-3xl shadow-xl shadow-indigo-200 hover:shadow-2xl transition-all active:scale-[0.98] text-lg uppercase tracking-widest flex justify-center items-center gap-3"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </>
          ) : 'Save & Recalculate'}
        </button>
      </div>
    </div>
  );
}

export default EditModelPortfolio;
