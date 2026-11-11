from .models import ActionPlanItem

def generate_action_plan_for_incident(incident):
    """
    Creates or updates the prioritized action plan items for the given incident.
    """
    # Delete existing items if any to regenerate freshly
    incident.action_items.all().delete()

    itype = incident.incident_type
    provider_name = incident.provider.name if incident.provider else "Payment App"
    support_url = incident.provider.support_url if incident.provider and incident.provider.support_url else "https://support.phonepe.com/"

    items_to_create = []

    if itype in ['UNAUTHORIZED', 'DECEIVED_PAYMENT']:
        # High urgency cyber fraud flow
        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='CALL_1930',
            title='Call 1930 Promptly (National Cyber Fraud Helpline)',
            description=(
                'Immediately dial 1930 to speak with the National Cyber Crime Reporting Helpline. '
                'Provide your bank name, account number, debit timestamp, transaction amount, and beneficiary details. '
                'The operator initiates an immediate interbank freeze alert across the Indian Financial Cyber Fraud Reporting rail.'
            ),
            priority=1,
            phone_action='1930',
            official_url='https://cybercrime.gov.in/',
            is_required=True
        ))

        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='REPORT_CYBERCRIME',
            title='Lodge Complaint at National Cyber Crime Portal',
            description=(
                'Follow the 1930 helpline instructions to register the detailed complaint on cybercrime.gov.in under '
                '"Financial Fraud". Keep your incident acknowledgement number safe.'
            ),
            priority=2,
            official_url='https://cybercrime.gov.in/',
            is_required=True
        ))

        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='NOTIFY_BANK',
            title='Notify Your Bank’s Fraud Reporting Desk',
            description=(
                'Contact your bank immediately through their official 24x7 fraud reporting number or net banking app. '
                'Ask them to block compromised cards/net banking and issue an official dispute reference number.'
            ),
            priority=3,
            official_url='https://rbi.org.in/',
            is_required=True
        ))

        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='PROVIDER_TICKET',
            title=f'Raise Transaction Dispute in {provider_name}',
            description=(
                f'Open {provider_name}, navigate to your Transaction History, select this transaction, '
                f'tap Help / Support, and file an unauthorized/deceptive payment report. Note down the provider ticket ID.'
            ),
            priority=4,
            official_url=support_url,
            is_required=True
        ))

        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='PRESERVE_EVIDENCE',
            title='Preserve All Transaction & Communication Evidence',
            description=(
                'Take full-page screenshots of the payment confirmation, bank SMS debit notifications, '
                'call logs, SMS/WhatsApp messages with the scammer, and fake profile links. Upload them securely here.'
            ),
            priority=5,
            is_required=True
        ))

        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='RECORD_REFERENCE',
            title='Record Official Acknowledgement Numbers',
            description=(
                'Record the 1930 ticket number, National Cyber Crime portal acknowledgement number, '
                'bank complaint ID, and app reference number in the references tab of this platform.'
            ),
            priority=6,
            is_required=True
        ))

    elif itype == 'FAILED_DEBITED':
        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='PROVIDER_TICKET',
            title=f'File Transaction Dispute inside {provider_name}',
            description=(
                f'Open {provider_name}, view the failed transaction, and click "Having issue with this transaction?". '
                f'Submit a status check request to sync with NPCI.'
            ),
            priority=1,
            official_url=support_url,
            is_required=True
        ))

        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='MONITOR_REVERSAL',
            title='Allow RBI Auto-Reversal Window (T+1 to T+2 Business Days)',
            description=(
                'As per RBI and NPCI Harmonisation of Turn Around Time (TAT) guidelines, failed transactions with debited '
                'amounts must be automatically refunded to your bank account within 1-2 business days.'
            ),
            priority=2,
            official_url='https://www.npci.org.in/',
            is_required=True
        ))

        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='NOTIFY_BANK',
            title='Contact Remitting Bank Customer Care if Not Reversed',
            description=(
                'If funds are not credited back within 48 hours, call your bank customer care quoting the UPI UTR number '
                'and demand a chargeback under NPCI UPI dispute management guidelines.'
            ),
            priority=3,
            is_required=True
        ))

        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='ESCALATE_RBI_CMS',
            title='Escalate to RBI Ombudsman (CMS) if Unresolved after 30 Days',
            description=(
                'If your bank fails to resolve the failed debit or credit auto-reversal penalty within 30 days, '
                'file an escalation on the RBI Complaint Management System (cms.rbi.org.in).'
            ),
            priority=4,
            official_url='https://cms.rbi.org.in/',
            is_required=False
        ))

    elif itype == 'WRONG_TRANSFER':
        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='NOTIFY_BANK_BRANCH',
            title='Approach Your Bank Branch Immediately for Wrong Credit Recall',
            description=(
                'Visit or email your home branch with the transaction reference (UTR). Request the branch manager '
                'to initiate an official interbank retrieval communication with the beneficiary bank.'
            ),
            priority=1,
            official_url='https://rbi.org.in/',
            is_required=True
        ))

        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='PROVIDER_TICKET',
            title=f'Notify {provider_name} Customer Care',
            description=(
                f'Contact {provider_name} to confirm the beneficiary bank name and IFSC/VPA code associated with the recipient.'
            ),
            priority=2,
            official_url=support_url,
            is_required=True
        ))

        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='RECORD_REFERENCE',
            title='Record Bank Written Acknowledgement',
            description='Save the formal dispute reference number provided by your bank branch.',
            priority=3,
            is_required=True
        ))

    elif itype == 'MERCHANT_DISPUTE':
        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='CONTACT_MERCHANT',
            title='Submit Formal Grievance to Merchant',
            description='Write to merchant official customer grievance desk with order invoice and UPI transaction reference.',
            priority=1,
            is_required=True
        ))

        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='PROVIDER_DISPUTE',
            title=f'Raise Merchant Chargeback in {provider_name}',
            description=f'Flag the merchant transaction in {provider_name} as service not provided.',
            priority=2,
            official_url=support_url,
            is_required=True
        ))

        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='CONSUMER_FORUM',
            title='Lodge Complaint at National Consumer Helpline (NCH)',
            description='If the merchant fails to respond within 15 days, report on consumerhelpline.gov.in or call 1915.',
            priority=3,
            official_url='https://consumerhelpline.gov.in/',
            is_required=False
        ))

    else: # UNKNOWN
        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='PRESERVE_EVIDENCE',
            title='Preserve All Transaction Records',
            description='Save screenshot, UTR number, and SMS alerts before taking further action.',
            priority=1,
            is_required=True
        ))
        items_to_create.append(ActionPlanItem(
            incident=incident,
            action_code='NOTIFY_BANK',
            title='Contact Bank Fraud / Customer Care Desk',
            description='Inquire with your bank regarding the exact debit status of this transaction.',
            priority=2,
            is_required=True
        ))

    created_items = ActionPlanItem.objects.bulk_create(items_to_create)
    return created_items
