let socket = io();
let messages = document.getElementById("message_inbox");
let contacts = document.getElementById("contacts");
let user_id = document.getElementById("chat_user_id").value;
let friend_id = document.getElementById("chat_friend_id").value;
let user_photo = document.getElementById("chat_user_photo").value;
let friend_photo = document.getElementById(friend_id).src;

let contact_current = document.getElementsByClassName("active change_chat")[0];

socket.emit("establish connection", {"user_id": user_id, "friend_id": friend_id});

const own_message = function (content, date, img) {

    let div_element_1 = document.createElement("div");
    div_element_1.className = "d-flex justify-content-start mb-4 ml-5";

    let div_element_11 = document.createElement("div");
    div_element_11.className = "img_cont_msg";

    let img_element = document.createElement("img");
    img_element.src = img;
    img_element.className = "rounded-circle user_img_msg";
    div_element_11.appendChild(img_element);

    let div_element_12 = document.createElement("div");
    div_element_12.className = "msg_cotainer"
    div_element_12.innerHTML = content;
    let span_element = document.createElement("span");
    span_element.className = "msg_time";
    span_element.innerHTML = date;
    div_element_12.appendChild(span_element);

    div_element_1.appendChild(div_element_11);
    div_element_1.appendChild(div_element_12);

    messages.appendChild(div_element_1);
    messages.scrollTop = messages.scrollHeight;
};

const other_message = function (content, date, img) {

    let div_element_1 = document.createElement("div");
    div_element_1.className = "d-flex justify-content-end mb-4 mr-5";

    let div_element_11 = document.createElement("div");
    div_element_11.className = "msg_cotainer_send"
    div_element_11.innerHTML = content;
    let span_element = document.createElement("span");
    span_element.className = "msg_time_send";
    span_element.innerHTML = date;
    div_element_11.appendChild(span_element);

    let div_element_12 = document.createElement("div");
    div_element_12.className = "img_cont_msg";

    let img_element = document.createElement("img");
    img_element.src = img;
    img_element.className = "rounded-circle user_img_msg";
    div_element_12.appendChild(img_element);

    div_element_1.appendChild(div_element_11);
    div_element_1.appendChild(div_element_12);
    messages.appendChild(div_element_1);
    messages.scrollTop = messages.scrollHeight;
};

const add_user = function(friend){
    console.log("Trying to insert " + JSON.stringify(friend));
    console.log(friend._id);
    let li_element = document.createElement("li");
    li_element.className = "change_chat";
    li_element.dataset.value = (friend._id).toString();

    let div_element = document.createElement("div");
    div_element.className = "d-flex bd-highlight";

    let div_element_11 = document.createElement("div");
    div_element_11.className = "img_cont";

        let img_element = document.createElement("img");
        img_element.src = friend.profileImagePath;
        img_element.className = "rounded-circle user_img";
        img_element.id = friend._id;

        let span_element = document.createElement("span");
        span_element.className = "online_icon " + friend.status;

        div_element_11.appendChild(img_element);
        div_element_11.appendChild(span_element);


    let div_element_12 = document.createElement("div");
    div_element_12.className = "user_info";
        let input_element_1 = document.createElement("input");
        input_element_1.className = "name " + friend._id;
        input_element_1.value = friend.firstName;
        let input_element_2 = document.createElement("input");
        input_element_2.className = "status " + friend._id;
        input_element_2.value = friend.status;
        input_element_1.setAttribute("type", "hidden");
        input_element_2.setAttribute("type", "hidden");

        let span_element_2 = document.createElement("span");
        span_element_2.innerHTML = friend.firstName + " " + friend.lastName;

        let p_element = document.createElement("p");
        p_element.innerHTML = name + " is " + friend["status"];

    div_element_12.appendChild(input_element_1);
    div_element_12.appendChild(input_element_2);
    div_element_12.appendChild(span_element_2);
    div_element_12.appendChild(p_element);

    div_element.appendChild(div_element_11);
    div_element.appendChild(div_element_12);

    li_element.appendChild(div_element);
    contacts.appendChild(li_element);
    contacts.scrollTop = contacts.scrollHeight;
    console.log("Finished inserting");
};


