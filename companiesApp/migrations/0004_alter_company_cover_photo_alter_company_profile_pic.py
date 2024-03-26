# Generated by Django 4.2.6 on 2024-03-13 15:47

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("companiesApp", "0003_company_location"),
    ]

    operations = [
        migrations.AlterField(
            model_name="company",
            name="cover_photo",
            field=models.ImageField(
                blank=True,
                default="default_cover_photo.jpeg",
                null=True,
                upload_to="cover_photos/",
            ),
        ),
        migrations.AlterField(
            model_name="company",
            name="profile_pic",
            field=models.ImageField(
                blank=True,
                default="default_profile_pic.jpeg",
                null=True,
                upload_to="profile_pics/",
            ),
        ),
    ]
