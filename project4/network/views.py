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
   # if request.method == "GET":
   #     return render(request, "network/index.html")

    if request.user.is_authenticated:
        if request.method == "GET":
            return render(request, "network/index.html")

    else:
        return HttpResponseRedirect(reverse("login"))
        

@login_required
def following_load_post(request):

    if request.method == "GET":

        # Setting loggedin user id
        loginuser = request.user
        loginuser_id = User.objects.filter(username=loginuser)
        loginuser_id = loginuser_id.first().id
        # Finding out loginuser's follower in list form
        loginuser_follower_list = Follow_connection.objects.filter(username=loginuser_id)
        loginuser_follower_list = loginuser_follower_list.first().follower.all()
        #loginuser_follower_list = loginuser_follower_list.first().username
        #loginuser_follower_list = loginuser_follower_list[0].follower
        # Filtering out followers' posts
        follower_posts = Posts.objects.filter(username__in=loginuser_follower_list)
        #follower_posts = Posts.objects.filter(username=loginuser_id)

        # Ordering posts in reverse chronological order
        follower_posts = follower_posts.order_by("-datetime").all()

        # Return follower's posts in serialized
        return JsonResponse([post.serialize() for post in follower_posts], safe=False)
        #return JsonResponse([post.serialize() for post in loginuser_follower_list], safe=False)  
        


@login_required
@csrf_exempt
def follow_connection(request, username):
    
    # 위 username은 링크 이름 클릭한 대상임
    # 로그인한 유저 모델 정보에 follow에 추가해야함, 위 username은 follow한 대상
    loggedin_username = request.user
    id_username = User.objects.filter(username=loggedin_username)
    id_username = id_username.first().id
    model_data = Follow_connection.objects.filter(username = id_username)
    
    if request.method == "POST":

    # Check there is model which model.username is loggedin user
    # if there is update the model inf, else make new model inf
        if len(model_data) > 0:
            #data = json.loads(request.body)        
            # Adding username in login user's follower list 
            tem_username = User.objects.filter(username=username)
            tem_username = tem_username.first().id
            model_data.first().follower.add(tem_username)

            # Adding login usrname in username's followee list
            follower_data = Follow_connection.objects.filter(username = tem_username)
            follower_data.first().followee.add(id_username)

            return JsonResponse({"message": "follower upload successfully!"})
        else:
            return JsonResponse({"message": "model_Data =< 0"})

    elif request.method == "PUT":        
        
        if len(model_data) > 0:
            #data = json.loads(request.body)
            # Erasing username in login user's follower list            
            tem_username = User.objects.filter(username=username)
            tem_username = tem_username.first().id
            model_data.first().follower.remove(tem_username)
            
            # Erasing login usrname in username's followee list
            follower_data = Follow_connection.objects.filter(username = tem_username)
            follower_data.first().followee.remove(id_username)
            
            return JsonResponse({"message": "follower delete successfully!"})    
        else:
            return JsonResponse({"message": "model_Data =< 0"})


@csrf_exempt 
@login_required
def get_follower(request, username):
    if request.method == 'POST':
        loggedin_usrname = request.user
        username = User.objects.filter(username=loggedin_usrname)
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
            username_id = User.objects.filter(username=username)
            username_id = username_id.first()
            followup = Follow_connection(username=username_id)
            followup.save()         
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
