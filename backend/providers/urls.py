from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentProviderViewSet, ProviderGuideViewSet

router = DefaultRouter()
router.register(r'providers', PaymentProviderViewSet, basename='provider')
router.register(r'provider-guides', ProviderGuideViewSet, basename='provider-guide')

urlpatterns = [
    path('', include(router.urls)),
]
