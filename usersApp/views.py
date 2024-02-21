from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .serializers import RecruiteeUserSerializer, CompanyUserSerializer
from .models import RecruiteeUser, CompanyUser
from .permissions import IsAdminOrCompanyUser
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, permissions
from django.contrib.auth import get_user_model


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
            user_data.update({
                'company': company_user.company.name,  # Assuming Company model has a 'name' field
            })

        return Response(user_data)
