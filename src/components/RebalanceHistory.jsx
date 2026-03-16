import React from 'react';

function RebalanceHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-sm animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No History Found</h3>
        <p className="text-slate-500 max-w-xs mx-auto">Complete a rebalancing session and save it to see your history logs here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Rebalancing Logs</h2>
          <p className="text-slate-500 mt-1">Audit trail of past recommended actions</p>
        </div>
      </div>

      <div className="space-y-6">
        {history.map((session) => (
          <div key={session.session_id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all">
            <div className="p-6 bg-slate-50/50 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saved on</div>
                  <div className="font-bold text-slate-800">{new Date(session.created_at).toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portfolio</div>
                   <div className="font-black text-indigo-600">Rs {session.portfolio_value.toLocaleString()}</div>
                </div>
                <span className={`px-4 py-1.5 text-[10px] font-black rounded-xl uppercase tracking-widest border ${
                  session.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                  (session.status === 'APPLIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200')
                }`}>
                  {session.status}
                </span>
              </div>
            </div>

            <div className="p-2 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 uppercase text-[9px] font-black tracking-widest border-b border-slate-50">
                    <th className="py-3 px-6">Fund</th>
                    <th className="py-3 px-6 text-center">Action</th>
                    <th className="py-3 px-6 text-right">Amount</th>
                    <th className="py-3 px-6 text-right">Target %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {session.items.map((item) => (
                    <tr key={item.item_id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-6">
                        <div className="font-bold text-slate-700">{item.fund_name}</div>
                        <div className="text-[9px] text-slate-400 font-mono uppercase">{item.fund_id}</div>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                          item.action === 'BUY' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          (item.action === 'SELL' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-100')
                        }`}>
                          {item.action}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right font-mono font-bold text-slate-600">
                        {item.amount > 0 ? `Rs ${item.amount.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3 px-6 text-right font-black text-slate-400 text-xs">
                        {item.target_pct ? `${item.target_pct}%` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-slate-900 flex flex-wrap justify-between items-center gap-4 rounded-b-[1.75rem]">
              <div className="flex gap-8">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Total BUY</span>
                  <span className="text-sm font-bold text-emerald-400">Rs {session.total_to_buy.toLocaleString()}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Total SELL</span>
                  <span className="text-sm font-bold text-indigo-300">Rs {session.total_to_sell.toLocaleString()}</span>
                </div>
              </div>
              <div className="px-4 py-1.5 bg-slate-800 rounded-xl border border-slate-700">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mr-2">Net Cash Required</span>
                <span className="text-sm font-black text-blue-400 underline decoration-blue-500/50 underline-offset-4 decoration-2">Rs {session.net_cash_needed.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RebalanceHistory;
