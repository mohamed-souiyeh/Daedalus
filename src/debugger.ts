import { Cell } from "./cell.js";
import { debugModeOn, debugBookletIsOn, mouse } from "./input.js";


export class Debuger {
  #x: number = 0;
  #y: number = 0;
  #length: number = 250;


  #textHOffset: number = 5;
  #textVOffset: number = 2;
  #textSize: number = 15;
  #textFont: string = "Arial";
  #textColor: string = "black";
  #textalign: CanvasTextAlign = "left";
  #textBaseline: CanvasTextBaseline = "top";



  #offsetLeftFromMouse: number = 5;
  #offsetTopFromMouse: number = 5;


  constructor() { }

  public update() {
    const horizontalDirection = mouse.x >= this.#offsetLeftFromMouse * 2 + this.#length ? -1 : 1;
    const verticalDirection = mouse.y >= this.#offsetTopFromMouse * 2 + this.#length ? -1 : 1;

    let offset = horizontalDirection === -1 ? this.#offsetLeftFromMouse + this.#length : this.#offsetLeftFromMouse;

    this.#x = mouse.x + (offset * horizontalDirection);

    offset = verticalDirection === -1 ? this.#offsetTopFromMouse + this.#length : this.#offsetTopFromMouse;
    this.#y = mouse.y + (offset * verticalDirection);
  }

  public draw(ctx: CanvasRenderingContext2D, cell: Cell | null) {
    if (!debugBookletIsOn || cell === null) return;
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