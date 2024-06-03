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


class InterviewTestCase(APITestCase):
    def setUp(self):
        self.company = Company.objects.create(name='Test Company')
        self.company_user = CompanyUser.objects.create(username='companyuser', password='password', company=self.company)
        self.recruitee_user = RecruiteeUser.objects.create(username='recruitee', email='recruitee@example.com', password='password')
        self.job = Job.objects.create(name='Developer', description='Develop software', company=self.company)
        self.interview = Interview.objects.create(
            job=self.job,
            company_user=self.company_user,
            recruitee_user=self.recruitee_user,
            time=timezone.now() + timezone.timedelta(days=1),
            interview_type='VIDEO_CALL'
        )
        self.url_list_create = reverse('api_interviews_list')
        self.url_detail = reverse('api_interview_detail', kwargs={'pk': self.interview.pk})

    def test_create_interview(self):
        data = {
            'job': self.job.id,
            'company_user': self.company_user.id,
            'recruitee_user': self.recruitee_user.id,
            'time': timezone.now() + timezone.timedelta(days=3),
            'interview_type': 'QUIZ'
        }
        response = self.client.post(self.url_list_create, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Interview.objects.count(), 2)  # Including the one from setUp

    def test_get_interview_list(self):
        response = self.client.get(self.url_list_create)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_interview_detail(self):
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.interview.id)

    def test_update_interview(self):
        data = {'interview_type': 'QUIZ'}
        response = self.client.patch(self.url_detail, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.interview.refresh_from_db()
        self.assertEqual(self.interview.interview_type, 'QUIZ')

    def test_delete_interview(self):
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Interview.objects.count(), 0)
