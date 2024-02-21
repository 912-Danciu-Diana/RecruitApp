from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True, default='default_profile_pic.jpeg')
    cover_photo = models.ImageField(upload_to='cover_photos/', null=True, blank=True, default='default_cover_photo.jpeg')

    class Meta:
        db_table = 'auth_user'

    def __str__(self):
        return self.username

    def is_recruitee(self):
        return hasattr(self, 'recruiteeuser')

    def is_company_user(self):
        return hasattr(self, 'companyuser')


class RecruiteeUser(User):
    cv = models.FileField(upload_to='cvs/', null=True, blank=True)
    profile_description = models.TextField(blank=True, null=True)
    school = models.TextField(blank=True, null=True)
    university = models.TextField(blank=True, null=True)
    work_experience = models.TextField(blank=True, null=True)


class CompanyUser(User):
    company = models.ForeignKey('companiesApp.Company', on_delete=models.CASCADE)
