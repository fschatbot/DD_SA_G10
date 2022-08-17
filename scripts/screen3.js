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
