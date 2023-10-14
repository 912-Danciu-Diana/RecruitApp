from rest_framework import serializers
from .models import Interview, Question, Answer, QuizQuestion


class InterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = ['job', 'company_user', 'recruitee_user', 'time', 'interview_type']


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['question']


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['answer', 'is_correct', 'question']


class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ['quiz_interview', 'question']
