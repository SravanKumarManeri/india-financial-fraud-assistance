from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import ComplaintReference
from .serializers import ComplaintReferenceSerializer
from .services import generate_complaint_draft
from incidents.models import Incident
from audit.models import log_audit_event

class ComplaintReferenceViewSet(viewsets.ModelViewSet):
    serializer_class = ComplaintReferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        incident_id = self.request.query_params.get('incident_id')
        qs = ComplaintReference.objects.all()
        if not user.role in ['ADMIN', 'SUPPORT_AGENT']:
            qs = qs.filter(incident__customer=user)
        if incident_id:
            qs = qs.filter(incident_id=incident_id)
        return qs

    def perform_create(self, serializer):
        incident = serializer.validated_data['incident']
        # Permission check: customer must own incident
        if self.request.user.role not in ['ADMIN', 'SUPPORT_AGENT'] and incident.customer != self.request.user:
            raise permissions.PermissionDenied("You do not own this incident.")
        ref = serializer.save()
        log_audit_event(
            request=self.request,
            action="ADD_COMPLAINT_REFERENCE",
            resource_type="ComplaintReference",
            resource_id=ref.id,
            details={'incident': str(incident.id), 'org': ref.organization_name, 'ref_no': ref.reference_number}
        )

class ComplaintDraftView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, incident_id):
        incident = get_object_or_404(Incident, id=incident_id)
        if request.user.role not in ['ADMIN', 'SUPPORT_AGENT'] and incident.customer != request.user:
            return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        draft = generate_complaint_draft(incident)
        log_audit_event(
            request=request,
            action="GENERATE_COMPLAINT_DRAFT",
            resource_type="Incident",
            resource_id=incident.id,
            details={'case_number': incident.case_number}
        )
        return Response(draft)
