from rest_framework import serializers
from .models import ComplaintReference

class ComplaintReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintReference
        fields = '__all__'
