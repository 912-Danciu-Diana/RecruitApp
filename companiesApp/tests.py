from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Company
from locations.models import Location


class CompanyTests(APITestCase):
    def setUp(self):
        self.location = Location.objects.create(city="New York", country="USA")

        self.company = Company.objects.create(
            name="Test Company",
            profile_pic=None,
            cover_photo=None,
            location=self.location
        )

        self.list_create_url = reverse('api_companies_list')
        self.detail_url = reverse('api_company_detail', kwargs={'pk': self.company.pk})

    def test_get_company_list(self):
        """
        Ensure we can retrieve a list of companies.
        """
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_company_detail(self):
        """
        Ensure we can retrieve a single company by id.
        """
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Company')

    def test_update_company(self):
        """
        Ensure we can update a company object.
        """
        updated_data = {'name': 'Updated Company'}
        response = self.client.patch(self.detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.company.refresh_from_db()
        self.assertEqual(self.company.name, 'Updated Company')

    def test_delete_company(self):
        """
        Ensure we can delete a company object.
        """
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Company.objects.count(), 0)
