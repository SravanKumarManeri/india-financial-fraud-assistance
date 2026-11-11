from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from accounts.models import User
from providers.models import PaymentProvider, ProviderGuide
from directories.models import OfficialChannel
from incidents.models import Incident
from action_plans.models import ActionPlanItem
from action_plans.services import generate_action_plan_for_incident
from complaints.models import ComplaintReference

class Command(BaseCommand):
    help = 'Seeds initial providers, verified guides, official channels, demo users and demo cases.'

    def handle(self, *args, **options):
        self.stdout.write("Starting database seeding...")
        now = timezone.now()

        # 1. Seed Users
        admin_user, _ = User.objects.get_or_create(
            email='admin@fraudassist.in',
            defaults={
                'username': 'admin',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True,
                'mobile_number': '+91-9876543210'
            }
        )
        admin_user.set_password('Admin@12345')
        admin_user.save()

        content_admin, _ = User.objects.get_or_create(
            email='content@fraudassist.in',
            defaults={
                'username': 'contentadmin',
                'role': User.Role.CONTENT_ADMIN,
                'is_staff': True,
                'mobile_number': '+91-9876543211'
            }
        )
        content_admin.set_password('Content@12345')
        content_admin.save()

        support_agent, _ = User.objects.get_or_create(
            email='support@fraudassist.in',
            defaults={
                'username': 'supportagent',
                'role': User.Role.SUPPORT_AGENT,
                'mobile_number': '+91-9876543212'
            }
        )
        support_agent.set_password('Support@12345')
        support_agent.save()

        customer, _ = User.objects.get_or_create(
            email='rahul.sharma@example.com',
            defaults={
                'username': 'rahul_sharma',
                'first_name': 'Rahul',
                'last_name': 'Sharma',
                'role': User.Role.CUSTOMER,
                'mobile_number': '+91-9876501234'
            }
        )
        customer.set_password('Customer@12345')
        customer.save()

        self.stdout.write("Created demo users.")

        # 2. Seed Payment Providers
        providers_data = [
            {
                'code': 'phonepe',
                'name': 'PhonePe',
                'category': PaymentProvider.Category.UPI,
                'logo_icon': 'bi-phone',
                'official_website': 'https://www.phonepe.com/',
                'support_url': 'https://support.phonepe.com/',
                'helpline_number': '080-68727374 / 022-68727374'
            },
            {
                'code': 'gpay',
                'name': 'Google Pay',
                'category': PaymentProvider.Category.UPI,
                'logo_icon': 'bi-google',
                'official_website': 'https://pay.google.com/about/',
                'support_url': 'https://support.google.com/pay/india',
                'helpline_number': '1-800-419-0157'
            },
            {
                'code': 'paytm',
                'name': 'Paytm',
                'category': PaymentProvider.Category.UPI,
                'logo_icon': 'bi-wallet2',
                'official_website': 'https://paytm.com/',
                'support_url': 'https://paytm.com/care',
                'helpline_number': '0120-4456-456'
            },
            {
                'code': 'bhim',
                'name': 'BHIM UPI',
                'category': PaymentProvider.Category.UPI,
                'logo_icon': 'bi-shield-check',
                'official_website': 'https://www.bhimupi.org.in/',
                'support_url': 'https://www.bhimupi.org.in/get-in-touch',
                'helpline_number': '1800-120-1740'
            },
            {
                'code': 'amazonpay',
                'name': 'Amazon Pay',
                'category': PaymentProvider.Category.UPI,
                'logo_icon': 'bi-cart-check',
                'official_website': 'https://www.amazon.in/amazonpay/home',
                'support_url': 'https://www.amazon.in/gp/help/customer/contact-us',
                'helpline_number': '1800-3000-9009'
            },
            {
                'code': 'bank_app',
                'name': 'Bank Mobile / Net Banking',
                'category': PaymentProvider.Category.NETBANKING,
                'logo_icon': 'bi-bank',
                'official_website': 'https://www.rbi.org.in/',
                'support_url': 'https://cms.rbi.org.in/',
                'helpline_number': 'Check bank official website'
            },
            {
                'code': 'other_upi',
                'name': 'Other UPI App / Third Party',
                'category': PaymentProvider.Category.UPI,
                'logo_icon': 'bi-qr-code-scan',
                'official_website': 'https://www.npci.org.in/',
                'support_url': 'https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism',
                'helpline_number': '1800-120-1740'
            }
        ]

        provider_objs = {}
        for pdata in providers_data:
            obj, _ = PaymentProvider.objects.update_or_create(code=pdata['code'], defaults=pdata)
            provider_objs[pdata['code']] = obj

        self.stdout.write("Created payment providers.")

        # 3. Seed Verified Provider Guides
        guides_data = [
            {
                'provider': provider_objs['phonepe'],
                'payment_method': 'UPI',
                'incident_type': 'ALL',
                'title': 'Official PhonePe In-App Transaction Dispute & Fraud Protocol',
                'official_support_url': 'https://support.phonepe.com/',
                'source_url': 'https://support.phonepe.com/',
                'version': 1,
                'status': ProviderGuide.GuideStatus.VERIFIED,
                'last_verified_at': now,
                'review_due_at': now + timedelta(days=90),
                'steps_json': [
                    "Open the official PhonePe application on your mobile device.",
                    "Tap on 'History' from the bottom navigation bar to view your transactions.",
                    "Locate and select the disputed transaction.",
                    "Tap on 'Contact PhonePe Support' or 'Having issues with this transaction?' at the bottom.",
                    "Select the exact category (e.g. 'Payment done but deceived/scammed' or 'Money debited but not received').",
                    "Submit the issue description and note down the generated PhonePe Ticket Number.",
                    "Return to this platform and record your PhonePe ticket reference number."
                ]
            },
            {
                'provider': provider_objs['gpay'],
                'payment_method': 'UPI',
                'incident_type': 'ALL',
                'title': 'Google Pay India Transaction Issue & Help Route',
                'official_support_url': 'https://support.google.com/pay/india',
                'source_url': 'https://support.google.com/pay/india',
                'version': 1,
                'status': ProviderGuide.GuideStatus.VERIFIED,
                'last_verified_at': now,
                'review_due_at': now + timedelta(days=90),
                'steps_json': [
                    "Open the Google Pay app on your device.",
                    "Scroll down and tap on 'See transaction history'.",
                    "Select the transaction you want to dispute.",
                    "Tap on 'Having issues?' or the three-dot menu at the top right.",
                    "Choose 'Report fraud or suspicious activity' or 'Payment issue'.",
                    "Follow the on-screen instructions and save the Google Pay Support Case ID."
                ]
            },
            {
                'provider': provider_objs['paytm'],
                'payment_method': 'UPI',
                'incident_type': 'ALL',
                'title': 'Paytm Care 24x7 UPI & Wallet Dispute Flow',
                'official_support_url': 'https://paytm.com/care',
                'source_url': 'https://paytm.com/care',
                'version': 1,
                'status': ProviderGuide.GuideStatus.VERIFIED,
                'last_verified_at': now,
                'review_due_at': now + timedelta(days=90),
                'steps_json': [
                    "Open the Paytm App and go to 'Balance & History'.",
                    "Select the disputed transaction from the payment list.",
                    "Tap on 'Help' or 'Need Help with this payment?'.",
                    "Select 'I suspect fraud / unauthorized transaction' or 'Transaction failed but debited'.",
                    "Submit the ticket and record the Paytm Ticket Reference Number."
                ]
            },
            {
                'provider': provider_objs['bhim'],
                'payment_method': 'UPI',
                'incident_type': 'ALL',
                'title': 'BHIM UPI Official Complaint & NPCI Escalation Path',
                'official_support_url': 'https://www.bhimupi.org.in/',
                'source_url': 'https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism',
                'version': 1,
                'status': ProviderGuide.GuideStatus.VERIFIED,
                'last_verified_at': now,
                'review_due_at': now + timedelta(days=90),
                'steps_json': [
                    "Open the BHIM app and navigate to 'Transactions'.",
                    "Select the transaction and tap 'Raise Dispute / Query'.",
                    "Select complaint nature from the dropdown (Fraudulent / Technical).",
                    "Save the NPCI UPI reference and visit NPCI Dispute Redressal Mechanism if unresolved."
                ]
            }
        ]

        for gdata in guides_data:
            ProviderGuide.objects.update_or_create(
                provider=gdata['provider'],
                title=gdata['title'],
                defaults=gdata
            )
        self.stdout.write("Created provider guides.")

        # 4. Seed Official Channels Directory
        channels_data = [
            {
                'organization_name': 'National Cyber Crime Reporting Portal',
                'channel_type': OfficialChannel.ChannelType.WEB_PORTAL,
                'display_value': 'cybercrime.gov.in',
                'destination_url': 'https://cybercrime.gov.in/',
                'purpose': 'Official Indian Government portal for reporting cybercrime, cyber financial fraud, and online extortion.',
                'instructions': 'Click "Report Financial Fraud", register with your mobile number, and submit transaction UTR and bank account details.',
                'source_url': 'https://cybercrime.gov.in/',
                'last_verified_at': now,
                'priority_order': 1
            },
            {
                'organization_name': 'National Cyber Fraud Helpline',
                'channel_type': OfficialChannel.ChannelType.HELPLINE,
                'display_value': '1930',
                'phone_number': '1930',
                'destination_url': 'https://cybercrime.gov.in/',
                'purpose': 'Dedicated 24x7 toll-free emergency helpline under the Citizen Financial Cyber Fraud Reporting and Management System.',
                'instructions': 'Call 1930 immediately within the first hour of suspected fraud to alert law enforcement to freeze receiver accounts before cashout.',
                'source_url': 'https://cybercrime.gov.in/',
                'last_verified_at': now,
                'priority_order': 2
            },
            {
                'organization_name': 'RBI Complaint Management System (CMS)',
                'channel_type': OfficialChannel.ChannelType.REGULATOR,
                'display_value': 'cms.rbi.org.in',
                'destination_url': 'https://cms.rbi.org.in/',
                'purpose': 'Reserve Bank of India Integrated Ombudsman scheme for escalated disputes against banks, NBFCs, and payment system participants.',
                'instructions': 'Use this portal only if your bank or payment provider fails to resolve your grievance within 30 days or rejects it without justification.',
                'source_url': 'https://cms.rbi.org.in/',
                'last_verified_at': now,
                'priority_order': 3
            },
            {
                'organization_name': 'NPCI UPI Dispute Redressal Mechanism',
                'channel_type': OfficialChannel.ChannelType.REGULATOR,
                'display_value': 'npci.org.in/what-we-do/upi/dispute-redressal-mechanism',
                'destination_url': 'https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism',
                'purpose': 'National Payments Corporation of India central dispute redressal portal for UPI transactions.',
                'instructions': 'Submit your 12-digit UPI UTR reference number to track interbank reconciliation status.',
                'source_url': 'https://www.npci.org.in/',
                'last_verified_at': now,
                'priority_order': 4
            },
            {
                'organization_name': 'Reserve Bank of India (RBI)',
                'channel_type': OfficialChannel.ChannelType.REGULATOR,
                'display_value': 'rbi.org.in',
                'destination_url': 'https://www.rbi.org.in/',
                'purpose': 'India’s central banking regulatory authority. Publishes guidelines on customer liability and turnaround times.',
                'instructions': 'Consult RBI Circulars on Limited Liability of Customers in Unauthorized Electronic Banking Transactions.',
                'source_url': 'https://www.rbi.org.in/',
                'last_verified_at': now,
                'priority_order': 5
            },
            {
                'organization_name': 'National Consumer Helpline (NCH)',
                'channel_type': OfficialChannel.ChannelType.HELPLINE,
                'display_value': '1915 / consumerhelpline.gov.in',
                'phone_number': '1915',
                'destination_url': 'https://consumerhelpline.gov.in/',
                'purpose': 'Department of Consumer Affairs grievance portal for commercial merchant disputes and failed services.',
                'instructions': 'Lodge complaints regarding undelivered goods or fraudulent e-commerce sellers.',
                'source_url': 'https://consumerhelpline.gov.in/',
                'last_verified_at': now,
                'priority_order': 6
            }
        ]

        for cdata in channels_data:
            OfficialChannel.objects.update_or_create(
                organization_name=cdata['organization_name'],
                defaults=cdata
            )
        self.stdout.write("Created official channels.")

        # 5. Create synthetic demo incident: PhonePe ₹10,000 deceptive payment scenario
        demo_incident, created = Incident.objects.get_or_create(
            case_number='AGY-2026-904128',
            defaults={
                'customer': customer,
                'provider': provider_objs['phonepe'],
                'payment_method': Incident.PaymentMethod.UPI,
                'incident_type': Incident.IncidentType.DECEIVED_PAYMENT,
                'transaction_status': Incident.TxnStatus.SUCCESS,
                'amount': Decimal('10000.00'),
                'currency': 'INR',
                'transaction_datetime': now - timedelta(hours=2),
                'transaction_reference': 'UPI/432109876543/PP',
                'beneficiary_details': 'fake_refund_desk@ybl (Ramesh Kumar)',
                'customer_description': 'Received a call claiming to be an electricity bill executive warning of immediate power disconnection. The caller asked me to make a verification payment of ₹10,000 on PhonePe with promise of instant refund. After payment, the caller disconnected the call.',
                'did_not_authorize': False,
                'was_deceived': True,
                'money_debited': True,
                'status': Incident.CaseStatus.CYBERCRIME_REPORTED,
                'classification_notes': 'Customer approved payment under social engineering / fake utility bill deception. Urgent 1930 and cybercrime.gov.in notification triggered.'
            }
        )

        generate_action_plan_for_incident(demo_incident)

        # Mark first two actions complete to simulate ongoing customer progress
        call_item = demo_incident.action_items.filter(action_code='CALL_1930').first()
        if call_item:
            call_item.is_completed = True
            call_item.completed_at = now - timedelta(minutes=90)
            call_item.customer_notes = "Called 1930. The operator recorded the transaction details and assigned complaint reference NCRP-2026-IN-49120."
            call_item.external_reference = "NCRP-2026-IN-49120"
            call_item.save()

        # Add complaint references
        ComplaintReference.objects.update_or_create(
            incident=demo_incident,
            organization_type=ComplaintReference.OrgType.CYBERCRIME_PORTAL,
            organization_name='National Cyber Crime Reporting Portal (1930)',
            defaults={
                'reference_number': 'NCRP-2026-IN-49120',
                'submitted_at': now - timedelta(minutes=90),
                'status': ComplaintReference.RefStatus.ACKNOWLEDGED,
                'notes': 'Lien request forwarded to beneficiary bank.'
            }
        )

        ComplaintReference.objects.update_or_create(
            incident=demo_incident,
            organization_type=ComplaintReference.OrgType.PROVIDER,
            organization_name='PhonePe Grievance Support',
            defaults={
                'reference_number': 'PP-TKT-99381204',
                'submitted_at': now - timedelta(minutes=60),
                'status': ComplaintReference.RefStatus.UNDER_REVIEW,
                'notes': 'Dispute ticket raised via PhonePe in-app Help.'
            }
        )

        self.stdout.write("Created synthetic PhonePe ₹10,000 demo incident with references.")
        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
