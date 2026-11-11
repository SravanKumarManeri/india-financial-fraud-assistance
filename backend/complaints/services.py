"""
Complaint Draft Generator Service.
Produces structured, professional complaint drafts with all necessary transaction facts,
statutory references, and requested bank/provider actions.
"""

def generate_complaint_draft(incident):
    customer = incident.customer
    customer_name = customer.get_full_name() or customer.username or "Customer"
    customer_email = customer.email if customer else "N/A"
    customer_phone = customer.mobile_number or "N/A" if customer else "N/A"

    provider_name = incident.provider.name if incident.provider else incident.payment_method
    amount_str = f"INR {incident.amount:,.2f}" if incident.amount else "INR [Amount]"
    txn_time = incident.transaction_datetime.strftime("%d-%b-%Y at %I:%M %p") if incident.transaction_datetime else "[Date/Time]"
    utr_ref = incident.transaction_reference or "[Transaction Reference / UTR]"
    beneficiary = incident.beneficiary_details or "[Beneficiary UPI ID / Account Details]"

    itype = incident.incident_type

    if itype == 'UNAUTHORIZED':
        subject = f"URGENT: Unauthorized Transaction of {amount_str} from Account - Dispute Ref {incident.case_number}"
        incident_summary = (
            f"I am writing to formally report an unauthorized digital payment of {amount_str} debited from my account "
            f"via {provider_name} on {txn_time}. I did NOT initiate, authorize, or approve this transaction. "
            f"I suspect unauthorized access or compromise of my payment instrument."
        )
        requested_actions = (
            "1. Immediately block any further transactions or mandates associated with this payment instrument.\n"
            "2. Mark this transaction as disputed under RBI's Limited Liability of Customers in Unauthorized Electronic Banking Transactions circular.\n"
            "3. Initiate a recall / hold request with the beneficiary bank.\n"
            "4. Provide me with a formal dispute tracking number and provisional credit as mandated by RBI guidelines."
        )
    elif itype == 'DECEIVED_PAYMENT':
        subject = f"URGENT: Report of Cyber Financial Fraud / Deceptive Transaction of {amount_str} - Case {incident.case_number}"
        incident_summary = (
            f"I am reporting a cyber financial fraud incident where I was deceived into transferring {amount_str} "
            f"using {provider_name} on {txn_time} to beneficiary: {beneficiary}. "
            f"The transfer was induced under deceptive pretenses (social engineering / fraudulent communication)."
        )
        requested_actions = (
            "1. Immediately coordinate with the beneficiary bank's fraud monitoring cell to freeze the credited funds before withdrawal.\n"
            "2. Share the beneficiary account details and bank IFSC with law enforcement authorities.\n"
            "3. Register an official financial fraud dispute reference number for this incident.\n"
            "4. Assist with interbank lien placement under the National Cyber Crime Reporting Portal (1930) protocol."
        )
    elif itype == 'FAILED_DEBITED':
        subject = f"Grievance: Failed / Pending Transaction with Account Debit of {amount_str} - UTR: {utr_ref}"
        incident_summary = (
            f"I initiated a payment of {amount_str} via {provider_name} on {txn_time} with reference {utr_ref}. "
            f"The application showed the transaction status as FAILED / PENDING, yet funds were successfully debited "
            f"from my bank account and have not been credited to the beneficiary nor reversed to me."
        )
        requested_actions = (
            "1. Reconcile this transaction with NPCI UPI / IMPS switch immediately.\n"
            "2. Process an auto-reversal of the debited amount of {amount_str} into my bank account.\n"
            "3. In accordance with RBI Circular on Harmonisation of Turn Around Time (TAT) and customer compensation, "
            "credit compensation of INR 100 per day if the reversal exceeds the prescribed T+1 business day window."
        )
    elif itype == 'WRONG_TRANSFER':
        subject = f"Request for Wrong Debit Reversal / Fund Retrieval of {amount_str} - UTR: {utr_ref}"
        incident_summary = (
            f"I mistakenly transferred {amount_str} using {provider_name} on {txn_time} to unintended recipient ({beneficiary}) "
            f"under transaction reference {utr_ref}. This was an inadvertent error."
        )
        requested_actions = (
            "1. Contact the beneficiary bank branch manager to seek consent and reverse the erroneous credit.\n"
            "2. Place a temporary freeze/lien on the transferred funds in the beneficiary account.\n"
            "3. Provide official communication regarding the beneficiary bank's response."
        )
    else:
        subject = f"Dispute Notice: Payment Issue of {amount_str} via {provider_name} - Ref {incident.case_number}"
        incident_summary = (
            f"I am lodging a formal complaint regarding a transaction of {amount_str} processed on {txn_time} "
            f"via {provider_name} under reference {utr_ref}."
        )
        requested_actions = (
            "1. Investigate the transaction and initiate appropriate dispute resolution.\n"
            "2. Provide an official reference tracking number."
        )

    # Compile references if already filed
    refs_text = ""
    for ref in incident.references.all():
        refs_text += f"- {ref.organization_name} Reference: {ref.reference_number} (Status: {ref.status})\n"
    if not refs_text:
        refs_text = "- None recorded yet / in progress\n"

    evidence_text = ""
    for ev in incident.evidence_files.all():
        evidence_text += f"- Attached: {ev.file_name} ({ev.description or 'Evidence document'})\n"
    if not evidence_text:
        evidence_text = "- Transaction screenshot and debit SMS extract attached\n"

    complaint_body = f"""To:
The Nodal Grievance Officer / Fraud Monitoring Cell
{provider_name} / Bank Customer Grievance Department

Subject: {subject}

Respected Sir / Madam,

{incident_summary}

--- TRANSACTION PARTICULARS ---
* Case Number: {incident.case_number}
* Payment Channel / App: {provider_name} ({incident.payment_method})
* Transaction Amount: {amount_str}
* Transaction Date & Time: {txn_time}
* Transaction Reference / UTR: {utr_ref}
* Beneficiary / Receiver Details: {beneficiary}
* Current Status on App: {incident.transaction_status}

--- COMPLAINANT PARTICULARS ---
* Name: {customer_name}
* Contact Email: {customer_email}
* Mobile Number: {customer_phone}

--- INCIDENT DESCRIPTION (IN CUSTOMER'S WORDS) ---
{incident.customer_description or 'As stated in the summary above.'}

--- COMPLAINTS ALREADY FILED WITH AUTHORITIES ---
{refs_text}
--- ENCLOSED EVIDENCE ---
{evidence_text}
--- REQUESTED ACTIONS ---
{requested_actions}

I request you to kindly register this complaint with immediate priority and share the official Grievance / Dispute Reference Number with me for tracking and regulatory escalation.

Yours faithfully,
{customer_name}
{customer_phone}

======================================================================
DISCLAIMER: This complaint draft was generated by the India Financial
Fraud Assistance Platform based on facts provided by the customer.
Never share OTP, UPI PIN, CVV, or passwords with anyone.
======================================================================
"""

    return {
        'case_number': incident.case_number,
        'subject': subject,
        'body_text': complaint_body.strip(),
        'requested_actions': requested_actions,
        'generated_for': customer_name
    }
