import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container">
        {/* Strict Statutory Notice Alert */}
        <div className="p-3 mb-4 rounded bg-dark border border-warning text-warning-emphasis bg-opacity-50">
          <div className="d-flex align-items-start">
            <i className="bi bi-shield-exclamation text-warning fs-3 me-3 flex-shrink-0"></i>
            <div>
              <h6 className="fw-bold text-warning mb-1">CRITICAL CITIZEN SAFETY & LEGAL DISCLAIMER</h6>
              <p className="small mb-1 text-light">
                <strong>FraudAssist India</strong> is an educational, complaint-assistance, and navigation platform.
                We are <strong>NOT</strong> a bank, payment service provider (PhonePe, Google Pay, Paytm, NPCI),
                law enforcement agency, cyber police station, or government authority.
                We cannot freeze accounts, reverse transactions, or guarantee any refund.
              </p>
              <p className="small mb-0 text-light opacity-75">
                <strong className="text-warning">Non-Negotiable Safety Rule:</strong> Never share your UPI PIN, OTP, CVV, Card PIN, or Internet Banking password with anyone.
                No genuine bank officer, police official, or support agent will EVER ask for your PIN, OTP, or ask you to install remote access apps (AnyDesk, TeamViewer, RustDesk).
              </p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold d-flex align-items-center">
              <i className="bi bi-shield-lock-fill text-warning me-2"></i> FraudAssist India
            </h5>
            <p className="small text-light opacity-75">
              Empowering Indian digital payment users with immediate, calm, and correct response steps for suspected fraud, unauthorized debits, failed transfers, and wrong payments.
            </p>
            <div className="badge bg-secondary text-wrap p-2 small">
              Complies with RBI Customer Protection & NPCI Dispute Harmonisation Guidelines
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase fw-bold text-warning mb-3 small">Emergency Action</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/emergency-guide" className="text-light text-decoration-none">First-Hour Protocol</Link></li>
              <li className="mb-2"><a href="tel:1930" className="text-light text-decoration-none">Call 1930 Helpline</a></li>
              <li className="mb-2"><a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="text-light text-decoration-none">cybercrime.gov.in <i className="bi bi-box-arrow-up-right ms-1"></i></a></li>
              <li className="mb-2"><Link to="/report-incident" className="text-light text-decoration-none">Incident Wizard</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold text-warning mb-3 small">Official Redressal</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="https://cms.rbi.org.in" target="_blank" rel="noreferrer" className="text-light text-decoration-none">RBI CMS (Ombudsman) <i className="bi bi-box-arrow-up-right ms-1"></i></a></li>
              <li className="mb-2"><a href="https://npci.org.in" target="_blank" rel="noreferrer" className="text-light text-decoration-none">NPCI UPI Dispute Portal <i className="bi bi-box-arrow-up-right ms-1"></i></a></li>
              <li className="mb-2"><Link to="/provider-guides" className="text-light text-decoration-none">PhonePe / GPay Guides</Link></li>
              <li className="mb-2"><Link to="/official-channels" className="text-light text-decoration-none">All Official Directories</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold text-warning mb-3 small">Urgent Helplines</h6>
            <div className="card bg-secondary bg-opacity-25 border-0 p-3 text-light small">
              <div className="mb-2">
                <span className="text-muted d-block">National Cyber Crime:</span>
                <span className="fw-bold fs-5 text-warning">1930</span> (24x7 Toll-Free)
              </div>
              <div className="mb-2">
                <span className="text-muted d-block">National Consumer Helpline:</span>
                <span className="fw-bold text-info">1915</span>
              </div>
              <div>
                <span className="text-muted d-block">Police Emergency:</span>
                <span className="fw-bold">112</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-top border-secondary mt-4 pt-3 text-center small text-light opacity-50">
          &copy; {new Date().getFullYear()} India Financial Fraud Assistance Platform. Open citizen guidance initiative.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
