from django.utils import timezone

from django.core.exceptions import ValidationError
from django.db import models


class Interview(models.Model):
    INTERVIEW_TYPES = [
        ('VIDEO_CALL', 'Video Call'),
        ('QUIZ', 'Quiz'),
    ]

    job = models.ForeignKey('jobsApp.Job', on_delete=models.CASCADE)
    company_user = models.ForeignKey('usersApp.CompanyUser', on_delete=models.CASCADE)
    recruitee_user = models.ForeignKey('usersApp.RecruiteeUser', on_delete=models.CASCADE)
    time = models.DateTimeField()
    interview_type = models.CharField(
        max_length=10,
        choices=INTERVIEW_TYPES,
        default='QUIZ',
    )

    def clean(self):
        if self.time <= timezone.now():
            raise ValidationError({'time': 'The interview time must be in the future.'})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class Question(models.Model):
    question = models.CharField(max_length=255)

    def __str__(self):
        return self.question


class Answer(models.Model):
    answer = models.CharField(max_length=255)
    is_correct = models.BooleanField()
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    def __str__(self):
        return self.answer


class QuizQuestion(models.Model):
    quiz_interview = models.ForeignKey(Interview, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if self.quiz_interview.interview_type != 'QUIZ':
            raise ValidationError("The linked interview must be of type 'Quiz'")
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.quiz_interview) + "\n" + str(self.question)

