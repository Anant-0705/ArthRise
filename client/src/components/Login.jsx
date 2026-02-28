import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';
import { GeneralContext } from '../context/GeneralContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(GeneralContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/users/login', formData);
      login(data);
      toast.success('Login successful!');
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="aesthetic-card p-4 p-md-5">
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-2">Welcome Back</h2>
              <p className="text-muted">Sign in to continue to Arthrise</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-medium text-muted text-uppercase mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg border-0 bg-light shadow-none"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-medium text-muted text-uppercase mb-0">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  className="form-control form-control-lg border-0 bg-light shadow-none"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 rounded-pill mt-4 fw-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
            <p className="text-center mt-4 mb-0 text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary fw-medium text-decoration-none">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
