import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientSelector from '../components/ClientSelector';
import PortfolioView from '../components/PortfolioView';
import RebalanceResult from '../components/RebalanceResult';

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  
  const [portfolioData, setPortfolioData] = useState(null);
  const [rebalanceData, setRebalanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

  // 1. Fetch clients on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${API_BASE}/clients`);
        if (response.data.success) {
          setClients(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch clients.');
      }
    };
    fetchClients();
  }, []);

  // 2. Fetch portfolio when a client is selected
  useEffect(() => {
    if (!selectedClient) return;
    
    const fetchPortfolio = async () => {
      setLoading(true);
      setError('');
      setRebalanceData(null); // reset old data
      
      try {
        const response = await axios.get(`${API_BASE}/portfolio/${selectedClient}`);
        if (response.data.success) {
          setPortfolioData(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch portfolio data.');
        setPortfolioData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [selectedClient]);

  // 3. Trigger rebalance calculation
  const handleRebalance = async () => {
    if (!selectedClient) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/rebalance/${selectedClient}`);
      if (response.data.success) {
        setRebalanceData(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate rebalance actions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Client Selection */}
      <ClientSelector 
        clients={clients} 
        selected={selectedClient} 
        onSelect={setSelectedClient} 
      />

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {loading && <div className="text-gray-500">Loading data...</div>}

      {/* Main Content Area */}
      {portfolioData && !loading && (
        <div className="space-y-6">
          <PortfolioView data={portfolioData} />

          <div className="flex justify-end">
            <button 
              onClick={handleRebalance}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow"
            >
              Calculate Rebalance Actions
            </button>
          </div>
        </div>
      )}

      {/* Rebalance Output Area */}
      {rebalanceData && !loading && (
        <RebalanceResult data={rebalanceData} />
      )}
    </div>
  );
}

export default Dashboard;
