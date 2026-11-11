import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { incidentAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { IncidentTypeBadge, CaseStatusBadge } from '../../components/StatusBadge';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const res = await incidentAPI.getIncidents();
      setIncidents(res.data);
    } catch (e) {
      console.error('Failed to load incidents', e);
    } finally {
      setLoading(false);
    }
  };

  const totalCases = incidents.length;
  const completedTasks = incidents.reduce((acc, inc) => acc + (inc.completed_actions_count || 0), 0);
  const totalTasks = incidents.reduce((acc, inc) => acc + (inc.total_actions_count || 0), 0);

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Welcome back, {user?.first_name || user?.username || 'Customer'}
          </h2>
          <p className="text-muted small mb-0">
            Track your financial fraud reports, first-hour action checklists, and complaint references.
          </p>
        </div>
        <Link to="/report-incident" className="btn btn-warning fw-semibold shadow-sm mt-3 mt-md-0">
          <i className="bi bi-plus-circle me-1"></i> Report New Incident
        </Link>
      </div>

      {/* Stats Summary Cards */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-3 p-3 bg-light">
            <span className="text-muted small fw-bold text-uppercase">Assistance Cases</span>
            <div className="d-flex align-items-center justify-content-between mt-2">
              <span className="display-6 fw-bold text-primary">{totalCases}</span>
              <i className="bi bi-folder-fill fs-2 text-primary opacity-50"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-3 p-3 bg-light">
            <span className="text-muted small fw-bold text-uppercase">Action Plan Progress</span>
            <div className="d-flex align-items-center justify-content-between mt-2">
              <span className="display-6 fw-bold text-success">
                {completedTasks} / {totalTasks}
              </span>
              <i className="bi bi-check-circle-fill fs-2 text-success opacity-50"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-3 p-3 bg-danger bg-opacity-10 border border-danger border-opacity-25">
            <span className="text-danger small fw-bold text-uppercase">Helpline 1930</span>
            <div className="d-flex align-items-center justify-content-between mt-2">
              <div>
                <a href="tel:1930" className="fw-bold text-danger fs-4 text-decoration-none">
                  Dial 1930
                </a>
                <span className="small d-block text-muted">24x7 Cybercrime Help</span>
              </div>
              <i className="bi bi-telephone-outbound-fill fs-2 text-danger"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Incidents Table / List */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-white py-3 border-bottom">
          <h5 className="fw-bold mb-0">Your Active Cases</h5>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Loading cases...</p>
            </div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted"></i>
              <h5 className="fw-bold mt-2">No cases registered yet</h5>
              <p className="text-muted small mb-3">
                Have you experienced a fraudulent debit or failed transaction?
              </p>
              <Link to="/report-incident" className="btn btn-primary btn-sm">
                Start Guided Report
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-uppercase">
                  <tr>
                    <th className="ps-4">Case Number</th>
                    <th>Provider / Channel</th>
                    <th>Incident Type</th>
                    <th>Amount</th>
                    <th>Date Reported</th>
                    <th>Checklist Progress</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((inc) => (
                    <tr key={inc.id}>
                      <td className="ps-4 fw-bold">
                        <Link to={`/cases/${inc.id}`} className="text-decoration-none">
                          {inc.case_number}
                        </Link>
                      </td>
                      <td>
                        <span className="fw-semibold">{inc.provider_name || 'Payment App'}</span>
                        <span className="d-block small text-muted">{inc.payment_method}</span>
                      </td>
                      <td>
                        <IncidentTypeBadge type={inc.incident_type} />
                      </td>
                      <td className="fw-bold text-dark">
                        ₹{parseFloat(inc.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="small text-muted">
                        {new Date(inc.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress flex-grow-1" style={{ height: '6px' }}>
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{
                                width: `${
                                  inc.total_actions_count > 0
                                    ? (inc.completed_actions_count / inc.total_actions_count) * 100
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                            {inc.completed_actions_count}/{inc.total_actions_count}
                          </span>
                        </div>
                      </td>
                      <td>
                        <CaseStatusBadge status={inc.status} />
                      </td>
                      <td className="text-end pe-4">
                        <Link to={`/cases/${inc.id}`} className="btn btn-outline-primary btn-sm">
                          View Case <i className="bi bi-arrow-right"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
