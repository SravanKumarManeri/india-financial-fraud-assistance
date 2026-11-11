from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import PaymentProvider, ProviderGuide
from .serializers import PaymentProviderSerializer, ProviderGuideSerializer

class IsContentAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.role in ['ADMIN', 'CONTENT_ADMIN']

class PaymentProviderViewSet(viewsets.ModelViewSet):
    queryset = PaymentProvider.objects.filter(is_active=True)
    serializer_class = PaymentProviderSerializer
    permission_classes = [IsContentAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated and user.role in ['ADMIN', 'CONTENT_ADMIN']:
            return PaymentProvider.objects.all()
        return PaymentProvider.objects.filter(is_active=True)

class ProviderGuideViewSet(viewsets.ModelViewSet):
    queryset = ProviderGuide.objects.all()
    serializer_class = ProviderGuideSerializer
    permission_classes = [IsContentAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['provider', 'payment_method', 'incident_type', 'status']
    search_fields = ['title', 'provider__name']

    def get_queryset(self):
        user = self.request.user
        qs = ProviderGuide.objects.all()
        if not (user and user.is_authenticated and user.role in ['ADMIN', 'CONTENT_ADMIN']):
            qs = qs.filter(status=ProviderGuide.GuideStatus.VERIFIED)
        return qs
