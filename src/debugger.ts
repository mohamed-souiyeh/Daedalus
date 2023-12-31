import { resetShadowStyle, setShadowStyle } from "./canvas_ctx_style_manipulation/shadows.js";
import { setTextStyle } from "./canvas_ctx_style_manipulation/text.js";
import { Cell } from "./cell.js";
import { CornerDirections, Directions } from "./configs/cell.config.js";
import { pageIndexs } from "./configs/defaults.js";
import { mouse } from "./configs/input.config.js";
import { Grid } from "./grid.js";
import { debugBookletIsOn, currentdebugPageIndex } from "./input.js";


const DEBUGGERCOLOR = "gray";
const SHADOWCOLOR = "gold";

let current_line = 0;

const CordAndPags: Map<number, number> = new Map([
  [8, Directions.NORTH as number],
  [2, Directions.SOUTH as number],
  [6, Directions.EAST as number],
  [4, Directions.WEST as number],
  [9, CornerDirections.NORTHEAST as number],
  [7, CornerDirections.NORTHWEST as number],
  [3, CornerDirections.SOUTHEAST as number],
  [1, CornerDirections.SOUTHWEST as number],
])

enum directions {
  UP = -1,
  DOWN = 1,
  LEFT = -1,
  RIGHT = 1,
}

export class Debuger {
  #x: number = 0;
  #y: number = 0;

  static length: number = 0;
  static width: number = 0;

  static textHOffset: number = 5;
  static textVOffset: number = 5;
  static textSize: number = 15;
  static textFont: string = "Arial";
  static textColor: string = "black";
  static textalign: CanvasTextAlign = "left";
  static textBaseline: CanvasTextBaseline = "top";



  #offsetLeftFromMouse: number = 5;
  #offsetTopFromMouse: number = 5;


  constructor() { }

  public update() {
    const horizontalDirection = mouse.x >= this.#offsetLeftFromMouse * 2 + Debuger.length ? directions.LEFT : directions.RIGHT;
    const verticalDirection = mouse.y >= this.#offsetTopFromMouse * 2 + Debuger.width ? directions.UP : directions.DOWN;

    let offset = horizontalDirection === directions.LEFT ? this.#offsetLeftFromMouse + Debuger.length : this.#offsetLeftFromMouse;

    this.#x = mouse.x + (offset * horizontalDirection);

    offset = verticalDirection === directions.UP ? this.#offsetTopFromMouse + Debuger.width : this.#offsetTopFromMouse;

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
    let xoffset = Debuger.length / 2 - ctx.measureText(title).width / 2;
    let yoffset = Debuger.textVOffset;

    ctx.fillText(title, this.#x + xoffset, this.#y + yoffset);
    current_line++;

    let gridInfo = `Length: ${grid.length} | Width: ${grid.width} | Size: ${grid.size()}`;
    xoffset = (Debuger.length - ctx.measureText(gridInfo).width) / 2;
    yoffset += Debuger.textVOffset + Debuger.textSize;

    ctx.fillText(gridInfo, this.#x + xoffset, this.#y + yoffset);
    current_line++;

    gridInfo = `Start: x ${grid.startX}, y ${grid.startY} | Offsets: h ${grid.offsetLeft}, v ${grid.offsetTop}`;
    xoffset = (Debuger.length - ctx.measureText(gridInfo).width) / 2;
    yoffset += Debuger.textVOffset + Debuger.textSize;

    ctx.fillText(gridInfo, this.#x + xoffset, this.#y + yoffset);
    current_line++;
  }

  drawNumberInCenterOfRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, number: number) {
    const xoffset = width / 2 - ctx.measureText(number.toString()).width / 2;
    const yoffset = height / 2 - Debuger.textSize / 2;

    ctx.fillText(number.toString(), x + xoffset, y + yoffset);
  }

  drawCellDiagram(ctx: CanvasRenderingContext2D) {

    const title = "-- Cell Diagram --";

    let xoffset = Debuger.length / 2 - ctx.measureText(title).width / 2;
    let yoffset = Debuger.textVOffset;


    //NOTE - stupid calibration
    yoffset += (Debuger.textVOffset * (current_line) + Debuger.textSize * current_line);

    ctx.fillText(title, this.#x + xoffset, this.#y + yoffset);
    current_line++;



    const size = Debuger.width;

    const cellSize = (size - ((yoffset + Debuger.textSize + Debuger.textVOffset) + (Debuger.textSize + Debuger.textVOffset * 2))) - 10;// - 10 is for the padding


    xoffset = (Debuger.length - cellSize) / 2;

    const cellx = this.#x + xoffset;
    const celly = (this.#y + (yoffset + Debuger.textSize + Debuger.textVOffset)) + 5;

    current_line = 0;

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

    setShadowStyle(ctx, { blur: 10, color: SHADOWCOLOR })

    ctx.fillRect(this.#x, this.#y, Debuger.length, Debuger.width);

    resetShadowStyle(ctx);

    setTextStyle(ctx, { textAlign: Debuger.textalign, textBaseline: Debuger.textBaseline, font: Debuger.textSize + "px " + Debuger.textFont, fillStyle: Debuger.textColor })

    // NOTE - writing the page index on debugger page
    const xoffset = Debuger.length / 2 - ctx.measureText(`-- x --`).width / 2;
    const yoffset = Debuger.width - Debuger.textSize - Debuger.textVOffset;

    ctx.fillText(`-- ${currentdebugPageIndex} --`, this.#x + xoffset, this.#y + yoffset);


    if (currentdebugPageIndex === pageIndexs.summary) {

      this.gridInfo(ctx, grid);
      this.drawCellDiagram(ctx);
      current_line = 0;
    }
    else {
      cell.drawDebug(ctx, this.#x, this.#y, CordAndPags.get(currentdebugPageIndex) as number);
    }

  }

}