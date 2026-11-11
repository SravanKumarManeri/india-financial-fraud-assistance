from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import OfficialChannel
from .serializers import OfficialChannelSerializer

class IsContentAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.role in ['ADMIN', 'CONTENT_ADMIN']

class OfficialChannelViewSet(viewsets.ModelViewSet):
    queryset = OfficialChannel.objects.filter(is_active=True)
    serializer_class = OfficialChannelSerializer
    permission_classes = [IsContentAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['channel_type', 'is_active']
    search_fields = ['organization_name', 'display_value', 'purpose']
    ordering_fields = ['priority_order', 'organization_name']

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated and user.role in ['ADMIN', 'CONTENT_ADMIN']:
            return OfficialChannel.objects.all()
        return OfficialChannel.objects.filter(is_active=True)
