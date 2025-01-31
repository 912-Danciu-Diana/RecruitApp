from django.urls import path
from .views import RecruiteeUserCreateView, CompanyUserCreateView, logout, delete_account, UserProfileView, \
    update_user_cv, generate_profile_from_cv

urlpatterns = [
    path('api/register/recruitee/', RecruiteeUserCreateView.as_view(), name='api_recruitee_register'),
    path('api/register/companyuser/', CompanyUserCreateView.as_view(), name='api_companyuser_register'),
    path('api/logout/', logout, name='api_logout'),
    path('api/delete_account/<int:pk>/', delete_account, name='delete_account'),
    path('api/user/profile/', UserProfileView.as_view(), name='user_profile'),
    path('api/user/update_cv/', update_user_cv, name='update_user_cv'),
    path('api/user/generate_profile/', generate_profile_from_cv, name='generate_profile')
]
