from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import EvidenceFile
from .serializers import EvidenceFileSerializer
from incidents.models import Incident
from audit.models import log_audit_event
import mimetypes

class EvidenceFileViewSet(viewsets.ModelViewSet):
    serializer_class = EvidenceFileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        incident_id = self.request.query_params.get('incident_id')
        qs = EvidenceFile.objects.all()
        if not user.role in ['ADMIN', 'SUPPORT_AGENT']:
            qs = qs.filter(incident__customer=user)
        if incident_id:
            qs = qs.filter(incident_id=incident_id)
        return qs

    def perform_create(self, serializer):
        incident = serializer.validated_data['incident']
        if self.request.user.role not in ['ADMIN', 'SUPPORT_AGENT'] and incident.customer != self.request.user:
            raise permissions.PermissionDenied("You do not own this incident.")
        
        uploaded_file = self.request.FILES.get('file')
        file_name = uploaded_file.name if uploaded_file else 'evidence_upload'
        file_size = uploaded_file.size if uploaded_file else 0
        mime_type, _ = mimetypes.guess_type(file_name)

        evidence = serializer.save(
            uploaded_by=self.request.user,
            file_name=file_name,
            file_size=file_size,
            mime_type=mime_type or 'application/octet-stream'
        )

        log_audit_event(
            request=self.request,
            action="UPLOAD_EVIDENCE",
            resource_type="EvidenceFile",
            resource_id=evidence.id,
            details={'incident': str(incident.id), 'file_name': file_name, 'size': file_size}
        )
