import PIXI from "./lib/pixi.js";
import { changeVerticalVelocity, changeHorizontalVelocity } from "./movement.js";
import { World } from "./World.js";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

window.onload = async function() {
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1099BB,
        resolution: 1,
    });

    window.onresize = function() {
        // app.resize(window.innerWidth / window.devicePixelRatio, window.innerHeight / window.devicePixelRatio);
        app.view.width = app.screen.width = window.innerWidth;
        app.view.height = app.screen.height = window.innerHeight;
    }

    document.body.appendChild(app.view);

    const world = new World();
    await world.loadChunkFromURL(app.stage, "./world/0_0.json");
    await world.loadChunkFromURL(app.stage, "./world/1_0.json");
    await world.loadChunkFromURL(app.stage, "./world/2_0.json");

    const marioTexture = await new Promise(resolve => {
        PIXI.loader.add([
            "./assets/mario-animation-sheet.png"
        ]).load(function() {
            resolve(PIXI.loader.resources["./assets/mario-animation-sheet.png"].texture);
        })
    });

    const mario = new PIXI.TilingSprite(marioTexture, 48, 48);

    const rect = new PIXI.Graphics();

    // rect.beginFill(0xFFFF00);

    // set the line style to have a width of 5 and set the color to red
    rect.lineStyle(1, 0xFF0000);

    // draw a rectangle
    rect.drawRect(0, 0, 10, 19);

    app.stage.addChild(mario);
    app.stage.addChild(rect);

    const keyboard = {
        left: false,
        right: false,
        down: false,
        up: false,
        jump: false
    };

    const keyboardConfig = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowDown: "down",
        ArrowUp: "up",
        KeyA: "left",
        KeyD: "right",
        KeyS: "down",
        KeyW: "up",
        KeyC: "jump"
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
    const horVelocityObj = {velocity: 0, counter: 0};
    const vertVelocityObj = {velocity: 0, counter: 0};

    let marioPosX = 0;
    let marioPosY = 0;

    function updateMarioPosition(frames) {
        const feet_x = Math.floor((19 + marioPosX) / 16);
        const feet_y = Math.floor((39 + marioPosY) / 16);

        const grounded = world.get(feet_x, feet_y) !== 0;

        changeHorizontalVelocity(horVelocityObj, keyboard.left, keyboard.right, keyboard.jump);
        changeVerticalVelocity(vertVelocityObj, grounded);

        marioPosX += horVelocityObj.velocity * frames;
        marioPosY -= vertVelocityObj.velocity * frames;
        if (marioPosY > 170) {
            marioPosY = 170;
        }

        mario.position.x = Math.floor(marioPosX);
        mario.position.y = Math.floor(marioPosY);

        rect.position.x = Math.floor(mario.position.x) + 19;
        rect.position.y = Math.floor(mario.position.y) + 19;
    }

    let frameCount = 0;

    // Listen for frame update
    app.ticker.add((frames) => {
        frameCount ++;
        /*
        if (frameCount % 8 !== 3) {
            return;
        }*/
        updateMarioPosition(frames);

        app.stage.pivot.x = + 24 - (app.screen.width) / 2 + marioPosX;
        app.stage.pivot.y = + 28 - (app.screen.height) / 2 + marioPosY;

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
