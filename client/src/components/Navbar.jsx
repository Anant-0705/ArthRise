import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';

const Navbar = () => {
  const { user, logout } = useContext(GeneralContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: 'rgba(5, 5, 16, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container-fluid px-4 py-2">
        <Link className="navbar-brand fw-bold fs-5 text-white d-flex align-items-center" to="/">
          <i className="bi bi-heptagon-half me-2 fs-4"></i>
          ArthRise
        </Link>
        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <i className="bi bi-list fs-2"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto align-items-center">
            {user ? (
              <>
                <li className="nav-item mx-2">
                  <Link className="nav-link text-white-50 hover-white px-2" style={{fontSize: '0.9rem'}} to="/home">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link text-white-50 hover-white px-2" style={{fontSize: '0.9rem'}} to="/portfolio">
                    Portfolio
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link text-white-50 hover-white px-2" style={{fontSize: '0.9rem'}} to="/history">
                    Markets
                  </Link>
                </li>
                {user.role === 'admin' && (
                  <li className="nav-item dropdown mx-2">
                    <a
                      className="nav-link dropdown-toggle text-white-50 hover-white px-2" style={{fontSize: '0.9rem'}}
                      href="#"
                      id="adminDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      Admin
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark border-0 shadow-lg rounded-3 mt-2" style={{backgroundColor: '#0b0f19'}}>
                      <li><Link className="dropdown-item" to="/admin">Stocks</Link></li>
                      <li><Link className="dropdown-item" to="/users">Users</Link></li>
                      <li><Link className="dropdown-item" to="/all-orders">Orders</Link></li>
                      <li><Link className="dropdown-item" to="/all-transactions">Transactions</Link></li>
                    </ul>
                  </li>
                )}
                <li className="nav-item mx-2">
                  <Link className="nav-link text-white-50 hover-white px-2" style={{fontSize: '0.9rem'}} to="/profile">
                    Profile
                  </Link>
                </li>
              </>
            ) : null}
          </ul>
          
          <div className="d-flex align-items-center">
            {/* Search Bar matching screenshot */}
            <div className="d-none d-lg-flex position-relative me-4">
              <i className="bi bi-search position-absolute text-muted" style={{top: '50%', transform: 'translateY(-50%)', left: '12px'}}></i>
              <input 
                type="text" 
                className="form-control bg-transparent border-0 rounded-pill text-white py-1 ps-5 pe-3" 
                placeholder="Search" 
                style={{backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '0.9rem', width: '200px'}}
              />
              <span className="position-absolute text-muted small" style={{top: '50%', transform: 'translateY(-50%)', right: '12px', fontSize: '0.75rem'}}>
                (Ctrl+K)
              </span>
            </div>

            <div className="d-flex align-items-center text-white-50 me-4" style={{fontSize: '0.9rem'}}>
              <i className="bi bi-globe me-1"></i> EN
            </div>

            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="text-white-50 small navbar-balance">Balance: <strong className="text-white">${user.balance?.toLocaleString()}</strong></span>
                <i className="bi bi-person text-white-50 fs-5 cursor-pointer hover-white" title="Profile"></i>
                <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-3">
                <Link to="/login" className="text-white-50 hover-white">
                  <i className="bi bi-person fs-5"></i>
                </Link>
                <Link className="btn btn-light text-dark rounded-pill px-4 fw-bold"  style={{ padding: '0.9rem 2.8rem', fontSize: '1.1rem', backgroundColor: 'rgba(10,12,24,0.75)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', boxShadow: '0 0 30px rgba(0,0,0,0.5)' }} to="/register">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
