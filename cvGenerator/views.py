from django.http import HttpResponse
from django.template.loader import get_template
from rest_framework import status
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from xhtml2pdf import pisa

from cvGenerator.models import UserSkills
from cvGenerator.serializers import UserSkillsSerializer
from jobsApp.models import Skill
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from usersApp.models import RecruiteeUser


class GenerateCV(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        recruitee_user = RecruiteeUser.objects.get(user_ptr_id=user.id)
        skills = Skill.objects.filter(
            userskills__recruitee_user=recruitee_user)

        template_path = 'cv_template.html'
        context = {'user': recruitee_user, 'skills': skills}
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="cv.pdf"'

        template = get_template(template_path)
        html = template.render(context)

        pisa_status = pisa.CreatePDF(html, dest=response)

        if pisa_status.err:
            return HttpResponse('We had some errors <pre>' + html + '</pre>')
        return response


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_user_skill(request):
    try:
        recruitee_user = RecruiteeUser.objects.get(user_ptr_id=request.user.id)
    except RecruiteeUser.DoesNotExist:
        return Response({"detail": "RecruiteeUser instance not found for the given user."}, status=status.HTTP_404_NOT_FOUND)
    skill_name = request.data.get('skill_name')
    if not skill_name:
        return Response({"detail": "Skill name is required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        skill = Skill.objects.get(name=skill_name)
    except Skill.DoesNotExist:
        return Response({"detail": f"Skill '{skill_name}' not found."}, status=status.HTTP_404_NOT_FOUND)
    data = {'recruitee_user': recruitee_user.pk, 'skill': skill.pk}
    serializer = UserSkillsSerializer(data=data)
    if serializer.is_valid():
        serializer.save(recruitee_user=recruitee_user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_user_skill(request):
    recruitee_user_id = request.data.get('recruitee_user')
    skill_id = request.data.get('skill')

    if not recruitee_user_id or not skill_id:
        return Response({"detail": "recruitee_user and skill IDs are required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user_skill = UserSkills.objects.get(recruitee_user_id=recruitee_user_id, skill_id=skill_id)
    except UserSkills.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user_skill.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_skills(request):
    user_skills = UserSkills.objects.filter(recruitee_user=request.user).select_related('skill')
    serializer = UserSkillsSerializer(user_skills, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_user_skills_unauthenticated(request):
    recruitee_id = request.query_params.get('recruitee')
    user_skills = UserSkills.objects.filter(recruitee_user=recruitee_id).select_related('skill')
    serializer = UserSkillsSerializer(user_skills, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
