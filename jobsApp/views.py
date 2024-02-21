from rest_framework import generics, filters
from .models import Job, Skill, JobSkills
from .serializers import JobSerializer, SkillSerializer, JobSkillsSerializer
from django.db.models import Q


class JobListView(generics.ListCreateAPIView):
    serializer_class = JobSerializer

    def get_queryset(self):
        queryset = Job.objects.all()
        search_term = self.request.query_params.get('search', None)

        if search_term:
            if search_term.lower() == 'remote':
                queryset = queryset.filter(is_remote=True)
            else:
                name_location_filtered = queryset.filter(
                    Q(name__icontains=search_term) |
                    Q(location__city__icontains=search_term) |
                    Q(location__country__icontains=search_term)
                )
                skill_jobs = JobSkills.objects.filter(skill__name__icontains=search_term).values_list('job', flat=True)
                skills_filtered = queryset.filter(id__in=skill_jobs)
                combined_queryset = (name_location_filtered | skills_filtered).distinct()
                queryset = combined_queryset

        return queryset


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
