from rest_framework import serializers
from .models import UserSkills


class UserSkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSkills
        fields = ['recruitee_user', 'skill']
