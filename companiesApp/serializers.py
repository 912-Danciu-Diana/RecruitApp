from rest_framework import serializers
from .models import Company
from locations.serializers import LocationSerializer


class CompanySerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    class Meta:
        model = Company
        fields = ['name', 'profile_pic', 'cover_photo', 'location']
