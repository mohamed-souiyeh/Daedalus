import { Cell } from "./cell.js";
import { Grid } from "./grid.js";
import { debugModeOn, debugBookletIsOn, mouse, currentdebugPageIndex } from "./input.js";


const DEBUGGERCOLOR = "gray";

export class Debuger {
  #x: number = 0;
  #y: number = 0;
  static size: number = 250;


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
    const horizontalDirection = mouse.x >= this.#offsetLeftFromMouse * 2 + Debuger.size ? -1 : 1;
    const verticalDirection = mouse.y >= this.#offsetTopFromMouse * 2 + Debuger.size ? -1 : 1;

    let offset = horizontalDirection === -1 ? this.#offsetLeftFromMouse + Debuger.size : this.#offsetLeftFromMouse;

    this.#x = mouse.x + (offset * horizontalDirection);

    offset = verticalDirection === -1 ? this.#offsetTopFromMouse + Debuger.size : this.#offsetTopFromMouse;
    this.#y = mouse.y + (offset * verticalDirection);
  }


  drawline(ctx: CanvasRenderingContext2D, x1: number, y1: number, xl: number, yl: number) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(xl, yl);
    ctx.stroke();
    ctx.closePath();
  }


  gridInfo(ctx: CanvasRenderingContext2D, grid: Grid) {
    const title = "-- Grid Info --";
    const xoffset = Debuger.size / 2 - ctx.measureText(title).width / 2;

    ctx.fillText(title, this.#x + xoffset, this.#y + this.#textVOffset);

    const gridInfo = `Length: ${grid.length} | Width: ${grid.width} | Size: ${grid.size()}`;
    const xoffset2 = (Debuger.size - ctx.measureText(gridInfo).width) / 2;

    ctx.fillText(gridInfo, this.#x + xoffset2, this.#y + this.#textVOffset * 4 + this.#textSize);

    const gridInfo2 = `Start: x ${grid.startX}, y ${grid.startY} | Offsets: h ${grid.offsetLeft}, v ${grid.offsetTop}`;
    const xoffset3 = (Debuger.size - ctx.measureText(gridInfo2).width) / 2;

    ctx.fillText(gridInfo2, this.#x + xoffset3, this.#y + this.#textVOffset * 8 + this.#textSize * 2);
  }

  drawNumberInCenterOfRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, number: number) {
    const xoffset = width / 2 - ctx.measureText(number.toString()).width / 2;
    const yoffset = height / 2 - this.#textSize / 2;

    ctx.fillText(number.toString(), x + xoffset, y + yoffset);
  }

  drawCellDiagram(ctx: CanvasRenderingContext2D) {
    const cellSize = (Debuger.size - (this.#textVOffset * 10 + this.#textSize * 3)) - (this.#textSize + this.#textVOffset * 2);
    const xoffset = (Debuger.size - cellSize) / 2;

    const cellx = this.#x + xoffset;
    const celly = this.#y + this.#textVOffset * 10 + this.#textSize * 3;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(cellx, celly, cellSize, cellSize);


    const wallPercentage = 0.25;

    this.drawNumberInCenterOfRect(ctx, cellx, celly, cellSize * wallPercentage, cellSize * wallPercentage, 7);

    this.drawNumberInCenterOfRect(ctx, cellx, celly + cellSize * wallPercentage, cellSize * wallPercentage, cellSize * (wallPercentage * 2), 4);

    let x = cellx + cellSize * wallPercentage;
    let y = celly;

    this.drawNumberInCenterOfRect(ctx, x, y, cellSize * (wallPercentage * 2), cellSize * wallPercentage, 8);
    this.drawNumberInCenterOfRect(ctx, x, y + cellSize * wallPercentage, cellSize * (wallPercentage * 2), cellSize * (wallPercentage * 2), 5);

    this.drawline(ctx, x, y, x, y + cellSize);


    x = cellx + cellSize * (1 - wallPercentage);
    y = celly;

    this.drawNumberInCenterOfRect(ctx, x, y, cellSize * wallPercentage, cellSize * wallPercentage, 9);

    this.drawNumberInCenterOfRect(ctx, x, y + cellSize * wallPercentage, cellSize * wallPercentage, cellSize * (wallPercentage * 2), 6);

    this.drawline(ctx, x, y, x, y + cellSize);

    x = cellx;
    y = celly + cellSize * wallPercentage;


    this.drawline(ctx, x, y, x + cellSize, y);


    x = cellx;
    y = celly + cellSize * (1 - wallPercentage);

    this.drawNumberInCenterOfRect(ctx, x, y, cellSize * wallPercentage, cellSize * wallPercentage, 1);

    this.drawNumberInCenterOfRect(ctx, x + cellSize * wallPercentage, y, cellSize * (wallPercentage * 2), cellSize * wallPercentage, 2);

    this.drawNumberInCenterOfRect(ctx, x + cellSize * (1 - wallPercentage), y, cellSize * wallPercentage, cellSize * wallPercentage, 3);

    this.drawline(ctx, x, y, x + cellSize, y);
  }

  public draw(ctx: CanvasRenderingContext2D, cell: Cell | null, grid: Grid) {
    if (!debugBookletIsOn || cell === null) return;
    ctx.fillStyle = DEBUGGERCOLOR;
    ctx.fillRect(this.#x, this.#y, Debuger.size, Debuger.size);
    
    //NOTE - styling the text
    ctx.textAlign = this.#textalign;
    ctx.textBaseline = this.#textBaseline;
    ctx.font = this.#textSize + "px " + this.#textFont;
    ctx.fillStyle = this.#textColor;

    // NOTE - writing the page index on debugger page
    const xoffset = Debuger.size / 2 - ctx.measureText(`-- x --`).width / 2;
    const yoffset = Debuger.size - this.#textSize - this.#textVOffset;

    ctx.fillText(`-- ${currentdebugPageIndex} --`, this.#x + xoffset, this.#y + yoffset);
    
    
    if (currentdebugPageIndex === 0) {
      
      this.gridInfo(ctx, grid);
      this.drawCellDiagram(ctx);
    }
    else {
      cell.drawDebug(ctx, this.#x, this.#y, Debuger.size, this.#textHOffset, this.#textVOffset);
    }

  }

}