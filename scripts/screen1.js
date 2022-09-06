const { Engine, Render, Runner, Bodies, Composite, Resolver, MouseConstraint, Mouse, Events } = require("matter-js");
const { addCanvasWalls, removeCanvasWalls } = require("./utils");

var canvasElem = document.querySelector("#screen1_ctx");

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
const Balls = [];

function addBall() {
	let randForce = () => ({ x: (Math.randomNum(30, 20) / 100) * [-1, 1].random(), y: (Math.randomNum(30, 20) / 100) * [-1, 1].random() });
	let { width, height } = canvasElem.getBoundingClientRect();

	let config = {
		force: randForce(),
		label: "ball",
		friction: 0,
		frictionAir: 0,
		frictionStatic: 0,
		inertia: Infinity,
		restitution: 1,
	};

	var ball = Bodies.polygon(width / 2, height / 2, 30, 40, config);
	Composite.add(matter.engine.world, [ball]);
	Balls.push(ball);

	if (Balls.length >= 5) {
		document.querySelector("[addBall]").style.display = "none";
	}
}

function init_screen1() {
	window.initiated[1] = true;

	// create an engine
	matter.engine = Engine.create();
	matter.world = matter.engine.world;
	matter.engine.gravity.y = 0;

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

	Events.on(matter.engine, "afterCollision", function (event) {
		console.log(1);
		Balls.forEach((ball) => {
			if (ball.speed != 0) {
				let speedMultiplier = 11.241098900509593 / ball.speed; // 11.241098900509593 == initial (starting) ball speed
				Body.setVelocity(ball, { x: ball.velocity.x * speedMultiplier, y: ball.velocity.y * speedMultiplier });
			}
		});
	});

	// add all of the bodies to the world
	(1).times(addBall);

	// add mouse control
	var mouse = Mouse.create(matter.render.canvas),
		mouseConstraint = MouseConstraint.create(matter.engine, {
			mouse: mouse,
			constraint: {
				stiffness: 0.2,
				render: {
					visible: false,
				},
			},
		});

	Composite.add(matter.engine.world, mouseConstraint);
	matter.render.mouse = mouse;

	// Run the render and the engine
	Render.run(matter.render);
	matter.runner = Runner.create();
	Runner.run(matter.runner, matter.engine);
	Resolver._restingThresh = 0.001;

	// Keep the things straight
	setSize();
	updateWalls();

	document.querySelector("[addBall]").addEventListener("click", addBall);
}

function updateWalls() {
	// This function respawns the walls
	removeCanvasWalls(matter.engine.world);
	addCanvasWalls(matter.engine.world, canvasElem);
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

window.loaded[1] = true;
window.initFuncs[1] = init_screen1;

// TODO: Install matter-wrap
// Add 3 balls which move around the screen randomly
// Implement https://github.com/liabru/matter-js/issues/256#issuecomment-545643626
