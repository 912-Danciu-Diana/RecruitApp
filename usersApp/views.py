from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
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
