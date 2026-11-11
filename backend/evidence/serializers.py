from rest_framework import serializers
from .models import EvidenceFile

class EvidenceFileSerializer(serializers.ModelSerializer):
    uploaded_by_email = serializers.CharField(source='uploaded_by.email', read_only=True)

    class Meta:
        model = EvidenceFile
        fields = ('id', 'incident', 'file_name', 'file', 'mime_type', 'file_size', 'description', 'created_at', 'uploaded_by_email')
        read_only_fields = ('id', 'file_name', 'mime_type', 'file_size', 'created_at', 'uploaded_by_email')
