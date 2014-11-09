$(document).ready(function() {
	$(".nocka").click(function() {
		$("body,.nocka").toggleClass("ciemno");
		$(".purple,.jade").toggleClass("swieci");
		$(".nocka").toggleClass("znaczek");
	});
	$(".przycisk .cerulean").click(function() {
		$(".kolor").removeClass("purple jade swieci").addClass("cerulean");
	});
	$(".przycisk .purple").click(function() {
		$(".kolor").removeClass("cerulean jade").addClass("purple");
		if ($(".nocka").hasClass("znaczek")) {
			$(".kolor").addClass("swieci");
		};
	});
	$(".przycisk .jade").click(function() {
		$(".kolor").removeClass("purple cerulean").addClass("jade");
		if ($(".nocka").hasClass("znaczek")) {
			$(".kolor").addClass("swieci");
		};
	});
});