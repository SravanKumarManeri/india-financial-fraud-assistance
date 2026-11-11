import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        email,
        username: username || email.split('@')[0],
        mobile_number: mobileNumber,
        password,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.email?.[0] || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card shadow border-0 rounded-4 p-4">
            <div className="text-center mb-4">
              <i className="bi bi-person-plus-fill text-primary fs-1"></i>
              <h3 className="fw-bold mt-2">Create Customer Account</h3>
              <p className="text-muted small">Save your cases, download drafts, and upload evidence securely</p>
            </div>

            {error && <div className="alert alert-danger small py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address *</label>
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
                <label className="form-label small fw-semibold">Full Name / Display Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ramesh Patel"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Mobile Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+91-9876543210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
                <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                  Used solely in formal complaint drafts for bank & cybercrime portal reference.
                </span>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Password (min 8 characters) *</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  minLength={8}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-2 fw-semibold mb-3"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <div className="text-center small text-muted">
              Already have an account? <Link to="/login" className="fw-semibold">Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
