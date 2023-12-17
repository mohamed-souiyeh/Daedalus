import { FADEIN, WALL_PERSENTAGE } from "../wall.js";

const calculateWidth = (currentlength) => { return currentlength * WALL_PERSENTAGE };

const cornerMoves = [
  {
    xd: 0, yd: 0,
    xcornerOffset: 0, ycornerOffset: 0,
  },
  {
    xd: 1, yd: 0,
    xcornerOffset: 0, ycornerOffset: 0,
  },
  {
    xd: 1, yd: 1,
    xcornerOffset: 0, ycornerOffset: 0,
  },
  {
    xd: 0, yd: 1,
    xcornerOffset: 0, ycornerOffset: 0,
  },

];

export class Corner {

  x;
  y;
  length;
  width;
  color = {
    r: 0,
    g: 0,
    b: 0,
    alpha: 1,
  };
  posInCell;
  animation = FADEIN;

  constructor() {}
  initialize(pos, cellx, celly, currentCellLength, color) {
    this.posInCell = pos;
    this.length = calculateWidth(currentCellLength);
    this.width  = calculateWidth(currentCellLength);

    this.x = cellx + (cornerMoves[this.posInCell].xd * (currentCellLength * (1 - WALL_PERSENTAGE)));
    this.y = celly + (cornerMoves[this.posInCell].yd * (currentCellLength * (1 - WALL_PERSENTAGE)));

    this.color = color;
  }

  update(cellCurrentx, cellCurrenty, currentlength, alpha) {
    this.length = calculateWidth(currentlength);
    this.width  = calculateWidth(currentlength);

    this.x = cellCurrentx + (cornerMoves[this.posInCell].xd * (currentlength * (1 - WALL_PERSENTAGE)));
    this.y = cellCurrenty + (cornerMoves[this.posInCell].yd * (currentlength * (1 - WALL_PERSENTAGE)));

    this.color.alpha = alpha;
  }

  draw(ctx, ctx2) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.alpha})`;
    // ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.alpha})`;
    ctx.rect(this.x, this.y, this.length, this.width);
    ctx.fill();
    // ctx.stroke();
    // ctx.closePath();
  }

  debug() {
    
    console.log("corner debug");
    console.log("x: ", this.x, "y: ", this.y, "length: ", this.length, "width: ", this.width);
    console.log("pos: ", this.posInCell, "color: ", this.color);
    console.log("animation: ", this.animation);
    console.log("---------------------");
  }
}