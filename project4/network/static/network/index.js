let counter = 1;
const list_number = 10;
let page = 0
//let pagetext = "page" + page;


document.addEventListener('DOMContentLoaded', function(){

    // Setting display to none 이부분의 innerhtml을 "" 놨으면 중복적용이 제거될텐데.. profile_page_view는 밑에 별도의 div tag들이 있어서 그것까지 해야함 애초에 설계가 별로
    //document.querySelector('#composition_view').style.display = 'none';
    //document.querySelector('#uploaded_posts_view').style.display = 'none';
    //document.querySelector('#profile_page_view').style.display = 'none';
    //document.querySelector('#following_posts_view').style.display = 'none';

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
    listing_posts(button_name, username);

    /*
    let pagetext = "page" + page;
    const start = counter;
    const end = start + list_number - 1
    counter = end + 1;
    let number_of_posts = 0;
    fetch(`/load_post/${button_name}/${username}?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        number_of_posts = posts.posts_number;
        console.log(number_of_posts);


        posts.posts.forEach(function(post){

            // Making container which is contain header and content
            const post_container = document.createElement('div');
            post_container.className = pagetext;
            post_container.style.cssText = 'border-style: solid;border-width: 1px;margin-left: 10px;margin-right: 10px;padding-left: 17px;margin-bottom: 10px;';

            // Making header in a post
            let header = post.username;
            const post_header = document.createElement('div')
            post_header.innerHTML = header;
            console.log(post_header);

            post_header.addEventListener('click', function(){
                console.log("post_header is onclick!")
                profile_page(header);
            });

            // Making content in a post
            let content = post.comment + "<br>" + post.timestamp + "<br>" + post.like;
            const post_content = document.createElement('div');                        
            post_content.innerHTML = content;
            console.log(post_content);
            
            // Cotaining header and content into container
            post_container.append(post_header);
            post_container.append(post_content);
            //appendChild vs append

            // Appending container html following_posts_view div tag
            document.querySelector('#following_posts_view').append(post_container);

        })

        if (parseInt(number_of_posts, 10) === 10) {
            let button_value = "Next";
            const next_button = document.createElement('button');
            next_button.innerHTML = button_value;
            next_button.addEventListener('click', function(){
                //document.querySelector(`.${pagetext}`).remove();
                document.querySelector('#following_posts_view').innerHTML = "";
                page++;
                let button_name = "following";
                let username = "random";
                const start = counter;
                const end = start + list_number - 1
                console.log(start);
                console.log(end);
                listing_posts(button_name, username);
                
            });
            document.querySelector('#following_posts_view').append(next_button);
        }

        if (page > 0) {
            let button_value = "Previous";
            const previous_button = document.createElement('button');
            previous_button.innerHTML = button_value;
            previous_button.addEventListener('click', function(){
                document.querySelector('#following_posts_view').innerHTML = "";
                //let remove_page = document.querySelectorAll(`div.${pagetext}`);
                //console.log(remove_page);
                //remove_page.remove();
                page--;
                counter = counter - 20;
                let button_name = "following";
                let username = "random";
                const start = counter;
                const end = start + list_number - 1
                listing_posts(button_name, username);
                
            });
            document.querySelector('#following_posts_view').append(previous_button);
        }

    });
    */
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

    document.querySelector('#follow_button').innerHTML = '';
    document.querySelector('#unfollow_button').innerHTML = '';
    document.querySelector('#number_of_follower').innerHTML = '';
    document.querySelector('#number_of_followee').innerHTML = '';
    document.querySelector('#profile_posts').innerHTML = '';

    // Show the profiel page name
    //let title = '<h1>Profile</h1>'
    //document.querySelector('#profile_page_view').innerHTML = title;

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
            //fetch('') 활용해서 models 안에 Follow_connection에 upload해
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
        } else {

            let loginuser_follower = followers[0].follower;
            let found_follower = false;
            console.log(loginuser_follower)
            console.log(username)
            for (let i = 0; i < loginuser_follower.length; i++){                
                if (username === loginuser_follower[i]){
                    document.querySelector('#follow_button').style.display = 'none';
                    document.querySelector('#unfollow_button').style.display = 'block'; 
                    found_follower = true;
                    break;
                }
            }
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

           // Requesting profile_load_post/<str:username> path to get username's posts
            //fetch(`/profile_load_post/${follower.username}`)

            let button_name = "profile";
            let name = username;
            counter = 1;
            page = 0;
            listing_posts(button_name, name);
            /*
            counter = 1;
            page = 0;
            let pagetext = "page" + page;
            const start = counter;
            const end = start + list_number - 1
            counter = end + 1;
            console.log(counter);
            let number_of_posts = 0;  

            //fetch(`/profile_load_post/${username}?start=${start}&end=${end}`)
            fetch(`/load_post/profile/${username}?start=${start}&end=${end}`)
            .then(response => response.json())  //위에 username을 follower.username도 써도됨
            .then(posts => {
                console.log(posts);
                console.log(posts.posts_number);
                console.log(start);
                console.log(end);

                number_of_posts = posts.posts_number;
                console.log(posts.posts_number);
                // Making a post content inside a container element 
                posts.posts.forEach(function(post){ //foreignkey 설정되어있는 field활용할때 그 original model의 id를 활용해야함
                    let content = post.username + "<br>" + post.comment + "<br>" + post.timestamp + "<br>" + post.like;
                    const one_post = document.createElement('div');
                    one_post.className = pagetext;
                    console.log(pagetext);
                    //const hr = document.createElement('hr');
                    one_post.innerHTML = content;
                    one_post.style.cssText = 'border-style: solid;border-width: 1px;margin-left: 10px;margin-right: 10px;padding-left: 17px;margin-bottom: 10px;';
                    
                    document.querySelector('#profile_posts').append(one_post);                    
                    
                })

                //console.log(number_of_posts);
                if (parseInt(number_of_posts, 10) === 10) {
                    let button_value = "Next";
                    const next_button = document.createElement('button');
                    next_button.innerHTML = button_value;
                    next_button.addEventListener('click', function(){
                        //document.querySelector(`.${pagetext}`).remove();
                        document.querySelector('#profile_posts').innerHTML = "";
                        page++;
                        let button_name = "profile";                        
                        const start = counter;
                        const end = start + list_number - 1
                        //counter = end + 1;
                        console.log(start);
                        console.log(end);
                        console.log(username);
                        listing_posts(button_name, username); ///////////

                    });
                    document.querySelector('#profile_posts').append(next_button);
                }
        
                if (page > 0) {
                    let button_value = "Previous";
                    const previous_button = document.createElement('button');
                    previous_button.innerHTML = button_value;
                    previous_button.addEventListener('click', function(){
                        document.querySelector('#profile_posts').innerHTML = "";
                        //let remove_page = document.querySelectorAll(`div.${pagetext}`);
                        //console.log(remove_page);
                        //remove_page.remove();
                        page--;
                        counter = counter - 20;
                        let button_name = "profile";
                        listing_posts(button_name, username);      /////////                  
                        
                    });
                    document.querySelector('#profile_posts').append(previous_button);
                }                

            });
            */
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

    let button_name = "all_post";
    let username = "random";
    counter = 1;
    page = 0;
    listing_posts(button_name, username);
    /*
    let pagetext = "page" + page;
    const start = counter;
    const end = start + list_number - 1
    counter = end + 1;
    let number_of_posts = 0;    

    //Showing posts
    fetch(`/load_post/all_post/random?start=${start}&end=${end}`)
    //fetch(`/posts?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        console.log(posts.posts);
        console.log(posts.posts_number);
        number_of_posts = posts.posts_number;

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
                //let button_name = "profile";
                //listing_posts(button_name)
            });

            // Setting content text with element in posts
            let content = post.comment + "<br>" + post.timestamp + "<br>" + post.like;
            const one_post_content = document.createElement('div');                        
            one_post_content.innerHTML = content;
            console.log(one_post_content);          
            
            // Setting post container in posts
            const post_container = document.createElement('div');   
            post_container.className = pagetext;
            console.log(pagetext);

            // Styling container
            post_container.style.cssText = 'border-style: solid;border-width: 1px;margin-left: 10px;margin-right: 10px;padding-left: 17px;margin-bottom: 10px;';
            
            // Appending header and content element into post container
            post_container.appendChild(one_post_header);
            post_container.appendChild(one_post_content);
            document.querySelector('#uploaded_posts_view').append(post_container);
        
        })

        if (parseInt(number_of_posts, 10) === 10) {
            let button_value = "Next";
            const next_button = document.createElement('button');
            next_button.innerHTML = button_value;
            next_button.addEventListener('click', function(){
                //document.querySelector(`.${pagetext}`).remove();
                document.querySelector('#uploaded_posts_view').innerHTML = "";
                page++;
                let button_name = "all_post";
                let username = "random";
                listing_posts(button_name, username);
                
                
                
            });
            document.querySelector('#uploaded_posts_view').append(next_button);
        }

        if (page > 0) {
            let button_value = "Previous";
            const previous_button = document.createElement('button');
            previous_button.innerHTML = button_value;
            previous_button.addEventListener('click', function(){
                document.querySelector('#uploaded_posts_view').innerHTML = "";
                //let remove_page = document.querySelectorAll(`div.${pagetext}`);
                //console.log(remove_page);
                //remove_page.remove();
                page--;
                counter = counter - 20;
                let button_name = "all_post";
                let username = "random";
                listing_posts(button_name, username);
                
                
            });
            document.querySelector('#uploaded_posts_view').append(previous_button);
        }
            
    });
    */
    return false;
}



function listing_posts(button_name, username){

    console.log(button_name);
  
    let pagetext = "page" + page;
    const start = counter;
    const end = start + list_number - 1
    counter = end + 1;
    let number_of_posts = 0;
    console.log(start);
    console.log(end);
    console.log(username);

    //if (button_name === "all_post"){}

    
    fetch(`/load_post/${button_name}/${username}?start=${start}&end=${end}`) 
    //fetch(`/posts?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(posts => {

        console.log(posts);
        console.log(posts.posts);
        console.log(posts.posts_number);
        number_of_posts = posts.posts_number;

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
            fetch('/get_login_username')
            .then(response => response.json())
            .then(name => {
                console.log(name);

                if (name.username === post.username){
                    let button_value = "Edit";
                    const edit_button = document.createElement('button');
                    edit_button.innerHTML = button_value;

                    edit_button.addEventListener('click', function(){

                        document.querySelector('#composition_view').style.display = 'block';
                        document.querySelector('#uploaded_posts_view').style.display = 'none';
                        document.querySelector('#profile_page_view').style.display = 'none';
                        document.querySelector('#following_posts_view').style.display = 'none';

                        console.log(post.comment);
                        document.querySelector('#comment').value = post.comment; 
                        document.querySelector('#submit_post_button').style.display = "none";
                        
                        let save_button_value = "Save";
                        const save_post_button = document.createElement('button');
                        //save_post_button.setAttribute("type", "submit");
                        save_post_button.innerHTML = save_button_value;

                        //document.querySelector('#new_post_form').onsubmit = update_db(posts.posts.id);
                        save_post_button.addEventListener('click', function(){
                            let new_comment = document.querySelector('#comment').value;
                            console.log(new_comment);
                            document.querySelector('#submit_post_button').style.display = "block";
                            save_post_button.style.display = "none";
                            update_db(post.id, new_comment);  //그냥 form이 submit된게아니라 save버튼 누른 후 새로운 comment 정보가 전달될까?
                        });
                        //document.querySelector('#new_post_form').append(save_post_button);
                        document.querySelector('#composition_view').append(save_post_button);
                    });

                    // Appending edit_button into post_container
                    post_container.appendChild(edit_button);
                }
                //else {
                //    document.querySelector('#submit_post_button').style.display = "block";
                //}
                
            });
            /*
            let button_value = "Edit";
            const edit_button = document.createElement('button');
            edit_button.innerHTML = button_value;

            edit_button.addEventListener('click', function(){

                document.querySelector('#composition_view').style.display = 'block';
                document.querySelector('#uploaded_posts_view').style.display = 'none';
                document.querySelector('#profile_page_view').style.display = 'none';
                document.querySelector('#following_posts_view').style.display = 'none';

                console.log(post.comment);
                document.querySelector('#comment').value = post.comment; 
                document.querySelector('#submit_post_button').style.display = "none";
                
                let save_button_value = "Save";
                const save_post_button = document.createElement('button');
                //save_post_button.setAttribute("type", "submit");
                save_post_button.innerHTML = save_button_value;

                //document.querySelector('#new_post_form').onsubmit = update_db(posts.posts.id);
                save_post_button.addEventListener('click', function(){
                    let new_comment = document.querySelector('#comment').value;
                    console.log(new_comment);
                    update_db(post.id, new_comment);  //그냥 form이 submit된게아니라 save버튼 누른 후 새로운 comment 정보가 전달될까?
                });
                //document.querySelector('#new_post_form').append(save_post_button);
                document.querySelector('#composition_view').append(save_post_button);
            });
            */

            // Setting content text with element in posts
            //let content = post.comment + "<br>" + post.timestamp + "<br>" + post.like;
            //const one_post_content = document.createElement('div');                        
            //one_post_content.innerHTML = content;
            //console.log(one_post_content);

            // 위의 content에서 like빼고 다시 appendchild해서 container한테
            fetch('/get_login_username')
            .then(response => response.json())
            .then(name => {
                if (name.username !== post.username){
                    console.log(name.username);
                    console.log(post.username);

                    // Setting content text with element in posts
                    let content = post.comment + "<br>" + post.timestamp;
                    const one_post_content = document.createElement('div');                        
                    one_post_content.innerHTML = content;
                    //console.log(one_post_content);
                    post_container.appendChild(one_post_content);

                    let like = "like";
                    const like_button = document.createElement('button');
                    like_button.innerHTML = like;

                    like_button.addEventListener('click', function(){
                        // unlike 버튼 활성화 필요

                        
                    
                        fetch(`/change_likes/${post.username}/${post.id}`)
                        .then(response => response.json())
                        .then(like => {
                            console.log(like);
                            //syn = true;
                            const like_content = document.createElement('div');
                                                 
                            fetch(`get_post_data/${post.username}/${post.id}`)
                            .then(response => response.json())
                            .then(posts => {
                                //forEach써야... posts.forEach(function(post))
                                like_content.innerHTML = posts.like + "";
                                console.log(posts);
                                console.log(posts.like);

                                one_post_like_content.innerHTML = "";
                                like_content.appendChild(unlike_button);
                                console.log(like_content);
                                one_post_like_content.appendChild(like_content);
                                //like_button
                            });
                        });      

                        //setTimeout(function(){}, 3000);
                        //let like_content_text = post.like;
                        //const one_post_like_content = document.createElement('div');                        
                        //one_post_like_content.innerHTML = like_content_text;
                        //one_post_like_content.append(like_button);

                        
                        // 이 아래 내용이 필요한가?? 좀 더 생각 숫자재업로드는 필요함
                        
                        // ***********************************************
                        //const like_content = document.createElement('div');
                                                 
                        //fetch(`get_post_data/${post.username}/${post.id}`)
                        //.then(response => response.json())
                        //.then(like => {
                        //    like_content.innerHTML = like.like + "";
                        //    console.log(like);
                        //    console.log(like.like);


                        //    one_post_like_content.innerHTML = "";
                        //    like_content.appendChild(like_button);
                        //    console.log(like_content);
                        //    one_post_like_content.appendChild(like_content);
                        //})

                        //*************************************************** */
                        
                        //one_post_like_content.style.display = "none";

                                                
                        // one_post_like_content 의 innerhtml을 ""로 비운 후에 새로운 내용 집어넣으면 됨                    
                        //post_container.innerHTML = "";  

                        //one_post_like_content.innerHTML = "";*

                        //post_container.remove(one_post_like_content);
                        
                        //like_content.appendChild(like_button);**
                        //one_post_like_content.appendChild(like_content);***

                        //post_container.appendChild(like_content);

                    })
                    // Putting like button into container
                    //like_content.append(like_button);
                    //post_container.appendChild(like_content);


                    let like_content_text = post.like;
                    const one_post_like_content = document.createElement('div');                        
                    one_post_like_content.innerHTML = like_content_text;
                    
                    fetch(`get_post_data/${post.username}/${post.id}`)
                    .then(response => response.json())
                    .then(post => {
                        console.log(post);
                        console.log(post.like_user); // 리스트 형태로 옮
                        
                        let post_like_user = post.like_user;
                        let found_like_user =false;
                        console.log(post_like_user);
                        
                        for (let i = 0; i < post_like_user.length; i++) {
                            if (name.username === post_like_user[i]){
                                one_post_like_content.append(unlike_button);
                                found_like_user = true;
                                break;
                            }
                        }

                        if (found_like_user === false) {
                            one_post_like_content.append(like_button);
                        }
                        
                    });
                    

                    // Appending one_post_content into post_container                        
                    //post_container.appendChild(one_post_content); 이미 등록한듯?-658
                    post_container.appendChild(one_post_like_content);



                    // 잠시 대기..*****************

                    // Making unlike button -- 기존 like content display=none한 상황에서 like number랑 unlike button을 대신 집어넣기
                    let unlike_button_text_value = "Unlike";
                    const unlike_button = document.createElement('button');
                    unlike_button.innerHTML = unlike_button_text_value;

                    unlike_button.addEventListener('click', function(){
                        fetch(`/change_likes/${post.username}/${post.id}`,{
                            method: 'PUT'//,
                            //body: JSON.stringify({

                            //})                 
                        })
                        .then(response => response.json())
                        .then(unlike => {
                            console.log(unlike);

                            const like_content = document.createElement('div');
                            fetch(`get_post_data/${post.username}/${post.id}`)
                            .then(response => response.json())
                            .then(like => {
                                like_content.innerHTML = like.like + "";

                                one_post_like_content.innerHTML = "";
                                like_content.appendChild(like_button);
                                one_post_like_content.appendChild(like_content);


                            })
                        });

                        // 이 아래 내용이 필요한가?? 좀 더 생각 숫자재업로드는 필요함
                        //*********************************************** 
                        //const like_content = document.createElement('div');
                        //fetch(`get_post_data/${post.username}/${post.id}`)
                        //.then(response => response.json())
                        //.then(like => {
                        //    like_content.innerHTML = like.like + "";
                        //})
                        ////one_post_like_content.style.display = "none";                       

                        //one_post_like_content.innerHTML = "";
                        ////post_container.remove(like_content);
                        ////post_container.remove(one_post_like_content);
                        //like_content.appendChild(like_button);
                        //post_container.appendChild(like_content);
                        //*********************************************** 

                        //like버튼을 빼고 unlike버튼 삽입 후 container에 like content 삽입
                        //like_content.append(unlike_button);
                        //post_container.appendChild(like_content);
                    })

                    
                    //const like_content = document.createElement('div');
                    //fetch(`get_post_data/${post.username}`)
                    //.then(response => response.json())
                    //.then(like => {
                    //    like_content.innerHTML = like.like + "";
                    //})
                    
                    //like_content.append(like_button);
                    //post_container.appendChild(like_content);
                }
                else {
                    // innerhtml= ""로 안만들고 해도 덮어지겠지?
                    let content = post.comment + "<br>" + post.timestamp + "<br>" + post.like;
                    const one_post_content = document.createElement('div');                        
                    one_post_content.innerHTML = content;

                    // Appending one_post_content into post_container                        
                    post_container.appendChild(one_post_content);
                }
            });
                        
            // Appending one_post_content into post_container                        
            //post_container.appendChild(one_post_content);

            if (button_name === "all_post") {
                document.querySelector('#uploaded_posts_view').append(post_container);
            }
            else if (button_name === "profile") {
                document.querySelector('#profile_posts').append(post_container);
            }
            else if (button_name === "following") {
                document.querySelector('#following_posts_view').append(post_container);
            }               
            
        });
        

        if (parseInt(number_of_posts, 10) === 10) {
            let button_value = "Next";
            const next_button = document.createElement('button');
            next_button.innerHTML = button_value;
            next_button.addEventListener('click', function(){
                //document.querySelectorAll(`div.${pagetext}`).remove();
                if (button_name === "all_post") {                
                    document.querySelector('#uploaded_posts_view').innerHTML = "";
                }
                else if (button_name === "profile") {                
                    document.querySelector('#profile_posts').innerHTML = "";
                }
                else if (button_name === "following") {
                    document.querySelector('#following_posts_view').innerHTML = "";
                }
                
                //document.querySelector('#uploaded_posts_view').innerHTML = "";
                listing_posts(button_name, username);
                page++;
                
            });
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

        if (page > 0) {
            let button_value = "Previous";
            const previous_button = document.createElement('button');
            previous_button.innerHTML = button_value;
            previous_button.addEventListener('click', function(){
                //document.querySelectorAll(`div.${pagetext}`).remove();
                if (button_name === "all_post") {                
                    document.querySelector('#uploaded_posts_view').innerHTML = "";
                }
                else if (button_name === "profile") {                
                    document.querySelector('#profile_posts').innerHTML = "";
                }
                else if (button_name === "following") {
                    document.querySelector('#following_posts_view').innerHTML = "";
                }
                //document.querySelector('#uploaded_posts_view').innerHTML = "";
                page--;
                counter = counter - 20;
                listing_posts(button_name, username);
                
            });
            if (button_name === "all_post") {                
                document.querySelector('#uploaded_posts_view').append(previous_button);
            }
            else if (button_name === "profile") {                
                document.querySelector('#profile_posts').append(previous_button);
            }
            else if (button_name === "following") {
                document.querySelector('#following_posts_view').append(previous_button);
            }
            //document.querySelector('#uploaded_posts_view').append(previous_button);
        }
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

    location.reload(); // 안해도 될듯? 체크하기
    //localStorage.clear(); 
    open_post();
    return false;    
}

function update_db(post_id, new_comment) {
    //const new_comment = document.querySelector('#comment').value;
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

    location.reload();
    //document.querySelector('#uploaded_posts_view').innerHTML = '';
    open_post();
    return false;  

}                 
// 수정을 했을때 수정한 값을 바로 innerhtml값으로 넣어주고 변경한 값은 fetch로 전송하면 reload없이 바로 될듯, 다음에 posts나열될때는 저장된 db에서 데이터 들고오니까.. 
// unlike도 해야함
// 일단, 코드정리한 후 다름 사람이 한 거 코드구경하러가자
//  cs50w project 아쉬운점 specification을 좀 더 구체적으로 해줬더라면..

                    


