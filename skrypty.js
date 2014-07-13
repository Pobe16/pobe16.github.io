$(document).ready(function() {
	$(".rectangle_over").click(function() {
		$(this).toggleClass("flipped");
	});
	$(".bottom_side>p").click(function(event){
		event.stopPropagation();
	});
});