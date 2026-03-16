import React, { useState } from 'react';
import axios from 'axios';

function RebalanceResult({ data, onSaveSuccess }) {
  const { clientId, modelAllocation, actions, totalPortfolioValue } = data;
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleSave = async (status = 'PENDING') => {
    setSaving(true);
    setSaveError('');
    try {
      const response = await axios.post(`${API_BASE}/rebalance/save`, {
        clientId,
        portfolioValue: totalPortfolioValue,
        actions,
        status
      });
      if (response.data.success) {
        onSaveSuccess && onSaveSuccess();
      }
    } catch (err) {
      setSaveError('Failed to save rebalancing recommendation.');
    } finally {
      setSaving(false);
    }
  };

  if (!actions || actions.length === 0) {
    return (
      <div className="bg-emerald-50 text-emerald-800 p-8 rounded-2xl shadow-sm border border-emerald-100 mt-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-emerald-100 p-3 rounded-full">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Portfolio is Balanced!</h2>
        <p className="text-emerald-600/80">Your current holdings perfectly match the model portfolio. No actions required.</p>
      </div>
    );
  }

  // Calculate totals for the summary block
  const totalBuy = actions.filter(a => a.action === 'BUY').reduce((s, a) => s + a.amount, 0);
  const totalSell = actions.filter(a => a.action === 'SELL' || a.action === 'REVIEW').reduce((s, a) => s + a.amount, 0);
  const freshMoney = Math.max(0, totalBuy - totalSell);

  return (
    <div className="space-y-8 mt-6 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] shadow-sm">
          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-1">Total to BUY</p>
          <p className="text-3xl font-black text-emerald-700">Rs {totalBuy.toLocaleString()}</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem] shadow-sm">
          <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mb-1">Total to SELL</p>
          <p className="text-3xl font-black text-indigo-700">Rs {totalSell.toLocaleString()}</p>
        </div>
        <div className="bg-blue-600 p-6 rounded-[2rem] shadow-xl shadow-blue-200 text-white">
          <p className="text-[10px] text-blue-100 font-black uppercase tracking-widest mb-1">Fresh Money Needed</p>
          <p className="text-3xl font-black">Rs {freshMoney.toLocaleString()}</p>
        </div>
      </div>

      {/* Consolidated Rebalancing Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Rebalancing Strategy</h2>
            <p className="text-sm text-slate-500">Targeting Wealth Builder 2025 Model</p>
          </div>
          <div className="flex gap-3">
             <button 
              onClick={() => handleSave('DISMISSED')}
              disabled={saving}
              className="px-5 py-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
            >
              Dismiss
            </button>
            <button 
              onClick={() => handleSave('PENDING')}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-black py-2.5 px-8 rounded-2xl transition-all shadow-xl shadow-indigo-200 text-xs uppercase tracking-widest"
            >
              {saving ? 'Saving...' : 'Save Plan'}
            </button>
          </div>
        </div>
        
        {saveError && (
          <div className="mx-8 mt-6 p-4 bg-rose-50 text-rose-700 rounded-2xl text-xs font-bold border border-rose-100 animate-in shake duration-300">
            {saveError}
          </div>
        )}

        <div className="overflow-x-auto p-2">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 uppercase text-[9px] font-black tracking-widest">
                <th className="py-4 px-6">Fund Hierarchy</th>
                <th className="py-4 px-6 text-right">Plan %</th>
                <th className="py-4 px-6 text-right">Current %</th>
                <th className="py-4 px-6 text-center">Drift Analysis</th>
                <th className="py-4 px-6 text-center">Recommended</th>
                <th className="py-4 px-6 text-right">Action Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {actions.map((action, index) => {
                const isBuy = action.action === 'BUY';
                const isSell = action.action === 'SELL';
                const isReview = action.action === 'REVIEW';
                const drift = action.targetPct - action.currentPct;
                
                return (
                  <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-6">
                      <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{action.fund}</div>
                      {!action.isModelFund && (
                        <span className="mt-1 inline-block px-1.5 py-0.5 bg-rose-50 text-rose-500 text-[8px] font-black uppercase rounded-sm border border-rose-100">Outside Model</span>
                      )}
                    </td>
                    <td className="py-5 px-6 text-right font-black text-slate-400 text-sm">{action.isModelFund ? `${action.targetPct}%` : '—'}</td>
                    <td className="py-5 px-6 text-right font-black text-slate-800 text-sm">{action.currentPct}%</td>
                    <td className="py-5 px-6">
                       <div className="flex flex-col items-center gap-1.5">
                         <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                           {action.isModelFund && (
                             <div 
                               className={`absolute h-full rounded-full transition-all duration-1000 ${isBuy ? 'bg-emerald-500' : (isSell ? 'bg-indigo-500' : 'bg-slate-300')}`}
                               style={{ 
                                 width: `${Math.min(100, Math.abs(drift) * 5)}%`,
                                 left: drift > 0 ? '50%' : `${50 - Math.min(50, Math.abs(drift) * 5)}%`
                               }}
                             />
                           )}
                           <div className="absolute left-1/2 top-0 w-0.5 h-full bg-slate-200/50" />
                         </div>
                         <span className={`text-[10px] font-black ${drift > 0 ? 'text-emerald-600' : (drift < 0 ? 'text-indigo-600' : 'text-slate-400')}`}>
                           {action.isModelFund ? `${drift > 0 ? '+' : ''}${drift.toFixed(1)}%` : '—'}
                         </span>
                       </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full tracking-wider border ${
                        isReview ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-50' : 
                        (isBuy ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-50' : 
                        (isSell ? 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-sm shadow-indigo-50' : 'bg-slate-50 text-slate-400 border-slate-100'))
                      }`}>
                        {action.action}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className={`font-mono font-black text-sm ${isBuy ? 'text-emerald-600' : (isSell ? 'text-indigo-600' : 'text-slate-800')}`}>
                        {action.amount > 0 ? `Rs ${action.amount.toLocaleString()}` : '—'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RebalanceResult;
