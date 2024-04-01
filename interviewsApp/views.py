from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from jobsApp.models import Job
from usersApp.models import RecruiteeUser, CompanyUser
from .generate_ai_quiz import generate_quiz, parse_quiz
from .models import Interview, Question, Answer, QuizQuestion, UsersAnswer
from .serializers import (
    InterviewSerializer, QuestionSerializer,
    AnswerSerializer, QuizQuestionSerializer, UsersAnswerSerializer
)


class InterviewListView(generics.ListCreateAPIView):
    queryset = Interview.objects.all()
    serializer_class = InterviewSerializer


class InterviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Interview.objects.all()
    serializer_class = InterviewSerializer


class QuestionListView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class AnswerListView(generics.ListCreateAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer


class AnswerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer


class QuizQuestionListView(generics.ListCreateAPIView):
    queryset = QuizQuestion.objects.all()
    serializer_class = QuizQuestionSerializer


class QuizQuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = QuizQuestion.objects.all()
    serializer_class = QuizQuestionSerializer


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def generate_quiz_api(request):
    topic = request.data.get('topic')
    if not topic:
        return Response({"detail": "Topic is required."}, status=status.HTTP_400_BAD_REQUEST)
    raw_quiz = generate_quiz(topic)
    quiz_data = parse_quiz(raw_quiz)
    saved_questions = []
    for q in quiz_data:
        question_obj = Question.objects.create(question=q['question'])
        for a in q['answers']:
            Answer.objects.create(question=question_obj, answer=a['answer'], is_correct=a['is_correct'])
        saved_questions.append(question_obj.id)

    return Response({"question_ids": saved_questions}, status=status.HTTP_201_CREATED)


class UsersAnswerListView(generics.ListCreateAPIView):
    queryset = UsersAnswer.objects.all()
    serializer_class = UsersAnswerSerializer

class UsersAnswerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UsersAnswer.objects.all()
    serializer_class = UsersAnswerSerializer


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def make_quiz(request):
    company_user = request.user
    try:
        recruiter = CompanyUser.objects.get(id=company_user.pk)
    except CompanyUser.DoesNotExist:
        return Response({"detail": "Unauthorized. Only recruiters can perform this action."},
                        status=status.HTTP_403_FORBIDDEN)
    job_id = request.query_params.get('job')
    recruitee_id = request.query_params.get('recruitee')
    if not job_id:
        return Response({"detail": "Job id is required."}, status=400)
    if not recruitee_id:
        return Response({"detail": "Recruitee id is required."}, status=400)
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"detail": "Job not found."}, status=status.HTTP_404_NOT_FOUND)
    try:
        recruitee_user = RecruiteeUser.objects.get(user_ptr_id=recruitee_id)
    except RecruiteeUser.DoesNotExist:
        return Response({"detail": "RecruiteeUser not found."}, status=status.HTTP_404_NOT_FOUND)
    data = {'job': job.pk, 'company_user': recruiter.pk, 'recruitee_user': recruitee_user.pk}
    serializer = InterviewSerializer(data=data)
    if serializer.is_valid():
        serializer.save(job=job, company_user=recruiter, recruitee_user=recruitee_user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def check_interview_exists(request):
    job_id = request.query_params.get('job')
    recruitee_id = request.query_params.get('recruitee')
    if not job_id:
        return Response({"detail": "Job id is required."}, status=400)
    if not recruitee_id:
        return Response({"detail": "Recruitee id is required."}, status=400)
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"detail": "Job not found."}, status=status.HTTP_404_NOT_FOUND)
    try:
        recruitee_user = RecruiteeUser.objects.get(user_ptr_id=recruitee_id)
    except RecruiteeUser.DoesNotExist:
        return Response({"detail": "RecruiteeUser not found."}, status=status.HTTP_404_NOT_FOUND)
    interviews = Interview.objects.filter(job=job.pk, recruitee_user=recruitee_user.pk)
    if interviews.exists():
        interview = interviews.first()
        return Response({"exists": True, "detail": "Interview already exists for this job and applicant.", "interview_id": interview.pk})
    else:
        return Response({"exists": False, "detail": "No interview found for this job and applicant."})


@api_view(['GET'])
def checkIfQuizTaken(request, interview_id):
    try:
        interview = Interview.objects.get(id=interview_id)
    except Interview.DoesNotExist:
        return Response({"error": "Interview not found."}, status=404)

    answers_exist = UsersAnswer.objects.filter(quiz_question__quiz_interview=interview).exists()

    return Response({"interview_taken": answers_exist})
