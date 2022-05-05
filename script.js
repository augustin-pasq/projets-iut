/* Permet d'ouvrir le pop-up de la description de Mélanie Auriel
et d'assombrir l'arrière plan */
function openForm(element) {
	document.getElementById("popupForm").style.display = "block";
	var overlay = document.getElementById("overlay");
	var dialog = document.getElementById("window");
	overlay.style.display = "block";
	overlay.fadeIn(250);
	dialog.fadeIn(300);
	document.getElementById("exit").onclick = function() {
		overlay.fadeOut(300);
		dialog.fadeOut(250);
	};
}

/* Permet d'ouvrir le pop-up de la description de Ronan Lucas
et d'assombrir l'arrière plan */
function openForm2(element) {
	document.getElementById("popupForm2").style.display = "block";
	var overlay = document.getElementById("overlay");
	var dialog = document.getElementById("window");
	overlay.style.display = "block";
	overlay.fadeIn(250);
	dialog.fadeIn(300);
	document.getElementById("exit").onclick = function() {
		overlay.fadeOut(300);
		dialog.fadeOut(250);
	};
}

/* Permet d'ouvrir le pop-up de la description de Mathilde Hervy
et d'assombrir l'arrière plan */
function openForm3(element) {
	document.getElementById("popupForm3").style.display = "block";
	var overlay = document.getElementById("overlay");
	var dialog = document.getElementById("window");
	overlay.style.display = "block";
	overlay.fadeIn(250);
	dialog.fadeIn(300);
	document.getElementById("exit").onclick = function() {
		overlay.fadeOut(300);
		dialog.fadeOut(250);
	};
}

// Permet de fermer tous les pop-up de description des formateurs
function closeForm(element) {
	document.getElementById("popupForm").style.display = "none";
	document.getElementById("popupForm2").style.display = "none";
	document.getElementById("popupForm3").style.display = "none";
	document.getElementById("overlay").style.display = "none";
}