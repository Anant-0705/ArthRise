import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';
import { GeneralContext } from '../context/GeneralContext';

const Home = () => {
  const { user, updateUser } = useContext(GeneralContext);
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [transactionType, setTransactionType] = useState('buy');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refreshPrices();
      }, 60000); // 60 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchStocks = async () => {
    try {
      const { data } = await axiosInstance.get('/stocks');
      setStocks(data);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch stocks');
      setLoading(false);
    }
  };

  const refreshPrices = async () => {
    try {
      setRefreshing(true);
      const { data } = await axiosInstance.get('/stocks?refresh=true');
      setStocks(data);
      setLastUpdate(new Date());
      if (!autoRefresh) {
        toast.success('Prices refreshed successfully!');
      }
    } catch (error) {
      toast.error('Failed to refresh prices');
    } finally {
      setRefreshing(false);
    }
  };

  const handleTransaction = async () => {
    if (!selectedStock || quantity <= 0) {
      toast.error('Please select a stock and enter valid quantity');
      return;
    }

    try {
      const endpoint = transactionType === 'buy' ? '/transactions/buy' : '/transactions/sell';
      const { data } = await axiosInstance.post(endpoint, {
        stockId: selectedStock._id,
        quantity: parseInt(quantity),
      });

      toast.success(`${transactionType === 'buy' ? 'Bought' : 'Sold'} successfully!`);
      
      // Update user balance
      const { data: userData } = await axiosInstance.get('/users/profile');
      updateUser(userData);
      
      setQuantity(1);
      setSelectedStock(null);
      
      // Close modal
      const modalElement = document.getElementById('transactionModal');
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transaction failed');
    }
  };

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-4 py-md-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-3 home-actions">
        <div>
          <h2 className="mb-0">Stock Market</h2>
          {lastUpdate && (
            <small className="text-muted">
              <i className="bi bi-clock me-1"></i>
              Last updated: {lastUpdate.toLocaleTimeString()}
            </small>
          )}
        </div>
        
        <div className="d-flex flex-wrap align-items-center gap-3">
          <div className="form-check form-switch m-0 pt-1">
            <input
              className="form-check-input"
              type="checkbox"
              id="autoRefreshSwitch"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <label className="form-check-label small text-muted" htmlFor="autoRefreshSwitch">
              Auto-refresh
            </label>
          </div>
          <button
            className="btn btn-outline-primary btn-sm rounded-pill px-3"
            onClick={refreshPrices}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Refreshing...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      <div className="aesthetic-card mb-4 p-3 d-flex align-items-center">
        <i className="bi bi-search text-muted ms-2 me-3 fs-5"></i>
        <input
          type="text"
          className="form-control border-0 shadow-none bg-transparent"
          placeholder="Search stocks by symbol or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="aesthetic-card">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead>
                <tr>
                  <th className="ps-4 rounded-top-start">Symbol</th>
                  <th>Company</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th className="d-none d-md-table-cell">Exchange</th>
                  <th className="text-end pe-4 rounded-top-end">Actions</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {filteredStocks.map((stock) => (
                  <tr key={stock._id}>
                    <td className="ps-4">
                      <span className="px-2 py-1 rounded fw-bold" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.9rem', letterSpacing: '0.03em', border: '1px solid rgba(255,255,255,0.12)' }}>
                        {stock.symbol}
                      </span>
                    </td>
                    <td className="fw-medium text-white">{stock.name}</td>
                    <td className="fw-bold fs-5 text-white">${stock.currentPrice.toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge ${
                          stock.changePercent >= 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'
                        } px-2 py-1 rounded-pill`}
                      >
                        <i className={`bi bi-arrow-${stock.changePercent >= 0 ? 'up' : 'down'}-short me-1`}></i>
                        {Math.abs(stock.changePercent).toFixed(2)}%
                      </span>
                    </td>
                    <td className="d-none d-md-table-cell">
                      <span className="text-muted small">{stock.exchange}</span>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm rounded-pill px-2 px-md-4 me-1 me-md-2 fw-semibold"
                        style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
                        data-bs-toggle="modal"
                        data-bs-target="#transactionModal"
                        onClick={() => {
                          setSelectedStock(stock);
                          setTransactionType('buy');
                        }}
                      >
                        Buy
                      </button>
                      <button
                        className="btn btn-sm rounded-pill px-2 px-md-4 fw-semibold"
                        style={{ background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)' }}
                        data-bs-toggle="modal"
                        data-bs-target="#transactionModal"
                        onClick={() => {
                          setSelectedStock(stock);
                          setTransactionType('sell');
                        }}
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      <div
        className="modal fade"
        id="transactionModal"
        tabIndex="-1"
        aria-labelledby="transactionModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 aesthetic-card overflow-hidden">
            <div className="modal-header border-0 pb-0">
              <h4 className="modal-title fw-bold" id="transactionModalLabel">
                {transactionType === 'buy' ? 'Buy Asset' : 'Sell Asset'}
              </h4>
              <button
                type="button"
                className="btn-close btn-close-white shadow-none"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body pb-0 pt-4">
              {selectedStock && (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="mb-1 fw-bold">{selectedStock.symbol}</h5>
                      <span className="text-muted small">{selectedStock.name}</span>
                    </div>
                    <div className="text-end">
                      <h5 className="mb-0 fw-bold text-primary">
                        ${selectedStock.currentPrice.toFixed(2)}
                      </h5>
                      <span className="text-muted small">Current Price</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label text-muted small fw-medium text-uppercase mb-2">Quantity</label>
                    <input
                      type="number"
                      className="form-control form-control-lg border-0 bg-light shadow-none"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center bg-light border-secondary p-3 rounded-3 mb-2 border">
                    <span className="text-muted fw-medium">Estimated Total</span>
                    <span className="fs-5 fw-bold text-white">
                      ${(selectedStock.currentPrice * quantity).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer border-0 pt-4">
              <button
                type="button"
                className="btn btn-outline-light rounded-pill px-4 fw-medium"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn rounded-pill px-4 fw-medium flex-grow-1 ${
                  transactionType === 'buy' ? 'btn-primary' : 'btn-danger'
                }`}
                onClick={handleTransaction}
              >
                Confirm {transactionType === 'buy' ? 'Buy' : 'Sell'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
