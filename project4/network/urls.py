
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    #API
    path("upload", views.upload, name="upload"),        
    path("get_follower/<str:username>", views.get_follower, name="get_follow"),
    path("follow_connection/<str:username>", views.follow_connection, name="follow_connection"),
    path("profile_load_post/<str:username>", views.profile_load_post, name="profile_load_post"),
    path("load_post/<str:button_name>/<str:username>", views.load_post, name="load_post"),
    path("following_load_post", views.following_load_post, name="following_load_post")
]
