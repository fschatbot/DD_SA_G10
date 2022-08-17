/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["*.{html,js}"],
	theme: {
		extend: {
			fontSize: { tiny: ".65rem" },
			fontFamily: {
				CCBackBeat: ['"CCBackBeatW00-Light"', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
};
