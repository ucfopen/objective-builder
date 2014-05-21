//Function to enable sliding
$(document).ready(function(){
	$('#begin_next').on('click','span',function(){
		$('#begin').css("transform","translateX("+(this).index()*-450+"px)");
	})
})