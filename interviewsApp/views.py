from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .generate_ai_quiz import generate_quiz, parse_quiz
from .models import Interview, Question, Answer, QuizQuestion
from .serializers import (
    InterviewSerializer, QuestionSerializer,
    AnswerSerializer, QuizQuestionSerializer
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
