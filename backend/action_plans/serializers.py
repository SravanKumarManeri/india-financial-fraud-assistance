from rest_framework import serializers
from .models import ActionPlanItem, CustomerActionUpdate

class ActionPlanItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionPlanItem
        fields = '__all__'
        read_only_fields = ('id', 'incident', 'action_code', 'title', 'description', 'priority')

class CustomerActionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerActionUpdate
        fields = '__all__'
        read_only_fields = ('id', 'completed_by', 'completed_at')
