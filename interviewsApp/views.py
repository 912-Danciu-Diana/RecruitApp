from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from jobsApp.models import Job
from usersApp.models import RecruiteeUser, CompanyUser
from .generate_ai_quiz import generate_quiz, parse_quiz, chat_with_ai
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
def generate_ai_quiz(request):
    company_user = request.user
    try:
        recruiter = CompanyUser.objects.get(id=company_user.pk)
    except CompanyUser.DoesNotExist:
        return Response({"detail": "Unauthorized. Only recruiters can perform this action."},
                        status=status.HTTP_403_FORBIDDEN)

    topic = request.data.get('topic')
    job_id = request.data.get('job')
    recruitee_id = request.data.get('recruitee')

    if not topic:
        return Response({"detail": "Topic is required."}, status=status.HTTP_400_BAD_REQUEST)
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

    raw_quiz = generate_quiz(topic)
    quiz_data = parse_quiz(raw_quiz)

    interview_data = {
        'job': job.pk,
        'company_user': recruiter.pk,
        'recruitee_user': recruitee_user.pk,
        'interview_type': 'QUIZ'
    }
    interview_serializer = InterviewSerializer(data=interview_data)
    if interview_serializer.is_valid():
        interview = interview_serializer.save(job=job, company_user=recruiter, recruitee_user=recruitee_user)
    else:
        return Response(interview_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    saved_questions = []
    for q in quiz_data:
        question_obj = Question.objects.create(question=q['question'])
        for a in q['answers']:
            Answer.objects.create(question=question_obj, answer=a['answer'], is_correct=a['is_correct'])
        saved_questions.append(question_obj.id)
        QuizQuestion.objects.create(quiz_interview=interview, question=question_obj)

    return Response({"interview_id": interview.id, "question_ids": saved_questions}, status=status.HTTP_201_CREATED)


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


@api_view(['GET'])
def calculate_quiz_score(request, interview_id):
    try:
        interview = Interview.objects.get(id=interview_id, interview_type='QUIZ')
    except Interview.DoesNotExist:
        return Response({"error": "Quiz interview not found."}, status=status.HTTP_404_NOT_FOUND)

    quiz_questions = QuizQuestion.objects.filter(quiz_interview=interview)
    total_questions = quiz_questions.count()

    if total_questions == 0:
        return Response({"error": "No questions found for this quiz."}, status=status.HTTP_400_BAD_REQUEST)

    correct_answers_count = 0
    total_answers_count = 0

    for quiz_question in quiz_questions:
        user_answers = UsersAnswer.objects.filter(quiz_question=quiz_question)
        total_answers_count += user_answers.count()

        for user_answer in user_answers:
            if user_answer.is_correct == user_answer.answer.is_correct:
                correct_answers_count += 1


    score_percentage = int((correct_answers_count / total_answers_count) * 100)

    return Response({"total_answers": total_answers_count, "correct_answers": correct_answers_count, "score_percentage": score_percentage})


@api_view(['GET'])
def quiz_details(request, interview_id):
    try:
        interview = Interview.objects.get(id=interview_id, interview_type='QUIZ')
    except Interview.DoesNotExist:
        return Response({"error": "Quiz interview not found."}, status=404)

    quiz_questions = QuizQuestion.objects.filter(quiz_interview=interview).select_related('question')
    quiz_questions_data = []

    for quiz_question in quiz_questions:
        question_data = {
            "id": quiz_question.id,
            "question": quiz_question.question.question,
            "user_answers": []
        }

        user_answers = UsersAnswer.objects.filter(quiz_question=quiz_question).select_related('answer')

        user_answer_data = [
            {
                "answer_id": user_answer.answer.id,
                "answer": user_answer.answer.answer,
                "user_marked_correct": user_answer.is_correct,
                "actual_is_correct": user_answer.answer.is_correct
            } for user_answer in user_answers.all()
        ]

        if user_answer_data:
            question_data["user_answers"] = user_answer_data

        quiz_questions_data.append(question_data)

    return Response({
        'id': interview.id,
        'quiz_questions': quiz_questions_data
    })


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def chatbot(request):
    recruitee_user = request.user
    try:
        RecruiteeUser.objects.get(id=recruitee_user.pk)
    except RecruiteeUser.DoesNotExist:
        return Response({"detail": "Unauthorized. Only recruitees can perform this action."},
                        status=status.HTTP_403_FORBIDDEN)

    prompt = request.data.get('prompt')

    if not prompt:
        return Response({"detail": "Prompt is required."}, status=status.HTTP_400_BAD_REQUEST)

    reply = chat_with_ai(prompt)

    return Response({"reply": reply}, status=status.HTTP_200_OK)
