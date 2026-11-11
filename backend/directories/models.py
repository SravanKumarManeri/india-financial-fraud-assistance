from django.db import models

class OfficialChannel(models.Model):
    class ChannelType(models.TextChoices):
        HELPLINE = 'HELPLINE', 'Emergency Helpline'
        WEB_PORTAL = 'WEB_PORTAL', 'Official Web Portal'
        REGULATOR = 'REGULATOR', 'Regulatory Authority (RBI/NPCI)'
        BANK_DISPUTE = 'BANK_DISPUTE', 'Bank Fraud Channel'
        POLICE = 'POLICE', 'Law Enforcement / Cyber Police'

    organization_name = models.CharField(max_length=200)
    channel_type = models.CharField(max_length=50, choices=ChannelType.choices, default=ChannelType.WEB_PORTAL)
    display_value = models.CharField(max_length=200, help_text="e.g. 1930, cybercrime.gov.in, cms.rbi.org.in")
    destination_url = models.URLField(max_length=500, blank=True)
    phone_number = models.CharField(max_length=50, blank=True)
    purpose = models.TextField()
    instructions = models.TextField(blank=True)
    source_url = models.URLField(max_length=500, blank=True)
    last_verified_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    priority_order = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['priority_order', 'organization_name']

    def __str__(self):
        return f"{self.organization_name} - {self.display_value}"
