const { World, Bodies, Composite } = require("matter-js");

const GROUP_LABEL = "CanvasWalls";
const GROUP = { label: GROUP_LABEL };
const WALL_LABEL = "CanvasWall";
const PHYSICS = {
	label: WALL_LABEL,
	isStatic: true, // immovable canvas wall body
	visible: false, // just a reminder it isn't for rendering
};

export function addCanvasWalls(world, canva, thick = 10) {
	let walls = findCanvasWalls(world); // checks if a walls composite exists

	// If none found, create a walls composite & add it to the world:
	walls || World.addComposite(world, (walls = Composite.create(GROUP)));

	let { width: w, height: h } = canva.getBoundingClientRect(),
		cx = w / 2,
		cy = h / 2,
		t = thick / 2,
		tt = thick * 2,
		north = Bodies.rectangle(cx, -t, w, thick, PHYSICS),
		east = Bodies.rectangle(w + t, cy, thick, h + tt, PHYSICS),
		south = Bodies.rectangle(cx, h + t, w, thick, PHYSICS),
		west = Bodies.rectangle(-t, cy, thick, h + tt, PHYSICS);

	// Adds 4 invisible immovable wall bodies to the walls composite
	// but not before erasing any previous 1s 1st:
	return Composite.add(Composite.clear(walls), [north, east, south, west]);
}

export function findCanvasWalls({ composites }) {
	for (const c of composites) if (c.label == GROUP_LABEL) return c;
}

export function removeCanvasWalls(world) {
	const walls = findCanvasWalls(world);
	return (walls && !!World.remove(world, walls)) || false;
}

// Removes and adds all the walls back to the screen
export function updateWalls({ engine }, canvas) {
	// This function respawns the walls
	removeCanvasWalls(engine.world);
	addCanvasWalls(engine.world, canvas);
}

// Resizes the canvas back to fit the screen and updates the walls & balls[todo] accordingly
export function resizeCanvas({ render, engine }, canvas, UpdateWalls = true) {
	// This function is ran to resize the canvas and the elements when the screen changes
	const container = canvas.parentElement;
	const { width, height } = { width: container.offsetWidth, height: container.offsetHeight };
	render.bounds.max.x = width;
	render.bounds.max.y = height;
	render.options.width = width;
	render.options.height = height;
	render.canvas.width = width;
	render.canvas.height = height;

	if (UpdateWalls) updateWalls({ engine }, canvas);

	// Remove any ball which has a y/x value below 0 or more than width/height
}
