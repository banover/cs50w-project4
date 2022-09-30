from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class User(AbstractUser):
    pass


class Posts(models.Model):
    username = models.ForeignKey("User", on_delete=models.CASCADE, related_name="post_username")
    comment = models.CharField(max_length=500, default=None)
    like = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    datetime = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username.username, #username in Posts is foreignkey, inside of it many field in int.
            "comment": self.comment,
            "like": self.like,
            "timestamp": self.datetime.strftime("%b %d %Y, %I:%M %p")
        }


#class Follow(models.Model):
#    username = models.ForeignKey("User", on_delete=models.CASCADE, related_name="follow_username")
#    follower_number = models.IntegerField(validators=[MinValueValidator(0)], default=0)
#    followee_number = models.IntegerField(validators=[MinValueValidator(0)], default=0)


class Follow_connection(models.Model):
    username = models.ForeignKey("User", on_delete=models.CASCADE, related_name="follow_username")
    follower = models.ManyToManyField("User", related_name="followers")
    followee = models.ManyToManyField("User", related_name="followees")
    #follower = models.ForeignKey("User", on_delete=models.CASCADE, related_name="follower_username")
    #followee = models.ForeignKey("User", on_delete=models.CASCADE, related_name="followee_username")
    # many to many 한번 써봐? mail project3의 compose부분을 잘 봐서 가능함
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username.username, #username in Posts is foreignkey, inside of it many field in int.
            "follower": [wer.username for wer in self.follower.all()],
            "followee": [wee.username for wee in self.followee.all()]            
        }
        
        