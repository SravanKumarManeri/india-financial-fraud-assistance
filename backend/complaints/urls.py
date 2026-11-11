from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComplaintReferenceViewSet, ComplaintDraftView

router = DefaultRouter()
router.register(r'references', ComplaintReferenceViewSet, basename='complaint-reference')

urlpatterns = [
    path('', include(router.urls)),
    path('incidents/<uuid:incident_id>/complaint-draft/', ComplaintDraftView.as_view(), name='complaint-draft'),
]
