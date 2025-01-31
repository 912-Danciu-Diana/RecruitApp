# Generated by Django 4.2.6 on 2024-02-21 10:42

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("usersApp", "0003_user_cover_photo_user_profile_pic"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="cover_photo",
            field=models.ImageField(
                blank=True,
                default="default_cover_photo.jpeg",
                null=True,
                upload_to="cover_photos/",
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="profile_pic",
            field=models.ImageField(
                blank=True,
                default="default_profile_pic.jpeg",
                null=True,
                upload_to="profile_pics/",
            ),
        ),
    ]
