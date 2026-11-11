from django.urls import path
from .views import AdminDashboardMetricsView

urlpatterns = [
    path('admin/dashboard/', AdminDashboardMetricsView.as_view(), name='admin-dashboard-metrics'),
]
