from django.db import models
from django.conf import settings

class ActionPlanItem(models.Model):
    incident = models.ForeignKey('incidents.Incident', on_delete=models.CASCADE, related_name='action_items')
    action_code = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.PositiveIntegerField(default=1, help_text="Priority: 1 is highest / immediate")
    official_url = models.URLField(max_length=500, blank=True)
    phone_action = models.CharField(max_length=50, blank=True, help_text="e.g. 1930")
    is_required = models.BooleanField(default=True)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    customer_notes = models.TextField(blank=True)
    external_reference = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['priority', 'created_at']

    def __str__(self):
        status = "DONE" if self.is_completed else "PENDING"
        return f"[{self.priority}] {self.title} ({status})"

class CustomerActionUpdate(models.Model):
    action_plan_item = models.ForeignKey(ActionPlanItem, on_delete=models.CASCADE, related_name='updates')
    completed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    completion_status = models.CharField(max_length=50)
    external_reference = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-completed_at']

    def __str__(self):
        return f"Update on {self.action_plan_item.title} at {self.completed_at}"
