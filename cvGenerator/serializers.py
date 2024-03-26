from rest_framework import serializers
from .models import UserSkills


class UserSkillsSerializer(serializers.ModelSerializer):
    skill_name = serializers.ReadOnlyField(source='skill.name')

    class Meta:
        model = UserSkills
        fields = ['recruitee_user', 'skill', 'skill_name']
        read_only_fields = ['skill_name', 'recruitee_user']

    def save(self, **kwargs):
        super().save(**kwargs)