const display_message = function (content, date, own = true, img = "https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"){
    if (own){
        own_message(content, date, img);
    } else {
        other_message(content, date, img);
    }
};

(function () {
    $("#message_send_form").submit(function (e) {
        if ($("#message").val() === "") {
            return false;
        }
        display_message($("#message").val(), moment().format('YYYY-MM-DD, HH:mm:ss'), true, user_photo)

        //add_user("Corinta");
        //add_user("Corinta", true);

        e.preventDefault(); // prevents page reloading
        let data = {"message": $("#message").val(),
                    "user_id": user_id,
                    "friend_id": friend_id,
                    "date": moment().format()
        }
        console.log(data);
        socket.emit("chat message", data);
        $("#message").val("");
        let elementNrMessages = document.getElementById("friend_number_of_messages");
        elementNrMessages.innerHTML = (1 + parseInt(elementNrMessages.innerHTML)).toString();
        return false;
    });

    socket.on("received", data => {
        console.log(data);
        console.log("Received message with socket from " + data["user_id"]);
        if (friend_id === data["user_id"]){
            display_message(data.message, moment(data.date).format('YYYY-MM-DD, HH:mm:ss'), false, friend_photo)
        }
    });

    socket.on("change friend approved", messages => {
        console.log("change friend inbox accepted");
        console.log(messages);
        if (messages != null){
            document.getElementById("friend_number_of_messages").innerHTML = messages.length;
            for( let i = 0; i < messages.length; i++){
                let date = moment(messages[i].date).format('YYYY-MM-DD, HH:mm:ss')
                if (user_id === messages[i]["sender"]){
                    own_message(messages[i].message, date, user_photo);
                } else {
                    other_message(messages[i].message, date, friend_photo);
                }
            }
        } else {
            document.getElementById("friend_number_of_messages").innerHTML = 0 + " Messages";
        }
        $("#message_send").prop('disabled', false);
    });
    $(document).on("click", "#contacts li", function () {
        console.log("Click on friend");

        $("#message_send").prop('disabled', true);
        contact_current.className = 'change_chat';
        $(this).attr('class', 'active change_chat');
        let new_friend_id = $(this).data("value");
        let new_friend_src = document.getElementById(new_friend_id).src;
        let new_friend_name = document.getElementsByClassName("name " + new_friend_id)[0].value;
        let new_friend_status = document.getElementsByClassName("status " + new_friend_id)[0].value;

        console.log("New friend id: " + new_friend_id);
        console.log("New friend src: " + new_friend_src);
        console.log("New friend name: " + new_friend_name);
        console.log("New friend status: " + new_friend_status);

        document.getElementById("currentFriendImage").src = new_friend_src;
        document.getElementById("friend_online_status").className = "online_icon " +  new_friend_status;
        document.getElementById("friend_firstname").innerHTML = "Chat with " + new_friend_name;

        //TO TO: number of messages
        console.log("Changing chat_friend_id value from " + document.getElementById("chat_friend_id").value);
        console.log("To " + document.getElementById("chat_friend_id").value);

        document.getElementById("chat_friend_id").value = new_friend_id;
        contact_current = document.getElementsByClassName("active change_chat")[0];
        friend_id = new_friend_id;
        friend_photo = new_friend_src;

        socket.emit("change friend", {"user_id": user_id, "friend_id": friend_id});

        messages.innerHTML = "";
    });
    $(document).on("click", "#search_chat_button", function () {
        let value_to_search = $("#search_chat_button_value").val();
        console.log("Chat to search: " + value_to_search);
        $.ajax({
            async: false,
            type: "POST",
            url: "/search-friend",
            data: {"value": value_to_search},
            success: function (result) {
                console.log(result["users"]);
                contacts.innerHTML = '';
                for (let i = 0; i < result["users"].length; i++){
                    add_user(result["users"][i]);
                }
            },
            error: function (e) {
                console.log(e.status);
            }
        });
    });
})();