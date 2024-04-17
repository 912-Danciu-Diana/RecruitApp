from rest_framework import serializers

from .models import Job, Skill, JobSkills, Application
from locations.serializers import LocationSerializer
from companiesApp.serializers import CompanySerializer


class JobSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    company = CompanySerializer()
    class Meta:
        model = Job
        fields = ['id', 'name', 'company', 'description', 'profile_pic', 'cover_photo', 'location', 'is_remote']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        base_url = 'http://127.0.0.1:8080'
        if representation['profile_pic'] and base_url not in representation['profile_pic']:
            representation['profile_pic'] = base_url + representation['profile_pic']
        if representation['cover_photo'] and base_url not in representation['cover_photo']:
            representation['cover_photo'] = base_url + representation['cover_photo']
        return representation


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


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['job', 'recruitee', 'interview', 'acceptedForQuiz', 'accepted']
