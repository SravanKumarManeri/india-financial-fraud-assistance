import React from 'react';

export const IncidentTypeBadge = ({ type }) => {
  const map = {
    UNAUTHORIZED: { bg: 'danger', label: 'Unauthorized Debit', icon: 'bi-shield-x' },
    DECEIVED_PAYMENT: { bg: 'warning text-dark', label: 'Deceptive Payment / Scam', icon: 'bi-exclamation-triangle-fill' },
    FAILED_DEBITED: { bg: 'info text-dark', label: 'Failed Debit / Pending', icon: 'bi-arrow-repeat' },
    WRONG_TRANSFER: { bg: 'secondary', label: 'Wrong Recipient Transfer', icon: 'bi-arrow-left-right' },
    MERCHANT_DISPUTE: { bg: 'primary', label: 'Merchant Dispute', icon: 'bi-shop' },
    UNKNOWN: { bg: 'dark', label: 'Unsure / Inquiry', icon: 'bi-question-circle' },
  };

  const item = map[type] || { bg: 'secondary', label: type, icon: 'bi-info-circle' };

  return (
    <span className={`badge bg-${item.bg} px-2 py-1`}>
      <i className={`bi ${item.icon} me-1`}></i> {item.label}
    </span>
  );
};

export const CaseStatusBadge = ({ status }) => {
  const map = {
    DRAFT: { bg: 'secondary', label: 'Draft' },
    GUIDANCE_VIEWED: { bg: 'info text-dark', label: 'Guidance Viewed' },
    BANK_CONTACTED: { bg: 'primary', label: 'Bank Contacted' },
    PROVIDER_CONTACTED: { bg: 'primary', label: 'Provider Contacted' },
    CYBERCRIME_REPORTED: { bg: 'danger', label: 'Cybercrime Reported (1930)' },
    POLICE_CONTACTED: { bg: 'dark', label: 'Police Contacted' },
    AWAITING_RESPONSE: { bg: 'warning text-dark', label: 'Awaiting Response' },
    CUSTOMER_ACTION_REQUIRED: { bg: 'warning text-dark', label: 'Action Required' },
    RESOLVED_BY_CUSTOMER: { bg: 'success', label: 'Resolved by Customer' },
    CLOSED: { bg: 'secondary', label: 'Case Closed' },
  };

  const item = map[status] || { bg: 'secondary', label: status };

  return (
    <span className={`badge bg-${item.bg}`}>
      {item.label}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  if (priority === 1) return <span className="badge bg-danger">Urgent #1</span>;
  if (priority === 2) return <span className="badge bg-warning text-dark">Priority #2</span>;
  if (priority === 3) return <span className="badge bg-primary">Step #3</span>;
  return <span className="badge bg-secondary">Step #{priority}</span>;
};
