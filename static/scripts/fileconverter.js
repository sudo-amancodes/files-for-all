$('#inputGroupSelect01').hide()
$('#inputGroupSelect02').hide()
$('#finish').hide()
$('#errorAlert').hide()
$("#next1").show();
let g1 = false;
let g2 = false;

$(document).ready(function() {

    document.getElementById("html-validator").onclick = function () {
        location.href = "https://validator.w3.org/check?uri=referer";
    };
    document.getElementById("css-validator").onclick = function () {
        location.href = "https://jigsaw.w3.org/css-validator/check/referer";
    };

function isValueInDropdown(value, mySelect) {
    for (var i = 0; i < mySelect.options.length; i++) {
    if (mySelect.options[i].value === value) {
        return true; // Value found in the dropdown
    }
    }
    return false; // Value not found in the dropdown
}
$("#formFile").click(function(){
    $('#inputGroupSelect01').hide()
    $('#inputGroupSelect02').hide()
    $('#finish').hide()
    $('#errorAlert').hide()
    $("#next1").show();
});

$("#next1").click(function(){
    // Get the file input element 
    
    var fileVal=document.getElementById("formFile");
    var file = fileVal.value.split('.');
    file = file[file.length-1].toUpperCase();
    console.log(file)
    if (isValueInDropdown(file, inputGroupSelect01)){
    $('#errorAlert').hide();
    $('#inputGroupSelect01').show();
    $("#next1").hide();
    $('#finish').show();
    g1 = true;
    }
    else if (isValueInDropdown(file, inputGroupSelect02)){
    $('#errorAlert').hide();
    $('#inputGroupSelect02').show();
    $("#next1").hide();
    $('#finish').show();
    g2 = true;
    }
    else {
        $('#errorAlert').text("Error").show();
    }
});

$('#file-form').on('submit', function(event){
    event.preventDefault();
    $('#successPopup').hide();


    let fileInput = $('#formFile')[0].files[0];
    let formData = new FormData();
    formData.append('file', fileInput);
    
    if ($('#inputGroupSelect01').is(':visible')) {
        formData.append('convert_to', $('#inputGroupSelect01').val());
    } else if ($('#inputGroupSelect02').is(':visible')) {
        formData.append('convert_to', $('#inputGroupSelect02').val());
    }
    
    $.ajax({
        data: formData,
        type: "POST",
        url: "/convert",
        contentType: false,
        processData: false,
    })
    .done(function(data){
            if (data.error){
            $('#errorAlert').text(data.error).show();
            $('#successPopup').hide();
            }
            else {
            if ($('#inputGroupSelect01').is(':visible')){
                $('#successPopup').empty();
            
                var videoDiv = $('<div>', {
                    id: 'download_link',
                    class: 'download_link',
                    html: `
                    <a href="{{ url_for('static', filename='files/out.mp4')}}" download>Click here to download!</a>                      `
                });
                $('#successPopup').append(videoDiv);
                $('#successPopup').addClass('spaced').show();
                $('#errorAlert').hide();
                $('#url-text').hide();
            // Handle the converted file response
            $('#errorAlert').hide();
            console.log(data);
        }
        else{
            $('#errorAlert').text('The image convertion is still in development').show();

        }
        }
        });

});

});