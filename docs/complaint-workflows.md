# Complaint & Dispute Redressal Workflows

## Workflow 1: Suspected Deceptive Payment (PhonePe ₹10,000 Scenario)
1. **Intake:** Customer transfers ₹10,000 via PhonePe and realizes they were scammed (fake electricity officer, lottery, remote app).
2. **Classification:** Categorized as `DECEIVED_PAYMENT`. `is_cyber_fraud_suspected` set to `True`.
3. **First-Hour Action Plan:**
   - **Step 1 (Urgent):** Call **1930** immediately. Provide the operator with remitting bank, PhonePe UTR reference, debit timestamp, and receiver details.
   - **Step 2:** Operator logs case on CFCFRMS dashboard, sending real-time lien request to the beneficiary bank.
   - **Step 3:** Customer reports at `cybercrime.gov.in` and records NCRP Acknowledgment Number.
   - **Step 4:** Customer opens PhonePe transaction history -> Contact Support -> Records PhonePe Ticket ID.
   - **Step 5:** Customer downloads platform-generated formal complaint draft and emails it to their bank's Nodal Grievance Cell.

## Workflow 2: Payment Failed but Money Debited (`FAILED_DEBITED`)
1. **Intake:** Customer attempted transfer on Google Pay or PhonePe. The app shows `FAILED` or `PENDING`, but bank account was deducted.
2. **Classification:** Categorized as `FAILED_DEBITED`.
3. **Harmonisation Rules:**
   - As per RBI DPSS.CO.PD No.629/02.01.014/2019-20 (Harmonisation of Turn Around Time), failed transactions must be reversed within T+1 day.
   - If not reversed within T+1 business day, bank must pay compensation of INR 100 per day of delay.
   - Escalate to RBI Ombudsman (cms.rbi.org.in) if unresolved after 30 days.

## Workflow 3: Unauthorized Transaction (`UNAUTHORIZED`)
1. **Intake:** Money debited without customer knowledge or consent (stolen card, SIM swap, compromise).
2. **Classification:** Categorized as `UNAUTHORIZED`.
3. **Protection Rules:**
   - Customer must report to bank within 3 working days under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18 to ensure Zero Customer Liability.
   - Customer immediately blocks payment instruments, files on cybercrime.gov.in, and tracks bank dispute reference.
