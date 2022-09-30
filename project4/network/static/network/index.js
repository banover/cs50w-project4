document.addEventListener('DOMContentLoaded', function(){

    // Setting display to none
    document.querySelector('#composition_view').style.display = 'none';
    document.querySelector('#uploaded_posts_view').style.display = 'none';
    document.querySelector('#profile_page_view').style.display = 'none';
    

    // Showing the posts view
    document.querySelector('#posts_button').addEventListener('click', open_post);
    
    // SHowing the profile view
    //document.querySelector('#profile_button').onclick = profile_page;

    // Uploading written comment when submit button on click 
    document.querySelector('#new_post_form').onsubmit = upload_db;
    
    // profile view testing~
    //document.querySelectorAll("a.profile_link").forEach(function(a) {
    //    a.onclick = function() {
    //        console.log(a);
    //       let username = a.dataset.name;
    //        profile_page(username);
    //    }        
    //});
    //console.log(document.querySelectorAll('a.profile_link'));
    
    //document.querySelectorAll('a.profile_link').onclick = open_post();

    // Default value, load the index
    open_post();
});


function profile_page(username) {

    // Setting profile_page_view block
    document.querySelector('#composition_view').style.display = 'none';
    document.querySelector('#uploaded_posts_view').style.display = 'none';
    document.querySelector('#profile_page_view').style.display = 'block';

    // Requesting server for follow datas and create div and lists all
    fetch(`/get_follower/${username}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(followers => {
        console.log(followers);
        console.log(followers[0].follower.length);

        // Finding number of follower and append it into follower_number_view tag
        const follower_number = "The number of follower: " + followers[0].follower.length;            
        const follower_number_view = document.createElement('div');
        follower_number_view.innerHTML = follower_number;
        document.querySelector('#number_of_follower').append(follower_number_view);

        // Finding number of followee and append it into followee_number_view tag
        const followee_number = "The number of followee: " + followers[0].followee.length;
        const followee_number_view = document.createElement('div');
        followee_number_view.innerHTML = followee_number;
        document.querySelector('#number_of_followee').append(followee_number_view)
        
        // Per each follower, listing username's(follower's) posts
        followers.forEach(function(follower){

            console.log(follower);
            //console.log(follower.follower[0]);
            //console.log(follower.username);

            // Listing follower users
            //for (let i = 0; i < follower.follower.length; i++){
            //    const follower_name = document.createElement('div');
            //    follower_name.innerHTML = follower.follower[i] + "<br>";
            //    document.querySelector('#follower').append(follower_name);
            //}

            // Listing followee users
            //for (let i = 0; i < follower.followee.length; i++){
            //    const followee_name = document.createElement('div');
            //    followee_name.innerHTML = follower.followee[i] + "<br>";
            //    document.querySelector('#followee').append(followee_name);
           // }            

           // Requesting profile_load_post/<str:username> path to get username's posts
            fetch(`/profile_load_post/${follower.username}`)
            .then(response => response.json())
            .then(posts => {
                console.log(posts);
                
                // Making a post content inside a container element 
                posts.forEach(function(post){ //foreignkey 설정되어있는 field활용할때 그 original model의 id를 활용해야함
                    let content = post.username + "<br>" + post.comment + "<br>" + post.timestamp + "<br>" + post.like;
                    const one_post = document.createElement('div');
                    //const hr = document.createElement('hr');
                    one_post.innerHTML = content;
                    one_post.style.cssText = 'border-style: solid;border-width: 1px;margin-left: 10px;margin-right: 10px;padding-left: 17px;margin-bottom: 10px;';
                    
                    document.querySelector('#profile_posts').append(one_post);
                    
                })
            });           
            

        })

        // Making follow button and unfollow button
        

        // follow&unfollow버튼 만들기(최근에 follow한 유저를 또 활용해야함, model을 손보든지 생각해보자)


    });    

    return false
}

function open_post (){

    // Show composition, uploaded_post view and hide something
    document.querySelector('#composition_view').style.display = 'block';
    document.querySelector('#uploaded_posts_view').style.display = 'block';
    document.querySelector('#profile_page_view').style.display = 'none';
    // added display whenever new div is created
    
    // Clear out comment field
    document.querySelector('#comment').value = '';

    //Showing posts
    fetch('/load_post')
    .then(response => response.json())
    .then(posts => {
        console.log(posts);

        posts.forEach(function(post){

            // Setting header text with element in posts
            let header = post.username + "<br>";
            const one_post_header = document.createElement('a');            
            one_post_header.innerHTML = header;
            console.log(one_post_header);

            // When one_post_header onclick, profile page will be viewd 
            one_post_header.addEventListener('click', function(){
                console.log("a post header link clikecd!");
                profile_page(post.username);
            });

            // Setting content text with element in posts
            let content = post.comment + "<br>" + post.timestamp + "<br>" + post.like;
            const one_post_content = document.createElement('div');                        
            one_post_content.innerHTML = content;
            console.log(one_post_content);          
            
            // Setting post container in posts
            const post_container = document.createElement('div');   
            
            // Styling container
            post_container.style.cssText = 'border-style: solid;border-width: 1px;margin-left: 10px;margin-right: 10px;padding-left: 17px;margin-bottom: 10px;';
            
            // Appending header and content element into post container
            post_container.appendChild(one_post_header);
            post_container.appendChild(one_post_content);
            document.querySelector('#uploaded_posts_view').append(post_container);

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

