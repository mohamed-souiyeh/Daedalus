
export const WALL_PERSENTAGE = 0.12;
export const FADEOUT = 0;
export const FADEIN  = 1;
export const STOPPED = 2;
export const PRESENT = 1;
export const ABSENT  = -1;

export const wallMoves = [
  {
    xd: 0, yd: 0,
    cl: (currentlength) => { return currentlength },
    cw: (currentlength) => { return currentlength * WALL_PERSENTAGE }
  },
  {
    xd: 1, yd: 0,
    cl: (currentlength) => { return currentlength * WALL_PERSENTAGE },
    cw: (currentlength) => { return currentlength }
  },
  {
    xd: 0, yd: 1,
    cl: (currentlength) => { return currentlength },
    cw: (currentlength) => { return currentlength * WALL_PERSENTAGE }
  },
  {
    xd: 0, yd: 0,
    cl: (currentlength) => { return currentlength * WALL_PERSENTAGE },
    cw: (currentlength) => { return currentlength }
  },
];

export class Wall {

  state;
  x;
  y;
  length;
  width;
  
  posInCell;

  animation = STOPPED;
  color = {
    r: 0,
    g: 0,
    b: 0,
    alpha: 1,
  };

  calculateLength;
  calculateWidth;
  
  constructor(pos, cellx, celly, currentCellLength, color, state = PRESENT) {
    this.posInCell = pos;
    this.x = cellx + (wallMoves[pos].xd * (currentCellLength * (1 - WALL_PERSENTAGE)));
    this.y = celly + (wallMoves[pos].yd * (currentCellLength * (1 - WALL_PERSENTAGE)));

    this.calculateLength = wallMoves[pos].cl;
    this.calculateWidth  = wallMoves[pos].cw;
    this.length = this.calculateLength(currentCellLength);
    this.width  = this.calculateWidth(currentCellLength);
    this.color  = color;
    this.color.alpha = state == PRESENT ? 0 : 1;
    this.animation = state == PRESENT ? FADEIN : FADEOUT;
    this.state = state;
  }

  debug() {
    console.log("wall debug");
    console.log("x: ", this.x, "y: ", this.y, "length: ", this.length, "width: ", this.width);
    console.log("pos: ", this.posInCell, "color: ", this.color);
    console.log("---------------------");
  }

  setWallState(state) {
    this.state = state;
    this.animation = state == PRESENT ? FADEIN : FADEOUT;
  }

  update(cellCurrentx, cellCurrenty, currentlength, alpha) {
    this.x = cellCurrentx + (wallMoves[this.posInCell].xd * (currentlength * (1 - WALL_PERSENTAGE)));
    this.y = cellCurrenty + (wallMoves[this.posInCell].yd * (currentlength * (1 - WALL_PERSENTAGE)));

    this.length = this.calculateLength(currentlength);
    this.width  = this.calculateWidth(currentlength);
    this.color.alpha = alpha;
  }


  draw(ctx) {
    // console.log("drawing wall");
    // this.debug();

    ctx.beginPath();
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.alpha})`;
    ctx.fillRect(this.x, this.y, this.length, this.width);
    ctx.fill();
  }
}