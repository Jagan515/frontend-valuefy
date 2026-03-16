import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientGrid from '../components/ClientGrid';
import PortfolioView from '../components/PortfolioView';
import RebalanceResult from '../components/RebalanceResult';
import RebalanceHistory from '../components/RebalanceHistory';
import EditModelPortfolio from '../components/EditModelPortfolio';

function Dashboard() {
  const [viewMode, setViewMode] = useState('DASHBOARD'); // DASHBOARD, PORTFOLIO, HISTORY, EDIT_MODEL
  const [clientSummary, setClientSummary] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [newInvestment, setNewInvestment] = useState(0);
  
  const [portfolioData, setPortfolioData] = useState(null);
  const [rebalanceData, setRebalanceData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

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

  const [modelPortfolio, setModelPortfolio] = useState([]);
  const fetchModel = async () => {
    try {
      const response = await axios.get(`${API_BASE}/rebalance/C001`); // Just use C001 to get the model structure
      if (response.data.success) {
        setModelPortfolio(response.data.data.modelAllocation);
      }
    } catch (err) {
      console.error('Failed to fetch model.');
    }
  };

  useEffect(() => {
    fetchModel();
  }, []);

  // 2. Fetch specific client portfolio
  useEffect(() => {
    if (!selectedClientId) {
      setPortfolioData(null);
      setRebalanceData(null);
      setNewInvestment(0);
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
          setViewMode('PORTFOLIO');
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
      const response = await axios.get(`${API_BASE}/rebalance/${selectedClientId}`, {
        params: { newInvestment }
      });
      if (response.data.success) {
        setRebalanceData(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate rebalance actions.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Fetch history
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/rebalance/history/${selectedClientId || ''}`);
      if (response.data.success) {
        setHistoryData(response.data.data);
        setViewMode('HISTORY');
      }
    } catch (err) {
      setError('Failed to fetch history.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    setSelectedClientId(null);
    setViewMode('DASHBOARD');
    fetchSummary();
  };

  const handleSaveSuccess = () => {
    fetchHistory();
  };

  const renderContent = () => {
    if (viewMode === 'DASHBOARD') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Financial Clients</h2>
              <p className="text-slate-500">Monitor and rebalance portfolio drift</p>
            </div>
            <button 
              onClick={() => setViewMode('EDIT_MODEL')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Global Model
            </button>
          </div>
          <ClientGrid clients={clientSummary} onSelectClient={setSelectedClientId} />
        </div>
      );
    }

    if (viewMode === 'EDIT_MODEL') {
      return (
        <EditModelPortfolio 
          modelAllocation={rebalanceData?.modelAllocation || modelPortfolio} 
          onSave={() => {
            fetchSummary();
            fetchModel();
            if (selectedClientId) {
              handleRebalance();
              setViewMode('PORTFOLIO');
            } else {
              setViewMode('DASHBOARD');
            }
          }}
        />
      );
    }

    if (viewMode === 'HISTORY') {
      return <RebalanceHistory history={historyData} />;
    }

    if (viewMode === 'PORTFOLIO') {
      return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {portfolioData && (
            <div className="space-y-8">
              <div className="flex flex-wrap justify-between items-end gap-6">
                <PortfolioView 
                  data={portfolioData} 
                  onNewInvestmentChange={(val) => setNewInvestment(parseFloat(val) || 0)}
                />
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <button 
                    onClick={fetchHistory}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 px-6 rounded-2xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Audit History
                  </button>
                  {!rebalanceData && (
                    <button 
                      onClick={handleRebalance}
                      disabled={loading}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] uppercase text-xs tracking-widest"
                    >
                      {loading ? 'Analyzing Drift...' : 'Generate Rebalance Plan'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {rebalanceData && (
            <RebalanceResult data={rebalanceData} onSaveSuccess={handleSaveSuccess} />
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8">
      
      {/* Navigation Breadcrumb / Back button */}
      {viewMode !== 'DASHBOARD' && (
        <button 
          onClick={handleBackToDashboard}
          className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
            <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">Back to Overview</span>
        </button>
      )}

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 flex items-center gap-3 animate-in shake duration-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-bold text-sm">{error}</span>
        </div>
      )}

      {loading && !clientSummary.length && !portfolioData && (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
           <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
           <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">Syncing Financial Data</p>
        </div>
      )}

      {/* Main Content Area */}
      {renderContent()}
    </div>
  );
}

export default Dashboard;
