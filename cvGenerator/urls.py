from django.urls import path
from .views import GenerateCV

urlpatterns = [
    path('generate_cv/', GenerateCV.as_view(), name='generate_cv'),
]
