import { CORNERCOLOR } from "./configs/corner.config.ts";
import { WALL_PERSENTAGE, WallAnimation, WallState } from "./configs/wall.config.ts";
import { Debuger } from "./debugger.ts";
import { color } from "./types/color.type.ts";

const CELLTARGETEDALPHA = 1;
let current_line = 1;

const calculateWidth = (currentlength: number) => {
  return currentlength * WALL_PERSENTAGE;
};

const cornerMoves = [
  {
    xd: 0,
    yd: 0,
    xcornerOffset: 0,
    ycornerOffset: 0,
  },
  {
    xd: 1,
    yd: 0,
    xcornerOffset: 0,
    ycornerOffset: 0,
  },
  {
    xd: 1,
    yd: 1,
    xcornerOffset: 0,
    ycornerOffset: 0,
  },
  {
    xd: 0,
    yd: 1,
    xcornerOffset: 0,
    ycornerOffset: 0,
  },
];



export class Corner {

  static debugPageLength: number;
  static debugPageWidth: number;


  #x: number;
  #y: number;
  #posInCell: number;

  #length: number;
  #width: number;

  #state: WallState = WallState.PRESENT;
  #animation: number = WallAnimation.FADEIN;
  #targetedAlpha: number = CELLTARGETEDALPHA;
  #color: color = CORNERCOLOR;


  //SECTION - initialization methods
  constructor() { }

  #initState = (state: WallState) => {
    this.#state = state;
    this.#targetedAlpha = state === WallState.PRESENT ? 0 : 1;

    this.#setAnimationAndTAlpha(state);
  }

  public init(
    pos: number,
    cellx: number,
    celly: number,
    currentCellLength: number,
    color: color,
    state: WallState
  ) {
    this.#posInCell = pos;
    this.#length = calculateWidth(currentCellLength);
    this.#width = calculateWidth(currentCellLength);

    this.#x =
      cellx + cornerMoves[pos].xd * (currentCellLength * (1 - WALL_PERSENTAGE));
    this.#y =
      celly + cornerMoves[pos].yd * (currentCellLength * (1 - WALL_PERSENTAGE));

    this.#color = color;

    this.#initState(state);
  }
  //!SECTION

  //SECTION - getters and setters

  getState() {
    return this.#state;
  }

  getAnimation() {
    return this.#animation;
  }

  getTargetedAlpha() {
    return this.#targetedAlpha;
  }

  #setAnimationAndTAlpha = (state: WallState) => {
    this.#targetedAlpha = state === WallState.PRESENT ? CELLTARGETEDALPHA : 0;

    this.#animation =
      state === WallState.PRESENT
        ? WallAnimation.FADEIN
        : WallAnimation.FADEOUT;
  };

  public setcornerState(state: WallState) {
    if (this.#state === state) return;

    this.#state = state;
    this.#setAnimationAndTAlpha(state);
  }

  public setStoppingAnimationRequirements() {
    this.#animation = WallAnimation.STOPPING;
    this.#color.a = this.#targetedAlpha;
  }

  public setStoppedAnimationRequirements() {
    this.#animation = WallAnimation.STOPPED;
    this.#color.a = this.#targetedAlpha;
  }
  //!SECTION

  //SECTION - animation methods

  public update(cellCurrentx: number, cellCurrenty: number, cellCurrentLength: number, alpha: number) {
    this.#length = calculateWidth(cellCurrentLength);
    this.#width = calculateWidth(cellCurrentLength);

    this.#x =
      cellCurrentx +
      cornerMoves[this.#posInCell].xd *
      (cellCurrentLength * (1 - WALL_PERSENTAGE));
    this.#y =
      cellCurrenty +
      cornerMoves[this.#posInCell].yd *
      (cellCurrentLength * (1 - WALL_PERSENTAGE));

    this.#color.a = alpha;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(${this.#color.r},${this.#color.g},${this.#color.b},${this.#color.a
      })`;
    ctx.fillRect(this.#x, this.#y, this.#length, this.#width);
  }

  private drawTitle(ctx: CanvasRenderingContext2D, startx: number, starty: number) {
    const title = `-- Corner Info --`;

    const xoffset = Debuger.d_length / 2 - ctx.measureText(title).width / 2;
    const yoffset = Debuger.textVOffset;

    ctx.fillText(title, startx + xoffset, starty + yoffset);
    current_line++;
  }

  public drawDebug(ctx: CanvasRenderingContext2D, startx: number, starty: number) {
    const cornerDirections = ["NW", "NE", "SE", "SW"];
    const wallStates = ["A", "P"];
    const wallAnimation = ["FADEOUT", "FADEIN", "STOPPED"];


    let yoffset = Debuger.textVOffset;

    this.drawTitle(ctx, startx, starty);

    let cornerInfo = `x: ${this.#x.toFixed(3)}      |   y: ${this.#y.toFixed(3)}`


    let xoffset = Debuger.textHOffset;
    yoffset += Debuger.textVOffset * (current_line) + Debuger.textSize * current_line;;

    ctx.fillText(cornerInfo, startx + xoffset, starty + yoffset);
    current_line++;


    cornerInfo = `Length: ${this.#length.toFixed(3)} |   Width: ${this.#width.toFixed(3)}`


    xoffset = Debuger.textHOffset;
    yoffset += Debuger.textVOffset + Debuger.textSize;

    ctx.fillText(cornerInfo, startx + xoffset, starty + yoffset);
    current_line++;

    cornerInfo = `Pos: ${cornerDirections[this.#posInCell]}         |   State: ${wallStates[this.#state]}`

    xoffset = Debuger.textHOffset;
    yoffset += Debuger.textVOffset + Debuger.textSize;

    ctx.fillText(cornerInfo, startx + xoffset, starty + yoffset);
    current_line++;


    cornerInfo = `Animation: ${wallAnimation[this.#animation]} | TAlpha: ${this.#targetedAlpha}`;

    xoffset = Debuger.textHOffset;
    yoffset += Debuger.textVOffset + Debuger.textSize;

    ctx.fillText(cornerInfo, startx + xoffset, starty + yoffset);
    current_line++;

    cornerInfo = `color: rgba(${this.#color.r.toFixed(2)}, ${this.#color.g.toFixed(2)}, ${this.#color.b.toFixed(2)}, ${this.#color.a.toFixed(2)})`;

    xoffset = Debuger.textHOffset;
    yoffset += Debuger.textVOffset + Debuger.textSize;

    ctx.fillText(cornerInfo, startx + xoffset, starty + yoffset);


    current_line = 0;
  }
  //!SECTION
}
