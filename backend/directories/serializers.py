from rest_framework import serializers
from .models import OfficialChannel

class OfficialChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfficialChannel
        fields = '__all__'
