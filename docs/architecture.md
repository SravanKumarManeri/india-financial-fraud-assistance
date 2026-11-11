# Architecture & System Design

## 1. System Overview
The **India Financial Fraud Assistance Platform** is an enterprise-grade citizen assistance application built to triage digital payment disputes, guide victims during the critical "First Hour" of suspected cyber financial fraud, provide verified provider instructions, and generate formal complaints for banks, payment providers, and the National Cyber Crime Reporting Portal.

```
+--------------------------------------------------------------------------------+
|                               Client Tier                                      |
|  React 18 SPA + Vite + Bootstrap 5.3 + Responsive Accessibility Layer          |
+--------------------------------------------------------------------------------+
                                       |
                                       | HTTPS / REST API / JWT
                                       v
+--------------------------------------------------------------------------------+
|                               API Gateway & Web Tier                           |
|  Nginx Reverse Proxy + Gunicorn + Django 5.2 / Django REST Framework           |
+--------------------------------------------------------------------------------+
                                       |
          +----------------------------+----------------------------+
          |                            |                            |
          v                            v                            v
+--------------------+      +--------------------+      +--------------------+
|   Accounts & RBAC  |      | Incident Engine    |      | Complaint & Action |
| Customer / Admin / |      | Deterministic      |      | 1930 / cybercrime  |
| Content / Support  |      | Classifier         |      | Bank / Provider    |
+--------------------+      +--------------------+      +--------------------+
          |                            |                            |
          +----------------------------+----------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
|                              Data & Storage Tier                               |
|  MySQL 8.x (InnoDB, utf8mb4) / SQLite (tests) + Private Media File Storage     |
+--------------------------------------------------------------------------------+
```

## 2. Core Modules
- **`accounts`**: Role-Based Access Control (`CUSTOMER`, `SUPPORT_AGENT`, `CONTENT_ADMIN`, `ADMIN`), secure JWT authentication with blacklisting.
- **`providers`**: Payment app & banking channels metadata, verified in-app dispute step catalogs with versioning and review expiration tracking.
- **`directories`**: Curated directory of official Indian authorities (1930 Helpline, cybercrime.gov.in, RBI CMS, NPCI, National Consumer Helpline).
- **`incidents`**: Multi-signal intake wizard and deterministic classification engine (`UNAUTHORIZED`, `DECEIVED_PAYMENT`, `FAILED_DEBITED`, `WRONG_TRANSFER`, `MERCHANT_DISPUTE`, `UNKNOWN`).
- **`action_plans`**: Dynamic prioritization engine creating first-hour and regulatory action checklists.
- **`complaints`**: Formal complaint draft generator (plain text & markdown) ready to dispatch to bank grievance cells.
- **`evidence`**: Secure file validation and private media storage for transaction screenshots and debit alerts.
- **`audit`**: Immutable logging of sensitive operations and status changes.
- **`dashboards`**: Operational metrics and content verification queues.
