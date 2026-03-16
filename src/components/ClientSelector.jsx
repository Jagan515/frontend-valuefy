import React from 'react';

function ClientSelector({ clients, selected, onSelect }) {
  if (!clients || clients.length === 0) {
    return <div className="text-gray-500">No clients available.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Client</h2>
      <select
        className="block w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selected || ''}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="" disabled>-- Select a client --</option>
        {clients.map(client => (
          <option key={client.clientId} value={client.clientId}>
            {client.name} (Total Invested: ${client.totalInvested.toLocaleString()})
          </option>
        ))}
      </select>
    </div>
  );
}

export default ClientSelector;
