import React from 'react';

function PortfolioView({ data }) {
  const { clientId, totalInvested, holdings } = data;

  if (!holdings || holdings.length === 0) {
    return <div className="text-gray-500">No active holdings for this client.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Current Portfolio 
        <span className="text-sm font-normal text-gray-500 ml-2">Client ID: {clientId}</span>
      </h2>
      
      <div className="mb-4">
        <p className="text-lg text-gray-700">
          Total Value: <span className="font-bold text-blue-600">${totalInvested.toLocaleString()}</span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 border-b">Fund Name</th>
              <th className="py-3 px-6 border-b text-right">Current Value</th>
              <th className="py-3 px-6 border-b text-right">Allocation %</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {holdings.map((holding, index) => {
              const allocationArrayPct = (holding.currentValue / totalInvested) * 100;
              return (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 whitespace-nowrap font-medium">
                    {holding.fundName}
                  </td>
                  <td className="py-3 px-6 text-right">
                    ${holding.currentValue.toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {allocationArrayPct.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PortfolioView;
