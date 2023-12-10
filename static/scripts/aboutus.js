$(document).ready(function () {
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