import os

from django.conf import settings
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes

from companiesApp.serializers import CompanySerializer
from .serializers import RecruiteeUserSerializer, CompanyUserSerializer
from .models import RecruiteeUser, CompanyUser
from .permissions import IsAdminOrCompanyUser
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, permissions
from django.contrib.auth import get_user_model

from pyresparser import ResumeParser
from io import BytesIO


class RecruiteeUserCreateView(generics.CreateAPIView):
    queryset = RecruiteeUser.objects.all()
    serializer_class = RecruiteeUserSerializer
    permission_classes = [permissions.AllowAny]


class CompanyUserCreateView(generics.CreateAPIView):
    queryset = CompanyUser.objects.all()
    serializer_class = CompanyUserSerializer
    permission_classes = [IsAdminOrCompanyUser]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    request.auth.delete()
    return Response({"detail": "Logout successful"}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request, pk):
    user = get_user_model().objects.get(pk=pk)
    if request.user == user or request.user.is_staff:
        user.delete()
        return Response({"detail": "Account deleted successfully"}, status=status.HTTP_200_OK)
    else:
        return Response({"detail": "Permission denied: You can only delete your own account"}, status=status.HTTP_403_FORBIDDEN)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            'id': user.pk,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile_pic_url': user.profile_pic.url,
            'cover_photo_url': user.cover_photo.url
        }

        if user.is_recruitee():
            recruitee_user = user.recruiteeuser
            user_data.update({
                'cv_url': recruitee_user.cv.url if recruitee_user.cv else None,
                'profile_description': recruitee_user.profile_description,
                'school': recruitee_user.school,
                'university': recruitee_user.university,
                'work_experience': recruitee_user.work_experience,
            })

        elif user.is_company_user():
            company_user = user.companyuser
            company_data = CompanySerializer(company_user.company).data
            domain = 'http://127.0.0.1:8080'
            if company_data['profile_pic']:
                company_data['profile_pic'] = domain + company_data['profile_pic']
            if company_data['cover_photo']:
                company_data['cover_photo'] = domain + company_data['cover_photo']
            user_data.update({
                'company': company_data,
            })

        return Response(user_data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_user_cv(request):
    cv_file = request.FILES.get('cv')
    if cv_file:
        user_id = request.user.pk
        user = RecruiteeUser.objects.get(pk=user_id)
        user.cv.save(cv_file.name, cv_file, save=True)  # Save the file to the model field
        return Response("User's CV updated successfully", status=status.HTTP_200_OK)
    else:
        return Response('No file attached', status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def generate_profile_from_cv(request):
    resume = request.FILES.get('cv')
    file_buffer = BytesIO(resume.read())
    file_buffer.name = resume.name
    data = ResumeParser(file_buffer).get_extracted_data()
    return Response(data)
