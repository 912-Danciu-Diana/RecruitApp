from rest_framework import serializers
from .models import Interview, Question, Answer, QuizQuestion, UsersAnswer


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer', 'is_correct', 'question']


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True, source='answer_set')

    class Meta:
        model = Question
        fields = ['id', 'question', 'answers']


class QuizQuestionSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)
    question_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = QuizQuestion
        fields = ['id', 'quiz_interview', 'question', 'question_id']


class UsersAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersAnswer
        fields = '__all__'


class InterviewSerializer(serializers.ModelSerializer):
    quiz_questions = QuizQuestionSerializer(source='quizquestion_set', many=True, read_only=True)

    class Meta:
        model = Interview
        fields = ['id', 'job', 'company_user', 'recruitee_user', 'time', 'interview_type', 'quiz_questions']

    def create(self, validated_data):
        job = validated_data.pop('job')
        company_user = validated_data.pop('company_user')
        recruitee_user = validated_data.pop('recruitee_user')

        interview = Interview.objects.create(job=job, company_user=company_user, recruitee_user=recruitee_user, **validated_data)
        return interview
