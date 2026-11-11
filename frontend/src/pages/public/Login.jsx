import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card shadow border-0 rounded-4 p-4">
            <div className="text-center mb-4">
              <i className="bi bi-shield-lock-fill text-warning fs-1"></i>
              <h3 className="fw-bold mt-2">Log In</h3>
              <p className="text-muted small">Access your assistance cases and complaint timeline</p>
            </div>

            {error && <div className="alert alert-danger small py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-2 fw-semibold mb-3"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="text-center small text-muted mb-4">
              Don’t have an account? <Link to="/register" className="fw-semibold">Register here</Link>
            </div>

            {/* Quick Demo Credentials */}
            <div className="border-top pt-3">
              <span className="small text-muted d-block text-center fw-semibold mb-2">
                Quick Demo Accounts (1-Click Fill):
              </span>
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm text-start"
                  onClick={() => handleQuickDemo('rahul.sharma@example.com', 'Customer@12345')}
                >
                  <i className="bi bi-person-fill me-1 text-primary"></i> <strong>Customer:</strong> rahul.sharma@example.com
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm text-start"
                  onClick={() => handleQuickDemo('admin@fraudassist.in', 'Admin@12345')}
                >
                  <i className="bi bi-shield-shaded me-1 text-danger"></i> <strong>Admin:</strong> admin@fraudassist.in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
