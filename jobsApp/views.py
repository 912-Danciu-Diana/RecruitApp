from django.shortcuts import get_object_or_404
from rest_framework import generics, filters, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from usersApp.models import RecruiteeUser
from usersApp.serializers import RecruiteeUserSerializer
from .models import Job, Skill, JobSkills, Application
from .serializers import JobSerializer, SkillSerializer, JobSkillsSerializer, ApplicationSerializer
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
                company_filtered = queryset.filter(Q(company__name__icontains=search_term))
                combined_queryset = (name_location_filtered | skills_filtered | company_filtered).distinct()
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


class FilteredSkillListView(generics.ListAPIView):
    serializer_class = SkillSerializer

    def get_queryset(self):
        queryset = Skill.objects.all()
        query = self.request.query_params.get('search', None)
        if query is not None:
            queryset = queryset.filter(name__icontains=query)
        return queryset


class ApplicationListView(generics.ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_application(request):
    try:
        recruitee_user = RecruiteeUser.objects.get(user_ptr_id=request.user.id)
    except RecruiteeUser.DoesNotExist:
        return Response({"detail": "RecruiteeUser instance not found for the given user."}, status=status.HTTP_404_NOT_FOUND)
    job_id = request.data.get('job')
    if not job_id:
        return Response({"detail": "Job id is required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"detail": f"Job '{job_id}' not found."}, status=status.HTTP_404_NOT_FOUND)
    data = {'job': job.pk, 'recruitee': recruitee_user.pk}
    serializer = ApplicationSerializer(data=data)
    if serializer.is_valid():
        serializer.save(job=job, recruitee=recruitee_user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def find_application(request):
    job_id = request.query_params.get('job')
    user_id = request.query_params.get('user')
    try:
        recruitee_user = RecruiteeUser.objects.get(id=user_id)
    except RecruiteeUser.DoesNotExist:
        return Response({"detail": "RecruiteeUser instance not found for the given user."}, status=status.HTTP_404_NOT_FOUND)
    if not job_id:
        return Response({"detail": "Job id is required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"detail": f"Job '{job_id}' not found."}, status=status.HTTP_404_NOT_FOUND)
    application_exists = Application.objects.filter(job=job.pk, recruitee=recruitee_user.pk)
    if application_exists:
        return Response({"exists": True, "detail": "Application already exists for this job."})
    else:
        return Response({"exists": False, "detail": "No application found for this job."})

@api_view(['GET'])
def get_application(request):
    job_id = request.query_params.get('job')
    user_id = request.query_params.get('user')
    try:
        recruitee_user = RecruiteeUser.objects.get(id=user_id)
    except RecruiteeUser.DoesNotExist:
        return Response({"detail": "RecruiteeUser instance not found for the given user."}, status=status.HTTP_404_NOT_FOUND)
    if not job_id:
        return Response({"detail": "Job id is required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"detail": f"Job '{job_id}' not found."}, status=status.HTTP_404_NOT_FOUND)
    application = Application.objects.filter(job=job.pk, recruitee=recruitee_user.pk)
    if application:
        serializer = ApplicationSerializer(application, many=True)
        return Response(serializer.data)
    else:
        return Response({"detail": "No application found for this job."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_job_applicants(request):
    job_id = request.query_params.get('job')
    if not job_id:
        return Response({"detail": "Job id is required."}, status=400)
    applications = Application.objects.filter(job=job_id)
    recruitees = [app.recruitee for app in applications]
    serializer = RecruiteeUserSerializer(recruitees, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_application(request):
    user = request.user
    if not user.is_company_user():
        return Response({"detail": "Unauthorized. Only recruiters can perform this action."},
                        status=status.HTTP_403_FORBIDDEN)
    job_id = request.query_params.get('job')
    user_id = request.query_params.get('user')
    if not job_id:
        return Response({"detail": "Job id is required."}, status=400)
    if not user_id:
        return Response({"detail": "User id is required."}, status=400)
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"detail": "Job not found."}, status=status.HTTP_404_NOT_FOUND)
    try:
        recruitee_user = RecruiteeUser.objects.get(user_ptr_id=user_id)
    except RecruiteeUser.DoesNotExist:
        return Response({"detail": "RecruiteeUser not found."}, status=status.HTTP_404_NOT_FOUND)
    application = get_object_or_404(Application, job=job_id, recruitee=user_id)
    serializer = ApplicationSerializer(application, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)
