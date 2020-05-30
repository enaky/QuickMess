$('#register_form').submit(function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    const form = $(this);
    const url = form.attr('action');

    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize() // serializes the form's elements.
    });

});

$('#login_form').submit(function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.
    $("#password").val(CryptoJS.SHA256($("#password").val).toString());
    const form = $(this);
    const url = form.attr('action');
    let data = form.serialize();
    console.log(data);
    $.ajax({
        async: false,
        type: "POST",
        url: url,
        data: data, // serializes the form's elements.
    });
});