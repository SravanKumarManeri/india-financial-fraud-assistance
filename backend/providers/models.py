from django.db import models
from django.conf import settings

class PaymentProvider(models.Model):
    class Category(models.TextChoices):
        UPI = 'UPI', 'UPI App'
        CARD = 'CARD', 'Credit / Debit Card'
        NETBANKING = 'NETBANKING', 'Internet Banking'
        WALLET = 'WALLET', 'Prepaid Wallet'
        OTHER = 'OTHER', 'Other Payment Channel'

    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=30, choices=Category.choices, default=Category.UPI)
    logo_icon = models.CharField(max_length=50, blank=True, default='bi-wallet2')
    official_website = models.URLField(max_length=500)
    support_url = models.URLField(max_length=500, blank=True)
    helpline_number = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.code})"

class ProviderGuide(models.Model):
    class GuideStatus(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        VERIFIED = 'VERIFIED', 'Verified'
        NEEDS_REVIEW = 'NEEDS_REVIEW', 'Needs Review'
        RETIRED = 'RETIRED', 'Retired'

    provider = models.ForeignKey(PaymentProvider, on_delete=models.CASCADE, related_name='guides')
    payment_method = models.CharField(max_length=50, default='UPI')
    incident_type = models.CharField(max_length=50, default='ALL')
    title = models.CharField(max_length=255)
    steps_json = models.JSONField(default=list, help_text="Ordered list of step instructions")
    official_support_url = models.URLField(max_length=500)
    source_url = models.URLField(max_length=500, blank=True)
    version = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=30, choices=GuideStatus.choices, default=GuideStatus.VERIFIED)
    last_verified_at = models.DateTimeField()
    review_due_at = models.DateTimeField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['provider', '-version']

    def __str__(self):
        return f"{self.provider.name} - {self.title} (v{self.version}) [{self.status}]"
