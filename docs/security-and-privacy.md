# Security, Privacy & Compliance Guidelines

## 1. Zero Knowledge of Authentication Secrets
The platform architecture strictly prevents collection, receipt, or persistence of:
- UPI PINs, ATM PINs, Net Banking passwords
- Card CVVs / Expiry dates
- OTPs (One Time Passwords)
- Remote access credentials

## 2. Customer Isolation & Authorization
- Django custom user model with SimpleJWT authentication.
- Strict object-level permissions: customers can only view, download, or edit their own incident cases, action plan items, and uploaded evidence files.
- Role-based authorization for administrators and support agents.

## 3. Evidence File Handling
- File uploads restricted to max 10MB.
- Permitted extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`, `.txt`.
- MIME type validation and safe sanitized file naming.
- Evidence files stored in private media directory protected from unauthorized direct URL scraping.

## 4. Audit Trail & Regulatory Compliance
- Sensitive operations (case creation, draft export, guide modification, reference logging) generate an immutable `AuditLog` entry recording actor ID, IP address, action code, and timestamp.
