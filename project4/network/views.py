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

# 전역변수 설정


def index(request):  

    # When logged in, render index.html
    if request.user.is_authenticated:
        if request.method == "GET":
            return render(request, "network/index.html")

    # When not logged in, reverse login.html
    else:
        return HttpResponseRedirect(reverse("login"))


@login_required
def get_post_data(request, username, post_id):
    
    # Finding user's id
    user_data = User.objects.filter(username=username)
    user_id = user_data.first().id

    # Finding a post which has certain username, post_id
    posts = Posts.objects.filter(username=user_id, id=post_id)
    posts = posts.first()
    #post_like = posts.first().like
  
    # Return post data in serialize form    
    return JsonResponse(posts.serialize(), safe=False)
            

@csrf_exempt
@login_required
def change_likes(request, username, post_id):    

    # Earning user's id whoes name is username who made a post
    user_data = User.objects.filter(username=username)
    user_id = user_data.first().id

    # Setting post to change
    post = Posts.objects.filter(username=user_id, id=post_id)
    post = post.first()

    # When request method is put
    if request.method == "PUT":

        # Remove logged in user in like_user
        logedin_user = request.user
        logedin_user_id = User.objects.filter(username=logedin_user)
        logedin_user_id = logedin_user_id.first().id
        post.like_user.remove(logedin_user_id)

        # Changing like decreased 1 
        new_like_number = post.like - 1
        post.like = new_like_number
        post.save()        

        # Return jsonresponse message if above process success
        return JsonResponse({"message": "update reducing like_number and remove like_user successfully!"})
 
    else:

        # Upload like_user
        logedin_user = request.user
        logedin_user_id = User.objects.filter(username=logedin_user)
        logedin_user_id = logedin_user_id.first().id
        post.like_user.add(logedin_user_id)
        #follower_data.first().followee.add(id_username)

        # Upload like number
        new_like_number = post.like + 1
        post.like = new_like_number
        post.save()        
        
        # Sending message in jsonresponse
        return JsonResponse({"message": "update like_number and like_user successfully!"})


@login_required
def get_login_username(request):

    # Getting logged in username
    username = request.user
    login_username = User.objects.filter(username=username).first().username

    # Return json format which has a username
    return JsonResponse({"username":login_username}, safe=False)


@csrf_exempt
@login_required
def update(request, post_id):

    # Setting logged in username
    loggedin_username = request.user

    # When request method is put
    if request.method == "PUT":

        # Getting a post which have to be changed
        username = User.objects.filter(username=loggedin_username)
        username = username.first().id
        post = Posts.objects.filter(username=username, pk=post_id).first()

        # Setting sended data 
        data = json.loads(request.body)
        #new_comment = data.get("comment")

        # Changing a post'comment inf
        new_comment = data["comment"]
        post.comment = new_comment
        post.save()
        
        #return JsonResponse({"message": "Update comment sent successfully."}, status=201)
        return HttpResponse(status=204)


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
        
        # Filtering out followers' posts
        follower_posts = Posts.objects.filter(username__in=loginuser_follower_list)
        
        # Ordering posts in reverse chronological order
        follower_posts = follower_posts.order_by("-datetime").all()
        a = [post.serialize() for post in follower_posts]
        b = len(a)

        # Return follower's posts in serialized
        #return JsonResponse([post.serialize() for post in follower_posts], safe=False)
        
        # Retrun json response per post        
        return JsonResponse({"posts":a,
                            "posts_number":b}, safe=False)

@login_required
@csrf_exempt
def follow_connection(request, username):
    
    #  username is cliked link name
    # Setting proper valriables for follower and followee upload and for remove follower + ee
    loggedin_username = request.user
    id_username = User.objects.filter(username=loggedin_username)
    id_username = id_username.first().id
    model_data = Follow_connection.objects.filter(username = id_username)
    
    if request.method == "POST":

    # Check there is model which model.username is loggedin user
    # Updating the model information
        if len(model_data) > 0:
                    
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

        # Setting variables for getting follower inf
        loggedin_usrname = request.user
        username = User.objects.filter(username=loggedin_usrname)
        username = username.first().id

        # Getting follower datas from db 
        follows = Follow_connection.objects.filter(username=username)
        
        # Return jsonresponse with follower data
        return JsonResponse([follow.serialize() for follow in follows], safe=False)
        

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

        # Return jason response 
        return JsonResponse({"message": "Posts sent successfully."}, status=201)


# Loading all posts
def load_post(request, button_name, username):

    # Get start and end points
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 9))

    # When the button name is all_post
    if button_name == "all_post":

        # Loading all post datas
        posts = Posts.objects.all()         
        posts = posts.order_by("-datetime")[start - 1:end]   
        posts_number = len(Posts.objects.all())
        a = [post.serialize() for post in posts]
        b = len(a)

        # Return json response per post
        return JsonResponse({"posts":a,
                            "posts_number":b}, safe=False)

    # When the button name is profile
    elif button_name =="profile":

        # Setting variables for loading posts
        name = User.objects.filter(username=username) 
        id_name = name.first().id

        # Loading posts from db
        posts = Posts.objects.filter(username=id_name)       
        posts = posts.order_by("-datetime")[start - 1:end]
        a = [post.serialize() for post in posts]
        b = len(a)

        # Retrun json response per post        
        return JsonResponse({"posts":a,
                            "posts_number":b}, safe=False)
    
    # When the button name is following
    elif button_name == "following":

        # Setting loggedin user id
        loginuser = request.user
        loginuser_id = User.objects.filter(username=loginuser)
        loginuser_id = loginuser_id.first().id

        # Finding out loginuser's follower in list form
        loginuser_follower_list = Follow_connection.objects.filter(username=loginuser_id)
        loginuser_follower_list = loginuser_follower_list.first().follower.all()
        
        # Filtering out followers' posts
        follower_posts = Posts.objects.filter(username__in=loginuser_follower_list)
        
        # Ordering posts in reverse chronological order        
        follower_posts = follower_posts.order_by("-datetime")[start - 1:end]
        a = [post.serialize() for post in follower_posts]
        b = len(a)
                
        # Retrun json response per post        
        return JsonResponse({"posts":a,
                            "posts_number":b}, safe=False)

    else:
        pass
        

# Loading profile posts
def profile_load_post(request, username):

    # Setting variables for loading posts
    name = User.objects.filter(username=username)
    id_name = name.first().id

    # Loading posts from db
    posts = Posts.objects.filter(username=id_name)
    #posts = posts.order_by("-datetime").all()    ****여기서부터 수정
    posts = posts.order_by("-datetime")[start - 1:end]
    a = [post.serialize() for post in posts]
    b = len(a)

    # Retrun json response per post
    #return JsonResponse([post.serialize() for post in posts], safe=False)
    return JsonResponse({"posts":a,
                         "posts_number":b}, safe=False)


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

        # Attempt to create new user and new follow_connection
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
