from django.contrib import admin
from .models import Interview, Question, Answer, QuizQuestion, UsersAnswer


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'job', 'company_user', 'recruitee_user', 'time', 'interview_type')


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'question',)


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'answer', 'is_correct')


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('quiz_interview', 'question')


@admin.register(UsersAnswer)
class UsersAnswerAdmin(admin.ModelAdmin):
    list_display = ('quiz_question', 'answer', 'is_correct')
