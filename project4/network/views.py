from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from .models import User

# @csrf_exempt, @login_required 붙일지 고민해보셈(header에 import하고 쓰셈 - from django.contrib.auth.decorators import login_required and from django.views.decorators.csrf import csrf_exempt)

def index(request):
    if request.method == "GET":
        return render(request, "network/index.html")

    else:
        pass
        

@csrf_exempt
@login_required
def upload(request):
    if request.method == "POST":

        # Setting request data to variables
        username = request.user
        post = json.loads(request.body)
        comment = post.get("comment","")

        # Uploading model using request data
        posts = Posts(
            username = username,
            comment = post
            # datetime and like made auto
        )
        posts.save()

        # Return jason response (view.py - compose부분 참고 FROM mail(pj3))
        return JsonResponse({"message": "Posts sent successfully."}, status=201)

        # method = get, read data from db and send it to js in Jsonform


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
