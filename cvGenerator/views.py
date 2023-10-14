from django.http import HttpResponse
from django.template.loader import get_template
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.views import APIView
from xhtml2pdf import pisa
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
