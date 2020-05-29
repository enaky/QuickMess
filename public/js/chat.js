var socket = io();
let messages = document.getElementById("message_inbox");
let contacts = document.getElementById("contacts");


const own_message = function (content, date, img) {

    let div_element_1 = document.createElement("div");
    div_element_1.className = "d-flex justify-content-start mb-4";

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
    div_element_1.className = "d-flex justify-content-end mb-4";

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


const send_message = function (content, date, own = true, img = "https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"){
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
        send_message($("#message").val(), "8:40 AM, ffffff")
        send_message($("#message").val(), "8:40 AM, ffffff", false)

        add_user("Corinta");
        add_user("Corinta", true);

        e.preventDefault(); // prevents page reloading
        socket.emit("chat message", $("#message").val());
        $("#message").val("");
        return false;
    });

    socket.on("received", data => {
        console.log("Hello bingo!");
    });
})();