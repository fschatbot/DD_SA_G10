var { Engine, Render, Runner, Bodies, Composite, Resolver, MouseConstraint, Mouse, Events } = require("matter-js");

var canvasElem = document.querySelector("#screen1_ctx");

let walls = {
	up: null,
	down: null,
	left: null,
	right: null,
};

var matter = {
	engine: null,
	render: null,
	runner: null,
	canvas: null,
	world: null,
};

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

	// Spawn in a dummy ball
	let config = {
		label: "ball",
		friction: 0,
		frictionAir: 0,
		frictionStatic: 0,
		inertia: Infinity,
		restitution: 1,
	};
	var ball1 = Bodies.polygon(width / 2, height / 2, 30, 40, { ...config, force: { x: 0.2 } });
	var ball2 = Bodies.circle(width / 4, height / 2, 40, { ...config, force: { y: 0.2 } });
	var ball3 = Bodies.circle((width * 3) / 4, height / 2, 40, { ...config, force: { x: 0.2, y: 0.1 } });

	Events.on(matter.engine, "afterCollision", function (event) {
		if (ball.speed != 0) {
			let speedMultiplier = 11.241098900509593 / ball.speed; // 11.241098900509593 == initial (starting) ball speed
			Body.setVelocity(ball, { x: ball.velocity.x * speedMultiplier, y: ball.velocity.y * speedMultiplier });
		}
	});

	// add all of the bodies to the world
	Composite.add(matter.engine.world, [ball1, ball2, ball3]);

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
}

window.addEventListener("resize", () => setTimeout(setSize, 1000));

window.loaded[1] = true;
window.initFuncs[1] = init_screen1;

// TODO: Install matter-wrap
// Add 3 balls which move around the screen randomly
// Implement https://github.com/liabru/matter-js/issues/256#issuecomment-545643626
