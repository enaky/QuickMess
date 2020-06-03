function add_friend_in_friends_bar(users, user_id) {
    let html_text
    html_text = '<div class="row justify-content-center">';
    console.log("USER ID after search in friends: " + user_id);
    console.log("Users founds: " + JSON.stringify(users));
    if (typeof (users) != "undefined") {
        for (let i = 0; i < users.length; i++) {
            html_text += '<div class="card p-1 mx-3 col-lg-4 col-md-5 col-sm-6">';

            html_text += '<img class="card-img-top embed-responsive-16by9" src="' + users[i].profileImagePath + '" alt="Card image">';

            html_text += ' <div class="card-body text-center">';
            html_text += ' <h6 class="card-title">' + users[i].firstName + ' ' + users[i].lastName + '</h6>';
            html_text += ' <div class="card-footer">';
            html_text += ' <form action="/remove-friend" method="post">';
            html_text += ' <input type="hidden" name="user_id" value="' + users[i]._id + '">';
            if (typeof (user_id) != "undefined") {
                html_text += ' <input type="hidden" name="user_request_id" value="' + user_id + '">';
            }
            html_text += ' <button type="submit" name="friend-operation" value="remove" class="btn btn-danger btn-block">Remove Friend</button>';
            html_text += ' <button type="submit" name="friend-operation" value="view" class="btn btn-warning btn-block">View</button>';
            html_text += ' </form>'
            html_text += ' </div>'
            html_text += ' </div>'
            html_text += ' </div>'
        }
    }
    html_text += ' </div>';
    $("#users").html(html_text);
}

$(document).on("click", "#friend_search", function () {
    let value_to_search = $("#friend_search_value").val();
    console.log("Friend to search: " + value_to_search);
    $.ajax({
        async: false,
        type: "POST",
        url: "/search-friend",
        data: {"value": value_to_search},
        success: function (result) {
            console.log(result);
            add_friend_in_friends_bar(result["users"], result["user"]._id);
        },
        error: function (e) {
            console.log(e.status);
        }
    });
});