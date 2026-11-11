import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { incidentAPI, complaintAPI, evidenceAPI, providerAPI } from '../../api';
import { IncidentTypeBadge, CaseStatusBadge, PriorityBadge } from '../../components/StatusBadge';

const CaseDetails = () => {
  const { id } = useParams();

  const [incident, setIncident] = useState(null);
  const [activeTab, setActiveTab] = useState('actions');
  const [loading, setLoading] = useState(true);

  // Draft state
  const [draft, setDraft] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // References state
  const [references, setReferences] = useState([]);
  const [newRef, setNewRef] = useState({
    organization_type: 'BANK',
    organization_name: '',
    reference_number: '',
    notes: '',
    submitted_at: new Date().toISOString().slice(0, 16),
  });
  const [savingRef, setSavingRef] = useState(false);

  // Evidence state
  const [evidenceList, setEvidenceList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDescription, setFileDescription] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  // Provider guide state
  const [providerGuide, setProviderGuide] = useState(null);

  useEffect(() => {
    loadCase();
  }, [id]);

  const loadCase = async () => {
    setLoading(true);
    try {
      const res = await incidentAPI.getIncident(id);
      setIncident(res.data);

      // Load associated data
      const [refsRes, evRes, draftRes] = await Promise.all([
        complaintAPI.getReferences(id),
        evidenceAPI.getEvidence(id),
        incidentAPI.getDraft(id),
      ]);
      setReferences(refsRes.data);
      setEvidenceList(evRes.data);
      setDraft(draftRes.data);

      // Load provider guide if provider is present
      if (res.data.provider) {
        const gRes = await providerAPI.getGuides({ provider: res.data.provider });
        if (gRes.data.length > 0) {
          setProviderGuide(gRes.data[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load incident details', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAction = async (itemId) => {
    try {
      await incidentAPI.toggleActionItem(itemId, {});
      // Refresh incident
      const res = await incidentAPI.getIncident(id);
      setIncident(res.data);
    } catch (e) {
      console.error('Failed to toggle action item', e);
    }
  };

  const handleAddReference = async (e) => {
    e.preventDefault();
    if (!newRef.reference_number || !newRef.organization_name) return;
    setSavingRef(true);
    try {
      await complaintAPI.addReference({
        incident: id,
        ...newRef,
        submitted_at: new Date(newRef.submitted_at).toISOString(),
      });
      setNewRef({
        organization_type: 'BANK',
        organization_name: '',
        reference_number: '',
        notes: '',
        submitted_at: new Date().toISOString().slice(0, 16),
      });
      const refsRes = await complaintAPI.getReferences(id);
      setReferences(refsRes.data);
      // Reload draft to reflect new reference
      const draftRes = await incidentAPI.getDraft(id);
      setDraft(draftRes.data);
    } catch (e) {
      console.error('Failed to add reference', e);
    } finally {
      setSavingRef(false);
    }
  };

  const handleUploadEvidence = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('incident', id);
      formData.append('file', selectedFile);
      formData.append('description', fileDescription);

      await evidenceAPI.uploadEvidence(formData);
      setSelectedFile(null);
      setFileDescription('');
      const evRes = await evidenceAPI.getEvidence(id);
      setEvidenceList(evRes.data);
      // Reload draft
      const draftRes = await incidentAPI.getDraft(id);
      setDraft(draftRes.data);
    } catch (e) {
      console.error('Failed to upload evidence', e);
      alert('Upload failed. Please ensure file is valid and under 10MB.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleCopyDraft = () => {
    if (!draft?.body_text) return;
    navigator.clipboard.writeText(draft.body_text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleDownloadDraft = () => {
    if (!draft?.body_text) return;
    const element = document.createElement('a');
    const file = new Blob([draft.body_text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Complaint_Draft_${incident.case_number}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await incidentAPI.patchIncident(id, { status: newStatus });
      setIncident((prev) => ({ ...prev, status: newStatus }));
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading incident details...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="container py-5 text-center">
        <h4>Incident not found or unauthorized access.</h4>
        <Link to="/dashboard" className="btn btn-primary mt-3">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <div className="mb-3">
        <Link to="/dashboard" className="text-decoration-none text-muted small">
          &larr; Back to My Cases
        </Link>
      </div>

      {/* Case Header Card */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-light">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <h3 className="fw-bold mb-0">{incident.case_number}</h3>
              <IncidentTypeBadge type={incident.incident_type} />
              <CaseStatusBadge status={incident.status} />
            </div>
            <p className="text-muted small mb-1">
              Provider: <strong>{incident.provider_details?.name || incident.payment_method}</strong> &bull; Txn Status: <strong>{incident.transaction_status}</strong> &bull; Reported: {new Date(incident.created_at).toLocaleString()}
            </p>
            {incident.transaction_reference && (
              <span className="badge bg-secondary me-2">
                Ref / UTR: {incident.transaction_reference}
              </span>
            )}
            {incident.beneficiary_details && (
              <span className="badge bg-light text-dark border">
                Beneficiary: {incident.beneficiary_details}
              </span>
            )}
          </div>

          <div className="text-md-end">
            <span className="text-muted small d-block">Disputed Amount</span>
            <span className="display-6 fw-bold text-danger">
              ₹{parseFloat(incident.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Change status control */}
        <div className="d-flex flex-wrap align-items-center gap-2 mt-3 pt-3 border-top">
          <span className="small text-muted fw-semibold">Update Case Status:</span>
          <select
            className="form-select form-select-sm w-auto"
            value={incident.status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="GUIDANCE_VIEWED">Guidance Viewed</option>
            <option value="CYBERCRIME_REPORTED">Cybercrime Reported (1930 / Portal)</option>
            <option value="BANK_CONTACTED">Bank Contacted</option>
            <option value="PROVIDER_CONTACTED">Provider Contacted</option>
            <option value="AWAITING_RESPONSE">Awaiting Response</option>
            <option value="RESOLVED_BY_CUSTOMER">Resolved by Customer</option>
            <option value="CLOSED">Case Closed</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs nav-fill mb-4">
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'actions' ? 'active text-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('actions')}
          >
            <i className="bi bi-list-check me-1"></i> First-Hour Action Plan ({incident.action_items?.length || 0})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'provider_guide' ? 'active text-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('provider_guide')}
          >
            <i className="bi bi-phone-fill me-1"></i> Provider Instructions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'draft' ? 'active text-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('draft')}
          >
            <i className="bi bi-file-earmark-text-fill me-1"></i> Formal Complaint Draft
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'references' ? 'active text-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('references')}
          >
            <i className="bi bi-hash me-1"></i> Official References ({references.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'evidence' ? 'active text-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('evidence')}
          >
            <i className="bi bi-paperclip me-1"></i> Evidence Files ({evidenceList.length})
          </button>
        </li>
      </ul>

      {/* TAB 1: Action Plan Checklist */}
      {activeTab === 'actions' && (
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1">Prioritized Action Plan</h4>
              <p className="text-muted small mb-0">
                Complete each urgent step. Click "Mark Done" once completed to track your progress.
              </p>
            </div>
            {incident.incident_type in { UNAUTHORIZED: 1, DECEIVED_PAYMENT: 1 } && (
              <a href="tel:1930" className="btn btn-danger btn-sm fw-bold">
                <i className="bi bi-telephone-fill me-1"></i> Call 1930
              </a>
            )}
          </div>

          <div className="d-flex flex-column gap-3">
            {incident.action_items?.map((item) => (
              <div
                key={item.id}
                className={`card border rounded-3 p-3 transition-hover ${
                  item.is_completed ? 'bg-light border-success opacity-75' : 'bg-white'
                }`}
              >
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                  <div className="d-flex align-items-start gap-3">
                    <input
                      type="checkbox"
                      className="form-check-input mt-1 fs-5"
                      checked={item.is_completed}
                      onChange={() => handleToggleAction(item.id)}
                    />
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <PriorityBadge priority={item.priority} />
                        <h6 className={`fw-bold mb-0 ${item.is_completed ? 'text-decoration-line-through text-muted' : ''}`}>
                          {item.title}
                        </h6>
                      </div>
                      <p className="small text-muted mb-2">{item.description}</p>

                      {item.customer_notes && (
                        <div className="p-2 bg-light rounded small text-dark border-start border-3 border-success mb-2">
                          <strong>Your Recorded Note:</strong> {item.customer_notes}
                        </div>
                      )}
                      {item.external_reference && (
                        <span className="badge bg-secondary me-2">
                          Ref: {item.external_reference}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 ms-auto">
                    {item.phone_action && (
                      <a href={`tel:${item.phone_action}`} className="btn btn-danger btn-sm">
                        <i className="bi bi-telephone-fill me-1"></i> Dial {item.phone_action}
                      </a>
                    )}
                    {item.official_url && (
                      <a
                        href={item.official_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="bi bi-box-arrow-up-right me-1"></i> Open Portal
                      </a>
                    )}
                    <button
                      className={`btn btn-sm ${item.is_completed ? 'btn-outline-secondary' : 'btn-success'}`}
                      onClick={() => handleToggleAction(item.id)}
                    >
                      {item.is_completed ? 'Mark Incomplete' : 'Mark Done'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Provider Instructions */}
      {activeTab === 'provider_guide' && (
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bold mb-1">
                {incident.provider_details?.name || 'Payment App'} Dispute Instructions
              </h4>
              <p className="text-muted small mb-0">Verified in-app navigation procedure</p>
            </div>
            {providerGuide && (
              <span className="badge bg-success-subtle text-success">
                Verified: {new Date(providerGuide.last_verified_at).toLocaleDateString()}
              </span>
            )}
          </div>

          {providerGuide ? (
            <div>
              <h6 className="fw-bold text-primary mb-3">{providerGuide.title}</h6>
              <ol className="list-group list-group-numbered mb-4">
                {Array.isArray(providerGuide.steps_json) &&
                  providerGuide.steps_json.map((step, idx) => (
                    <li key={idx} className="list-group-item py-3">
                      {typeof step === 'string' ? step : step.text || JSON.stringify(step)}
                    </li>
                  ))}
              </ol>

              {providerGuide.official_support_url && (
                <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Official Help Destination:</strong>
                    <div className="small text-muted">{providerGuide.official_support_url}</div>
                  </div>
                  <a
                    href={providerGuide.official_support_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Open Official Support <i className="bi bi-box-arrow-up-right ms-1"></i>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="alert alert-info">
              No specific in-app guide found for this provider. Open the transaction inside your bank / payment app, tap "Help" or "Support", and report a payment dispute.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Complaint Draft Generator */}
      {activeTab === 'draft' && (
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <div>
              <h4 className="fw-bold mb-1">Formal Complaint Draft</h4>
              <p className="text-muted small mb-0">
                Ready to copy and send to your Bank Manager, Nodal Grievance Officer, or National Cyber Portal.
              </p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary btn-sm" onClick={handleCopyDraft}>
                <i className="bi bi-clipboard me-1"></i> {copySuccess ? 'Copied to Clipboard!' : 'Copy Draft'}
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleDownloadDraft}>
                <i className="bi bi-download me-1"></i> Download (.txt)
              </button>
            </div>
          </div>

          {copySuccess && (
            <div className="alert alert-success py-2 small mb-3">
              <i className="bi bi-check-circle-fill me-1"></i> Draft text copied to clipboard! Paste it into your email or grievance portal.
            </div>
          )}

          <div className="p-3 bg-dark text-light rounded-3 font-monospace small" style={{ whiteSpace: 'pre-wrap', maxHeight: '500px', overflowY: 'auto' }}>
            {draft?.body_text || 'Generating draft...'}
          </div>
        </div>
      )}

      {/* TAB 4: References Tracker */}
      {activeTab === 'references' && (
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <h4 className="fw-bold mb-3">Official Complaint Reference Numbers</h4>
          <p className="text-muted small mb-4">
            Record tracking reference numbers provided by 1930, cybercrime.gov.in, your bank, or payment app.
          </p>

          {/* Add New Reference Form */}
          <form onSubmit={handleAddReference} className="bg-light p-3 rounded-3 mb-4">
            <h6 className="fw-bold mb-3">Add New Reference Record</h6>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Organization Type</label>
                <select
                  className="form-select form-select-sm"
                  value={newRef.organization_type}
                  onChange={(e) => setNewRef({ ...newRef, organization_type: e.target.value })}
                >
                  <option value="CYBERCRIME_PORTAL">1930 / Cyber Crime Portal</option>
                  <option value="BANK">Bank Dispute Desk</option>
                  <option value="PROVIDER">Payment App (PhonePe/GPay)</option>
                  <option value="POLICE">Local Police Station</option>
                  <option value="RBI_CMS">RBI Ombudsman (CMS)</option>
                  <option value="OTHER">Other Authority</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold">Organization Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="e.g. State Bank of India or 1930 NCRP"
                  required
                  value={newRef.organization_name}
                  onChange={(e) => setNewRef({ ...newRef, organization_name: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-semibold">Reference / Ticket ID</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="e.g. NCRP-2026-IN-XXXX"
                  required
                  value={newRef.reference_number}
                  onChange={(e) => setNewRef({ ...newRef, reference_number: e.target.value })}
                />
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" disabled={savingRef} className="btn btn-primary btn-sm w-100">
                  {savingRef ? 'Saving...' : 'Save Ref'}
                </button>
              </div>
            </div>
          </form>

          {/* References Table */}
          {references.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              No complaint references recorded yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light small">
                  <tr>
                    <th>Authority</th>
                    <th>Reference Number</th>
                    <th>Submitted On</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {references.map((r) => (
                    <tr key={r.id}>
                      <td className="fw-semibold">
                        {r.organization_name}
                        <span className="d-block small text-muted">{r.organization_type}</span>
                      </td>
                      <td className="fw-bold font-monospace text-primary">{r.reference_number}</td>
                      <td className="small text-muted">{new Date(r.submitted_at).toLocaleDateString()}</td>
                      <td>
                        <span className="badge bg-secondary">{r.status}</span>
                      </td>
                      <td className="small text-muted">{r.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Evidence Management */}
      {activeTab === 'evidence' && (
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <h4 className="fw-bold mb-3">Supporting Evidence Management</h4>
          <p className="text-muted small mb-4">
            Upload transaction screenshots, bank statement extracts, and SMS alerts. Files are stored securely and never accessible publicly.
          </p>

          {/* Upload Form */}
          <form onSubmit={handleUploadEvidence} className="bg-light p-3 rounded-3 mb-4">
            <h6 className="fw-bold mb-3">Upload New Evidence</h6>
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label small fw-semibold">Select File (PNG, JPG, PDF - max 10MB)</label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  required
                  accept=".jpg,.jpeg,.png,.webp,.pdf,.txt"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>

              <div className="col-md-5">
                <label className="form-label small fw-semibold">Description / Label</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="e.g. PhonePe transaction confirmation screenshot"
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                />
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" disabled={uploadingFile || !selectedFile} className="btn btn-primary btn-sm w-100">
                  {uploadingFile ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </form>

          {/* Evidence List */}
          {evidenceList.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              No evidence files uploaded yet.
            </div>
          ) : (
            <div className="row g-3">
              {evidenceList.map((ev) => (
                <div key={ev.id} className="col-md-6">
                  <div className="card border p-3 rounded-3 d-flex flex-row justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <i className="bi bi-file-earmark-check fs-2 text-primary"></i>
                      <div>
                        <strong className="d-block text-truncate" style={{ maxWidth: '250px' }}>
                          {ev.file_name}
                        </strong>
                        <span className="small text-muted">
                          {ev.description || 'Evidence document'} &bull; {(ev.file_size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                    {ev.file && (
                      <a href={ev.file} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-download"></i>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CaseDetails;
