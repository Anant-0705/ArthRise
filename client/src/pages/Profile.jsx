import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';
import { GeneralContext } from '../context/GeneralContext';

const Profile = () => {
  const { user, updateUser } = useContext(GeneralContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const { data } = await axiosInstance.put('/users/profile', updateData);
      updateUser(data);
      toast.success('Profile updated successfully');
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h2 className="mb-4 text-white fw-bold">My Profile</h2>

          {/* Account Info Card */}
          <div className="aesthetic-card p-4 mb-4">
            <h5 className="fw-bold text-white mb-4">Account Information</h5>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-muted small fw-medium text-uppercase" style={{ letterSpacing: '0.06em' }}>Balance</span>
                <span className="fw-bold text-success fs-5">${user?.balance?.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-muted small fw-medium text-uppercase" style={{ letterSpacing: '0.06em' }}>Role</span>
                <span className="badge px-3 py-2 rounded-pill" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem' }}>{user?.role}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2">
                <span className="text-muted small fw-medium text-uppercase" style={{ letterSpacing: '0.06em' }}>Member Since</span>
                <span className="text-white">{new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Update Profile Card */}
          <div className="aesthetic-card p-4">
            <h5 className="fw-bold text-white mb-4">Update Profile</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-medium text-muted text-uppercase mb-2" style={{ letterSpacing: '0.06em' }}>Username</label>
                <input
                  type="text"
                  className="form-control form-control-lg shadow-none"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-medium text-muted text-uppercase mb-2" style={{ letterSpacing: '0.06em' }}>Email</label>
                <input
                  type="email"
                  className="form-control form-control-lg shadow-none"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-medium text-muted text-uppercase mb-2" style={{ letterSpacing: '0.06em' }}>New Password <span className="text-muted fw-normal normal-case">(optional)</span></label>
                <input
                  type="password"
                  className="form-control form-control-lg shadow-none"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  minLength="6"
                />
              </div>
              <div className="mb-5">
                <label className="form-label small fw-medium text-muted text-uppercase mb-2" style={{ letterSpacing: '0.06em' }}>Confirm New Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg shadow-none"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg w-100 rounded-pill fw-bold"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</>
                ) : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
