import { WALLCOLOR, WALL_PERSENTAGE, WALL_TARGETEDALPHA, WallAnimation, wallState } from "./configs/wall.config.js";
import { Debuger } from "./debugger.js";
import { color } from "./types/color.type.js";



let current_line = 0;

const wallMoves = [
  {
    xd: 0,
    yd: 0,
    cl: (currentlength: number) => {
      return currentlength - currentlength * (WALL_PERSENTAGE * 2);
    },
    cw: (currentlength: number) => {
      return currentlength * WALL_PERSENTAGE;
    },
    xcornerOffset: 1,
    ycornerOffset: 0,
  },
  {
    xd: 1,
    yd: 0,
    cl: (currentlength: number) => {
      return currentlength * WALL_PERSENTAGE;
    },
    cw: (currentlength: number) => {
      return currentlength - currentlength * (WALL_PERSENTAGE * 2);
    },
    xcornerOffset: 0,
    ycornerOffset: 1,
  },
  {
    xd: 0,
    yd: 1,
    cl: (currentlength: number) => {
      return currentlength - currentlength * (WALL_PERSENTAGE * 2);
    },
    cw: (currentlength: number) => {
      return currentlength * WALL_PERSENTAGE;
    },
    xcornerOffset: 1,
    ycornerOffset: 0,
  },
  {
    xd: 0,
    yd: 0,
    cl: (currentlength: number) => {
      return currentlength * WALL_PERSENTAGE;
    },
    cw: (currentlength: number) => {
      return currentlength - currentlength * (WALL_PERSENTAGE * 2);
    },
    xcornerOffset: 0,
    ycornerOffset: 1,
  },
];



export class Wall {

  static debugPageLength: number;
  static debugPageWidth: number;


  #x: number;
  #y: number;
  #posInCell: number;

  #length: number;
  #width: number;

  #state: wallState = wallState.PRESENT;
  #animation: WallAnimation = WallAnimation.FADEIN;
  #targetedAlpha: number = WALL_TARGETEDALPHA;
  #color: color = Object.create(WALLCOLOR);

  #calculateLength: (currentlength: number) => number;
  #calculateWidth: (currentlength: number) => number;

  //SECTION - initialization methods
  constructor() { }

  #initState = (state: wallState) => {
    this.#state = state;
    this.#color.a = state === wallState.PRESENT ? 0 : WALL_TARGETEDALPHA;

    this.#setAnimationAndTAlpha(state);
  };

  public init(
    pos: number,
    cellx: number,
    celly: number,
    currentCellLength: number,
    color: color,
    state: wallState
  ) {
    this.#posInCell = pos;
    this.#calculateLength = wallMoves[pos].cl;
    this.#calculateWidth = wallMoves[pos].cw;

    this.#length = this.#calculateLength(currentCellLength);
    this.#width = this.#calculateWidth(currentCellLength);

    let offsetWidth = this.#length < this.#width ? this.#length : this.#width;

    this.#x =
      cellx +
      offsetWidth * wallMoves[pos].xcornerOffset +
      wallMoves[pos].xd * (currentCellLength * (1 - WALL_PERSENTAGE));
    this.#y =
      celly +
      offsetWidth * wallMoves[pos].ycornerOffset +
      wallMoves[pos].yd * (currentCellLength * (1 - WALL_PERSENTAGE));

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

  #setAnimationAndTAlpha = (state: wallState) => {
    this.#targetedAlpha = state === wallState.PRESENT ? WALL_TARGETEDALPHA : 0;
    this.#animation =
      state === wallState.PRESENT
        ? WallAnimation.FADEIN
        : WallAnimation.FADEOUT;
  };

  public setWallState(state: wallState) {
    if (state === this.#state) return false;

    this.#state = state;
    this.#setAnimationAndTAlpha(state);
    return true;
  }

  public setStoppedAnimationRequirements() {
    this.#animation = WallAnimation.STOPPED;
    this.#color.a = this.#targetedAlpha;
  }

  //!SECTION

  //SECTION - animation methods

  public update(
    cellCurrentx: number,
    cellCurrenty: number,
    currentCellLength: number,
    alpha: number
  ) {
    this.#length = this.#calculateLength(currentCellLength);
    this.#width = this.#calculateWidth(currentCellLength);

    let offsetWidth = this.#length < this.#width ? this.#length : this.#width;

    this.#x =
      cellCurrentx +
      offsetWidth * wallMoves[this.#posInCell].xcornerOffset +
      wallMoves[this.#posInCell].xd * (currentCellLength * (1 - WALL_PERSENTAGE));
    this.#y =
      cellCurrenty +
      offsetWidth * wallMoves[this.#posInCell].ycornerOffset +
      wallMoves[this.#posInCell].yd * (currentCellLength * (1 - WALL_PERSENTAGE));
    this.#color.a = alpha;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(${this.#color.r},${this.#color.g},${this.#color.b},${this.#color.a})`;
    ctx.fillRect(this.#x, this.#y, this.#length, this.#width);
  }
  //!SECTION

  //SECTION - debug methods

  drawTitle(ctx: CanvasRenderingContext2D, startx: number, starty: number) {
    const title = `-- Wall Info --`;

    const xoffset = Debuger.d_length / 2 - ctx.measureText(title).width / 2;
    const yoffset = Debuger.textVOffset;

    ctx.fillText(title, startx + xoffset, starty + yoffset);
    current_line++;
  }

  public drawDebug(ctx: CanvasRenderingContext2D, startx: number, starty: number) {
    const directions = ["N", "E", "S", "W"];
    const wallStates = ["A", "P"];
    const wallAnimation = ["FADEOUT", "FADEIN", "STOPPED"];

    let yoffset = Debuger.textVOffset;

    this.drawTitle(ctx, startx, starty);

    let wallInfo = `x: ${this.#x.toFixed(3)}      |   y: ${this.#y.toFixed(3)}`


    let xoffset = Debuger.textHOffset;
    yoffset += Debuger.textVOffset * (current_line) + Debuger.textSize * current_line;;

    ctx.fillText(wallInfo, startx + xoffset, starty + yoffset);
    current_line++;


    wallInfo = `Length: ${this.#length.toFixed(3)} |   Width: ${this.#width.toFixed(3)}`


    xoffset = Debuger.textHOffset;
    yoffset += Debuger.textVOffset + Debuger.textSize;

    ctx.fillText(wallInfo, startx + xoffset, starty + yoffset);
    current_line++;

    wallInfo = `Pos: ${directions[this.#posInCell]}           |   State: ${wallStates[this.#state]}`

    xoffset = Debuger.textHOffset;
    yoffset += Debuger.textVOffset + Debuger.textSize;

    ctx.fillText(wallInfo, startx + xoffset, starty + yoffset);
    current_line++;


    wallInfo = `Animation: ${wallAnimation[this.#animation]} | TAlpha: ${this.#targetedAlpha}`;

    xoffset = Debuger.textHOffset;
    yoffset += Debuger.textVOffset + Debuger.textSize;

    ctx.fillText(wallInfo, startx + xoffset, starty + yoffset);
    current_line++;

    wallInfo = `color: rgba(${this.#color.r.toFixed(2)}, ${this.#color.g.toFixed(2)}, ${this.#color.b.toFixed(2)}, ${this.#color.a.toFixed(2)})`;

    xoffset = Debuger.textHOffset;
    yoffset += Debuger.textVOffset + Debuger.textSize;

    ctx.fillText(wallInfo, startx + xoffset, starty + yoffset);


    current_line = 0;

  }

  //!SECTION - debug methods

}
