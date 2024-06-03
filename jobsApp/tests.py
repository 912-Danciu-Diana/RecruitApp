from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

from companiesApp.models import Company
from locations.models import Location
from usersApp.models import RecruiteeUser
from .models import Job, Application, Skill

User = get_user_model()


class JobTests(APITestCase):
    def setUp(self):
        self.location = Location.objects.create(city="Test City", country="Test Country")
        self.company = Company.objects.create(name="Test Company", location=self.location)
        self.user = User.objects.create_user(username='testuser', password='testpass123', email='test@example.com')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.job_list_url = reverse('api_jobs_list')

        self.job = Job.objects.create(
            name="Software Developer",
            description="Develops software",
            company=self.company,
            location=self.location,
            is_remote=True
        )

    def test_get_job_list(self):
        """
        Ensure we can retrieve a list of jobs.
        """
        response = self.client.get(self.job_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # only one job in database so far

    def test_get_job_detail(self):
        """
        Ensure we can retrieve a single job by id.
        """
        url = reverse('api_job_detail', kwargs={'pk': self.job.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.job.name)


class SkillTests(APITestCase):
    def setUp(self):
        self.skill_list_url = reverse('api_skills_list')
        self.skill = Skill.objects.create(name='Python')

    def test_create_skill(self):
        data = {'name': 'Django'}
        response = self.client.post(self.skill_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Skill.objects.count(), 2)

    def test_get_skill_list(self):
        response = self.client.get(self.skill_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # only one skill created
