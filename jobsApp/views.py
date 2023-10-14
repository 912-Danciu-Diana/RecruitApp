from rest_framework import generics
from .models import Job, Skill, JobSkills
from .serializers import JobSerializer, SkillSerializer, JobSkillsSerializer


class JobListView(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class SkillListView(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class SkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class JobSkillsListView(generics.ListCreateAPIView):
    queryset = JobSkills.objects.all()
    serializer_class = JobSkillsSerializer


class JobSkillsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobSkills.objects.all()
    serializer_class = JobSkillsSerializer
