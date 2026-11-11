from rest_framework import serializers
from .models import Incident
from providers.serializers import PaymentProviderSerializer
from action_plans.models import ActionPlanItem

class ActionPlanItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionPlanItem
        fields = '__all__'

class IncidentListSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source='provider.name', read_only=True)
    provider_code = serializers.CharField(source='provider.code', read_only=True)
    completed_actions_count = serializers.SerializerMethodField()
    total_actions_count = serializers.SerializerMethodField()

    class Meta:
        model = Incident
        fields = (
            'id', 'case_number', 'provider', 'provider_name', 'provider_code',
            'payment_method', 'incident_type', 'transaction_status',
            'amount', 'currency', 'transaction_datetime', 'transaction_reference',
            'status', 'created_at', 'completed_actions_count', 'total_actions_count'
        )

    def get_completed_actions_count(self, obj):
        return obj.action_items.filter(is_completed=True).count()

    def get_total_actions_count(self, obj):
        return obj.action_items.count()

class IncidentDetailSerializer(serializers.ModelSerializer):
    provider_details = PaymentProviderSerializer(source='provider', read_only=True)
    action_items = ActionPlanItemSerializer(many=True, read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)

    class Meta:
        model = Incident
        fields = '__all__'

class IncidentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = (
            'id', 'case_number', 'provider', 'payment_method', 'incident_type',
            'transaction_status', 'amount', 'currency', 'transaction_datetime',
            'transaction_reference', 'beneficiary_details', 'customer_description',
            'did_not_authorize', 'was_deceived', 'money_debited',
            'sent_to_wrong_recipient', 'product_or_service_not_delivered',
            'contacted_bank_already', 'contacted_1930_already', 'status'
        )
        read_only_fields = ('id', 'case_number', 'incident_type')

class IncidentClassifyInputSerializer(serializers.Serializer):
    payment_method = serializers.CharField(required=False, default='UPI')
    provider_id = serializers.IntegerField(required=False, allow_null=True)
    did_not_authorize = serializers.BooleanField(required=False, default=False)
    was_deceived = serializers.BooleanField(required=False, default=False)
    money_debited = serializers.BooleanField(required=False, default=True)
    transaction_status = serializers.CharField(required=False, default='SUCCESS')
    sent_to_wrong_recipient = serializers.BooleanField(required=False, default=False)
    product_or_service_not_delivered = serializers.BooleanField(required=False, default=False)
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    customer_description = serializers.CharField(required=False, allow_blank=True)
