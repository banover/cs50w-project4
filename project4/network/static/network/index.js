let counter = 1;
const list_number = 10;
let page = 0;

document.addEventListener('DOMContentLoaded', function(){

    // Setting display to none 이부분의 innerhtml을 "" 놨으면 중복적용이 제거될텐데.. profile_page_view는 밑에 별도의 div tag들이 있어서 그것까지 해야함 애초에 설계가 별로
    //document.querySelector('#composition_view').innerHTML = '';
    //document.querySelector('#uploaded_posts_view').innerHTML = '';
    //document.querySelector('#profile_page_view').innerHTML = '';
    //document.querySelector('#following_posts_view').innerHTML = '';

    // Showing the posts view, when All posts button is onclick
    document.querySelector('#posts_button').addEventListener('click', function(){      
        counter = 1;
        page = 0;
        open_post();
    });
    
    // Showing the following post view, when following button in onclick    
    document.querySelector('#following_button').addEventListener('click', function(){
        counter = 1;
        page = 0;
        following_post();
    });    

    // Uploading written comment when submit button on click 
    document.querySelector('#new_post_form').onsubmit = upload_db;

    // Default value, load the index
    open_post();
});


function following_post() {
    
    // Open the view tag
    document.querySelector('#composition_view').style.display = 'none';
    document.querySelector('#uploaded_posts_view').style.display = 'none';
    document.querySelector('#profile_page_view').style.display = 'none';
    document.querySelector('#following_posts_view').style.display = 'block';
    document.querySelector('#following_posts_view').innerHTML = "";

    // Requesting following posts
    let button_name = "following";
    let username = "following_random";
    counter = 1;
    page = 0;

    // Listing following posts
    listing_posts(button_name, username);
    
    return false;
}



