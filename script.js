import PIXI from "./pixi.js";

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

	// Listen for animate update
	app.ticker.add((delta) => {
		// rotate the container!
		// use delta to create frame-independent transform
		container.rotation -= 0.01 * delta;
	});
}
