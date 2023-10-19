from rest_framework import serializers
from .models import Job, Skill, JobSkills


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['name', 'company', 'description', 'profile_pic', 'cover_photo', 'location', 'is_remote']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['name']


class JobSkillsSerializer(serializers.ModelSerializer):
    job_name = serializers.ReadOnlyField(source='job.name', read_only=True)
    skill_name = serializers.ReadOnlyField(source='skill.name', read_only=True)

    class Meta:
        model = JobSkills
        fields = ['job', 'skill', 'job_name', 'skill_name']
