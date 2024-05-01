import { resetShadowStyle, setShadowStyle } from "./canvas_ctx_style_manipulation/shadows.ts";
import { setTextStyle } from "./canvas_ctx_style_manipulation/text.ts";
import { Cell } from "./cell.ts";
import { CornerDirections, Directions } from "./configs/cell.config.ts";
import { pageIndexs } from "./configs/defaults.ts";
import { globals } from "./configs/globals.ts";
import { mouse } from "./configs/input.config.ts";
import { Grid } from "./grid.ts";



const DEBUGGERCOLOR = "rgba(113, 113, 122, 1)";
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

  static d_length: number = 0;
  static d_width: number = 0;

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
    const horizontalDirection = mouse.bx >= this.#offsetLeftFromMouse * 2 + Debuger.d_length ? directions.LEFT : directions.RIGHT;
    const verticalDirection = mouse.by >= this.#offsetTopFromMouse * 2 + Debuger.d_width ? directions.UP : directions.DOWN;

    let offset = horizontalDirection === directions.LEFT ? this.#offsetLeftFromMouse + Debuger.d_length : this.#offsetLeftFromMouse;

    this.#x = mouse.bx + (offset * horizontalDirection);

    offset = verticalDirection === directions.UP ? this.#offsetTopFromMouse + Debuger.d_width : this.#offsetTopFromMouse;

    this.#y = mouse.by + (offset * verticalDirection);
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
    let xoffset = Debuger.d_length / 2 - ctx.measureText(title).width / 2;
    let yoffset = Debuger.textVOffset;

    ctx.fillText(title, this.#x + xoffset, this.#y + yoffset);
    current_line++;

    let gridInfo = `Length: ${grid.length} | Width: ${grid.width} | Size: ${grid.size()}`;
    xoffset = (Debuger.d_length - ctx.measureText(gridInfo).width) / 2;
    yoffset += Debuger.textVOffset + Debuger.textSize;

    ctx.fillText(gridInfo, this.#x + xoffset, this.#y + yoffset);
    current_line++;

    gridInfo = `Start: x ${grid.startX}, y ${grid.startY} | Offsets: h ${grid.offsetLeft}, v ${grid.offsetTop}`;
    xoffset = (Debuger.d_length - ctx.measureText(gridInfo).width) / 2;
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

    let xoffset = Debuger.d_length / 2 - ctx.measureText(title).width / 2;
    let yoffset = Debuger.textVOffset;


    //NOTE - stupid calibration
    yoffset += (Debuger.textVOffset * (current_line) + Debuger.textSize * current_line);

    ctx.fillText(title, this.#x + xoffset, this.#y + yoffset);
    current_line++;



    const size = Debuger.d_width;

    const cellSize = (size - ((yoffset + Debuger.textSize + Debuger.textVOffset) + (Debuger.textSize + Debuger.textVOffset * 2))) - 10;// - 10 is for the padding


    xoffset = (Debuger.d_length - cellSize) / 2;

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
    if (!globals.debugBookletIsOn || cell === null) {
      // console.log("this is the cell: ", cell);
      // console.log("is booklet on?: ", globals.debugBookletIsOn);
      return;
    };


    ctx.fillStyle = DEBUGGERCOLOR;

    ctx.fillRect(this.#x, this.#y, Debuger.d_length, Debuger.d_width);

    setTextStyle(ctx, { textAlign: Debuger.textalign, textBaseline: Debuger.textBaseline, font: Debuger.textSize + "px " + Debuger.textFont, fillStyle: Debuger.textColor })

    // NOTE - writing the page index on debugger page
    const xoffset = Debuger.d_length / 2 - ctx.measureText(`-- x --`).width / 2;
    const yoffset = Debuger.d_width - Debuger.textSize - Debuger.textVOffset;

    ctx.fillText(`-- ${globals.currentdebugPageIndex} --`, this.#x + xoffset, this.#y + yoffset);


    if (globals.currentdebugPageIndex === pageIndexs.summary) {

      this.gridInfo(ctx, grid);
      this.drawCellDiagram(ctx);
      current_line = 0;
    }
    else {
      cell.drawDebug(ctx, this.#x, this.#y, CordAndPags.get(globals.currentdebugPageIndex) as number);
    }

  }

}
