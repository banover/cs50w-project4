from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class User(AbstractUser):
    pass


class Posts(models.Model):
    username = models.ForeignKey("User", on_delete=models.CASCADE, related_name="post_username")
    comment = models.CharField(max_length=500, default=None)
    like = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    like_user = models.ManyToManyField("User", related_name="like_user")
    datetime = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username.username, #username in Posts is foreignkey, inside of it many field in int.
            "comment": self.comment,
            "like": self.like,
            "like_user": [user.username for user in self.like_user.all()],
            "timestamp": self.datetime.strftime("%b %d %Y, %I:%M %p")
        }


class Follow_connection(models.Model):
    username = models.ForeignKey("User", on_delete=models.CASCADE, related_name="follow_username")
    follower = models.ManyToManyField("User", related_name="followers")
    followee = models.ManyToManyField("User", related_name="followees")
        
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username.username, #username in Posts is foreignkey, inside of it many field in int.
            "follower": [wer.username for wer in self.follower.all()],
            "followee": [wee.username for wee in self.followee.all()]            
        } 
        