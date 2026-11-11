from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal

from accounts.models import User
from providers.models import PaymentProvider
from incidents.models import Incident
from incidents.services import classify_incident_data
from complaints.services import generate_complaint_draft

class IncidentClassificationTests(TestCase):
    def test_unauthorized_transaction_classification(self):
        result = classify_incident_data({
            'did_not_authorize': True,
            'money_debited': True,
            'transaction_status': 'SUCCESS'
        })
        self.assertEqual(result['incident_type'], 'UNAUTHORIZED')
        self.assertTrue(result['is_cyber_fraud_suspected'])
        self.assertTrue(any('1930' in act for act in result['urgent_actions']))

    def test_deceived_payment_classification(self):
        # Scenario: PhonePe deceptive payment ₹10,000
        result = classify_incident_data({
            'did_not_authorize': False,
            'was_deceived': True,
            'money_debited': True,
            'transaction_status': 'SUCCESS'
        })
        self.assertEqual(result['incident_type'], 'DECEIVED_PAYMENT')
        self.assertTrue(result['is_cyber_fraud_suspected'])
        self.assertTrue(any('1930' in act for act in result['urgent_actions']))

    def test_failed_pending_debited_classification(self):
        result = classify_incident_data({
            'did_not_authorize': False,
            'was_deceived': False,
            'money_debited': True,
            'transaction_status': 'FAILED'
        })
        self.assertEqual(result['incident_type'], 'FAILED_DEBITED')
        self.assertFalse(result['is_cyber_fraud_suspected'])

    def test_wrong_transfer_classification(self):
        result = classify_incident_data({
            'sent_to_wrong_recipient': True,
            'money_debited': True,
            'transaction_status': 'SUCCESS'
        })
        self.assertEqual(result['incident_type'], 'WRONG_TRANSFER')
        self.assertFalse(result['is_cyber_fraud_suspected'])

    def test_merchant_dispute_classification(self):
        result = classify_incident_data({
            'product_or_service_not_delivered': True,
            'money_debited': True,
            'transaction_status': 'SUCCESS'
        })
        self.assertEqual(result['incident_type'], 'MERCHANT_DISPUTE')
        self.assertFalse(result['is_cyber_fraud_suspected'])

class IncidentAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(email='user1@example.com', password='Password@123', role=User.Role.CUSTOMER)
        self.user2 = User.objects.create_user(email='user2@example.com', password='Password@123', role=User.Role.CUSTOMER)
        self.provider = PaymentProvider.objects.create(
            code='phonepe',
            name='PhonePe',
            official_website='https://phonepe.com',
            support_url='https://support.phonepe.com'
        )

    def test_create_incident_generates_action_plan(self):
        self.client.force_authenticate(user=self.user1)
        payload = {
            'provider': self.provider.id,
            'payment_method': 'UPI',
            'amount': '10000.00',
            'transaction_status': 'SUCCESS',
            'was_deceived': True,
            'money_debited': True,
            'transaction_reference': 'UPI/432109876543/PP',
            'customer_description': 'Transferred to fake utility agent.'
        }
        response = self.client.post('/api/v1/incidents/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['incident_type'], 'DECEIVED_PAYMENT')

        incident = Incident.objects.get(id=response.data['id'])
        self.assertGreater(incident.action_items.count(), 0)

        # Check First-Hour items present
        codes = list(incident.action_items.values_list('action_code', flat=True))
        self.assertIn('CALL_1930', codes)
        self.assertIn('REPORT_CYBERCRIME', codes)
        self.assertIn('NOTIFY_BANK', codes)

    def test_customer_isolation_permissions(self):
        # Create incident for user1
        incident = Incident.objects.create(
            customer=self.user1,
            provider=self.provider,
            amount=Decimal('5000.00'),
            incident_type='UNAUTHORIZED'
        )

        # Authenticate as user2 and attempt to view
        self.client.force_authenticate(user=self.user2)
        response = self.client.get(f'/api/v1/incidents/{incident.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_complaint_draft_generation(self):
        incident = Incident.objects.create(
            customer=self.user1,
            provider=self.provider,
            amount=Decimal('10000.00'),
            incident_type='DECEIVED_PAYMENT',
            transaction_reference='UPI/999888777/TEST'
        )
        draft = generate_complaint_draft(incident)
        self.assertIn('DECEIVED', incident.incident_type)
        self.assertIn('INR 10,000.00', draft['body_text'])
        self.assertIn('UPI/999888777/TEST', draft['body_text'])
        self.assertIn('1930', draft['body_text'])
