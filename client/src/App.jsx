import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GeneralProvider, GeneralContext } from './context/GeneralContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import History from './pages/History';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Users from './pages/Users';
import AllOrders from './pages/AllOrders';
import AllTransactions from './pages/AllTransactions';
import StockChart from './pages/StockChart';
import AdminStockChart from './pages/AdminStockChart';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(GeneralContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(GeneralContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return user && user.role === 'admin' ? children : <Navigate to="/home" />;
};

function AppRoutes() {
  const { user } = useContext(GeneralContext);

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Landing />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/home" /> : <Register />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock-chart"
          element={
            <ProtectedRoute>
              <StockChart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />
        <Route
          path="/all-orders"
          element={
            <AdminRoute>
              <AllOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/all-transactions"
          element={
            <AdminRoute>
              <AllTransactions />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-stock-chart"
          element={
            <AdminRoute>
              <AdminStockChart />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

function App() {
  return (
    <GeneralProvider>
      <Router>
        <AppRoutes />
      </Router>
    </GeneralProvider>
  );
}

export default App;
