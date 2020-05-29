//let socket = io();
let messages = document.getElementById("message_inbox");

(function () {
    $("#message_send_form").submit(function (e) {
        if ($("#message").val() === ""){
            return false;
        }

        let div_element_1 = document.createElement("div");
        div_element_1.className = "d-flex justify-content-start mb-4";

            let div_element_11 = document.createElement("div");
            div_element_11.className = "img_cont_msg";

                let img_element = document.createElement("img");
                img_element.src = "https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg";
                img_element.className = "rounded-circle user_img_msg";
                div_element_11.appendChild(img_element);

            let div_element_12 = document.createElement("div");
            div_element_12.className = "msg_cotainer"
            div_element_12.innerHTML = $("#message").val();
                let span_element = document.createElement("span");
                span_element.className = "msg_time";
                span_element.innerHTML = "8:40 AM, ffffff";
                div_element_12.appendChild(span_element);

        div_element_1.appendChild(div_element_11);
        div_element_1.appendChild(div_element_12);
        messages.appendChild(div_element_1);
        messages.scrollTop = messages.scrollHeight;
        //messages.append(html_message);

        e.preventDefault(); // prevents page reloading
        //socket.emit("chat message", $("#message").val());
        $("#message").val("");
        return false;
    });

    // socket.on("received", data => {
    //     let li = document.createElement("li");
    //     let span = document.createElement("span");
    //     var messages = document.getElementById("messages");
    //     messages.appendChild(li).append(data.message);
    //     messages.appendChild(span).append("by " + "anonymous" + ": " + "just now");
    //     console.log("Hello bingo!");
    // });
})();