from django.db import models


class Job(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    company = models.ForeignKey('companiesApp.Company', on_delete=models.CASCADE)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    cover_photo = models.ImageField(upload_to='cover_photos/', null=True, blank=True)
    location = models.ForeignKey('locations.Location', on_delete=models.SET_NULL, null=True,
                                 blank=True)
    is_remote = models.BooleanField(default=False, null=True, blank=True)

    def __str__(self):
        return self.name


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class JobSkills(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.job) + "\n" + str(self.skill)
