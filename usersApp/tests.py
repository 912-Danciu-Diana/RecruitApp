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

    def test_create_companyuser_by_companyuser(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(self.url, self.company_user_data, format='json')
        created_user = get_user_model().objects.get(username='newcompanyuser')
        self.client.force_authenticate(user=created_user)
        response = self.client.post(self.url, self.company_user_data2, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

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
