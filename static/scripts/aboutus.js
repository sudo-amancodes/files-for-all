$(document).ready(function () {
    document.getElementById("html-validator").onclick = function () {
        location.href = "https://validator.w3.org/check?uri=referer";
    };
    document.getElementById("css-validator").onclick = function () {
        location.href = "https://validator.w3.org/check?uri=referer";
    };
    
    var $folded = $(".aboutmepage").oriDomi({ maxAngle: 40, vPanels: 3 });
    
    // Function to handle scroll event
    function handleScroll() {
      if ($(this).scrollTop() > 250) {
        // Apply accordion effect when scrolled more than 100px
        $folded.oriDomi("accordion", 0);
      } else {
        // Reset to default state if scrolled back to the top
        $folded.oriDomi("accordion", 50);
      }
    }

    // Bind scroll event
    $(document).scroll(handleScroll);
  });