function profile_page(username) {
    console.log(counter);
    console.log(page);

    // Setting profile_page_view block
    document.querySelector('#composition_view').style.display = 'none';
    document.querySelector('#uploaded_posts_view').style.display = 'none';
    document.querySelector('#profile_page_view').style.display = 'block';
    document.querySelector('#following_posts_view').style.display = 'none';

    // Preventing duplication of post from double clike
    document.querySelector('#follow_button').innerHTML = '';
    document.querySelector('#unfollow_button').innerHTML = '';
    document.querySelector('#number_of_follower').innerHTML = '';
    document.querySelector('#number_of_followee').innerHTML = '';
    document.querySelector('#profile_posts').innerHTML = '';

    // Requesting server for follow datas and create div and lists all
    fetch(`/get_follower/${username}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(followers => {

        // For checking the followers return value
        //console.log(followers);
        //console.log(followers[0].username);
        //console.log(followers[0].follower.length);
        //console.log(followers[0].follower);
        //console.log(followers[0].follower[0]);

        // Setting logged in username
        loggedin_username = followers[0].username;
        
        // Making follow button
        let button_text = "Follow";
        const follow_button = document.createElement('button');
        follow_button.innerHTML = button_text;
        
        // When follow_button onclick, change data in Follow_connection models
        follow_button.addEventListener('click', function(){
            console.log("follow_button is cliked!");
            document.querySelector('#follow_button').style.display = 'none';
            document.querySelector('#unfollow_button').style.display = 'block';
            
            // Updating Follow_connection models data using post fetch to add follower
            fetch(`/follow_connection/${username}`, {
                method: 'POST',
                body: JSON.stringify({
                    follower: username
                })
            })
            .then(response => response.json())
            .then(message => {
                console.log(message);
            });
        });

        // Appending follow button 
        document.querySelector('#follow_button').append(follow_button);
        
        // Making unfollow button
        let unfol_button_text = "Unfollow";
        const unfollow_button = document.createElement('button');
        unfollow_button.innerHTML = unfol_button_text;
        
        // When unfollow_button onclick, change data in Follow_connection models
        unfollow_button.addEventListener('click', function(){
            console.log("unfollow_button is cliked!");
            document.querySelector('#follow_button').style.display = 'block';
            document.querySelector('#unfollow_button').style.display = 'none';

            // Updating Follow_connection models data using post put to remove follower
            fetch(`/follow_connection/${username}`, {
                method: 'PUT',
                body: JSON.stringify({
                    follower : username
                })
            })
            .then(response => response.json())
            .then(message => {
                console.log(message);
            });
        });        
        
        // Appending unfollow button
        document.querySelector('#unfollow_button').append(unfollow_button);
        
        // Finding number of follower and append it into follower_number_view tag
        const follower_number = "The number of follower: " + followers[0].follower.length;            
        const follower_number_view = document.createElement('div');
        follower_number_view.innerHTML = follower_number;
        document.querySelector('#number_of_follower').append(follower_number_view);
        
        // Finding number of followee and append it into followee_number_view tag
        const followee_number = "The number of followee: " + followers[0].followee.length;
        const followee_number_view = document.createElement('div');
        followee_number_view.innerHTML = followee_number;
        document.querySelector('#number_of_followee').append(followee_number_view);               

        // Checking username with model_username then show button properly
        if (username === loggedin_username){

            document.querySelector('#follow_button').style.display = 'none';
            document.querySelector('#unfollow_button').style.display = 'none';

        // When two username above is different
        } else {

            // Setting loginuser's all follower and making check varialble for finding certain name follower
            let loginuser_follower = followers[0].follower;
            let found_follower = false;
            console.log(loginuser_follower)
            console.log(username)

            // Finding username which is same with follower user
            for (let i = 0; i < loginuser_follower.length; i++){       
                
                // There is same username then show unfollow button
                if (username === loginuser_follower[i]){
                    document.querySelector('#follow_button').style.display = 'none';
                    document.querySelector('#unfollow_button').style.display = 'block'; 
                    found_follower = true;
                    break;
                }
            }
            // There is no same username then show follow button
            if (found_follower === false) {
                document.querySelector('#follow_button').style.display = 'block';
                document.querySelector('#unfollow_button').style.display = 'none';
            }                       
        }

        // Per each follower, listing username's(follower's) posts
        followers.forEach(function(follower){

            console.log(follower.username);            

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

            // Setting button's name and profile host name
            let button_name = "profile";
            let name = username;
            counter = 1;
            page = 0;

            // Listing profile posts
            listing_posts(button_name, name);            
        })
    });
    
    return false
}

function open_post (){

    // Show composition, uploaded_post view and hide something
    document.querySelector('#composition_view').style.display = 'block';
    document.querySelector('#uploaded_posts_view').style.display = 'block';
    document.querySelector('#profile_page_view').style.display = 'none';
    document.querySelector('#following_posts_view').style.display = 'none';
    document.querySelector('#uploaded_posts_view').innerHTML = '';
    // added display whenever new div is created
    
    // Clear out comment field
    document.querySelector('#comment').value = '';

    // Setting button name, username(not nessasary in open post)
    let button_name = "all_post";
    
    // username here is not nessasary
    let username = "random";
    counter = 1;
    page = 0;

    // Listing all posts
    listing_posts(button_name, username);
    
    return false;
}


// Listing posts in conditon which has three button and specific usrname
function listing_posts(button_name, username){

    console.log(button_name);
  
    // Setting for pagination variables
    let pagetext = "page" + page;
    const start = counter;
    const end = start + list_number - 1
    counter = end + 1;
    let number_of_posts = 0;
    console.log(start);
    console.log(end);
    console.log(username);
    
    // Requesting only 10 posts start with start.variable and end with end.varialble
    fetch(`/load_post/${button_name}/${username}?start=${start}&end=${end}`)    
    .then(response => response.json())
    .then(posts => {

        console.log(posts);
        console.log(posts.posts);
        console.log(posts.posts_number);
        number_of_posts = posts.posts_number;

        // Per post in 10 posts, making post 
        posts.posts.forEach(function(post){

            // Setting header text with element in posts
            let header = post.username + "<br>";
            const one_post_header = document.createElement('a');            
            one_post_header.innerHTML = header;
            console.log(one_post_header);

            // When one_post_header onclick, profile page will be viewd 
            one_post_header.addEventListener('click', function(){
                console.log("a post header link clikecd!");
                console.log(post.username);
                profile_page(post.username);
            });

            // Setting post container in posts
            const post_container = document.createElement('div');   
            post_container.className = pagetext;            

            // Styling container
            post_container.style.cssText = 'border-style: solid;border-width: 1px;margin-left: 10px;margin-right: 10px;padding-left: 17px;margin-bottom: 10px;';
            
            // Appending header into post_container
            post_container.appendChild(one_post_header);

            // Making edit button
            // Requesting logged in username using fetch
            fetch('/get_login_username')
            .then(response => response.json())
            .then(name => {
                console.log(name);

                // When logged in username is equel to post.username
                if (name.username === post.username){
                    // Making Edit button
                    let button_value = "Edit";
                    const edit_button = document.createElement('button');
                    edit_button.innerHTML = button_value;

                    // When edit button is onclick
                    edit_button.addEventListener('click', function(){

                        // Setting composition_view block, else all none
                        document.querySelector('#composition_view').style.display = 'block';
                        document.querySelector('#uploaded_posts_view').style.display = 'none';
                        document.querySelector('#profile_page_view').style.display = 'none';
                        document.querySelector('#following_posts_view').style.display = 'none';

                        console.log(post.comment);
                        // Moving old comment in comment textarea and remove submit button 
                        document.querySelector('#comment').value = post.comment; 
                        document.querySelector('#submit_post_button').style.display = "none";
                        
                        // Making save button
                        let save_button_value = "Save";
                        const save_post_button = document.createElement('button');
                        //save_post_button.setAttribute("type", "submit");
                        save_post_button.innerHTML = save_button_value;

                        // When save button is onclick
                        save_post_button.addEventListener('click', function(){
                            
                            // Saving edited comment value  
                            let new_comment = document.querySelector('#comment').value;
                            console.log(new_comment);

                            // Showing submit button once again to back to original state and remove save button
                            document.querySelector('#submit_post_button').style.display = "block";
                            save_post_button.style.display = "none";

                            // Updating edited comment to original comment
                            update_db(post.id, new_comment);
                        });
                        
                        // Appending save button into composition_view replacing submit button
                        document.querySelector('#composition_view').append(save_post_button);
                    });

                    // Appending edit_button into post_container
                    post_container.appendChild(edit_button);
                }
            });

            // Getting logged in username to inserting like button or unlike button
            fetch('/get_login_username')
            .then(response => response.json())
            .then(name => {

                // When logged username is not same with post.username
                if (name.username !== post.username){
                    console.log(name.username);
                    console.log(post.username);

                    // Setting content text with element in posts
                    let content = post.comment + "<br>" + post.timestamp;
                    const one_post_content = document.createElement('div');                        
                    one_post_content.innerHTML = content;
                    
                    // Appending post content(excepting like) into post_container
                    post_container.appendChild(one_post_content);

                    // Making like button
                    let like = "like";
                    const like_button = document.createElement('button');
                    like_button.innerHTML = like;

                    // When like button is onclick
                    like_button.addEventListener('click', function(){

                        // Updating number of like and adding like_user
                        fetch(`/change_likes/${post.username}/${post.id}`)
                        .then(response => response.json())
                        .then(like => {
                            console.log(like);

                            // Making like content which has number of like and like or unlike button
                            const like_content = document.createElement('div');
                                                 
                            // Getting certain post.id post data
                            fetch(`get_post_data/${post.username}/${post.id}`)
                            .then(response => response.json())
                            .then(posts => {

                                // setting like content's innerhtml value
                                like_content.innerHTML = posts.like + "";
                                console.log(posts);
                                console.log(posts.like);

                                // Removing original post like content for showing updated like content
                                one_post_like_content.innerHTML = "";

                                // Appending unlike button into like content cause it is inside of like button onclik situation
                                like_content.appendChild(unlike_button);
                                console.log(like_content);

                                // Appending like content into post like content replacing original post like content
                                one_post_like_content.appendChild(like_content);                                
                            });
                        });
                    })

                    // Making post like content
                    let like_content_text = post.like;
                    const one_post_like_content = document.createElement('div');                        
                    one_post_like_content.innerHTML = like_content_text;
                    
                    // Requesting certain username and post.id post
                    fetch(`get_post_data/${post.username}/${post.id}`)
                    .then(response => response.json())
                    .then(post => {
                        console.log(post);
                        console.log(post.like_user); // it's list form
                        
                        // Setting post_like user in list form
                        let post_like_user = post.like_user;
                        let found_like_user =false;
                        console.log(post_like_user);
                        
                        // Checking  whether logged username is same with post like username
                        for (let i = 0; i < post_like_user.length; i++) {
                            if (name.username === post_like_user[i]){
                                
                                // When there is same name, append unlike button into post like content
                                one_post_like_content.append(unlike_button);

                                // Setting found variable to true
                                found_like_user = true;

                                // Stop the loop
                                break;
                            }
                        }

                        // When there is no same name
                        if (found_like_user === false) {
                            
                            // Appending like button into post like content
                            one_post_like_content.append(like_button);
                        }                        
                    });                    

                    // Appending one_post_like_content into post_container                    
                    post_container.appendChild(one_post_like_content);                   

                    // Making unlike button
                    let unlike_button_text_value = "Unlike";
                    const unlike_button = document.createElement('button');
                    unlike_button.innerHTML = unlike_button_text_value;

                    // When unlike button is onclick
                    unlike_button.addEventListener('click', function(){

                        // Updating number of like(-1)
                        fetch(`/change_likes/${post.username}/${post.id}`,{
                            method: 'PUT'                                             
                        })
                        .then(response => response.json())
                        .then(unlike => {
                            console.log(unlike);

                            // Making like content 
                            const like_content = document.createElement('div');                            
                            
                            // Requesting certain username and post.id post
                            fetch(`get_post_data/${post.username}/${post.id}`)                            
                            .then(response => response.json())
                            .then(like => {

                                // Inserting recently number of likes 
                                like_content.innerHTML = like.like + "";

                                // Remove original post like content for showing new like content
                                one_post_like_content.innerHTML = "";

                                // Appending like button 
                                like_content.appendChild(like_button);

                                // Appending like content into post like content
                                one_post_like_content.appendChild(like_content);
                            })
                        });                        
                    })
                }

                // When logged username is same with post.username
                else {

                    // Making content incorporating all content except header
                    let content = post.comment + "<br>" + post.timestamp + "<br>" + post.like;

                    // Making one post content and initializing content into this 
                    const one_post_content = document.createElement('div');                        
                    one_post_content.innerHTML = content;

                    // Appending one_post_content into post_container                        
                    post_container.appendChild(one_post_content);
                }
            });

            // When button name is all post
            if (button_name === "all_post") {
                document.querySelector('#uploaded_posts_view').append(post_container);
            }

            // When button name is profile
            else if (button_name === "profile") {
                document.querySelector('#profile_posts').append(post_container);
            }

            // When button name is following
            else if (button_name === "following") {
                document.querySelector('#following_posts_view').append(post_container);
            }            
        });        

        // When number of posts variables has same value with 10, setting for pagination function
        if (parseInt(number_of_posts, 10) === 10) {

            // Makin next button
            let button_value = "Next";
            const next_button = document.createElement('button');
            next_button.innerHTML = button_value;

            // When next button is onclick
            next_button.addEventListener('click', function(){
                
                // Setting each post view's innerHTML to none in condition of button name
                if (button_name === "all_post") {                
                    document.querySelector('#uploaded_posts_view').innerHTML = "";
                }
                else if (button_name === "profile") {                
                    document.querySelector('#profile_posts').innerHTML = "";
                }
                else if (button_name === "following") {
                    document.querySelector('#following_posts_view').innerHTML = "";
                }                
                
                // Listing posts the next 10 posts
                listing_posts(button_name, username);

                // Incrementing page variable for Previous button
                page++;                
            });

            // Appending next button into each posts view on condition of button name
            if (button_name === "all_post") {                
                document.querySelector('#uploaded_posts_view').append(next_button);
            }
            else if (button_name === "profile") {                
                document.querySelector('#profile_posts').append(next_button);
            }
            else if (button_name === "following") {
                document.querySelector('#following_posts_view').append(next_button);
            }
        }

        // When page variable's value over 0
        if (page > 0) {

            // Making previous button
            let button_value = "Previous";
            const previous_button = document.createElement('button');
            previous_button.innerHTML = button_value;

            // When previous button is onclick
            previous_button.addEventListener('click', function(){
                
                // Setting each posts view's innerHTML to none for showing previous posts
                if (button_name === "all_post") {                
                    document.querySelector('#uploaded_posts_view').innerHTML = "";
                }
                else if (button_name === "profile") {                
                    document.querySelector('#profile_posts').innerHTML = "";
                }
                else if (button_name === "following") {
                    document.querySelector('#following_posts_view').innerHTML = "";
                }

                // Decrementing page value and couter for showing previous 10 posts
                page--;
                counter = counter - 20;
                listing_posts(button_name, username);                
            });

            // Appending previous button into each posts view on condition of button name
            if (button_name === "all_post") {                
                document.querySelector('#uploaded_posts_view').append(previous_button);
            }
            else if (button_name === "profile") {                
                document.querySelector('#profile_posts').append(previous_button);
            }
            else if (button_name === "following") {
                document.querySelector('#following_posts_view').append(previous_button);
            }            
        }
    });    
    
    return false;
}


function upload_db() {

    // Setting post comment data value into variable    
    const comment = document.querySelector('#comment').value;
    
    // Upload comment variable into db using fetch
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

    // Reload the page for showing current page
    location.reload(); // if you remove the code, you should set none to post view innethtml in proper condition
    
    // Listing all posts
    open_post();

    return false;    
}

function update_db(post_id, new_comment) {

    // Updating new comment bying editting comment
    fetch(`/update/${post_id}`,{
        method: 'PUT',
        body: JSON.stringify({
            comment : new_comment
        })
    })
    .then(response => response)//.json())
    .then(result => {
        console.log(result);
    });    

    // Reload for current page
    location.reload();

    // Listing all posts
    open_post();

    return false;  

}

//  cs50w project 아쉬운점 specification을 좀 더 구체적으로 해줬더라면.. 
// 그래도 like button 할 때 reload 안하고 page에 바로 결과보여주는거 성공해서 다행 그 아이디어를 upload_db나 update_db에 적용하면 될듯