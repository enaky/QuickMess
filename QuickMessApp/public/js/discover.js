function add_user_in_discover(users, user_id) {
    let html_text;
    if (users.length > 1){
        html_text = '<div class="card-deck">'
    } else {
        html_text = '<div class="row justify-content-center">'
    }
    if (typeof (users) != "undefined") {
        for (let i = 0; i < users.length; i++) {
            if (i % 2 === 0 && users.length - i >= 2) {
                html_text += '<div class="w-100 d-none d-sm-block d-md-none"><!-- wrap every 2 on sm--></div>';
                html_text += '<div class="w-100 d-none d-md-block d-lg-none"><!-- wrap every 2 on md--></div>';
            }
            if (i % 3 === 0 && users.length - i >= 2) {
                html_text += '<div class="w-100 d-none d-lg-block d-xl-none"><!-- wrap every 3 on lg--></div>';
                html_text += '<div class="w-100 d-none d-xl-block "><!-- wrap every 3 on xl--></div>';
            }
            html_text += '<div class="card p-1 m-1">';

            html_text += '<img class="card-img-top embed-responsive-16by9" src="' + users[i].profileImagePath + '" alt="Card image">';

            html_text += ' <div class="card-body text-center">';
            html_text += ' <h6 class="card-title">' + users[i].firstName + ' ' + users[i].lastName + '</h6>';
            html_text += ' <div class="card-footer">';
            html_text += ' <form action="/discover" method="post">';
            html_text += ' <input type="hidden" name="user_id" value="' + users[i]._id + '">';
            if (typeof (user_id) != "undefined") {
                html_text += ' <input type="hidden" name="user_request_id" value="' + user_id + '">';
            }
            html_text += ' <div class="row">';
            if (users[i].friendshipAlreadyRequested) {
                html_text += ' <button type="submit" name="user-operation" value="add" class="col btn btn-secondary" disabled>Add Friend</button>';
            } else {
                html_text += ' <button type="submit" name="user-operation" value="add" class="col btn btn-success">Add Friend</button>';
            }
            html_text += ' </div>';
            html_text += ' <div class="row">'
            html_text += ' <button type="submit" name="user-operation" value="view" class="col mt-1 btn btn-warning btn-block">View</button>';
            html_text += ' </div>'
            html_text += ' </form>'
            html_text += ' </div>'
            html_text += ' </div>'
            html_text += ' </div>'
        }
    }
    html_text += ' </div>';
    console.log(html_text);
    $("#users").html(html_text);
}

$(document).on("click", "#discover_people_search", function () {
    let value_to_search = $("#discover_people_search_value").val();
    console.log("People to search: " + value_to_search);
    $.ajax({
        async: false,
        type: "POST",
        url: "/search_people",
        data: {"value": value_to_search},
        success: function (result) {
            console.log(result);
            add_user_in_discover(result["users"], result["user"]._id);
        },
        error: function (e) {
            console.log(e.status);
        }
    });
});