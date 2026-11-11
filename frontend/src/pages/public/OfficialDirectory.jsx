import React, { useState, useEffect } from 'react';
import { channelAPI } from '../../api';

const OfficialDirectory = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    setLoading(true);
    try {
      const res = await channelAPI.getChannels();
      setChannels(res.data);
    } catch (e) {
      console.error('Failed to load official channels', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredChannels = channels.filter((c) => {
    const matchesFilter = filterType === 'ALL' || c.channel_type === filterType;
    const matchesSearch =
      c.organization_name.toLowerCase().includes(search.toLowerCase()) ||
      c.display_value.toLowerCase().includes(search.toLowerCase()) ||
      c.purpose.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          <i className="bi bi-building-fill-check text-primary me-2"></i> Official Complaint Channels Directory
        </h2>
        <p className="text-muted">
          Admin-verified directory of official Indian financial regulators, emergency fraud helplines, and grievance escalation portals.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card shadow-sm border-0 mb-4 p-3 bg-light">
        <div className="row g-3">
          <div className="col-md-7">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by organization name (e.g. 1930, RBI CMS, NPCI, Cyber Crime)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-5">
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">All Official Channel Types</option>
              <option value="HELPLINE">Emergency Helplines</option>
              <option value="WEB_PORTAL">Official Web Portals</option>
              <option value="REGULATOR">Regulators (RBI / NPCI)</option>
              <option value="BANK_DISPUTE">Bank Dispute Desks</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading verified channels...</p>
        </div>
      ) : filteredChannels.length === 0 ? (
        <div className="alert alert-info text-center py-4">
          No official channels found matching your criteria.
        </div>
      ) : (
        <div className="row g-4">
          {filteredChannels.map((c) => (
            <div key={c.id} className="col-lg-6">
              <div className="card h-100 shadow-sm border rounded-3 p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                    {c.channel_type}
                  </span>
                  <span className="badge bg-success-subtle text-success">
                    <i className="bi bi-patch-check-fill me-1"></i> Verified
                  </span>
                </div>

                <h5 className="fw-bold mb-1">{c.organization_name}</h5>
                <div className="fs-5 text-danger fw-semibold mb-3">
                  {c.phone_number ? (
                    <a href={`tel:${c.phone_number}`} className="text-danger text-decoration-none">
                      <i className="bi bi-telephone-fill me-2"></i>{c.display_value}
                    </a>
                  ) : (
                    <span className="text-dark">
                      <i className="bi bi-globe me-2"></i>{c.display_value}
                    </span>
                  )}
                </div>

                <p className="text-muted small mb-3">{c.purpose}</p>

                {c.instructions && (
                  <div className="p-3 bg-light rounded small mb-3 border-start border-3 border-primary">
                    <strong className="text-dark d-block mb-1">How to Use:</strong>
                    <span className="text-muted">{c.instructions}</span>
                  </div>
                )}

                <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                  <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                    Verified on: {new Date(c.last_verified_at).toLocaleDateString()}
                  </span>
                  {c.destination_url && (
                    <a
                      href={c.destination_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Visit Official Destination <i className="bi bi-box-arrow-up-right ms-1"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfficialDirectory;
