const { Engine, Render, Runner, Bodies, Composite, Resolver, MouseConstraint, Mouse, Events, Body } = require("matter-js");

var canvasElem = document.querySelector("#screen2_ctx");

const walls = {
	up: null,
	down: null,
	left: null,
	right: null,
};

const matter = {
	engine: null,
	render: null,
	runner: null,
	canvas: null,
	world: null,
};

function init_screen2() {
	window.initiated[2] = true;

	// create an engine
	matter.engine = Engine.create();
	matter.world = matter.engine.world;
	// matter.engine.gravity.y = 1;

	// create a renderer
	let { width, height } = canvasElem.getBoundingClientRect();
	matter.render = Render.create({
		canvas: canvasElem,
		engine: matter.engine,
		options: {
			hasBounds: true,
			wireframes: false,
		},
	});
	matter.canvas = matter.render.canvas;

	// Create a ball
	let ball = Bodies.circle(width / 2, height / 2, 40, {
		label: "ball",
		friction: 0,
		frictionAir: 0,
		frictionStatic: 0,
		inertia: Infinity,
		restitution: 0.5,
		density: 1,
	});
	Composite.add(matter.engine.world, ball);

	// add mouse control
	var mouse = Mouse.create(matter.render.canvas),
		mouseConstraint = MouseConstraint.create(matter.engine, {
			mouse: mouse,
			constraint: {
				render: {
					visible: false,
				},
			},
		});

	let fire = false;
	Events.on(mouseConstraint, "mousedown", (event) => {
		if (event.source.body == ball) fire = true;
	});

	Events.on(mouseConstraint, "mouseup", (event) => {
		if (fire) {
			console.log("Something");
			let xOffset = Math.randomNum(-3, 3);
			let yLaunch = 15;
			Body.setVelocity(ball, { x: ball.velocity.x + xOffset, y: -yLaunch });
			fire = false;
		}
	});

	Composite.add(matter.engine.world, mouseConstraint);
	matter.render.mouse = mouse;

	// Run the render and the engine
	Render.run(matter.render);
	matter.runner = Runner.create();
	Runner.run(matter.runner, matter.engine);

	// Keep the things straight
	setSize();
	updateWalls();
}

function updateWalls() {
	// This function respawns the walls
	Object.values(walls)
		.filter((wall) => wall)
		.forEach((wall) => Composite.remove(matter.engine.world, wall));
	let { width, height } = canvasElem.getBoundingClientRect();
	var bounceRate = 1;
	var wallWidth = 10;
	walls.down = Bodies.rectangle(width / 2, height, width, wallWidth, { isStatic: true, restitution: bounceRate });
	walls.up = Bodies.rectangle(width / 2, 0, width, wallWidth, { isStatic: true, restitution: bounceRate });
	walls.left = Bodies.rectangle(0, height / 2, wallWidth, height, { isStatic: true, restitution: bounceRate });
	walls.right = Bodies.rectangle(width, height / 2, wallWidth, height, { isStatic: true, restitution: bounceRate });

	Composite.add(matter.engine.world, Object.values(walls));
}

function setSize() {
	// This function is ran to resize the canvas and the elements when the screen changes
	let container = canvasElem.parentElement;
	let { width, height } = { width: container.offsetWidth, height: container.offsetHeight };
	matter.render.bounds.max.x = width;
	matter.render.bounds.max.y = height;
	matter.render.options.width = width;
	matter.render.options.height = height;
	matter.render.canvas.width = width;
	matter.render.canvas.height = height;

	updateWalls();
	// Remove any ball which has a y/x value below 0 or more than width/height
}

window.addEventListener("resize", () => setTimeout(setSize, 1000));

window.loaded[2] = true;
window.initFuncs[2] = init_screen2;
