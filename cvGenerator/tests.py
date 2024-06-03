from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token

from cvGenerator.models import UserSkills
from jobsApp.models import Skill
from usersApp.models import RecruiteeUser


class GenerateCVTestCase(APITestCase):

    def setUp(self):
        self.recruitee_user = RecruiteeUser.objects.create(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.recruitee_user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.generate_cv_url = reverse('generate_cv')

    def test_generate_cv(self):
        response = self.client.get(self.generate_cv_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')


class GetUserSkillsTestCase(APITestCase):
    def setUp(self):
        self.recruitee_user = RecruiteeUser.objects.create(username='testuser', password='testpass')
        self.skill = Skill.objects.create(name="Test Skill")
        self.user_skill = UserSkills.objects.create(recruitee_user=self.recruitee_user, skill=self.skill)
        self.token = Token.objects.create(user=self.recruitee_user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.get_user_skills_url = reverse('get-user-skills')
        self.get_user_skills_unauthenticated_url = reverse('get-user-skills-unauthenticated')

    def test_get_user_skills_authenticated(self):
        response = self.client.get(self.get_user_skills_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Assuming only one skill is added
        self.assertEqual(response.data[0]['skill_name'], 'Test Skill')

    def test_get_user_skills_unauthenticated(self):
        self.client.credentials()
        response = self.client.get(f"{self.get_user_skills_unauthenticated_url}?recruitee={self.recruitee_user.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Assuming only one skill is added
        self.assertEqual(response.data[0]['skill_name'], 'Test Skill')

    def test_get_user_skills_unauthenticated_no_user(self):
        self.client.credentials()
        response = self.client.get(f"{self.get_user_skills_unauthenticated_url}?recruitee=999")  # Non-existent user ID
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # No skills should be returned


class AddUserSkillTestCase(APITestCase):
    def setUp(self):
        self.recruitee_user = RecruiteeUser.objects.create(username='testuser', password='testpass')
        self.skill = Skill.objects.create(name="Test Skill")
        self.token = Token.objects.create(user=self.recruitee_user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.add_user_skill_url = reverse('add_user_skill')

    def test_add_user_skill_with_skill_name(self):
        data = {'skill_name': 'Test Skill'}
        response = self.client.post(self.add_user_skill_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserSkills.objects.count(), 1)
        self.assertEqual(UserSkills.objects.first().skill.name, 'Test Skill')

    def test_add_user_skill_skill_not_found(self):
        data = {'skill_name': 'Nonexistent Skill'}
        response = self.client.post(self.add_user_skill_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class DeleteUserSkillTestCase(APITestCase):
    def setUp(self):
        self.recruitee_user = RecruiteeUser.objects.create(username='testuser', password='testpass')
        self.skill = Skill.objects.create(name="Test Skill")
        self.user_skill = UserSkills.objects.create(recruitee_user=self.recruitee_user, skill=self.skill)
        self.token = Token.objects.create(user=self.recruitee_user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.delete_user_skill_url = reverse('delete_user_skill')

    def test_delete_user_skill_with_correct_data(self):
        data = {'recruitee_user': self.recruitee_user.id, 'skill': self.skill.id}
        response = self.client.delete(self.delete_user_skill_url, data)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(UserSkills.objects.filter(recruitee_user=self.recruitee_user, skill=self.skill).exists())

    def test_delete_user_skill_with_incorrect_data(self):
        data = {'recruitee_user': 999, 'skill': 999}  # Invalid IDs
        response = self.client.delete(self.delete_user_skill_url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)