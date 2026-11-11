from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OfficialChannelViewSet

router = DefaultRouter()
router.register(r'official-channels', OfficialChannelViewSet, basename='official-channel')

urlpatterns = [
    path('', include(router.urls)),
]
