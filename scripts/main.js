// If incase we ever use `require()` in the future, please change the `script.js` to `main.js` in the `index.html`.
// Also implement the "build:JS" in `package.json` file.
"use strict";

// Importing all the screen scripts
window.loaded = {
	1: false,
	2: false,
	3: false,
};
window.initFuncs = {};
window.initiated = {};

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
	if (window.initFuncs[screenIndex] && !window.initiated[screenIndex]) initFuncs[screenIndex]();
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
// Make sure to run only when all the scripts have been loaded
let interval = null;
setInterval(() => {
	if (Object.values(window.loaded).every((a) => a == true)) {
		setScreen(Number(localStorage.getItem("activeScreen")) || 0, { instant: true });
		clearInterval(interval);
	}
}, 500);
