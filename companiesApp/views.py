from rest_framework import generics, filters
from .models import Company
from .serializers import CompanySerializer


class CompanyListView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'location__city', 'location__country']


class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
