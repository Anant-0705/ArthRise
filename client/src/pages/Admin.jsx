import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';

const Admin = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    exchange: 'NASDAQ',
    currentPrice: '',
    previousClose: '',
    marketCap: '',
    volume: '',
    sector: '',
    description: '',
  });
  const [editingStock, setEditingStock] = useState(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const { data } = await axiosInstance.get('/stocks');
      setStocks(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch stocks');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingStock) {
        await axiosInstance.put(`/stocks/${editingStock._id}`, formData);
        toast.success('Stock updated successfully');
      } else {
        await axiosInstance.post('/stocks', formData);
        toast.success('Stock created successfully');
      }

      resetForm();
      fetchStocks();
      
      // Close modal
      const modalElement = document.getElementById('stockModal');
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (stock) => {
    setEditingStock(stock);
    setFormData({
      symbol: stock.symbol,
      name: stock.name,
      exchange: stock.exchange,
      currentPrice: stock.currentPrice,
      previousClose: stock.previousClose,
      marketCap: stock.marketCap,
      volume: stock.volume,
      sector: stock.sector,
      description: stock.description,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stock?')) {
      try {
        await axiosInstance.delete(`/stocks/${id}`);
        toast.success('Stock deleted successfully');
        fetchStocks();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      symbol: '',
      name: '',
      exchange: 'NASDAQ',
      currentPrice: '',
      previousClose: '',
      marketCap: '',
      volume: '',
      sector: '',
      description: '',
    });
    setEditingStock(null);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Stocks</h2>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#stockModal"
          onClick={resetForm}
        >
          Add New Stock
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Price</th>
                <th>Exchange</th>
                <th>Sector</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock._id}>
                  <td className="fw-bold">{stock.symbol}</td>
                  <td>{stock.name}</td>
                  <td>${stock.currentPrice.toFixed(2)}</td>
                  <td>{stock.exchange}</td>
                  <td>{stock.sector}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#stockModal"
                      onClick={() => handleEdit(stock)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(stock._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Modal */}
      <div
        className="modal fade"
        id="stockModal"
        tabIndex="-1"
        aria-labelledby="stockModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="stockModalLabel">
                {editingStock ? 'Edit Stock' : 'Add New Stock'}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={resetForm}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Symbol</label>
                    <input
                      type="text"
                      className="form-control"
                      name="symbol"
                      value={formData.symbol}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Exchange</label>
                    <select
                      className="form-select"
                      name="exchange"
                      value={formData.exchange}
                      onChange={handleChange}
                      required
                    >
                      <option value="NASDAQ">NASDAQ</option>
                      <option value="NYSE">NYSE</option>
                      <option value="AMEX">AMEX</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Current Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="currentPrice"
                      value={formData.currentPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Previous Close</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="previousClose"
                      value={formData.previousClose}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Market Cap</label>
                    <input
                      type="number"
                      className="form-control"
                      name="marketCap"
                      value={formData.marketCap}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Volume</label>
                    <input
                      type="number"
                      className="form-control"
                      name="volume"
                      value={formData.volume}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Sector</label>
                    <input
                      type="text"
                      className="form-control"
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStock ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
