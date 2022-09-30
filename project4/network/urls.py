
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    #API
    path("upload", views.upload, name="upload"),
    path("load_post", views.load_post, name="load_post"),
    path("profile_load_post/<str:username>", views.profile_load_post, name="profile_load_post"),
    path("get_follower/<str:username>", views.get_follower, name="get_follow")
    #path("get_followee", views.get_followee, name="get_follow")
]
