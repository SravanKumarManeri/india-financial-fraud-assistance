import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleQuickStart = (type) => {
    navigate('/report-incident', { state: { quickType: type } });
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="bg-gradient bg-primary text-white py-5 shadow-sm">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 shadow-sm">
                <i className="bi bi-shield-check me-1"></i> India National Payment Dispute & Fraud Navigator
              </span>
              <h1 className="display-5 fw-bold mb-3 tracking-tight">
                Had a suspicious or failed payment? We’ll guide you through the next steps.
              </h1>
              <p className="lead mb-4 text-white opacity-90">
                Don’t panic. Whether you transferred money to a scammer on PhonePe, suffered an unauthorized bank debit,
                or faced a failed UPI transfer where money was deducted, follow calm, prioritized steps to protect your funds.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/report-incident" className="btn btn-warning btn-lg px-4 fw-bold shadow">
                  <i className="bi bi-compass me-2"></i> Start Guided Assistance
                </Link>
                <Link to="/emergency-guide" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-lightning-fill text-warning me-1"></i> First-Hour Emergency Plan
                </Link>
              </div>

              {/* Instant Safety Reminder */}
              <div className="mt-4 pt-3 border-top border-white border-opacity-25 d-flex align-items-center text-white-50 small">
                <i className="bi bi-lock-fill text-warning fs-5 me-2"></i>
                <span>Never share your UPI PIN, OTP, or CVV. No bank or police official will ever ask for them.</span>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                <div className="card-header bg-danger text-white py-3 text-center">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-telephone-outbound-fill me-2"></i> Immediate Emergency Callout
                  </h5>
                </div>
                <div className="card-body p-4 bg-light">
                  <div className="text-center mb-3">
                    <span className="text-muted d-block small">National Cyber Crime Reporting Helpline</span>
                    <a href="tel:1930" className="display-4 fw-bold text-danger text-decoration-none">
                      1930
                    </a>
                    <span className="d-block badge bg-danger text-white py-1 px-3 mt-1">24x7 Toll-Free Citizen Helpline</span>
                  </div>

                  <p className="small text-muted text-center mb-3">
                    Calling <strong>1930</strong> within the first hour of financial fraud triggers an instant interbank freeze alert across the Indian banking network before fraudsters withdraw the money.
                  </p>

                  <div className="d-grid gap-2">
                    <a href="tel:1930" className="btn btn-danger fw-semibold">
                      <i className="bi bi-telephone-fill me-2"></i> Call 1930 Right Now
                    </a>
                    <a
                      href="https://cybercrime.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-dark btn-sm"
                    >
                      <i className="bi bi-box-arrow-up-right me-1"></i> Visit cybercrime.gov.in
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Problem Selector */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center max-w-700 mx-auto mb-5">
            <h2 className="fw-bold">What happened with your payment?</h2>
            <p className="text-muted">
              Select your situation below to instantly see the correct, prioritized course of action:
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 border-top border-4 border-danger rounded-3 transition-hover">
                <div className="card-body p-4 text-center">
                  <div className="rounded-circle bg-danger bg-opacity-10 text-danger p-3 d-inline-flex mb-3">
                    <i className="bi bi-shield-x fs-2"></i>
                  </div>
                  <h5 className="fw-bold">I Suspect Online Fraud</h5>
                  <p className="small text-muted">
                    Tricked into approving a payment, fake electricity bill caller, remote app scam, or deceptive QR code.
                  </p>
                  <button
                    onClick={() => handleQuickStart('DECEIVED_PAYMENT')}
                    className="btn btn-outline-danger btn-sm w-100 mt-2 fw-semibold"
                  >
                    Act Now &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 border-top border-4 border-warning rounded-3 transition-hover">
                <div className="card-body p-4 text-center">
                  <div className="rounded-circle bg-warning bg-opacity-10 text-warning-emphasis p-3 d-inline-flex mb-3">
                    <i className="bi bi-credit-card-2-front fs-2"></i>
                  </div>
                  <h5 className="fw-bold">Unauthorized Debit</h5>
                  <p className="small text-muted">
                    Money debited without your knowledge, OTP bypass, stolen card, or unknown UPI auto-mandate.
                  </p>
                  <button
                    onClick={() => handleQuickStart('UNAUTHORIZED')}
                    className="btn btn-outline-warning text-dark btn-sm w-100 mt-2 fw-semibold"
                  >
                    Block & Dispute &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 border-top border-4 border-info rounded-3 transition-hover">
                <div className="card-body p-4 text-center">
                  <div className="rounded-circle bg-info bg-opacity-10 text-info-emphasis p-3 d-inline-flex mb-3">
                    <i className="bi bi-arrow-repeat fs-2"></i>
                  </div>
                  <h5 className="fw-bold">Money Debited, Txn Failed</h5>
                  <p className="small text-muted">
                    Payment failed or pending on PhonePe/GPay, but your bank account was debited.
                  </p>
                  <button
                    onClick={() => handleQuickStart('FAILED_DEBITED')}
                    className="btn btn-outline-info text-dark btn-sm w-100 mt-2 fw-semibold"
                  >
                    Auto-Reversal Steps &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 border-top border-4 border-secondary rounded-3 transition-hover">
                <div className="card-body p-4 text-center">
                  <div className="rounded-circle bg-secondary bg-opacity-10 text-secondary p-3 d-inline-flex mb-3">
                    <i className="bi bi-arrow-left-right fs-2"></i>
                  </div>
                  <h5 className="fw-bold">Sent to Wrong Person</h5>
                  <p className="small text-muted">
                    Mistaken transfer due to wrong mobile number, typo in UPI ID, or wrong beneficiary account.
                  </p>
                  <button
                    onClick={() => handleQuickStart('WRONG_TRANSFER')}
                    className="btn btn-outline-secondary btn-sm w-100 mt-2 fw-semibold"
                  >
                    Recall Procedure &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Payment Providers Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
            <div>
              <h3 className="fw-bold mb-1">Tailored Guides for Indian Apps & Banks</h3>
              <p className="text-muted mb-0">Verified in-app grievance navigation paths and official nodal contacts</p>
            </div>
            <Link to="/provider-guides" className="btn btn-outline-primary btn-sm mt-2 mt-md-0">
              View All Provider Guides <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-3">
            {[
              { name: 'PhonePe', code: 'phonepe', icon: 'bi-phone', desc: 'Transaction history dispute & fraud reporting' },
              { name: 'Google Pay', code: 'gpay', icon: 'bi-google', desc: 'Google Pay India Help & Case ID generation' },
              { name: 'Paytm', code: 'paytm', icon: 'bi-wallet2', desc: 'Paytm 24x7 Care UPI & Wallet grievance route' },
              { name: 'BHIM UPI', code: 'bhim', icon: 'bi-shield-check', desc: 'NPCI central dispute redressal integration' },
              { name: 'Amazon Pay', code: 'amazonpay', icon: 'bi-cart-check', desc: 'Amazon Pay customer service & chargebacks' },
              { name: 'Bank Apps', code: 'bank_app', icon: 'bi-bank', desc: 'SBI, HDFC, ICICI, Axis fraud desks & RBI CMS' },
            ].map((p, idx) => (
              <div key={idx} className="col-md-4 col-sm-6">
                <div className="card h-100 border p-3 rounded-3 d-flex flex-row align-items-center">
                  <div className="p-3 bg-light rounded-circle text-primary me-3">
                    <i className={`bi ${p.icon} fs-3`}></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">{p.name}</h6>
                    <p className="text-muted small mb-0">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-5 bg-light border-top">
        <div className="container">
          <div className="text-center mb-5">
            <h3 className="fw-bold">How FraudAssist India Works</h3>
            <p className="text-muted">A clear, step-by-step roadmap to navigate payment distress</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100">
                <span className="badge bg-primary rounded-circle p-3 fs-5 mb-3">1</span>
                <h5 className="fw-bold">Answer Simple Questions</h5>
                <p className="text-muted small">
                  Select your payment app, whether money was debited, and what happened in plain language.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100">
                <span className="badge bg-warning text-dark rounded-circle p-3 fs-5 mb-3">2</span>
                <h5 className="fw-bold">Prioritized First-Hour Plan</h5>
                <p className="text-muted small">
                  Receive an ordered checklist: 1930 call, cybercrime portal filing, bank notice, and app dispute.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-3 shadow-sm h-100">
                <span className="badge bg-success rounded-circle p-3 fs-5 mb-3">3</span>
                <h5 className="fw-bold">Generate Complaint Draft</h5>
                <p className="text-muted small">
                  Instantly download a formal complaint ready to email to your bank manager, provider, or police.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
