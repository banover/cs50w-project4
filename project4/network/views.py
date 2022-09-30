from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json

from .models import User, Posts, Follow_connection

# @csrf_exempt, @login_required 붙일지 고민해보셈(header에 import하고 쓰셈 - from django.contrib.auth.decorators import login_required and from django.views.decorators.csrf import csrf_exempt)

def index(request):
    if request.method == "GET":
        return render(request, "network/index.html")

    #else:
    #    pass
    # is_authenticated 활용해서 elsw시 로그인 html로 redirect시키기
        

@csrf_exempt 
@login_required
def get_follower(request, username):
    if request.method == 'POST':
        username = User.objects.filter(username=username)
        username = username.first().id
        # Getting follower datas from db 
        follows = Follow_connection.objects.filter(username=username)
        # return jsonresponse with follower data
        return JsonResponse([follow.serialize() for follow in follows], safe=False)
        #return JsonResponse(follows)


@login_required
@csrf_exempt
def upload(request):
    if request.method == "POST":

        # Setting request data to variables
        username = request.user
        post = json.loads(request.body)
        comment = post.get("comment","")

        # Uploading model using request data
        posts = Posts(
            username = username,
            comment = comment
            # datetime and like made auto
        )
        posts.save()

        # Return jason response (view.py - compose부분 참고 FROM mail(pj3))
        return JsonResponse({"message": "Posts sent successfully."}, status=201)


# Loading all posts
def load_post(request):
    posts = Posts.objects.all()
    posts = posts.order_by("-datetime").all()

    return JsonResponse([post.serialize() for post in posts], safe=False)


# Loading profile posts
def profile_load_post(request, username):
    name = User.objects.filter(username=username)
    id_name = name.first().id
    posts = Posts.objects.filter(username=id_name)
    posts = posts.order_by("-datetime").all()

    return JsonResponse([post.serialize() for post in posts], safe=False)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
