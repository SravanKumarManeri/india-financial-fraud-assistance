from django.db import models
from django.conf import settings
import uuid

class Incident(models.Model):
    class IncidentType(models.TextChoices):
        UNAUTHORIZED = 'UNAUTHORIZED', 'Unauthorized Transaction / Account Takeover'
        DECEIVED_PAYMENT = 'DECEIVED_PAYMENT', 'Deceptive Payment / Scammed Transfer'
        FAILED_DEBITED = 'FAILED_DEBITED', 'Payment Failed / Pending but Money Debited'
        WRONG_TRANSFER = 'WRONG_TRANSFER', 'Mistaken Transfer to Wrong Recipient'
        MERCHANT_DISPUTE = 'MERCHANT_DISPUTE', 'Merchant Issue / Product or Service Not Delivered'
        UNKNOWN = 'UNKNOWN', 'Unsure / Other Payment Dispute'

    class PaymentMethod(models.TextChoices):
        UPI = 'UPI', 'UPI Payment'
        CARD = 'CARD', 'Debit / Credit Card'
        NETBANKING = 'NETBANKING', 'Internet Banking'
        WALLET = 'WALLET', 'Digital Wallet'
        OTHER = 'OTHER', 'Other Method'

    class TxnStatus(models.TextChoices):
        SUCCESS = 'SUCCESS', 'Successful / Completed'
        FAILED = 'FAILED', 'Failed'
        PENDING = 'PENDING', 'Pending / Processing'
        REVERSED = 'REVERSED', 'Reversed / Refunded'
        UNKNOWN = 'UNKNOWN', 'Unsure'

    class CaseStatus(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        GUIDANCE_VIEWED = 'GUIDANCE_VIEWED', 'Guidance Viewed'
        BANK_CONTACTED = 'BANK_CONTACTED', 'Bank Contacted'
        PROVIDER_CONTACTED = 'PROVIDER_CONTACTED', 'Provider Contacted'
        CYBERCRIME_REPORTED = 'CYBERCRIME_REPORTED', 'Cybercrime Reported (1930/Portal)'
        POLICE_CONTACTED = 'POLICE_CONTACTED', 'Police Contacted'
        AWAITING_RESPONSE = 'AWAITING_RESPONSE', 'Awaiting Response'
        CUSTOMER_ACTION_REQUIRED = 'CUSTOMER_ACTION_REQUIRED', 'Customer Action Required'
        RESOLVED_BY_CUSTOMER = 'RESOLVED_BY_CUSTOMER', 'Resolved by Customer'
        CLOSED = 'CLOSED', 'Case Closed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case_number = models.CharField(max_length=50, unique=True, editable=False)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='incidents', null=True, blank=True)
    provider = models.ForeignKey('providers.PaymentProvider', on_delete=models.SET_NULL, null=True, blank=True, related_name='incidents')
    
    payment_method = models.CharField(max_length=30, choices=PaymentMethod.choices, default=PaymentMethod.UPI)
    incident_type = models.CharField(max_length=50, choices=IncidentType.choices, default=IncidentType.UNKNOWN)
    transaction_status = models.CharField(max_length=30, choices=TxnStatus.choices, default=TxnStatus.SUCCESS)
    
    amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='INR')
    transaction_datetime = models.DateTimeField(null=True, blank=True)
    transaction_reference = models.CharField(max_length=100, blank=True, help_text="UTR / UPI Ref ID / Transaction Reference")
    beneficiary_details = models.CharField(max_length=200, blank=True, help_text="Receiver UPI ID or Name (optional)")
    customer_description = models.TextField(blank=True)

    # Deterministic signals
    did_not_authorize = models.BooleanField(default=False)
    was_deceived = models.BooleanField(default=False)
    money_debited = models.BooleanField(default=True)
    sent_to_wrong_recipient = models.BooleanField(default=False)
    product_or_service_not_delivered = models.BooleanField(default=False)
    contacted_bank_already = models.BooleanField(default=False)
    contacted_1930_already = models.BooleanField(default=False)

    status = models.CharField(max_length=50, choices=CaseStatus.choices, default=CaseStatus.GUIDANCE_VIEWED)
    classification_version = models.CharField(max_length=20, default='1.0')
    classification_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.case_number:
            import datetime, random
            year = datetime.datetime.now().year
            rand_suffix = random.randint(100000, 999999)
            self.case_number = f"AGY-{year}-{rand_suffix}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.case_number} - {self.incident_type} (₹{self.amount or 0})"
