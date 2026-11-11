from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import ActionPlanItem, CustomerActionUpdate
from .serializers import ActionPlanItemSerializer, CustomerActionUpdateSerializer
from audit.models import log_audit_event

class ActionPlanItemViewSet(viewsets.ModelViewSet):
    serializer_class = ActionPlanItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'SUPPORT_AGENT']:
            return ActionPlanItem.objects.all()
        return ActionPlanItem.objects.filter(incident__customer=user)

    @action(detail=True, methods=['post'])
    def toggle_complete(self, request, pk=None):
        item = self.get_object()
        item.is_completed = not item.is_completed
        item.completed_at = timezone.now() if item.is_completed else None
        
        notes = request.data.get('notes')
        ext_ref = request.data.get('external_reference')
        if notes is not None:
            item.customer_notes = notes
        if ext_ref is not None:
            item.external_reference = ext_ref
        
        item.save()

        # Log customer update record
        CustomerActionUpdate.objects.create(
            action_plan_item=item,
            completed_by=request.user,
            completion_status="COMPLETED" if item.is_completed else "INCOMPLETE",
            external_reference=item.external_reference,
            notes=item.customer_notes
        )

        log_audit_event(
            request=request,
            action="UPDATE_ACTION_ITEM",
            resource_type="ActionPlanItem",
            resource_id=item.id,
            details={'is_completed': item.is_completed, 'action_code': item.action_code}
        )

        return Response(ActionPlanItemSerializer(item).data)
