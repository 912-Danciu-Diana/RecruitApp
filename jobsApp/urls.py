from django.urls import path
from .views import (
    JobListView, JobDetailView,
    SkillListView, SkillDetailView,
    JobSkillsListView, JobSkillsDetailView
)

urlpatterns = [
    path('api/jobs/', JobListView.as_view(), name='api_jobs_list'),
    path('api/jobs/<int:pk>/', JobDetailView.as_view(), name='api_job_detail'),
    path('api/skills/', SkillListView.as_view(), name='api_skills_list'),
    path('api/skills/<int:pk>/', SkillDetailView.as_view(), name='api_skill_detail'),
    path('api/jobskills/', JobSkillsListView.as_view(), name='api_jobskills_list'),
    path('api/jobskills/<int:pk>/', JobSkillsDetailView.as_view(), name='api_jobskills_detail'),
]
