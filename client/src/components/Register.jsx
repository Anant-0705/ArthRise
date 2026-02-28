import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';
import { GeneralContext } from '../context/GeneralContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(GeneralContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/users/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      login(data);
      toast.success('Registration successful!');
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
              <h2 className="fw-bold mb-2">Create Account</h2>
              <p className="text-muted">Start your investment journey</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-medium text-muted text-uppercase mb-2">Username</label>
                <input
                  type="text"
                  className="form-control form-control-lg border-0 bg-light shadow-none"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-medium text-muted text-uppercase mb-2">Email Address</label>
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
                <label className="form-label small fw-medium text-muted text-uppercase mb-2">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg border-0 bg-light shadow-none"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-medium text-muted text-uppercase mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg border-0 bg-light shadow-none"
                  name="confirmPassword"
                  value={formData.confirmPassword}
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
                    Creating Account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
            <p className="text-center mt-4 mb-0 text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-medium text-decoration-none">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
