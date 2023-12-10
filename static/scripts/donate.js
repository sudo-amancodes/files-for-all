$(document).ready(function () {
    document.getElementById("html-validator").onclick = function () {
        location.href = "https://validator.w3.org/check?uri=referer";
    };
    document.getElementById("css-validator").onclick = function () {
        location.href = "https://jigsaw.w3.org/css-validator/check/referer";
    };
    
    });