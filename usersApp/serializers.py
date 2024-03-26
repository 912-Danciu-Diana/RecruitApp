from django.contrib.auth import get_user_model
from rest_framework import serializers

from companiesApp.serializers import CompanySerializer
from .models import RecruiteeUser, CompanyUser

User = get_user_model()


class RecruiteeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiteeUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'profile_description', 'school',
                  'university', 'work_experience', 'profile_pic', 'cover_photo', 'cv']
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5}}

    def create(self, validated_data):
        return RecruiteeUser.objects.create_user(**validated_data)


class CompanyUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CompanyUser
        fields = ['username', 'email', 'password', 'company']
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5}}

    def create(self, validated_data):
        return CompanyUser.objects.create_user(**validated_data)
