"""
Deterministic incident classification engine.
Transparent rule-based logic to prioritize customer safety.
"""

def classify_incident_data(data):
    """
    Evaluates intake signals and returns:
    - incident_type: UNAUTHORIZED | DECEIVED_PAYMENT | FAILED_DEBITED | WRONG_TRANSFER | MERCHANT_DISPUTE | UNKNOWN
    - is_cyber_fraud_suspected: bool
    - primary_reason: str
    - urgent_actions: list of priority strings
    - disclaimer: str
    """
    did_not_authorize = bool(data.get('did_not_authorize'))
    was_deceived = bool(data.get('was_deceived'))
    money_debited = bool(data.get('money_debited', True))
    txn_status = str(data.get('transaction_status', 'SUCCESS')).upper()
    sent_to_wrong = bool(data.get('sent_to_wrong_recipient'))
    product_not_delivered = bool(data.get('product_or_service_not_delivered'))

    is_cyber_fraud_suspected = False
    incident_type = "UNKNOWN"
    primary_reason = ""
    urgent_actions = []

    if did_not_authorize:
        incident_type = "UNAUTHORIZED"
        is_cyber_fraud_suspected = True
        primary_reason = "Transaction occurred without your consent or knowledge (possible SIM swap, device compromise, or stolen card/credentials)."
        urgent_actions = [
            "Block affected card/net banking/UPI immediately via official bank channel.",
            "Call 1930 (National Cyber Fraud Helpline) right away.",
            "Report unauthorized transaction at cybercrime.gov.in."
        ]
    elif was_deceived:
        incident_type = "DECEIVED_PAYMENT"
        is_cyber_fraud_suspected = True
        primary_reason = "You were induced to approve payment through social engineering, fake customer care, fraudulent investment, or deceptive QR/link."
        urgent_actions = [
            "Call 1930 immediately to freeze the recipient bank account/UPI ID before money is withdrawn.",
            "Lodge formal complaint at cybercrime.gov.in.",
            "Notify your remitting bank fraud desk to flag the transfer.",
            "Raise an in-app dispute with your payment provider."
        ]
    elif money_debited and txn_status in ["FAILED", "PENDING"]:
        incident_type = "FAILED_DEBITED"
        is_cyber_fraud_suspected = False
        primary_reason = "Payment failed or remains pending on the payment app, but funds were deducted from your bank account. Typically resolved via NPCI auto-reversal or provider dispute."
        urgent_actions = [
            "Open the transaction in your payment app and file a transaction dispute.",
            "Wait for the T+1 to T+2 banking auto-reversal window as per RBI guidelines.",
            "If not reversed within 48 hours, escalate directly to your bank ombudsman."
        ]
    elif sent_to_wrong:
        incident_type = "WRONG_TRANSFER"
        is_cyber_fraud_suspected = False
        primary_reason = "Payment was initiated by you but sent to an unintended recipient or incorrect mobile/UPI ID."
        urgent_actions = [
            "Contact your remitting bank branch immediately to initiate wrong debit retrieval with beneficiary bank.",
            "Report to payment app support to trace beneficiary bank details.",
            "Note: Banks require beneficiary consent to reverse; this is a civil/banking dispute unless deceptive intent is established."
        ]
    elif product_not_delivered:
        incident_type = "MERCHANT_DISPUTE"
        is_cyber_fraud_suspected = False
        primary_reason = "Merchant received payment but did not fulfill product, service, or promised refund."
        urgent_actions = [
            "Contact merchant official grievance portal with payment receipt.",
            "Raise a merchant chargeback/dispute with your card or UPI provider.",
            "If merchant was a fake storefront or fraudulent entity, report under cybercrime.gov.in."
        ]
    else:
        incident_type = "UNKNOWN"
        is_cyber_fraud_suspected = False
        primary_reason = "The details provided require additional clarification to determine the appropriate dispute path."
        urgent_actions = [
            "Preserve transaction SMS, bank statement extract, and app screenshot.",
            "Check official provider help route or speak to your branch."
        ]

    # Special handling for overlapping signals
    overlapping_notes = []
    if money_debited and txn_status in ["FAILED", "PENDING"] and was_deceived:
        is_cyber_fraud_suspected = True
        overlapping_notes.append("Fraudulent scenario involved a failed/pending debit trick. Both technical dispute and cybercrime 1930 reporting are required.")

    disclaimer = (
        "This classification is automated assistance guidance based on customer-entered facts. "
        "It is NOT a legal finding, banking decision, or verified fraud conviction. "
        "This platform does not reverse transactions or freeze accounts directly."
    )

    return {
        'incident_type': incident_type,
        'is_cyber_fraud_suspected': is_cyber_fraud_suspected,
        'primary_reason': primary_reason,
        'urgent_actions': urgent_actions,
        'overlapping_notes': overlapping_notes,
        'disclaimer': disclaimer,
        'classification_version': '1.0'
    }
