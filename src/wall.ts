export const WALL_PERSENTAGE = 0.1;
export enum WallAnimation {
  FADEOUT,
  FADEIN,
  STOPPED,
}

export enum wallState {
  PRESENT = 1,
  ABSENT = -1,
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

type color = {
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
  #animation: WallAnimation = WallAnimation.STOPPED;
  #targetedAlpha: number = 1;
  #color: color = {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  };

  #calculateLength: (currentlength: number) => number;
  #calculateWidth: (currentlength: number) => number;

  constructor() {}

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

    this.#x = (cellx + (offsetWidth * wallMoves[pos].xcornerOffset)) + (wallMoves[pos].xd * (currentCellLength * (1 - WALL_PERSENTAGE)));
    //NOTE - this is where we are so far
  }
}
