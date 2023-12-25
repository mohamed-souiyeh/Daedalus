
enum wallDefaults {
  WALL_PERSENTAGE = 0.1,
}


export const WALL_PERSENTAGE = wallDefaults.WALL_PERSENTAGE;
const WALL_TARGETEDALPHA = 1;
export enum WallAnimation {
  FADEOUT,
  FADEIN,
  STOPPED,
}

export enum wallState {
  ABSENT = 0,
  PRESENT = 1,
}

export const wallMoves = [
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

export type color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export class Wall {
  #posInCell: number;
  #x: number;
  #y: number;
  #length: number;
  #width: number;

  #state: wallState = wallState.PRESENT;
  #animation: WallAnimation = WallAnimation.FADEIN;
  #targetedAlpha: number = WALL_TARGETEDALPHA;
  #color: color = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  };

  #calculateLength: (currentlength: number) => number;
  #calculateWidth: (currentlength: number) => number;

//SECTION - initialization methods
  constructor() {}

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
// write a debug function that will print all the wall information
// to the console line by line in an organized manner
  public debug() {
    console.log(`pos: ${this.#posInCell}`);
    console.log(`x: ${this.#x}`);
    console.log(`y: ${this.#y}`);
    console.log(`length: ${this.#length}`);
    console.log(`width: ${this.#width}`);
    console.log(`state: ${this.#state}`);
    console.log(`animation: ${this.#animation}`);
    console.log(`targetedAlpha: ${this.#targetedAlpha}`);
    console.log(`color: `, this.#color);
  }
}
