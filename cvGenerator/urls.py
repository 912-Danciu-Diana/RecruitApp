from django.urls import path
from .views import GenerateCV, add_user_skill, delete_user_skill

urlpatterns = [
    path('generate_cv/', GenerateCV.as_view(), name='generate_cv'),
    path('add_user_skill/', add_user_skill, name='add_user_skill'),
    path('delete_user_skill/', delete_user_skill, name='delete_user_skill'),
]
