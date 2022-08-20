var musics = {
	Rain: "rain.mp3",
	River: "river.mp3",
	Nature: "nature.mp3",
	Night: "night.mp3",
	Piano: "piano.mp3",
};
var selections = Object.keys(musics).randomize();

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

function get_current() {
	return selections[2]; // the middle one
}

function update_title_display() {
	document.querySelectorAll(".titles span").forEach(function (el, index) {
		el.textContent = selections[index];
	});
}

document.querySelectorAll(".titles span").forEach(function (el) {
	el.addEventListener("click", function (event) {
		event.preventDefault();
		console.log(event.target.textContent);
		while (selections[2] != el.textContent) {
			selections = selections.rotate();
		}
		update_title_display();
	});
});
update_title_display();
