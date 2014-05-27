//Function to enable sliding via bottom bar
var active_slide = 1;

$(document).on("click", "#bottom_bar button", function() {
    var id = $(this).val();
    
    $("#slide_" + active_slide).removeClass("active");
    
    active_slide = id;
    
    $("#slide_" + id).addClass("active");
});
//Function to enable navigation between slides
