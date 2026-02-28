import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div 
      className="min-vh-100 d-flex flex-column" 
      style={{ 
        marginTop: '-64px',
        paddingTop: '64px',
        backgroundColor: '#050510',
        backgroundImage: 'radial-gradient(circle at center, rgba(30, 45, 90, 0.4) 0%, rgba(5, 5, 16, 1) 60%), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'screen'
      }}
    >
      <div className="container-fluid flex-grow-1 d-flex flex-column justify-content-center text-center position-relative">
        <div className="row justify-content-center mt-5 mb-4">
          <div className="col-12 col-md-10 col-lg-8 z-2">
            <h1 className="fw-bold text-white mb-3 landing-hero-title" style={{ fontSize: '5.5rem', lineHeight: '1.05', letterSpacing: '-0.02em', textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}>
              Welcome to a Better<br/>Way to Trade
            </h1>
            
            <p className="lead mb-5 px-md-5 mx-md-5 landing-hero-sub" style={{ color: '#e2e8f0', fontSize: '1.4rem', fontWeight: '400' }}>
              Trade CFDs on FX, Indices, Commodities, Cryptocurrencies.
            </p>
            
            <div className="d-flex flex-column align-items-center mt-2">
              <Link 
                to="/register" 
                className="btn rounded-pill fw-bold landing-cta-btn" 
                style={{ padding: '0.9rem 2.8rem', fontSize: '1.1rem', backgroundColor: 'rgba(10,12,24,0.75)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', boxShadow: '0 0 30px rgba(0,0,0,0.5)' }}
              >
                Try Demo Account
              </Link>
              <div className="mt-4 small" style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                $0 forever, no credit card needed
              </div>
            </div>
          </div>
        </div>

        {/* Silhouette Overlay (Simulated astronaut effect) */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x z-1 w-100 text-center" style={{ pointerEvents: 'none' }}>
           <div className="d-flex flex-column align-items-center mb-4">
             <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#8b9bb4', textTransform: 'uppercase' }}>
               DISCOVER MORE
             </span>
             <i className="bi bi-chevron-down mt-2 text-white opacity-50" style={{ animation: 'bounce 2s infinite' }}></i>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
