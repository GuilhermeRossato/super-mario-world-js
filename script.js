import PIXI from "./pixi.js";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

class Chunk {
	/**
	 *
	 * @param {number} cx
	 * @param {number} cy
	 * @param {Uint32Array} data
	 */
	constructor(cx, cy, data) {
		this.cx = cx;
		this.cy = cy;
		if (!data) {
			data = new Uint32Array(64 * 64);
		}
		if (data.length !== 64 * 64) {
			throw new Error("Unexpected size");
		}
		this.data = data;
		this.container = new PIXI.Container();
	}

	get(x, y) {
		if (x < 0 || x >= 64 || y < 0 || y >= 64) {
			throw new Error(`Coords (${x}, ${y}) out of bounds (64, 64)`);
		}
		return this.data[y * 64 + x];
	}

	set(x, y, v) {
		if (x < 0 || x >= 64 || y < 0 || y >= 64) {
			throw new Error(`Coords (${x}, ${y}) out of bounds (64, 64)`);
		}
		return (this.data[y * 64 + x] = v);
	}
}

const data = new Uint32Array(64 * 64);
const chunk = new Chunk(0, 0, data);
for (let x = 0; x < 32; x++) {
	chunk.set(x, 63, 1);
}

window.onload = function(){
	const app = new PIXI.Application({
		width: window.innerWidth,
		height: window.innerHeight,
		backgroundColor: 0x1099bb,
		resolution: window.devicePixelRatio || 1,
		resizeTo: window
	});

	document.body.appendChild(app.view);

	const container = new PIXI.Container();

	app.stage.addChild(container);

	const textures = [
		"ground-in.png",
		"ground-left-left.png",
		"ground-left.png",
		"ground-middle.png",
		"ground-right-right.png",
		"ground-right.png",
		"left-bottom-pipe.png",
		"left-top-pipe.png",
		"right-bottom-pipe.png",
		"plant-left.png",
		"plant-middle.png",
		"plant-right.png",
		"right-top-pipe.png",
		"plant-left.png",
		"plant-middle.png",
		"plant-right.png"
	].map(filename => PIXI.Texture.from("./assets/" + filename));

	const marioTexture = PIXI.Texture.from("./assets/mario-animation-sheet.png");
	const mario = new PIXI.TilingSprite(marioTexture, 48, 48);
	mario.position.x = 100;

	app.stage.addChild(mario);

	// Create a 5x5 grid of bunnies
	for (let i = 0; i < 250; i++) {
		const bunny = new PIXI.Sprite(textures[i % textures.length]);
		bunny.anchor.set(0.5);
		bunny.x = (i % 5) * 16;
		bunny.y = Math.floor(i / 5) * 16;
		container.addChild(bunny);
	}

	// Move container to the center
	container.x = app.screen.width / 2;
	container.y = app.screen.height / 2;

	// Center bunny sprite in local container coordinates
	container.pivot.x = container.width / 2;
	container.pivot.y = container.height / 2;

	let walk_frame = 0;

	// Listen for animate update
	app.ticker.add((delta, x) => {
		// rotate the container!
		// use delta to create frame-independent transform
		// container.rotation -= 0.01 * delta;

		walk_frame = (walk_frame + 1) % 30;
		if (walk_frame < 10) {
			mario.tilePosition.x = -8;
			mario.tilePosition.y = -33;
		} else {
			mario.tilePosition.x = -164;
			mario.tilePosition.y = -33;
		}
	});
}
