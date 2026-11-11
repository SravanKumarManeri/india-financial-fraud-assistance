import os
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

def validate_evidence_file(file):
    max_mb = settings.MAX_UPLOAD_SIZE_MB
    if file.size > max_mb * 1024 * 1024:
        raise ValidationError(f"File size cannot exceed {max_mb} MB.")
    
    ext = os.path.splitext(file.name)[1].lower()
    allowed_exts = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.txt']
    if ext not in allowed_exts:
        raise ValidationError(f"Unsupported file type '{ext}'. Allowed types: {', '.join(allowed_exts)}")

class EvidenceFile(models.Model):
    incident = models.ForeignKey('incidents.Incident', on_delete=models.CASCADE, related_name='evidence_files')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    file = models.FileField(upload_to='evidence/%Y/%m/', validators=[validate_evidence_file])
    mime_type = models.CharField(max_length=100, blank=True)
    file_size = models.PositiveIntegerField(default=0, help_text="File size in bytes")
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.file_name} ({self.file_size} bytes) for {self.incident.case_number}"
