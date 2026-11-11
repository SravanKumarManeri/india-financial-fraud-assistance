import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Urgent Emergency Alert Bar */}
      <div className="bg-danger text-white py-1 px-3 d-flex justify-content-between align-items-center small">
        <div className="container d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Suspected Cyber Fraud / Money Lost?</strong> Call the National Cyber Helpline promptly at <strong>1930</strong> or report at <strong>cybercrime.gov.in</strong>
          </div>
          <a href="tel:1930" className="btn btn-sm btn-light text-danger fw-bold py-0 px-2 mt-1 mt-sm-0">
            <i className="bi bi-telephone-fill me-1"></i> Call 1930 Now
          </a>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <i className="bi bi-shield-lock-fill text-warning fs-3 me-2"></i>
            <div>
              <span className="fw-bold tracking-tight">FraudAssist India</span>
              <span className="d-block small text-light opacity-75" style={{ fontSize: '0.65rem' }}>
                Financial Fraud & Payment Dispute Navigator
              </span>
            </div>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
              <li className="nav-item">
                <Link className="nav-link" to="/emergency-guide">
                  <i className="bi bi-lightning-charge-fill text-warning me-1"></i> First-Hour Guide
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/provider-guides">
                  <i className="bi bi-phone-fill me-1"></i> Provider Guides
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/official-channels">
                  <i className="bi bi-building-fill-check me-1"></i> Official Channels
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/report-incident" className="btn btn-warning btn-sm fw-semibold">
                    <i className="bi bi-plus-circle me-1"></i> Report Issue
                  </Link>
                  <Link to="/dashboard" className="btn btn-outline-light btn-sm">
                    <i className="bi bi-grid-fill me-1"></i> My Cases
                  </Link>
                  {user?.role in { ADMIN: 1, CONTENT_ADMIN: 1, SUPPORT_AGENT: 1 } && (
                    <Link to="/admin" className="btn btn-outline-info btn-sm">
                      <i className="bi bi-speedometer2 me-1"></i> Admin
                    </Link>
                  )}
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary btn-sm dropdown-toggle"
                      type="button"
                      id="userMenu"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-person-circle me-1"></i> {user?.username || user?.email}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow">
                      <li className="dropdown-header small text-muted">
                        Role: <span className="badge bg-secondary">{user?.role}</span>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                          <i className="bi bi-box-arrow-right me-2"></i> Log Out
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/report-incident" className="btn btn-warning btn-sm fw-semibold">
                    <i className="bi bi-exclamation-octagon-fill me-1"></i> Check My Issue
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-sm">
                    Log In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
