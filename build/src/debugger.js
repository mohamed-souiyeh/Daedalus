import { debugRect } from "./input.js";
export class Debuger {
    #x = 0;
    #y = 0;
    #length = 200;
    #textHOffset = 5;
    #textVOffset = 5;
    #textSize = 15;
    #textFont = "Arial";
    #textColor = "black";
    #textalign = "left";
    #textBaseline = "top";
    #offsetLeftFromMouse = 10;
    #offsetTopFromMouse = 10;
    constructor() { }
    update(mousex, mousey) {
        const horizontalDirection = mousex >= this.#offsetLeftFromMouse * 2 + this.#length ? -1 : 1;
        const verticalDirection = mousey >= this.#offsetTopFromMouse * 2 + this.#length ? -1 : 1;
        let offset = horizontalDirection === -1 ? this.#offsetLeftFromMouse + this.#length : this.#offsetLeftFromMouse;
        this.#x = mousex + (offset * horizontalDirection);
        offset = verticalDirection === -1 ? this.#offsetTopFromMouse + this.#length : this.#offsetTopFromMouse;
        this.#y = mousey + (offset * verticalDirection);
    }
    draw(ctx) {
        if (!debugRect)
            return;
        ctx.fillStyle = "gray";
        ctx.fillRect(this.#x, this.#y, this.#length, this.#length);
        ctx.textAlign = this.#textalign;
        ctx.textBaseline = this.#textBaseline;
        ctx.font = this.#textSize + "px " + this.#textFont;
        ctx.fillStyle = this.#textColor;
        ctx.fillText("hello world!", this.#x + this.#textHOffset, this.#y + this.#textVOffset);
    }
}
