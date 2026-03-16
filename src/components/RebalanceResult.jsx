import React from 'react';

function RebalanceResult({ data }) {
  const { modelAllocation, actions, totalPortfolioValue } = data;

  if (!actions || actions.length === 0) {
    return (
      <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow mt-6">
        <h2 className="text-xl font-semibold">Portfolio is Balanced!</h2>
        <p>Your current holdings perfectly match the model portfolio. No actions required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Model Allocation View */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Target Model Allocation</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-800 uppercase text-sm leading-normal">
                <th className="py-3 px-6 border-b">Fund Name</th>
                <th className="py-3 px-6 border-b text-right">Target Allocation %</th>
                <th className="py-3 px-6 border-b text-right">Target Value</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {modelAllocation.map((model, index) => {
                const targetVal = totalPortfolioValue * (model.allocationPct / 100);
                return (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 whitespace-nowrap font-medium">{model.fundName}</td>
                    <td className="py-3 px-6 text-right font-semibold">{model.allocationPct}%</td>
                    <td className="py-3 px-6 text-right">${targetVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Actions View */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recommended Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const isBuy = action.action === 'BUY';
            const bgColor = isBuy ? 'bg-green-50' : 'bg-red-50';
            const actionColor = isBuy ? 'text-green-700' : 'text-red-700';
            const badgeBg = isBuy ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';

            return (
              <div key={index} className={`${bgColor} rounded-lg p-4 border`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${badgeBg}`}>
                    {action.action}
                  </span>
                  <span className={`font-bold text-lg ${actionColor}`}>
                    ${action.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="font-medium text-gray-800">{action.fund}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RebalanceResult;
