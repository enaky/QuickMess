let countries;
$.getJSON("/data/country.json", function (data) {
    countries = data;
    console.log(countries);
});

function getFormDataAsJSON(form){
    const unindexed_array = form.serializeArray();
    const indexed_array = {};

    unindexed_array.map(function(item){
        indexed_array[item['name']] = item['value'];
    });
    return indexed_array;
}

$('#register_form').submit(function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    const url = $(this).attr('action');
    let data = getFormDataAsJSON($(this));
    data["password"] = CryptoJS.SHA256(data["password"]).toString();
    data["passwordConfirmation"] = CryptoJS.SHA256(data["passwordConfirmation"]).toString();
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
    //$("#password").val(CryptoJS.SHA256($("#password").val()).toString());
    const url = $(this).attr('action');
    let data = getFormDataAsJSON($(this));
    data["password"] = CryptoJS.SHA256(data["password"]).toString();
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