"""
URL configuration for India Financial Fraud Assistance Platform.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # OpenAPI Schema & API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # API v1 routes
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/', include('providers.urls')),
    path('api/v1/', include('directories.urls')),
    path('api/v1/', include('incidents.urls')),
    path('api/v1/', include('action_plans.urls')),
    path('api/v1/', include('complaints.urls')),
    path('api/v1/', include('evidence.urls')),
    path('api/v1/', include('audit.urls')),
    path('api/v1/', include('dashboards.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
