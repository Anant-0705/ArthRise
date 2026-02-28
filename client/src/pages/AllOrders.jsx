import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get('/orders/all');
      setOrders(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Orders</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="alert alert-info">No orders found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-sm">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Stock</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price/Share</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.user?.username}</td>
                  <td>{order.stock?.symbol}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.orderType === 'buy' ? 'bg-success' : 'bg-danger'
                      }`}
                    >
                      {order.orderType.toUpperCase()}
                    </span>
                  </td>
                  <td>{order.quantity}</td>
                  <td>${order.pricePerShare.toFixed(2)}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === 'completed'
                          ? 'bg-success'
                          : order.status === 'pending'
                          ? 'bg-warning'
                          : order.status === 'cancelled'
                          ? 'bg-secondary'
                          : 'bg-danger'
                      }`}
                    >
                      {order.status.toUpperCase()}
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

export default AllOrders;
