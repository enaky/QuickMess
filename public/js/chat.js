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
    span_element.className = "msg_time";
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

const add_user = function(name, online= false, img="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"){
    let li_element = document.createElement("li");

    let div_element = document.createElement("div");
    div_element.className = "d-flex bd-highlight";

    let div_element_11 = document.createElement("div");
    div_element_11.className = "img_cont";

        let img_element = document.createElement("img");
        img_element.src = img;
        img_element.className = "rounded-circle user_img";

        let span_element = document.createElement("span");
        span_element.className = online ? "online_icon" : "online_icon offline";

        div_element_11.appendChild(img_element);
        div_element_11.appendChild(span_element);


    let div_element_12 = document.createElement("div");
    div_element_12.className = "user_info";
        let span_element_2 = document.createElement("span");
        span_element_2.innerHTML = name;

        let p_element = document.createElement("p");
        p_element.innerHTML = name + " is " + (online ? "online" : "offline");

    div_element_12.appendChild(span_element_2);
    div_element_12.appendChild(p_element);

    div_element.appendChild(div_element_11);
    div_element.appendChild(div_element_12);

    li_element.appendChild(div_element);
    contacts.appendChild(li_element);
    contacts.scrollTop = contacts.scrollHeight;
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
        return false;
    });

    socket.on("received", data => {
        console.log(data);
        console.log("Received message with socket from " + data["user_id"]);
        if (friend_id === data["user_id"]){
            display_message(data.message, moment(data.date).format('YYYY-MM-DD, HH:mm:ss'), false, friend_photo)
        }
    });

    $( "#contacts li" ).click(function() {
        console.log("Click on friend");
        contact_current.className = 'change_chat';
        $(this).attr('class', 'active change_chat');
        let new_friend_id = $(this).attr("value");
        console.log("New friend id: " + new_friend_id);
        let new_friend_src = document.getElementById(new_friend_id).src;
        let new_friend_name = document.getElementsByClassName("name " + new_friend_id)[0].value;
        let new_friend_status = document.getElementsByClassName("status " + new_friend_id)[0].value;
        console.log("New friend src: " + new_friend_src);
        console.log("New friend name: " + new_friend_name);
        console.log("New friend status: " + new_friend_status);

        document.getElementById("currentFriendImage").src = new_friend_src;
        document.getElementsByClassName(user_id + " online_icon")[0].className = user_id + " online_icon " +  new_friend_status;
        document.getElementsByClassName(user_id + " firstname")[0].innerHTML = "Chat with " + new_friend_name;

        //TO TO: number of messages
        console.log("Changing chat_friend_id value from " + document.getElementById("chat_friend_id").value);
        document.getElementById("chat_friend_id").value = new_friend_id;
        console.log("To " + document.getElementById("chat_friend_id").value);
        contact_current = document.getElementsByClassName("active change_chat")[0];
        friend_id = new_friend_id;
        friend_photo = new_friend_src;

        socket.emit("change friend", {"user_id": user_id, "friend_id": friend_id});

        messages.innerHTML = "";
    });
})();