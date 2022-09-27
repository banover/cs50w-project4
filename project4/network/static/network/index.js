document.addEventListener('DOMContentLoaded', function(){
    
    document.querySelector('#new_post_form').onsubmit = upload_db;
})

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

    return false;

    // return false (이거 위에 display none과 block 활용하기)
}