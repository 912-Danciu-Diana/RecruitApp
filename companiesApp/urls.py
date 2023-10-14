from django.urls import path
from .views import CompanyListView, CompanyDetailView


urlpatterns = [
    path('api/companies/', CompanyListView.as_view(), name='api_companies_list'),
    path('api/companies/<int:pk>/', CompanyDetailView.as_view(), name='api_company_detail'),
]
