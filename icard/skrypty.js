var flashcard = {
	// it's OK to have one global variable, isn't it?
	newcardnumber: 0,
	activate: function(){
		// Checking and preparing local storage.
		if (window.localStorage.length==0){ 
			this.storeCard(0, "eng:<br />Flash card", "pl:<br />Fiszka");
			this.newcardnumber = 1;
		};
		// printing all stored cards
		for (var tempid in window.localStorage){
			this.printCard(tempid.substr(9));
			this.newcardnumber = parseInt(tempid.substr(9))+1;
		};
	},
	// Storing the card in localstorage
	storeCard: function(id, frontCard, backCard){
		var tempcard = {
			front: frontCard,
			back: backCard
			}
		window.localStorage.setItem("flashcard"+id, JSON.stringify(tempcard));
		this.newcardnumber++;
		},
	// Printing the card on canvas
	printCard: function (flashid, editing){
		var tempcard=JSON.parse(window.localStorage.getItem("flashcard"+flashid));
			// creating the variable
			var localCard='\
			<div class="rectangle_over" id="flashcard'+flashid+'">\
				<div class="top_side">\
					<div>'+tempcard.front+'</div>\
				</div>\
				<div class="bottom_side">\
					<div>'+tempcard.back+'</div>\
				</div>\
				<div class="cardcontroller">\
					<p class="edit">EDIT</p>\
					<p class="remove">DELETE</p>\
				</div>\
			</div>';
		if (editing === true) {
			var i = 0;
			// the "normal way" don't work for 0 :/
			if (flashid === 0) {
			this.eraseCard(flashid);
			$(".canvas").children(":nth-child(1)").before(localCard);
			} else {
			// determine which child we are editing
			while (!(flashid == $(".canvas").children()[i].getAttribute('id').substr(9))) {
			i++;
			}
			this.eraseCard(flashid);
			$(".canvas").children(":nth-child("+(i+1)+")").before(localCard);
			}
		} else {
			$(".canvas .addcard").before(localCard);
		}
		
	},
	eraseCard: function(flashid){
		var todelete = document.getElementById("flashcard"+flashid);
			todelete.parentNode.removeChild(todelete);
	},
	// get the info from localstorage onto the toplayer form, preparing for editing
	edit: function(id){
		document.getElementById("addeditcard").innerHTML = "Edit flashcard:";
		var tempcard=JSON.parse(window.localStorage.getItem("flashcard"+id))
		document.getElementById("flashid").value = id;
		var regexbrton = /<br\s*[\/]?>/gi;
		document.getElementById("frontcard").value = tempcard.front.replace(regexbrton, "\n");
		document.getElementById("backcard").value = tempcard.back.replace(regexbrton, "\n");
		$(".toplayer").addClass("active");
	},
	clearInputFields: function(){
		document.getElementById("frontcard").value = "";
		document.getElementById("backcard").value = "";
		document.getElementById("flashid").value = "new";
		document.getElementById("addeditcard").innerHTML = "Add a flashcard:";
	},
	// remove the card from localstorage
	remove: function(id){
		this.eraseCard(id);
		window.localStorage.removeItem("flashcard"+id);
	}
}

$(document).ready(function() {
	// Lifting every flashcard: existing and newly created.
	$("body").on("click", "div.rectangle_over", function() {
		$(this).children(":first-child").toggleClass("lifted");
	});
	// show the toplayer
	$(".addcard").click(function() {
		$(".toplayer").addClass("active");
	});
	// hide the toplayer
	$(".toplayer").click(function() {
		$(this).removeClass("active");
		flashcard.clearInputFields();
	});
	// but don't hide when clicked on form
	$(".insides").click(function(event){
		event.stopPropagation();
	});
	$("button#savecard").click(function() {
		//checking if it's new one or editing
		if(!isNaN(document.getElementById("flashid").value)) {
			var tempId = document.getElementById("flashid").value
		} else {
			var tempId = flashcard.newcardnumber;
		};
		// preparing variables
		var tempFront = document.getElementById("frontcard");
		var tempBack = document.getElementById("backcard");
		// validating the input
		if (!(tempFront.value == "")&&!(tempBack.value == "")){
		// saving into storage
		flashcard.storeCard(tempId,tempFront.value.replace(/\n/g, "<br />"),tempBack.value.replace(/\n/g, "<br />")); 
		// printing the card
		if(!isNaN(document.getElementById("flashid").value)) {
			flashcard.printCard(tempId, true);
		} else {
			flashcard.printCard(tempId);
		};
		flashcard.clearInputFields();
		// hiding the toplayer
		$(".toplayer").removeClass("active");
		};
	});
	// editing newly created flashcards
	$(".canvas").on("click", "p.edit", function() {
		tempId = $(this).parent().parent().attr("id").substr(9);
		flashcard.edit(tempId);
	});
	// deleting newly created flashcards
	$(".canvas").on("click", "p.remove", function() {
		if (confirm("Are you sure?")) {
		tempId = $(this).parent().parent().attr("id").substr(9);
		flashcard.remove(tempId);
		};
	});
	// start the whole thing
	flashcard.activate();
});