import { WALL_PERSENTAGE, WallAnimation, color, wallState } from "./wall.js";

const CELLTARGETEDALPHA = 1;

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
  #x: number;
  #y: number;
  #posInCell: number;

  #length: number;
  #width: number;

  #state: wallState = wallState.PRESENT;
  #animation: number = WallAnimation.FADEIN;
  #targetedAlpha: number = CELLTARGETEDALPHA;
  #color: color = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  };


  //SECTION - initialization methods
  constructor() { }

  #initState = (state: wallState) => {
    this.#state = state;
    this.#targetedAlpha = state === wallState.PRESENT ? 0 : 1;

    this.#setAnimationAndTAlpha(state);
  }

  public init(
    pos: number,
    cellx: number,
    celly: number,
    currentCellLength: number,
    color: color,
    state: wallState
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

  #setAnimationAndTAlpha = (state: wallState) => {
    this.#targetedAlpha = state === wallState.PRESENT ? CELLTARGETEDALPHA : 0;

    this.#animation =
      state === wallState.PRESENT
        ? WallAnimation.FADEIN
        : WallAnimation.FADEOUT;
  };

  public setcornerState(state: wallState) {
    if (this.#state === state) return;

    this.#state = state;
    this.#setAnimationAndTAlpha(state);
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
  //!SECTION
}
