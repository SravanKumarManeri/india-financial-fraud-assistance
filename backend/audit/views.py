from rest_framework import viewsets, permissions
from .models import AuditLog
from .serializers import AuditLogSerializer

class IsPlatformAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['ADMIN', 'CONTENT_ADMIN']

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [IsPlatformAdmin]
    queryset = AuditLog.objects.all()
    filterset_fields = ['action', 'resource_type']
    search_fields = ['resource_id', 'actor__email', 'action']
