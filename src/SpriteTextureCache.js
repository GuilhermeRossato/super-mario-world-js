import PIXI from "./lib/pixi.js";

const spriteTextureCache = {};

export class SpriteTextureService {
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
