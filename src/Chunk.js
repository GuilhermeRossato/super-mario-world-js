import PIXI from "./lib/pixi.js";
import BlockData from "./data/BlockData.js";
import { SpriteTextureService } from "./SpriteTextureCache.js";

export class Chunk {
    /**
     * @param {number} cx
     * @param {number} cy
     * @param {Uint32Array} data
     */
    constructor(cx, cy, data) {
        this.cx = cx;
        this.cy = cy;
        if (!data) {
            data = new Uint32Array(16 * 16);
        }
        if (data.length !== 16 * 16) {
            throw new Error("Unexpected size");
        }
        this.data = data;
        this.container = new PIXI.Container();
        this.container.position.x = cx * 16 * 16;
        this.container.position.y = cy * 16 * 16;
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
                let id = data[y * 16 + x];
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
        if (x < 0 || x >= 16 || y < 0 || y >= 16) {
            throw new Error(`Coords (${x}, ${y}) out of bounds (16, 16)`);
        }
        return this.data[y * 16 + x];
    }

    set(x, y, v) {
        if (x < 0 || x >= 16 || y < 0 || y >= 16) {
            throw new Error(`Coords (${x}, ${y}) out of bounds (16, 16)`);
        }
        return (this.data[y * 16 + x] = v);
    }
}
