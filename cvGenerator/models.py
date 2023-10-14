from django.db import models


class UserSkills(models.Model):
    recruitee_user = models.ForeignKey('usersApp.RecruiteeUser', on_delete=models.CASCADE)
    skill = models.ForeignKey('jobsApp.Skill', on_delete=models.CASCADE)

    class Meta:
        unique_together = ['recruitee_user', 'skill']
