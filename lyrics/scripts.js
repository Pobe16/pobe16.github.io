let lyrics = {


	timeLeftToMs: function(timeString){

	},

	checkLogin: function(){
		let timer = document.querySelector("[max]").getAttribute("max");
		if (timer == "30000"){
			return false;
		} else {
			return true;
		}
	},
	init: function(){

		var iframe = document.getElementById('playeriFrame');
		var innerDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;
		
		var playButton = innerDoc.querySelector('button');
		console.log(playButton)
		if (playButton){
			playButton.click();
		} else {
			window.setTimeout(() => {lyrics.init()}, 1000);
		}
	}
}


document.addEventListener("DOMContentLoaded", () => {
	document.querySelector('[data-songid="1"] .song--title').scrollIntoView({/*behavior: "smooth",*/ block: "center"});
	lyrics.init();
});