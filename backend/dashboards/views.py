from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count
from django.utils import timezone
from incidents.models import Incident
from providers.models import ProviderGuide, PaymentProvider
from audit.models import AuditLog

class IsAdminOrSupport(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['ADMIN', 'CONTENT_ADMIN', 'SUPPORT_AGENT']

class AdminDashboardMetricsView(APIView):
    permission_classes = [IsAdminOrSupport]

    def get(self, request):
        total_incidents = Incident.objects.count()
        by_type = list(Incident.objects.values('incident_type').annotate(count=Count('id')).order_by('-count'))
        by_status = list(Incident.objects.values('status').annotate(count=Count('id')).order_by('-count'))
        by_provider = list(Incident.objects.values('provider__name').annotate(count=Count('id')).order_by('-count'))
        
        # Outdated or needing review guides
        now = timezone.now()
        guides_needing_review = ProviderGuide.objects.filter(review_due_at__lte=now).count()
        total_guides = ProviderGuide.objects.count()
        total_providers = PaymentProvider.objects.count()

        recent_audits = AuditLog.objects.select_related('actor')[:8].values(
            'id', 'action', 'resource_type', 'resource_id', 'timestamp', 'actor__email'
        )

        return Response({
            'total_incidents': total_incidents,
            'incidents_by_type': by_type,
            'incidents_by_status': by_status,
            'incidents_by_provider': by_provider,
            'guides_needing_review': guides_needing_review,
            'total_guides': total_guides,
            'total_providers': total_providers,
            'recent_audits': list(recent_audits)
        })
