document.addEventListener('DOMContentLoaded', function(){

    document.querySelector('#posts_button').addEventListener('click', open_post);
    
    document.querySelector('#new_post_form').onsubmit = upload_db;
    
    // Default value, load the index
    open_post();
});


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

