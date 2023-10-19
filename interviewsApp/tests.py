from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from companiesApp.models import Company
from .models import UsersAnswer, QuizQuestion, Answer, Question, Interview
from usersApp.models import CompanyUser, RecruiteeUser
from jobsApp.models import Job


class UsersAnswerTestCase(APITestCase):

    def setUp(self):
        self.company = Company.objects.create(name='company')
        self.company_user = CompanyUser.objects.create(username='company', password='password123', company=self.company,
                                                       email='companyuser@gmail.com')
        self.recruitee_user = RecruiteeUser.objects.create(username='recruitee', password='password123',
                                                           email='recruiteeuser@gmail.com')
        self.job = Job.objects.create(name='Developer', description='Software Developer', company=self.company)
        self.interview = Interview.objects.create(
            job=self.job,
            company_user=self.company_user,
            recruitee_user=self.recruitee_user,
            time=timezone.now() + timezone.timedelta(days=1)
        )
        self.question = Question.objects.create(question="What is Python?")
        self.answer = Answer.objects.create(answer="A programming language", is_correct=True, question=self.question)
        self.quiz_question = QuizQuestion.objects.create(quiz_interview=self.interview, question=self.question)

    def test_create_users_answer(self):
        url = reverse('api_users_answer_list')
        data = {
            'quiz_question': self.quiz_question.id,
            'answer': self.answer.id,
            'is_correct': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UsersAnswer.objects.count(), 1)

    def test_retrieve_users_answer(self):
        users_answer = UsersAnswer.objects.create(quiz_question=self.quiz_question, answer=self.answer, is_correct=True)
        url = reverse('api_users_answer_detail', args=[users_answer.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_users_answer(self):
        users_answer = UsersAnswer.objects.create(quiz_question=self.quiz_question, answer=self.answer, is_correct=True)
        url = reverse('api_users_answer_detail', args=[users_answer.id])
        data = {'is_correct': False}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        users_answer.refresh_from_db()
        self.assertFalse(users_answer.is_correct)

    def test_delete_users_answer(self):
        users_answer = UsersAnswer.objects.create(quiz_question=self.quiz_question, answer=self.answer, is_correct=True)
        url = reverse('api_users_answer_detail', args=[users_answer.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(UsersAnswer.objects.count(), 0)
