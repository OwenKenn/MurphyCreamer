const topButton = document.getElementById("topButton");

window.addEventListener("scroll", () => {
	const threshold = window.innerHeight * 0.20;
	topButton.style.display = window.scrollY > threshold ? "block" : "none";
});

topButton.addEventListener("click", () => {
	window.scrollTo({ top: 0, behavior: "smooth" });
});