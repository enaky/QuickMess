let countries;
$.getJSON("/data/country.json", function (data) {
    countries = data;
    console.log(countries);
});

$('#register_form').submit(function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.
    $("#password").val(CryptoJS.SHA256($("#password").val()).toString());
    $("#passwordConfirmation").val(CryptoJS.SHA256($("#passwordConfirmation").val()).toString());

    const form = $(this);
    const url = form.attr('action');
    let data = form.serialize();
    console.log(data);
    $.ajax({
        async: false,
        type: "POST",
        url: url,
        data: data, // serializes the form's elements.
        success: function (result) {
            //if the submit was successful, you redirect
            console.log(result.status);
            window.location.href = "/login";
        },
        error: function (e) {
            console.log(e.status);
            window.location.href = "/register";
        }
    });

});

$('#login_form').submit(function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.
    $("#password").val(CryptoJS.SHA256($("#password").val()).toString());
    const form = $(this);
    console.log(form);
    const url = form.attr('action');
    let data = form.serialize();
    console.log(data);
    $.ajax({
        async: false,
        type: "POST",
        url: url,
        data: data, // serializes the form's elements.
        success: function (result) {
            //if the submit was successful, you redirect
            console.log(result.status);
            window.location.href = "/";
        },
        error: function (e) {
            console.log(e.status);
            window.location.href = "/login";
        }
    });
});

$('#country').on('change', function () {
    let city_input = document.getElementById("city");
    let first = city_input.firstElementChild;
    while (first) {
        first.remove();
        first = city_input.firstElementChild;
    }
    for (let i = 0; i < countries.length; i++) {
        if (countries[i].name === this.value) {
            for (let j = 0; j < countries[i]["cities"].length; j++) {
                let select_element = document.createElement("option");
                select_element.value = countries[i].cities[j];
                select_element.innerHTML = countries[i].cities[j];
                city_input.appendChild(select_element);
            }
        }
    }
});

$("textarea").keypress(function (e) {
    if(e.which === 13 && !e.shiftKey) {
        $(this).closest("form").submit();
        e.preventDefault();
    }
});