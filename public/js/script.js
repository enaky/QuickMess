$('#gender_hidden').change(function() {
    const x = $(this).val();
    console.log(x);
    $('#gender').val(x);
});