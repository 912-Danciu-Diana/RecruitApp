from django.urls import path
from .views import GenerateCV, add_user_skill, delete_user_skill, get_user_skills, get_user_skills_unauthenticated

urlpatterns = [
    path('generate_cv/', GenerateCV.as_view(), name='generate_cv'),
    path('add_user_skill/', add_user_skill, name='add_user_skill'),
    path('delete_user_skill/', delete_user_skill, name='delete_user_skill'),
    path('userskills/', get_user_skills, name='get-user-skills'),
    path('userskillsunauthenticated/', get_user_skills_unauthenticated, name='get-user-skills-unauthenticated'),
]
