const { Engine, Render, Runner, Bodies, Composite, Resolver, MouseConstraint, Mouse, Events, Body } = require("matter-js");
const { resizeCanvas } = require("./utils");

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
				damping: 0,
				stiffness: 0, // This makes the mouse unable to grab the object
				render: {
					visible: false,
				},
			},
		});

	Events.on(mouseConstraint, "mousedown", (event) => {
		if (event.source.body == ball) {
			// Removing the ball from the contrainst to avoid getting stuck in mid-air
			event.source.constraint.bodyB = null;
			event.source.constraint.body = null;

			// Launching the ball
			let xOffset = Math.randomNum(-3, 3);
			let yLaunch = 15;
			Body.setVelocity(ball, { x: ball.velocity.x + xOffset, y: -yLaunch });
		}
	});

	Composite.add(matter.engine.world, mouseConstraint);
	matter.render.mouse = mouse;

	// Run the render and the engine
	Render.run(matter.render);
	matter.runner = Runner.create();
	Runner.run(matter.runner, matter.engine);

	// Keep the things straight
	resizeCanvas(matter, canvasElem);
}

window.addEventListener("resize", () => setTimeout(resizeCanvas, 1000, matter, canvasElem));

window.loaded[2] = true;
window.initFuncs[2] = init_screen2;
