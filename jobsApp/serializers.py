from rest_framework import serializers

from interviewsApp.serializers import InterviewSerializer
from usersApp.serializers import RecruiteeUserSerializer
from .models import Job, Skill, JobSkills, Application
from locations.serializers import LocationSerializer
from companiesApp.serializers import CompanySerializer


class JobSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    company = CompanySerializer()
    class Meta:
        model = Job
        fields = ['id', 'name', 'company', 'description', 'profile_pic', 'cover_photo', 'location', 'is_remote']


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
