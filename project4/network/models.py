from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class User(AbstractUser):
    pass


class Posts(models.Model):
    username = models.ForeignKey("User", on_delete=models.CASCADE, related_name="post_username")
    comment = models.CharField(max_length=500, default=None, related_name="post_comment")
    like = models.IntegerField(validators=[MinValueValidator(0)], default=0, related_name="post_like")
    datetime = models.DateTimeField(auto_now_add=True, related_name="post_datetime")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "comment": self.comment,
            "like": self.like,
            "timestamp": self.datetimestrftime("%b %d %Y, %I:%M %p")
        }