from django.db import models


class Location(models.Model):
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    class Meta:
        unique_together = ['country', 'city']

    def __str__(self):
        return f"{self.city}, {self.country}"
