import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axiosInstance.get('/transactions/all');
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch transactions');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Transactions</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="alert alert-info">No transactions found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-sm">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Type</th>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Price/Share</th>
                <th>Total</th>
                <th>Balance After</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{formatDate(transaction.createdAt)}</td>
                  <td>{transaction.user?.username}</td>
                  <td>
                    <span
                      className={`badge ${
                        transaction.transactionType === 'buy'
                          ? 'bg-success'
                          : 'bg-danger'
                      }`}
                    >
                      {transaction.transactionType.toUpperCase()}
                    </span>
                  </td>
                  <td>{transaction.stock?.symbol}</td>
                  <td>{transaction.quantity}</td>
                  <td>${transaction.pricePerShare?.toFixed(2)}</td>
                  <td>${transaction.totalAmount.toFixed(2)}</td>
                  <td>${transaction.balanceAfter.toLocaleString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        transaction.status === 'completed'
                          ? 'bg-success'
                          : transaction.status === 'pending'
                          ? 'bg-warning'
                          : 'bg-danger'
                      }`}
                    >
                      {transaction.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllTransactions;
