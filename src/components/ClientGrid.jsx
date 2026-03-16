import React from 'react';

function ClientGrid({ clients, onSelectClient }) {
  if (!clients || clients.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
        <div className="text-slate-300 mb-4 flex justify-center">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-slate-500 font-medium text-lg">No clients found in system.</p>
        <p className="text-slate-400 text-sm">Add clients to the database to begin rebalancing.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clients.map((client) => {
          const isDrifted = client.status === 'Drifted';
          
          return (
            <div 
              key={client.clientId}
              onClick={() => onSelectClient(client.clientId)}
              className="group bg-white rounded-[2rem] p-1 border border-slate-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer relative"
            >
              <div className="p-7">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    {client.name.charAt(0)}
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    isDrifted ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {client.status}
                  </span>
                </div>

                <div className="space-y-1 mb-8">
                  <h3 className="font-bold text-xl text-slate-800 tracking-tight">
                    {client.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                    {client.clientId}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-50">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Portfolio</p>
                    <p className="text-lg font-bold text-slate-700">Rs {client.currentValue.toLocaleString()}</p>
                  </div>
                  {isDrifted && (
                    <div className="bg-rose-50/30 rounded-2xl p-4 border border-rose-50/50">
                      <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest mb-1">Drifted</p>
                      <p className="text-lg font-bold text-rose-600">{client.actionCount} <span className="text-[10px] font-medium text-rose-400">Actions</span></p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 bg-slate-50/50 rounded-b-[1.75rem] flex items-center justify-between text-indigo-600 text-xs font-black uppercase tracking-widest group-hover:bg-indigo-50 transition-colors">
                Manage Portfolio
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClientGrid;
