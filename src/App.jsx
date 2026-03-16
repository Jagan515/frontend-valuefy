import React from 'react';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Portfolio Rebalancing Engine</h1>
      </header>
      <main className="p-6">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
