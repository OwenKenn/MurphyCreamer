var topButton = document.getElementById("topButton");
	window.addEventListener("scroll", () => {
		// need to change the percent for windows. Prehaps add a functionCall
		// the css/html page throws when it detects browser screen size.
		// window.screen.height
		//var twtyPerHght = window.innerHeight * 0.20;
	var twtyPerHght = window.screen.height * 0.20;
	if (window.scrollY > twtyPerHght) {
		document.getElementById("topButton").style.display = "block";
	}
	else {
		document.getElementById("topButton").style.display = "none";
	}
});

// non-functional
// "cannot read properties if null (reading 'addEventListener')"???
topButton.addEventListener( "click", () => {
	window.scrollTo({top: 0, behavior: "smooth"});
});

