import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { providerAPI, incidentAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { IncidentTypeBadge } from '../../components/StatusBadge';

const IncidentWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    payment_method: 'UPI',
    provider: '',
    did_not_authorize: false,
    was_deceived: false,
    money_debited: true,
    transaction_status: 'SUCCESS',
    sent_to_wrong_recipient: false,
    product_or_service_not_delivered: false,
    amount: '',
    transaction_datetime: new Date().toISOString().slice(0, 16),
    transaction_reference: '',
    beneficiary_details: '',
    customer_description: '',
  });

  const [classificationResult, setClassificationResult] = useState(null);

  useEffect(() => {
    loadProviders();
    // Handle quick start preset from Landing Page
    const quickType = location.state?.quickType;
    if (quickType) {
      if (quickType === 'DECEIVED_PAYMENT') {
        setFormData((prev) => ({ ...prev, was_deceived: true, did_not_authorize: false }));
      } else if (quickType === 'UNAUTHORIZED') {
        setFormData((prev) => ({ ...prev, did_not_authorize: true, was_deceived: false }));
      } else if (quickType === 'FAILED_DEBITED') {
        setFormData((prev) => ({ ...prev, transaction_status: 'FAILED', money_debited: true }));
      } else if (quickType === 'WRONG_TRANSFER') {
        setFormData((prev) => ({ ...prev, sent_to_wrong_recipient: true }));
      }
    }
  }, [location.state]);

  const loadProviders = async () => {
    try {
      const res = await providerAPI.getProviders();
      setProviders(res.data);
      if (res.data.length > 0 && !formData.provider) {
        setFormData((prev) => ({ ...prev, provider: res.data[0].id }));
      }
    } catch (e) {
      console.error('Failed to load providers', e);
    }
  };

  const handleNextToClassification = async () => {
    setLoading(true);
    try {
      const res = await incidentAPI.classify({
        payment_method: formData.payment_method,
        provider_id: formData.provider,
        did_not_authorize: formData.did_not_authorize,
        was_deceived: formData.was_deceived,
        money_debited: formData.money_debited,
        transaction_status: formData.transaction_status,
        sent_to_wrong_recipient: formData.sent_to_wrong_recipient,
        product_or_service_not_delivered: formData.product_or_service_not_delivered,
        amount: formData.amount || 0,
        customer_description: formData.customer_description,
      });
      setClassificationResult(res.data);
      setStep(4);
    } catch (e) {
      console.error('Classification error', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/report-incident', incidentData: formData } });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        transaction_datetime: formData.transaction_datetime ? new Date(formData.transaction_datetime).toISOString() : null,
      };
      const res = await incidentAPI.createIncident(payload);
      navigate(`/cases/${res.data.id}`);
    } catch (e) {
      console.error('Failed to save case', e);
      alert('Could not save case. Please verify the entered information.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="max-w-800 mx-auto">
        {/* Stepper Header */}
        <div className="mb-4 text-center">
          <h2 className="fw-bold">Report a Transaction Issue</h2>
          <p className="text-muted small">
            Follow the guided intake to determine your official redressal route and first-hour plan.
          </p>

          <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
            {[
              { num: 1, label: 'App / Method' },
              { num: 2, label: 'What Happened' },
              { num: 3, label: 'Txn Details' },
              { num: 4, label: 'Action Plan' },
            ].map((s) => (
              <div key={s.num} className="d-flex align-items-center">
                <span
                  className={`badge rounded-circle p-2 ${
                    step >= s.num ? 'bg-primary text-white' : 'bg-light text-muted border'
                  }`}
                  style={{ width: '32px', height: '32px' }}
                >
                  {s.num}
                </span>
                <span className="small ms-1 fw-semibold d-none d-md-inline text-muted me-2">
                  {s.label}
                </span>
                {s.num < 4 && <span className="text-muted me-2">&rarr;</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Provider & Payment Method Selection */}
        {step === 1 && (
          <div className="card shadow-sm border-0 rounded-4 p-4">
            <h4 className="fw-bold mb-3">1. Select Payment App or Channel</h4>
            <p className="text-muted small mb-4">
              Which application or banking platform was used for this disputed transaction?
            </p>

            <div className="mb-4">
              <label className="form-label fw-semibold small">Payment Method</label>
              <div className="d-flex flex-wrap gap-2">
                {['UPI', 'CARD', 'NETBANKING', 'WALLET'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`btn btn-sm ${
                      formData.payment_method === m ? 'btn-primary' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setFormData({ ...formData, payment_method: m })}
                  >
                    {m === 'UPI' && <i className="bi bi-qr-code me-1"></i>}
                    {m === 'CARD' && <i className="bi bi-credit-card me-1"></i>}
                    {m === 'NETBANKING' && <i className="bi bi-bank me-1"></i>}
                    {m === 'WALLET' && <i className="bi bi-wallet2 me-1"></i>}
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small">Payment Provider / Bank App</label>
              <div className="row g-3">
                {providers.map((p) => (
                  <div key={p.id} className="col-md-4 col-sm-6">
                    <div
                      className={`card h-100 p-3 text-center border-2 cursor-pointer ${
                        String(formData.provider) === String(p.id)
                          ? 'border-primary bg-primary bg-opacity-10'
                          : 'border-light bg-light'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setFormData({ ...formData, provider: p.id })}
                    >
                      <i className={`bi ${p.logo_icon || 'bi-wallet2'} fs-2 mb-2 text-primary`}></i>
                      <h6 className="fw-bold mb-0">{p.name}</h6>
                      <span className="small text-muted">{p.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-primary px-4 fw-semibold"
                disabled={!formData.provider}
                onClick={() => setStep(2)}
              >
                Next: What Happened &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Step 2: What Happened? (Intake Questions) */}
        {step === 2 && (
          <div className="card shadow-sm border-0 rounded-4 p-4">
            <h4 className="fw-bold mb-3">2. Tell Us What Happened</h4>
            <p className="text-muted small mb-4">
              Answer these questions honestly to help our classification engine pinpoint whether this is a criminal fraud or a banking reversal issue.
            </p>

            <div className="mb-3 p-3 bg-light rounded-3">
              <label className="fw-semibold small d-block mb-2">
                Did you personally approve or enter your UPI PIN / OTP for this payment?
              </label>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="approval"
                  id="appYes"
                  checked={!formData.did_not_authorize}
                  onChange={() => setFormData({ ...formData, did_not_authorize: false })}
                />
                <label className="form-check-label" htmlFor="appYes">
                  Yes, I personally approved / entered my PIN
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="approval"
                  id="appNo"
                  checked={formData.did_not_authorize}
                  onChange={() => setFormData({ ...formData, did_not_authorize: true, was_deceived: false })}
                />
                <label className="form-check-label" htmlFor="appNo">
                  No, I did NOT authorize this (Unauthorized Debit / SIM Swap / Hack)
                </label>
              </div>
            </div>

            {!formData.did_not_authorize && (
              <div className="mb-3 p-3 bg-light rounded-3">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="deceivedSwitch"
                    checked={formData.was_deceived}
                    onChange={(e) => setFormData({ ...formData, was_deceived: e.target.checked })}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="deceivedSwitch">
                    Were you tricked, deceived, or scammed into approving this payment?
                  </label>
                </div>
                <span className="small text-muted d-block mt-1">
                  Examples: Fake customer care caller, electricity bill disconnection threat, lottery/job offer scam, fake seller QR code.
                </span>
              </div>
            )}

            <div className="mb-3 p-3 bg-light rounded-3">
              <label className="fw-semibold small d-block mb-2">
                What does the payment status show on the app?
              </label>
              <select
                className="form-select"
                value={formData.transaction_status}
                onChange={(e) => setFormData({ ...formData, transaction_status: e.target.value })}
              >
                <option value="SUCCESS">Successful / Completed</option>
                <option value="FAILED">Failed</option>
                <option value="PENDING">Pending / Processing</option>
                <option value="UNKNOWN">Unsure</option>
              </select>
            </div>

            <div className="mb-3 p-3 bg-light rounded-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="debitedSwitch"
                  checked={formData.money_debited}
                  onChange={(e) => setFormData({ ...formData, money_debited: e.target.checked })}
                />
                <label className="form-check-label fw-semibold" htmlFor="debitedSwitch">
                  Was money debited / deducted from your bank account or wallet?
                </label>
              </div>
            </div>

            <div className="mb-3 p-3 bg-light rounded-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="wrongSwitch"
                  checked={formData.sent_to_wrong_recipient}
                  onChange={(e) => setFormData({ ...formData, sent_to_wrong_recipient: e.target.checked })}
                />
                <label className="form-check-label fw-semibold" htmlFor="wrongSwitch">
                  Did you mistakenly send funds to the wrong person / incorrect UPI ID?
                </label>
              </div>
            </div>

            <div className="mb-4 p-3 bg-light rounded-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="merchantSwitch"
                  checked={formData.product_or_service_not_delivered}
                  onChange={(e) => setFormData({ ...formData, product_or_service_not_delivered: e.target.checked })}
                />
                <label className="form-check-label fw-semibold" htmlFor="merchantSwitch">
                  Is this a merchant dispute where goods/services were not delivered?
                </label>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setStep(1)}>
                &larr; Back
              </button>
              <button type="button" className="btn btn-primary px-4 fw-semibold" onClick={() => setStep(3)}>
                Next: Transaction Details &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Transaction Details */}
        {step === 3 && (
          <div className="card shadow-sm border-0 rounded-4 p-4">
            <h4 className="fw-bold mb-3">3. Transaction Details</h4>
            <p className="text-muted small mb-4">
              Enter known particulars. These are essential for filing with 1930 and generating your formal bank complaint draft.
            </p>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Amount (₹ INR) *</label>
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="e.g. 10000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Date & Time of Transaction</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={formData.transaction_datetime}
                  onChange={(e) => setFormData({ ...formData, transaction_datetime: e.target.value })}
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Transaction Reference / UTR Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 432109876543 or UTR"
                  value={formData.transaction_reference}
                  onChange={(e) => setFormData({ ...formData, transaction_reference: e.target.value })}
                />
                <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                  Found on the app transaction receipt or in your bank debit SMS.
                </span>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Receiver Details / Beneficiary VPA</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. receiver@upi or mobile number"
                  value={formData.beneficiary_details}
                  onChange={(e) => setFormData({ ...formData, beneficiary_details: e.target.value })}
                />
                <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                  Never enter PINs, OTPs, or passwords here.
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold">Describe What Happened (In Your Own Words)</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Briefly state the circumstances (e.g. received call about power bill, asked to pay ₹10,000 for verification...)"
                value={formData.customer_description}
                onChange={(e) => setFormData({ ...formData, customer_description: e.target.value })}
              ></textarea>
            </div>

            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setStep(2)}>
                &larr; Back
              </button>
              <button
                type="button"
                className="btn btn-primary px-4 fw-semibold"
                disabled={loading}
                onClick={handleNextToClassification}
              >
                {loading ? 'Evaluating Rules...' : 'Evaluate & View Action Plan \u2192'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Classification Result & First-Hour Guidance */}
        {step === 4 && classificationResult && (
          <div className="card shadow-sm border-0 rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="small text-uppercase text-muted fw-bold">Classification Result</span>
              <IncidentTypeBadge type={classificationResult.incident_type} />
            </div>

            {/* Suspected Cyber Fraud High Urgency Warning */}
            {classificationResult.is_cyber_fraud_suspected ? (
              <div className="alert alert-danger p-4 rounded-3 border-danger mb-4">
                <div className="d-flex align-items-start">
                  <i className="bi bi-shield-exclamation fs-1 text-danger me-3 flex-shrink-0"></i>
                  <div>
                    <h5 className="fw-bold text-danger mb-1">
                      SUSPECTED CYBER FRAUD: IMMEDIATE ACTION REQUIRED
                    </h5>
                    <p className="small mb-3">
                      {classificationResult.primary_reason}
                    </p>
                    <div className="p-3 bg-white rounded border border-danger border-opacity-50">
                      <strong className="d-block text-danger mb-2">Priority Golden Hour Actions:</strong>
                      <ol className="mb-0 ps-3 small text-dark">
                        {classificationResult.urgent_actions.map((act, i) => (
                          <li key={i} className="mb-1">{act}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-info p-4 rounded-3 border-info mb-4">
                <div className="d-flex align-items-start">
                  <i className="bi bi-info-circle-fill fs-2 text-info me-3 flex-shrink-0"></i>
                  <div>
                    <h5 className="fw-bold text-dark mb-1">Payment Redressal Guidance</h5>
                    <p className="small mb-2 text-dark">{classificationResult.primary_reason}</p>
                    <ul className="mb-0 ps-3 small text-muted">
                      {classificationResult.urgent_actions.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Legal Disclaimer Box */}
            <div className="p-3 bg-light rounded text-muted small mb-4">
              <i className="bi bi-info-circle me-1"></i>
              {classificationResult.disclaimer}
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setStep(3)}>
                &larr; Edit Details
              </button>

              <button
                type="button"
                className="btn btn-success btn-lg px-4 fw-bold"
                disabled={submitting}
                onClick={handleFinalSubmit}
              >
                {submitting ? 'Generating Plan...' : isAuthenticated ? 'Save Case & Open Action Plan \u2192' : 'Log In / Register to Save Case \u2192'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentWizard;
