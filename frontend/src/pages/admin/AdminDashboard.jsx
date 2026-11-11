import React, { useState, useEffect } from 'react';
import { dashboardAPI, providerAPI, channelAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.getMetrics();
      setMetrics(res.data);
    } catch (e) {
      console.error('Failed to load admin metrics', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading platform analytics...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-secondary text-uppercase small">Platform Operations</span>
          <h2 className="fw-bold mb-1">Administrative Analytics & Oversight</h2>
          <p className="text-muted small mb-0">
            Monitor citizen dispute volumes, content verification queues, and audit compliance.
          </p>
        </div>
        <button onClick={loadMetrics} className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Metrics
        </button>
      </div>

      {/* Metric Cards */}
      <div className="row g-3 mb-5">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-3 p-3 bg-light">
            <span className="text-muted small fw-bold text-uppercase">Total Assistance Cases</span>
            <span className="display-6 fw-bold text-primary mt-1">{metrics?.total_incidents || 0}</span>
            <span className="small text-muted mt-2">Citizen-reported incidents</span>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-3 p-3 bg-light">
            <span className="text-muted small fw-bold text-uppercase">Verified Providers</span>
            <span className="display-6 fw-bold text-success mt-1">{metrics?.total_providers || 0}</span>
            <span className="small text-muted mt-2">Active UPI & Banking apps</span>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-3 p-3 bg-light">
            <span className="text-muted small fw-bold text-uppercase">Provider Guides</span>
            <span className="display-6 fw-bold text-info mt-1">{metrics?.total_guides || 0}</span>
            <span className="small text-muted mt-2">In-app dispute workflows</span>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-3 p-3 bg-warning bg-opacity-10 border border-warning">
            <span className="text-warning-emphasis small fw-bold text-uppercase">Guides Needing Review</span>
            <span className="display-6 fw-bold text-warning-emphasis mt-1">{metrics?.guides_needing_review || 0}</span>
            <span className="small text-muted mt-2">Past review due date</span>
          </div>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="row g-4 mb-5">
        {/* Incidents by Type */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-3">Cases by Incident Category</h5>
            <div className="list-group list-group-flush">
              {metrics?.incidents_by_type?.map((item, idx) => (
                <div key={idx} className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small fw-semibold">{item.incident_type}</span>
                  <span className="badge bg-primary rounded-pill">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incidents by Provider */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-3">Cases by Payment Provider</h5>
            <div className="list-group list-group-flush">
              {metrics?.incidents_by_provider?.map((item, idx) => (
                <div key={idx} className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="small fw-semibold">{item.provider__name || 'Unspecified'}</span>
                  <span className="badge bg-secondary rounded-pill">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sensitive Operation Audit Logs */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Recent Audit Trail Events</h5>
          <span className="badge bg-secondary">Security & Action Logs</span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 small">
            <thead className="table-light">
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Resource ID</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.recent_audits?.map((log) => (
                <tr key={log.id}>
                  <td className="text-muted">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="fw-semibold">{log.actor__email || 'Anonymous'}</td>
                  <td>
                    <span className="badge bg-primary-subtle text-primary border">{log.action}</span>
                  </td>
                  <td>{log.resource_type}</td>
                  <td className="font-monospace text-muted">{log.resource_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
