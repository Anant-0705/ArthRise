import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
    fetchSummary();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const { data } = await axiosInstance.get('/portfolio');
      setPortfolio(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch portfolio');
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const { data } = await axiosInstance.get('/portfolio/summary');
      setSummary(data);
    } catch (error) {
      console.error('Failed to fetch summary');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-white fw-bold">My Portfolio</h2>

      {summary && (
        <div className="row g-3 mb-5">
          {[
            { label: 'Total Invested', value: `$${summary.totalInvested.toLocaleString()}`, color: 'text-white' },
            { label: 'Current Value', value: `$${summary.currentValue.toLocaleString()}`, color: 'text-white' },
            { label: 'Total P/L', value: `$${summary.totalProfitLoss.toLocaleString()}`, color: summary.totalProfitLoss >= 0 ? 'text-success' : 'text-danger' },
            { label: 'Total P/L %', value: `${summary.totalProfitLossPercent.toFixed(2)}%`, color: summary.totalProfitLossPercent >= 0 ? 'text-success' : 'text-danger' },
          ].map((stat) => (
            <div key={stat.label} className="col-6 col-md-3">
              <div className="aesthetic-card p-4 text-center">
                <p className="text-muted small text-uppercase fw-bold mb-2" style={{ letterSpacing: '0.06em' }}>{stat.label}</p>
                <h4 className={`mb-0 fw-bold ${stat.color}`}>{stat.value}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-white-50" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : portfolio.length === 0 ? (
        <div className="aesthetic-card p-4 text-center text-muted">
          <i className="bi bi-briefcase fs-1 mb-3 d-block opacity-25"></i>
          Your portfolio is empty. Start trading to see your holdings here.
        </div>
      ) : (
        <div className="aesthetic-card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead>
                <tr>
                  <th className="ps-4">Symbol</th>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Avg Price</th>
                  <th>Curr. Price</th>
                  <th>Invested</th>
                  <th>Value</th>
                  <th>P/L</th>
                  <th className="pe-4">P/L %</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item) => (
                  <tr key={item._id}>
                    <td className="ps-4">
                      <span className="px-2 py-1 rounded fw-bold" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {item.stock.symbol}
                      </span>
                    </td>
                    <td className="fw-medium">{item.stock.name}</td>
                    <td className="text-white">{item.quantity}</td>
                    <td className="text-muted">${item.averagePurchasePrice.toFixed(2)}</td>
                    <td className="fw-bold text-white">${item.stock.currentPrice.toFixed(2)}</td>
                    <td className="text-muted">${item.totalInvested.toFixed(2)}</td>
                    <td className="text-white">${item.currentValue.toFixed(2)}</td>
                    <td className={item.profitLoss >= 0 ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                      {item.profitLoss >= 0 ? '+' : ''}${item.profitLoss.toFixed(2)}
                    </td>
                    <td className={`pe-4 ${item.profitLossPercent >= 0 ? 'text-success' : 'text-danger'}`}>
                      <span className={`badge px-2 py-1 rounded-pill ${item.profitLossPercent >= 0 ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
                        {item.profitLossPercent >= 0 ? '+' : ''}{item.profitLossPercent.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
