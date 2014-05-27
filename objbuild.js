//Function to enable sliding via bottom bar
var active_slide = 1;
var slides = ["begin", "condition","audience","behavior","degree"];
$(document).on("click", "#bottom_bar button", function() {
    var id = $(this).val();
    
    $("#" + slides[active_slide]).removeClass("active");
    
    active_slide = id;
    
    $("#" + slides[id]).addClass("active");
});
//Function to enable navigation between slides
