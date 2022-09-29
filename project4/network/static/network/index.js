document.addEventListener('DOMContentLoaded', function(){

    // Setting display to none
    document.querySelector('#composition_view').style.display = 'none';
    document.querySelector('#uploaded_posts_view').style.display = 'none';
    document.querySelector('#profile_page_view').style.display = 'none';

    // Showing the posts view
    document.querySelector('#posts_button').addEventListener('click', open_post);
    
    // SHowing the profile view
    document.querySelector('#profile_button').onclick = profile_page;

    // Uploading written comment when submit button on click 
    document.querySelector('#new_post_form').onsubmit = upload_db;
    
    // Default value, load the index
    open_post();
});


function profile_page() {

    // Setting profile_page_view block
    document.querySelector('#composition_view').style.display = 'none';
    document.querySelector('#uploaded_posts_view').style.display = 'none';
    document.querySelector('#profile_page_view').style.display = 'block';

    // Requesting server for follow datas and create div and lists all
    fetch('/get_follower', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(followers => {
        console.log(followers);

        //console.log 기록 확인 후, followr 수, folloeww 수, 로그인 유저의 모든 post(최근시간순), follow&unfollow버튼 만들기


        
        //const follower_number = followers.length;
        //const follower_number_view = document.createElement('div');
        //follower_number_view.innerHTML = follower_number;
        //document.querySelector('#number_of_follow').append(follower_number_view);

        //followers.forEach(function(follower){
        //    const followers_name = follower.follower;
        //    const followers = document.createElement('div');
        //    followers.innerHTML = followers_name; //여기에 + 활용해서 button(follow or unfollow)만들고 그 밑에 onclick시 db 손질작성
        //    //one_post.style.cssText = 'border-style: solid;border-width: 1px;margin-left: 10px;margin-right: 10px;padding-left: 17px;margin-bottom: 10px;';
        //    document.querySelector('#follower').append(followers);
        //});
        

    });
    // Requesting server for post datas by loggedin user and list them

    return false

}

function open_post (){

    // Show composition, uploaded_post view and hide something
    document.querySelector('#composition_view').style.display = 'block';
    document.querySelector('#uploaded_posts_view').style.display = 'block';
    // added display whenever new div is created
    
    // Clear out comment field
    document.querySelector('#comment').value = '';

    //Showing posts
    fetch('/load_post')
    .then(response => response.json())
    .then(posts => {
        console.log(posts);

        posts.forEach(function(post){
            let content = post.username + "<br>" + post.comment + "<br>" + post.timestamp + "<br>" + post.like;
            const one_post = document.createElement('div');
            //const hr = document.createElement('hr');
            one_post.innerHTML = content;
            one_post.style.cssText = 'border-style: solid;border-width: 1px;margin-left: 10px;margin-right: 10px;padding-left: 17px;margin-bottom: 10px;';
            
            document.querySelector('#uploaded_posts_view').append(one_post);
        })
    });

    
    return false;
}


function upload_db() {
    // Setting post data into variables
    //const username = pass;
    const comment = document.querySelector('#comment').value;
    //const like = 0; setting default 0 
    // upload variable into db using fetch
    fetch('/upload', {
        method: 'POST',
        body: JSON.stringify({
            comment: comment
        })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });

    reload(); 
    //localStorage.clear();   
    open_post();
    return false;    
}

