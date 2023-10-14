from django.contrib import admin
from .models import UserSkills


@admin.register(UserSkills)
class UserSkillsAdmin(admin.ModelAdmin):
    list_display = ('recruitee_user', 'skill')
