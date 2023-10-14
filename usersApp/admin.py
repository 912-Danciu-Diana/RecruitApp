from django.contrib import admin
from .models import User, RecruiteeUser, CompanyUser


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email')


@admin.register(RecruiteeUser)
class RecruiteeUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'cv', 'profile_description', 'school', 'university', 'work_experience')


@admin.register(CompanyUser)
class CompanyUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'company')
