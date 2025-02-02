from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=255)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True, default='default_profile_pic.jpeg')
    cover_photo = models.ImageField(upload_to='cover_photos/', null=True, blank=True, default='default_cover_photo.jpeg')
    location = models.ForeignKey('locations.Location', on_delete=models.SET_NULL, null=True,
                                 blank=True)

    def __str__(self):
        return self.name
