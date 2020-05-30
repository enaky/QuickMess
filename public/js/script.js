let countries;
$.getJSON("/data/country.json", function (data) {
    countries = data;
    console.log(countries);
});

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

$('#country').on('change', function() {
    let city_input = document.getElementById("city");
    let first = city_input.firstElementChild;
    while (first) {
        first.remove();
        first = city_input.firstElementChild;
    }
    for (let i = 0; i < countries.length; i++){
        if (countries[i].name === this.value){
            for (let j = 0; j < countries[i]["cities"].length; j++){
                let select_element = document.createElement("option");
                select_element.value = countries[i].cities[j];
                select_element.innerHTML = countries[i].cities[j];
                city_input.appendChild(select_element);
            }
        }
    }
});