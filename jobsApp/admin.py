from django.contrib import admin
from .models import Job, Skill, JobSkills


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'description')


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(JobSkills)
class JobSkillsAdmin(admin.ModelAdmin):
    list_display = ('job', 'skill')
