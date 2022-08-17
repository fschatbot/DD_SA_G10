// If incase we ever use `require()` in the future, please change the `script.js` to `main.js` in the `index.html`.
// Also implement the "build:JS" in `package.json` file.

"use strict";
let activeScreen = 0;

/*
 * @description: This function is used to change the screen.
 * @param: {number} screenNumber - The screen number to be changed.
 * @param: {object} options - Change how the scrolling is done.
 * @return: {void}
 */
function setScreen(screenIndex, options = { instant: false, log: false }) {
	// Managing the scroll
	let elem = document.querySelector(`.screen[screen="${screenIndex}"]`);
	if (options.instant === true) {
		elem.scrollIntoView({ behavior: "instant", block: "start" });
	} else {
		elem.scrollIntoView({ behavior: "smooth", block: "start" }); // TODO: Change the duration of the scroll (https://stackoverflow.com/q/15935318/13703806)
	}

	// Managing the navigation classes
	document.querySelector(`nav li[index="${activeScreen}"]`).classList.remove("active");
	document.querySelector(`nav li[index="${screenIndex}"]`).classList.add("active");

	// Declaring the active screen in the script
	activeScreen = screenIndex;
	localStorage.setItem("activeScreen", activeScreen);
	if (options.log) console.info(`Screen ${screenIndex} is now active!`);
}

// Add event listeners to the navigation buttons
document.querySelectorAll("nav li").forEach((elem) => {
	elem.addEventListener("click", () => {
		let index = elem.getAttribute("index");
		setScreen(index);
	});
});

// Scroll to the last active screen instantly on boot. If none, then make it first screen
setScreen(Number(localStorage.getItem("activeScreen")) || 0, { instant: true });

// Changing the progress bar behind color on change
// https://stackoverflow.com/questions/43771735/style-input-range-background-before-thumb
document.querySelectorAll(".bar").forEach(function (el) {
	el.oninput = function () {
		var valPercent = (el.valueAsNumber - parseInt(el.min)) / (parseInt(el.max) - parseInt(el.min));
		var style = "background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(" + valPercent + ", #475569), color-stop(" + valPercent + ", #64748b));";
		el.setAttribute("style", style);
	};
	el.oninput();
});
