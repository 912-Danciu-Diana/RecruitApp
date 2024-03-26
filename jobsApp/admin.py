from django.contrib import admin
from .models import Job, Skill, JobSkills, Application


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'company', 'description', 'profile_pic', 'cover_photo', 'location', 'is_remote')


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


@admin.register(JobSkills)
class JobSkillsAdmin(admin.ModelAdmin):
    list_display = ('job', 'skill')


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('job', 'recruitee', 'interview', 'acceptedForQuiz', 'accepted')
