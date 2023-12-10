$(document).ready(function() { 
  $('#url-form').on('submit', function(event){
    $.ajax({
      data: {url: $("#url-input").val()},
      type:"POST",
      url:"/process"
    })
    .done(function(data){
      if (data.error){
        $('#url-text').show();
        $('#errorAlert').addClass('spaced')
        $('#errorAlert').text(data.error).show();
        $('#successPopup').hide();
      }
      else{
        $('#successPopup').empty(); 
        var videoDiv = $('<div>', {
            id: 'videoDiv',
            class: 'videoDivClass',
            html: `
               <h2>${data.title}${data.channel}</h2>
               <video controls>
                   <source src="${data.url}" type="video/mp4">
               </video>
            `
        });
        $('#successPopup').append(videoDiv);
        $('#successPopup').addClass('spaced').show();
        $('#errorAlert').hide();
        $('#url-text').hide();
    }
    });
    event.preventDefault();
  });
  document.getElementById("html-validator").onclick = function () {
    location.href = "https://validator.w3.org/check?uri=referer";
};
document.getElementById("css-validator").onclick = function () {
    location.href = "https://jigsaw.w3.org/css-validator/check/referer";
};

});