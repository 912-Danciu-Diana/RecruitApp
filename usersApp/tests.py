import os

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from companiesApp.models import Company
from rest_framework.authtoken.models import Token


class RecruiteeUserCreateTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.recruitee_user_data = {
            'username': 'recruiteeuser',
            'email': 'recruiteeuser@example.com',
            'password': 'testpassword123',
        }
        self.url = reverse('api_recruitee_register')

    def test_create_recruitee_user(self):
        response = self.client.post(self.url, self.recruitee_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(get_user_model().objects.filter(email=self.recruitee_user_data['email']).exists())


class CompanyUserCreateTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = get_user_model().objects.create_superuser(
            username='adminuser',
            email='adminuser@example.com',
            password='testpassword123',
        )
        self.company = Company.objects.create(name='company')
        self.company_user_data = {
            'username': 'newcompanyuser',
            'email': 'newcompanyuser@example.com',
            'password': 'testpassword123',
            'company': 1
        }
        self.company_user_data2 = {
            'username': 'newcompanyuser2',
            'email': 'newcompanyuser2@example.com',
            'password': 'testpassword123',
            'company': 1
        }
        self.url = reverse('api_companyuser_register')

    def test_create_companyuser_by_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(self.url, self.company_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # def test_create_companyuser_by_companyuser(self):
    #     self.client.force_authenticate(user=self.admin_user)
    #     response = self.client.post(self.url, self.company_user_data, format='json')
    #     created_user = get_user_model().objects.get(username='newcompanyuser')
    #     self.client.force_authenticate(user=created_user)
    #     response = self.client.post(self.url, self.company_user_data2, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_companyuser_by_unauthenticated(self):
        response = self.client.post(self.url, self.company_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LoginTestCase(APITestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(username='testuser', password='testpass')
        self.login_url = reverse('api_token_auth')

    def test_token_creation_on_login(self):
        response = self.client.post(self.login_url, {'username': 'testuser', 'password': 'testpass'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)


class LogoutTestCase(APITestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.logout_url = reverse('api_logout')

    def test_logout(self):
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        exists = Token.objects.filter(user=self.user).exists()
        self.assertFalse(exists)


class DeleteAccountTestCase(APITestCase):

    def setUp(self):
        self.user1 = get_user_model().objects.create_user(username='user1', email='user1@example.com', password='pass')
        self.user2 = get_user_model().objects.create_user(username='user2', email='user2@example.com', password='pass')
        self.admin_user = get_user_model().objects.create_superuser(username='admin', email='admin_user@example.com', password='pass')
        self.url = reverse('delete_account', kwargs={'pk': self.user1.pk})

    def test_delete_own_account(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(get_user_model().objects.filter(username='user1').exists())

    def test_delete_other_account_as_normal_user(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(get_user_model().objects.filter(username='user1').exists())

    def test_delete_other_account_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(get_user_model().objects.filter(username='user1').exists())


# class GenerateProfileFromCVTestCase(APITestCase):
#     def setUp(self):
#         self.client = APIClient()
#         self.user = get_user_model().objects.create_user(username='testuser', email='testuser@example.com', password='testpass123')
#         self.url = reverse('generate_profile')
#         self.client.force_authenticate(user=self.user)
#
#         self.resume_path = os.path.join(os.path.dirname(__file__), '..\media\cvs', 'cv.pdf')
#         self.resume_file = SimpleUploadedFile(
#             name='test_resume.pdf',
#             content=open(self.resume_path, 'rb').read(),
#             content_type='application/pdf'
#         )
#
#     def test_generate_profile_from_valid_cv(self):
#         response = self.client.post(self.url, {'cv': self.resume_file}, format='multipart')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertIn('name', response.data)
#         self.assertIn('education', response.data)
#         self.assertIn('skills', response.data)
#
#     def test_generate_profile_without_file(self):
#         response = self.client.post(self.url, {}, format='multipart')
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertEqual(response.data, 'No file attached')