from django.urls import path

from interviewsApp.views import make_quiz
from .views import (
    JobListView, JobDetailView,
    SkillListView, SkillDetailView,
    JobSkillsListView, JobSkillsDetailView, FilteredSkillListView, ApplicationListView, ApplicationDetailView,
    add_application, find_application, get_application, get_job_applicants, update_application, search_jobs
)

urlpatterns = [
    path('api/jobs/', JobListView.as_view(), name='api_jobs_list'),
    path('api/jobs/<int:pk>/', JobDetailView.as_view(), name='api_job_detail'),
    path('api/skills/', SkillListView.as_view(), name='api_skills_list'),
    path('api/skills/<int:pk>/', SkillDetailView.as_view(), name='api_skill_detail'),
    path('api/jobskills/', JobSkillsListView.as_view(), name='api_jobskills_list'),
    path('api/jobskills/<int:pk>/', JobSkillsDetailView.as_view(), name='api_jobskills_detail'),
    path('api/search-skills/', FilteredSkillListView.as_view(), name='api_search_skills'),
    path('api/applications/', ApplicationListView.as_view(), name='api_application_list'),
    path('api/applications/<int:pk>/', ApplicationDetailView.as_view(), name='api_application_detail'),
    path('api/add_application/', add_application, name='api_add_application'),
    path('api/find_application/', find_application, name='api_find_application'),
    path('api/get_application/', get_application, name='api_get_application'),
    path('api/get_job_applicants/', get_job_applicants, name='api_get_job_applicants'),
    path('api/update_application/', update_application, name='api_update_application'),
    path('api/make_quiz/', make_quiz, name='api_make_quiz'),
    path('api/search_jobs/', search_jobs, name='api_search_jobs')
]
