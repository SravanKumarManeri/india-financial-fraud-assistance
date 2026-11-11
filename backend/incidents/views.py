from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Incident
from .serializers import (
    IncidentListSerializer, IncidentDetailSerializer,
    IncidentCreateSerializer, IncidentClassifyInputSerializer
)
from .services import classify_incident_data
from action_plans.services import generate_action_plan_for_incident
from action_plans.serializers import ActionPlanItemSerializer
from audit.models import log_audit_event

class IncidentPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == 'classify':
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.role in ['ADMIN', 'SUPPORT_AGENT']:
            return True
        return obj.customer == request.user

class IncidentViewSet(viewsets.ModelViewSet):
    permission_classes = [IncidentPermission]

    def get_serializer_class(self):
        if self.action == 'list':
            return IncidentListSerializer
        elif self.action == 'create':
            return IncidentCreateSerializer
        return IncidentDetailSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Incident.objects.none()
        if user.role in ['ADMIN', 'SUPPORT_AGENT']:
            return Incident.objects.all().select_related('provider', 'customer')
        return Incident.objects.filter(customer=user).select_related('provider')

    def perform_create(self, serializer):
        classification = classify_incident_data(self.request.data)
        incident = serializer.save(
            customer=self.request.user,
            incident_type=classification['incident_type'],
            classification_notes=classification['primary_reason']
        )
        # Generate initial action plan
        generate_action_plan_for_incident(incident)

        log_audit_event(
            request=self.request,
            action="CREATE_INCIDENT",
            resource_type="Incident",
            resource_id=incident.id,
            details={'case_number': incident.case_number, 'type': incident.incident_type}
        )

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def classify(self, request):
        """
        Public or authenticated endpoint to preview incident classification and urgent actions.
        """
        serializer = IncidentClassifyInputSerializer(data=request.data)
        if serializer.is_valid():
            result = classify_incident_data(serializer.validated_data)
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def action_plan(self, request, pk=None):
        incident = self.get_object()
        items = incident.action_items.all()
        serializer = ActionPlanItemSerializer(items, many=True)
        return Response(serializer.data)
