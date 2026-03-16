import React from 'react';

function ClientGrid({ clients, onSelectClient }) {
  if (!clients || clients.length === 0) {
    return <div className="text-gray-500 p-8 text-center italic">No clients found in system.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Portfolio Summary Dashboard</h2>
        <span className="text-sm text-gray-500">{clients.length} Clients Managed</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => {
          const isDrifted = client.status === 'Drifted';
          
          return (
            <div 
              key={client.clientId}
              onClick={() => onSelectClient(client.clientId)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
            >
              {/* Status Indicator Bar */}
              <div className={`absolute top-0 left-0 w-1 h-full ${isDrifted ? 'bg-red-500' : 'bg-green-500'}`} />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">{client.clientId}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  isDrifted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {client.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Current Value:</span>
                  <span className="font-semibold text-gray-900">
                    ${client.currentValue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                  </span>
                </div>
                
                {isDrifted && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Actions Required:</span>
                    <span className="text-red-600 font-bold">{client.actionCount}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-50 flex items-center text-blue-600 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                View Detailed Portfolio &rarr;
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClientGrid;
