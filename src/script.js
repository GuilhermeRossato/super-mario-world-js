import PIXI from "./lib/pixi.js";
import BlockData from "./data/BlockData.js";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const spriteTextureCache = {};

class SpriteTextureService {
	/**
	 * @param {string} texture
	 * @returns {PIXI.Texture}
	 */
	static get(texture) {
		if (!spriteTextureCache[texture]) {
			spriteTextureCache[texture] = PIXI.Texture.from("./assets/" + texture);
		}
		return spriteTextureCache[texture];
	}
}

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
			data = new Uint32Array(32 * 32);
		}
		if (data.length !== 32 * 32) {
			throw new Error("Unexpected size");
		}
		this.data = data;
		this.container = new PIXI.Container();
		for (let y = 0; y < 32; y++) {
			for (let x = 0; x < 32; x++) {
				let id = data[y * 32 + x];
				if (!BlockData[id]) {
					continue;
				}
				const textureName = BlockData[id].texture;
				if (!textureName) {
					continue;
				}
				const texture = SpriteTextureService.get(textureName);
				const sprite = new PIXI.Sprite(texture);
				sprite.position.x = x * 16;
				sprite.position.y = y * 16;
				this.container.addChild(sprite);
			}
		}
	}

	assignToStage(stage) {
		if (this.assigned) {
			throw new Error("Already assigned");
		}
		this.assigned = true;
		stage.addChild(this.container);
	}

	get(x, y) {
		if (x < 0 || x >= 32 || y < 0 || y >= 32) {
			throw new Error(`Coords (${x}, ${y}) out of bounds (32, 32)`);
		}
		return this.data[y * 32 + x];
	}

	set(x, y, v) {
		if (x < 0 || x >= 32 || y < 0 || y >= 32) {
			throw new Error(`Coords (${x}, ${y}) out of bounds (32, 32)`);
		}
		return (this.data[y * 32 + x] = v);
	}
}

// 32 * 32 

window.onload = function(){
	const app = new PIXI.Application({
		width: window.innerWidth,
		height: window.innerHeight,
		backgroundColor: 0x1099BB,
		resolution: window.devicePixelRatio || 1,
	});

	window.onresize = function() {
    	// app.resize(window.innerWidth / window.devicePixelRatio, window.innerHeight / window.devicePixelRatio);
    	app.view.width = app.screen.width = window.innerWidth;
    	app.view.height = app.screen.height = window.innerHeight;
    }

	document.body.appendChild(app.view);

	const container = new PIXI.Container();

	app.stage.addChild(container);

	const marioTexture = PIXI.Texture.from("./assets/mario-animation-sheet.png");
	const mario = new PIXI.TilingSprite(marioTexture, 48, 48);
	mario.position.x = 0;
	// mario.scale.x *= -1;
	app.stage.pivot.x = - app.screen.width / 2;
	app.stage.pivot.y = - app.screen.height / 2;

	app.stage.addChild(mario);

	const data = new Uint32Array(32 * 32);
	for (let x = 0; x < 32; x++) {
		data[x + 15 * 32] = 1;
	}
	data[(0) + (14) * 32] = 3;
	data[(31) + (14) * 32] = 2;
	const chunk = new Chunk(0, 0, data);
	chunk.assignToStage(app.stage);

	// Move container to the center
	container.x = app.screen.width / 2;
	container.y = app.screen.height / 2;

	const keyboard = {
		left: false,
		right: false,
		down: false,
		up: false,
		b: false,
		a: false,
		y: false,
		x: false,
		start: false,
		select: false,
		l: false,
		r: false
	};

	const keyboardConfig = {
		ArrowLeft: "left",
		ArrowRight: "right",
		ArrowDown: "down",
		ArrowUp: "up",
		KeyC: "b",
		KeyV: "a",
		KeyX: "y",
		KeyD: "x",
		Enter: "start",
		Escape: "select",
		KeyA: "l",
		KeyS: "r"
	};

	window.addEventListener("keydown", (event) => {
		if (keyboardConfig[event.code]) {
			keyboard[keyboardConfig[event.code]] = true;
		}
	});

	window.addEventListener("keyup", (event) => {
		if (keyboardConfig[event.code]) {
			keyboard[keyboardConfig[event.code]] = false;
		}
	});

	let walk_frame = 0;

	// Listen for animate update
	app.ticker.add((frames, x) => {
		let moved = false;
		const col_x = Math.floor((19 + mario.position.x) / 16);
		const col_y = Math.floor((38 + mario.position.y) / 16);

		const is_within_range = col_x >= 0 && col_x < 31 && col_y >= 0 && col_y <= 31;
		if (!is_within_range) {
			mario.position.y += 1;
			moved = true;
		} else if (!chunk.get(col_x, col_y)) {
			mario.position.y += 1;
			moved = true;
		}

		if (keyboard.right) {
			mario.position.x += 1.25 * frames;
			moved = true;
		} else if (keyboard.left) {
			mario.position.x -= 1.25 * frames;
			moved = true;
		}


		if (moved) {
			app.stage.pivot.x = - app.screen.width / 2 + mario.position.x;
			app.stage.pivot.y = - app.screen.height / 2 + mario.position.y;
		}

		// rotate the container!
		// use delta to create frame-independent transform
		// container.rotation -= 0.01 * delta;

		walk_frame = (walk_frame + 1) % 30;
		if (walk_frame < 10) {
			mario.tilePosition.x = -8;
			mario.tilePosition.y = -33;
		} else {
			//mario.tilePosition.x = -164;
			//mario.tilePosition.y = -33;
		}
	});
}
