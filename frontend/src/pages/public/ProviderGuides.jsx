import React, { useState, useEffect } from 'react';
import { providerAPI } from '../../api';

const ProviderGuides = () => {
  const [guides, setGuides] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [guidesRes, provsRes] = await Promise.all([
        providerAPI.getGuides(),
        providerAPI.getProviders(),
      ]);
      setGuides(guidesRes.data);
      setProviders(provsRes.data);
    } catch (e) {
      console.error('Failed to load guides', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuides = guides.filter((g) => {
    if (selectedProvider === 'ALL') return true;
    return String(g.provider) === String(selectedProvider);
  });

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          <i className="bi bi-phone-fill text-primary me-2"></i> Verified In-App Provider Guides
        </h2>
        <p className="text-muted">
          Official dispute redressal routes and grievance steps for PhonePe, Google Pay, Paytm, BHIM UPI, and banks.
        </p>
      </div>

      {/* Filter by Provider Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          className={`btn btn-sm ${selectedProvider === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setSelectedProvider('ALL')}
        >
          All Providers
        </button>
        {providers.map((p) => (
          <button
            key={p.id}
            className={`btn btn-sm ${selectedProvider === String(p.id) ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setSelectedProvider(String(p.id))}
          >
            <i className={`bi ${p.logo_icon || 'bi-wallet2'} me-1`}></i> {p.name}
          </button>
        ))}
      </div>

      {/* Warning on dynamic app UI */}
      <div className="alert alert-warning d-flex align-items-center mb-4 small" role="alert">
        <i className="bi bi-info-circle-fill fs-5 me-2 flex-shrink-0"></i>
        <div>
          <strong>Interface Accuracy Notice:</strong> Mobile app interfaces update frequently. If button names differ slightly, navigate to your payment history, select the transaction, and choose <strong>"Help"</strong> or <strong>"Having issues with this transaction?"</strong>.
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading verified provider instructions...</p>
        </div>
      ) : filteredGuides.length === 0 ? (
        <div className="alert alert-light text-center py-4 border">
          No published guides found for this selection.
        </div>
      ) : (
        <div className="row g-4">
          {filteredGuides.map((guide) => (
            <div key={guide.id} className="col-lg-6">
              <div className="card h-100 shadow-sm border rounded-3 p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-dark">
                    {guide.provider_name} &bull; {guide.payment_method}
                  </span>
                  <span className="badge bg-success-subtle text-success">
                    <i className="bi bi-check2-circle me-1"></i> Version {guide.version} (Verified)
                  </span>
                </div>

                <h5 className="fw-bold mb-3">{guide.title}</h5>

                <div className="mb-4">
                  <h6 className="small text-uppercase text-muted fw-bold mb-2">Ordered Steps to Raise Issue:</h6>
                  <ol className="list-group list-group-numbered list-group-flush small">
                    {Array.isArray(guide.steps_json) &&
                      guide.steps_json.map((step, idx) => (
                        <li key={idx} className="list-group-item px-0 py-2 bg-transparent text-secondary">
                          {typeof step === 'string' ? step : step.text || JSON.stringify(step)}
                        </li>
                      ))}
                  </ol>
                </div>

                <div className="mt-auto pt-3 border-top d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                    Last Verified: {new Date(guide.last_verified_at).toLocaleDateString()}
                  </span>
                  {guide.official_support_url && (
                    <a
                      href={guide.official_support_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      <i className="bi bi-box-arrow-up-right me-1"></i> Official {guide.provider_name} Support
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

export default ProviderGuides;
