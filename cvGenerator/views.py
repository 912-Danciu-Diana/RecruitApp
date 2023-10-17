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
    serializer = UserSkillsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
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
