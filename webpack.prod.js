const path = require("path");

module.exports = {
	mode: "production",
	entry: ["./scripts/main.js", "./scripts/screen1.js", "./scripts/screen2.js", "./scripts/screen3.js"],
	output: {
		path: path.resolve(__dirname, "dist"),
	},
	devtool: "source-map",
	target: "web",
	externalsType: "commonjs",
};
