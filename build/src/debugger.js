import { debugBookletIsOn, mouse } from "./input.js";
export class Debuger {
    #x = 0;
    #y = 0;
    #length = 250;
    #textHOffset = 5;
    #textVOffset = 2;
    #textSize = 15;
    #textFont = "Arial";
    #textColor = "black";
    #textalign = "left";
    #textBaseline = "top";
    #offsetLeftFromMouse = 5;
    #offsetTopFromMouse = 5;
    constructor() { }
    update() {
        const horizontalDirection = mouse.x >= this.#offsetLeftFromMouse * 2 + this.#length ? -1 : 1;
        const verticalDirection = mouse.y >= this.#offsetTopFromMouse * 2 + this.#length ? -1 : 1;
        let offset = horizontalDirection === -1 ? this.#offsetLeftFromMouse + this.#length : this.#offsetLeftFromMouse;
        this.#x = mouse.x + (offset * horizontalDirection);
        offset = verticalDirection === -1 ? this.#offsetTopFromMouse + this.#length : this.#offsetTopFromMouse;
        this.#y = mouse.y + (offset * verticalDirection);
    }
    draw(ctx, cell) {
        if (!debugBookletIsOn || cell === null)
            return;
        ctx.fillStyle = "gray";
        ctx.fillRect(this.#x, this.#y, this.#length, this.#length);
        // for (let i = 0; i < 10; i++) {
        //   ctx.fillStyle = "black";
        //   ctx.fillRect(this.#x + i * 15, this.#y, 1, this.#length);
        //   ctx.fillRect(this.#x, this.#y + i * 15, this.#length, 1);
        // }
        ctx.textAlign = this.#textalign;
        ctx.textBaseline = this.#textBaseline;
        ctx.font = this.#textSize + "px " + this.#textFont;
        ctx.fillStyle = this.#textColor;
        cell.drawDebug(ctx, this.#x, this.#y, this.#length, this.#textHOffset, this.#textVOffset);
    }
}
