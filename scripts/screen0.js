const { Engine, Render, Runner, Bodies, Composite, World, MouseConstraint, Mouse, Events, Body } = require("matter-js");
const { resizeCanvas } = require("./utils");

var canvasElem = document.querySelector("#screen0_ctx");

const matter = {
	engine: null,
	render: null,
	runner: null,
	canvas: null,
	world: null,
};

let bubbles = [];
let remover;
let score = 0;

function init_screen0() {
	window.initiated[0] = true; // create an engine
	matter.engine = Engine.create();
	matter.world = matter.engine.world;
	matter.engine.gravity.y = -0.01; // || -9.807 / 10;

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

	// add mouse control
	var mouse = Mouse.create(matter.render.canvas),
		mouseConstraint = MouseConstraint.create(matter.engine, {
			mouse: mouse,
			constraint: {
				damping: 0,
				stiffness: 0, // This makes the mouse unable to grab the object
				render: { visible: false },
			},
		});

	Events.on(mouseConstraint, "mousedown", (event) => {
		if (bubbles.indexOf(event.source.body) === -1) return; // Only dealing with legit bubbles!
		ball = event.source.body;
		// Removing the bubble
		World.remove(matter.engine.world, ball);
		bubbles.remove(ball);

		// Updating the score
		score += 1;
		console.log(score);
	});

	// Adding the removing functionality
	Events.on(matter.engine, "collisionStart", (event) => {
		event.pairs.forEach((pair) => {
			if (pair.bodyA !== remover && pair.bodyB !== remover) return; // Probably 2 balls colliding
			let ball = pair.bodyA === remover ? pair.bodyB : pair.bodyA; // Determining which body is the ball
			if (bubbles.indexOf(ball) === -1) throw new Error("How in the world did this happen?");

			// Removing the bubble
			World.remove(matter.engine.world, ball);
			bubbles.remove(ball);
		});
	});

	Composite.add(matter.engine.world, mouseConstraint);
	matter.render.mouse = mouse;

	// Run the render and the engine
	Render.run(matter.render);
	matter.runner = Runner.create();
	Runner.run(matter.runner, matter.engine);

	// Keep the things straight
	resizeCanvas(matter, canvasElem, false);
	makeTopWall();

	// Start the spawning
	setInterval(spawnBubbles, BubbleConfig.spawnRate);
}

const BubbleConfig = {
	spawnRate: 1000,
	radius: 40,
	speed: 1,
};

function spawnBubbles() {
	let radius = BubbleConfig.radius;
	let { width, height } = canvasElem.getBoundingClientRect();
	let ball = Bodies.circle(Math.randomNum(radius, width - radius), height + 2 * radius, radius, {
		label: "ball",
		friction: 0,
		frictionAir: 0,
		frictionStatic: 0,
		inertia: Infinity,
		restitution: 0.5,
		density: 1,
		collisionFilter: {
			group: -1,
		},
	});
	Composite.add(matter.engine.world, ball);
	Body.setVelocity(ball, { ...ball.velocity, y: -BubbleConfig.speed });
	bubbles.push(ball);
}

function makeTopWall() {
	// Removing any top walls
	if (remover) World.remove(matter.engine.world, remover);
	// Creating the top wall
	let { width } = canvasElem.getBoundingClientRect();
	remover = Bodies.rectangle(width / 2, -BubbleConfig.radius * 2, width, 10, { isStatic: true, visible: false });
	Composite.add(matter.engine.world, remover);
}

window.addEventListener("resize", () => {
	setTimeout(() => {
		resizeCanvas(matter, canvasElem, false);
		makeTopWall();
	}, 1000);
});

window.loaded[0] = true;
window.initFuncs[0] = init_screen0;
