// @ts-check

import { Chunk } from "./Chunk.js";

export class World {
    constructor() {
        /** @type {Record<number, Record<number, Chunk>>} */
        this.chunks = {};
    }

    _loadChunkByData(stage, cx, cy, data) {
        const chunk = new Chunk(cx, cy, data);
        chunk.assignToStage(stage);

        if (!this.chunks[cy]) {
            this.chunks[cy] = {};
        }

        this.chunks[cy][cx] = chunk;

    }

    async loadChunkFromURL(stage, url) {
        const response = await fetch(url);
        const json = await response.json();
        const {cx, cy, data} = json;
        this._loadChunkByData(stage, cx, cy, data);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} fallback Value to return if there are no chunks at position
     * @returns {number}
     */
    get(x, y, fallback = 0) {
        // Find chunk
        const cx = Math.floor(x / 16);
        const cy = Math.floor(y / 16);
        if (!this.chunks[cy]) {
            return fallback;
        }
        const chunk = this.chunks[cy][cx];
        if (!chunk) {
            return fallback;
        }
        // Find value in chunk
        return chunk.get(x % 16, y % 16);
    }
}
