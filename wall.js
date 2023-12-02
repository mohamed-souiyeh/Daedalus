
export const WALL_PERSENTAGE = 0.12;
export const FADEOUT = 0;
export const FADEIN  = 1;
export const STOPPED = 2;
export const PRESENT = 1;
export const ABSENT  = -1;

export const wallMoves = [
  {
    xd: 0, yd: 0,
    cl: (currentlength) => { return currentlength - (currentlength * (WALL_PERSENTAGE * 2)) },
    cw: (currentlength) => { return currentlength * WALL_PERSENTAGE },
    xcornerOffset: 1, ycornerOffset: 0,
  },
  {
    xd: 1, yd: 0,
    cl: (currentlength) => { return currentlength * WALL_PERSENTAGE },
    cw: (currentlength) => { return currentlength - (currentlength * (WALL_PERSENTAGE * 2)) },
    xcornerOffset: 0, ycornerOffset: 1,
  },
  {
    xd: 0, yd: 1,
    cl: (currentlength) => { return currentlength - (currentlength * (WALL_PERSENTAGE * 2)) },
    cw: (currentlength) => { return currentlength * WALL_PERSENTAGE },
    xcornerOffset: 1, ycornerOffset: 0,
  },
  {
    xd: 0, yd: 0,
    cl: (currentlength) => { return currentlength * WALL_PERSENTAGE },
    cw: (currentlength) => { return currentlength - (currentlength * (WALL_PERSENTAGE * 2)) },
    xcornerOffset: 0, ycornerOffset: 1,
  },
];

export class Wall {

  x;
  y;
  length;
  width;
  
  posInCell;
  
  state = PRESENT;
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
    
    this.calculateLength = wallMoves[pos].cl;
    this.calculateWidth  = wallMoves[pos].cw;
    this.length = this.calculateLength(currentCellLength);
    this.width  = this.calculateWidth(currentCellLength);
    
    let offsetWidth = this.length < this.width ? this.length : this.width;

    this.x = (cellx + (offsetWidth * wallMoves[pos].xcornerOffset)) + (wallMoves[pos].xd * (currentCellLength * (1 - WALL_PERSENTAGE)));
    this.y = (celly + (offsetWidth * wallMoves[pos].ycornerOffset)) + (wallMoves[pos].yd * (currentCellLength * (1 - WALL_PERSENTAGE)));

    this.color  = color;
    this.color.alpha = state == PRESENT ? 0 : 1;
    this.animation = state == PRESENT ? FADEIN : FADEOUT;
    this.state = state;

    console.log("wall created");
    this.debug();
  }

  debug() {
    console.log("---------------------");
    console.log("wall debug");
    console.log("x: ", this.x, "y: ", this.y, "length: ", this.length, "width: ", this.width);
    console.log("pos: ", this.posInCell, "color: ", this.color);
    console.log("state: ", this.state, "animation: ", this.animation);
    console.log("---------------------");
  }

  setWallState(state) {
    this.state = state;
    this.animation = state == PRESENT ? FADEIN : FADEOUT;
  }

  update(cellCurrentx, cellCurrenty, currentlength, alpha) {
    this.length = this.calculateLength(currentlength);
    this.width  = this.calculateWidth(currentlength);

    let offsetWidth = this.length < this.width ? this.length : this.width;

    this.x = (cellCurrentx + (offsetWidth * wallMoves[this.posInCell].xcornerOffset)) + (wallMoves[this.posInCell].xd * (currentlength * (1 - WALL_PERSENTAGE)));
    this.y = (cellCurrenty + (offsetWidth * wallMoves[this.posInCell].ycornerOffset)) + (wallMoves[this.posInCell].yd * (currentlength * (1 - WALL_PERSENTAGE)));

    this.color.alpha = alpha;
  }


  draw(ctx, ctx2) {
    // console.log("drawing wall");
    // this.debug();
  
    ctx.beginPath();
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.alpha})`;
    // ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.alpha})`;
    ctx.rect(this.x, this.y, this.length, this.width);
    ctx.fill();
    // ctx.stroke();
    // ctx.closePath();
  }
}