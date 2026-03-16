import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientGrid from '../components/ClientGrid';
import PortfolioView from '../components/PortfolioView';
import RebalanceResult from '../components/RebalanceResult';

function Dashboard() {
  const [clientSummary, setClientSummary] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  
  const [portfolioData, setPortfolioData] = useState(null);
  const [rebalanceData, setRebalanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

  // 1. Fetch summary of all clients on mount
  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/rebalance-summary`);
      if (response.data.success) {
        setClientSummary(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch client summaries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // 2. Fetch specific client portfolio
  useEffect(() => {
    if (!selectedClientId) {
      setPortfolioData(null);
      setRebalanceData(null);
      return;
    }
    
    const fetchPortfolio = async () => {
      setLoading(true);
      setError('');
      setRebalanceData(null);
      
      try {
        const response = await axios.get(`${API_BASE}/portfolio/${selectedClientId}`);
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
  }, [selectedClientId]);

  // 3. Trigger rebalance calculation
  const handleRebalance = async () => {
    if (!selectedClientId) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/rebalance/${selectedClientId}`);
      if (response.data.success) {
        setRebalanceData(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate rebalance actions.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    setSelectedClientId(null);
    fetchSummary(); // Refresh statuses when returning
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Navigation Breadcrumb / Back button */}
      {selectedClientId && (
        <button 
          onClick={handleBackToDashboard}
          className="text-blue-600 hover:text-blue-800 flex items-center font-medium transition-colors"
        >
          &larr; Back to Client Summary Dashboard
        </button>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {loading && !clientSummary.length && !portfolioData && (
        <div className="text-gray-500 py-10 text-center animate-pulse">Loading dashboard data...</div>
      )}

      {/* Main Content Area */}
      {!selectedClientId ? (
        <ClientGrid clients={clientSummary} onSelectClient={setSelectedClientId} />
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {portfolioData && (
            <div className="space-y-6">
              <PortfolioView data={portfolioData} />

              {!rebalanceData && (
                <div className="flex justify-center py-4">
                  <button 
                    onClick={handleRebalance}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
                  >
                    {loading ? 'Calculating...' : 'Calculate Rebalance Actions'}
                  </button>
                </div>
              )}
            </div>
          )}

          {rebalanceData && (
            <RebalanceResult data={rebalanceData} />
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
