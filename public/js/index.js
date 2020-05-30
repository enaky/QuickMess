let posts = document.getElementById("posts");

$('textarea').keyup(function() {

    var characterCount = $(this).val().length,
        current = $('#current'),
        maximum = $('#maximum'),
        theCount = $('#the-count');

    current.text(characterCount);

    /*This isn't entirely necessary, just playin around*/
    if (characterCount < 70) {
        current.css('color', '#666');
    }
    if (characterCount > 70 && characterCount < 90) {
        current.css('color', '#6d5555');
    }
    if (characterCount > 90 && characterCount < 100) {
        current.css('color', '#793535');
    }
    if (characterCount > 100 && characterCount < 120) {
        current.css('color', '#841c1c');
    }
    if (characterCount > 120 && characterCount < 139) {
        current.css('color', '#8f0001');
    }

    if (characterCount >= 140) {
        maximum.css('color', '#8f0001');
        current.css('color', '#8f0001');
        theCount.css('font-weight','bold');
    } else {
        maximum.css('color','#666');
        theCount.css('font-weight','normal');
    }
});

const post = function (content, date) {
    let div_element = document.createElement("div");
    div_element.className = "post my-4";

    let div_element_11 = document.createElement("div");
    div_element_11.className = "mx-4 mt-4 post_text";
    div_element_11.innerHTML = content;

    let div_element_12 = document.createElement("div");
    div_element_12.className = "text-right mb-2 mx-3";
    div_element_12.innerHTML = date;
    div_element_12.style['color'] = '#fd8a00';

    div_element.appendChild(div_element_11);
    div_element.appendChild(div_element_12);

    posts.insertAdjacentElement('afterbegin', div_element);
    //if (posts.scrollTop != null){
    //    posts.scrollTop = messages.scrollHeight;
    //}
};

(function () {
    $("#post_send_form").submit(function (e) {
        if ($("#post-textarea").val() === "") {
            return false;
        }
        console.log("I am posting something");
        post($("#post-textarea").val(), "8:40 AM, ffffff");

        e.preventDefault(); // prevents page reloading
        //socket.emit("chat message", $("#message").val());
        $("#post-textarea").val("");
        return false;
    });

})();