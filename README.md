# India Financial Fraud Assistance & Complaint Management Platform

An open, citizen-centric full-stack FinTech assistance platform that guides users in India calmly, systematically, and safely through the aftermath of suspicious, fraudulent, failed, pending, or mistaken digital payment transactions (PhonePe, Google Pay, Paytm, BHIM, Bank Apps, Cards, Wallets).

---

## 1. Key Features

- **Golden Hour First-Response Protocol:** Prominent **1930** National Cybercrime helpline integration and CFCFRMS interbank freeze instructions.
- **Deterministic Incident Classifier:** Distinguishes between:
  - `UNAUTHORIZED` (SIM swap, compromised cards, unauthorized debit)
  - `DECEIVED_PAYMENT` (Tricked into paying utility bill scam, fake refund agent)
  - `FAILED_DEBITED` (Technical failure on PhonePe/GPay but bank account deducted)
  - `WRONG_TRANSFER` (Accidental transfer to wrong mobile/UPI ID)
  - `MERCHANT_DISPUTE` (Service or goods not delivered)
- **Verified Provider Guides:** In-app dispute navigation for PhonePe, Google Pay, Paytm, BHIM, and Amazon Pay.
- **Complaint Draft Generator:** Generates customer-editable, formal grievance letters citing RBI circulars ready to email to bank managers.
- **External Complaint Reference Tracking:** Unified log of 1930 NCRP reference numbers, bank grievance IDs, and provider tickets.
- **Private Evidence Vault:** Secure upload for screenshots and debit alerts with strict file validation.
- **Admin & Support Analytics:** Incident category trends, provider guide review tracking, and security audit logs.
- **Zero-Secret Safety Enforcement:** Strictly prohibits asking for or storing UPI PINs, OTPs, CVVs, or Net Banking passwords.

---

## 2. Technology Stack

- **Frontend:** React 18, Vite, React Router, Axios, Bootstrap 5.3, Bootstrap Icons
- **Backend:** Python 3.11+, Django 5.2, Django REST Framework, SimpleJWT, `drf-spectacular` (OpenAPI 3.0)
- **Database:** MySQL 8.x / SQLite for isolated testing
- **API Docs:** Swagger UI (`/api/docs/`), Redoc (`/api/redoc/`)

---

## 3. Quick Local Setup

### Backend (Django)

```bash
cd backend
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# macOS / Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Apply migrations and seed verified providers, guides & demo users
python manage.py migrate
python manage.py seed_demo_data

# Run API server
python manage.py runserver 127.0.0.1:8000
```

### Frontend (React / Vite)

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at: `http://localhost:5173/`  
The backend API will run at: `http://127.0.0.1:8000/api/v1/`  
The Swagger UI documentation will run at: `http://127.0.0.1:8000/api/docs/`

---

## 4. Pre-configured Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Customer** | `rahul.sharma@example.com` | `Customer@12345` |
| **Platform Admin** | `admin@fraudassist.in` | `Admin@12345` |
| **Content Admin** | `content@fraudassist.in` | `Content@12345` |
| **Support Agent** | `support@fraudassist.in` | `Support@12345` |

The Login screen features **1-click fill buttons** for these accounts for instant evaluation.

---

## 5. Running Automated Tests

```bash
cd backend
python manage.py test
```

---

## 6. Statutory Disclaimer

*This is an educational, complaint-assistance, and navigation platform. It is NOT a bank, payment provider, law enforcement agency, or government authority. It cannot freeze accounts, reverse transactions, or guarantee a refund. Never share your UPI PIN, OTP, CVV, or passwords with anyone.*
