from django.db import models
from django.conf import settings

class ComplaintReference(models.Model):
    class OrgType(models.TextChoices):
        CYBERCRIME_PORTAL = 'CYBERCRIME_PORTAL', 'National Cyber Crime Portal / 1930'
        BANK = 'BANK', 'Remitting / Beneficiary Bank'
        PROVIDER = 'PROVIDER', 'Payment App / Provider (PhonePe, GPay, etc.)'
        POLICE = 'POLICE', 'Local Police / Cyber Police Station'
        RBI_CMS = 'RBI_CMS', 'RBI Ombudsman (CMS)'
        OTHER = 'OTHER', 'Other Authority'

    class RefStatus(models.TextChoices):
        SUBMITTED = 'SUBMITTED', 'Submitted'
        ACKNOWLEDGED = 'ACKNOWLEDGED', 'Acknowledged'
        UNDER_REVIEW = 'UNDER_REVIEW', 'Under Review / Investigation'
        REJECTED = 'REJECTED', 'Rejected'
        RESOLVED = 'RESOLVED', 'Resolved / Refunded'
        CLOSED = 'CLOSED', 'Closed'

    incident = models.ForeignKey('incidents.Incident', on_delete=models.CASCADE, related_name='references')
    organization_type = models.CharField(max_length=50, choices=OrgType.choices, default=OrgType.BANK)
    organization_name = models.CharField(max_length=200, help_text="e.g. State Bank of India, PhonePe Support, NCRP 1930")
    reference_number = models.CharField(max_length=150, help_text="Complaint No. / Ticket ID / Acknowledgement No.")
    submitted_at = models.DateTimeField()
    status = models.CharField(max_length=50, choices=RefStatus.choices, default=RefStatus.SUBMITTED)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.organization_name} - {self.reference_number} ({self.status})"
