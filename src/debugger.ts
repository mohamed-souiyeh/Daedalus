import { debugModeOn, debugRect, mouse } from "./input.js";


export class Debuger {
  #x: number = 0;
  #y: number = 0;
  #length: number = 200;


  #textHOffset: number = 5;
  #textVOffset: number = 5;
  #textSize: number = 15;
  #textFont: string = "Arial";
  #textColor: string = "black";
  #textalign: CanvasTextAlign = "left";
  #textBaseline: CanvasTextBaseline = "top";



  #offsetLeftFromMouse: number = 10;
  #offsetTopFromMouse: number = 10;


  constructor() { }

  public update(mousex: number, mousey: number) {
    const horizontalDirection = mousex >= this.#offsetLeftFromMouse * 2 + this.#length ? -1 : 1;
    const verticalDirection = mousey >= this.#offsetTopFromMouse * 2 + this.#length ? -1 : 1;

    let offset = horizontalDirection === -1 ? this.#offsetLeftFromMouse + this.#length : this.#offsetLeftFromMouse;

    this.#x = mousex + (offset * horizontalDirection);

    offset = verticalDirection === -1 ? this.#offsetTopFromMouse + this.#length : this.#offsetTopFromMouse;
    this.#y = mousey + (offset * verticalDirection);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (!debugRect) return;
    ctx.fillStyle = "gray";
    ctx.fillRect(this.#x, this.#y, this.#length, this.#length);

    ctx.textAlign = this.#textalign;
    ctx.textBaseline = this.#textBaseline;
    ctx.font = this.#textSize + "px " + this.#textFont;
    ctx.fillStyle = this.#textColor;
    ctx.fillText("hello world!", this.#x + this.#textHOffset, this.#y + this.#textVOffset);
  }

}