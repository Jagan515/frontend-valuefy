import React from 'react';

function PortfolioView({ data, onNewInvestmentChange }) {
  const { clientId, totalInvested, holdings } = data;

  if (!holdings || holdings.length === 0) {
    return <div className="text-slate-500 italic p-8 text-center bg-white rounded-3xl border border-slate-100">No active holdings for this client.</div>;
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-left-8 duration-700">
      <div className="p-8 pb-4 flex flex-wrap justify-between items-start gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
            Current Investments
          </h2>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wider">Client {clientId}</span>
          </div>
        </div>
        
        <div className="flex gap-8">
          <div className="space-y-2">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">New Investment (Rs)</p>
            <input 
              type="number" 
              placeholder="e.g. 80000"
              className="bg-slate-50 border border-slate-100 rounded-xl py-2 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm font-bold text-slate-700 w-32"
              onChange={(e) => onNewInvestmentChange && onNewInvestmentChange(e.target.value)}
            />
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Current Portfolio Value</p>
            <p className="text-3xl font-black text-indigo-600 tracking-tighter">
              Rs {totalInvested.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] font-black tracking-widest">
                <th className="py-4 px-6">Fund Name</th>
                <th className="py-4 px-6 text-right">Current Value</th>
                <th className="py-4 px-6 text-right">Portfolio Mix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {holdings.map((holding, index) => {
                const allocationPct = (holding.currentValue / totalInvested) * 100;
                return (
                  <tr key={index} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-5 px-6">
                      <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{holding.fundName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{holding.fundId}</div>
                    </td>
                    <td className="py-5 px-6 text-right font-mono font-bold text-slate-700">
                      Rs {holding.currentValue.toLocaleString()}
                    </td>
                    <td className="py-5 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${allocationPct}%` }}
                          />
                        </div>
                        <span className="font-black text-slate-900 text-sm w-12">{allocationPct.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-center">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           Investment data updated as of {new Date().toLocaleDateString()}
         </p>
      </div>
    </div>
  );
}

export default PortfolioView;
