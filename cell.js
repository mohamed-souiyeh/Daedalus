export const OUTWARDS = 0;
export const INWARDS = 1;
export const STOPPED = 2;

export class Cell {
  gridX;
  gridY;
  visited;

  x;
  y;
  length;

  Velocity;
  Acceleration;
  animation;

  inwardScallingFactor;
  outwardScallingFactor;
  firstCellVector = {
    startx: 0,
    starty: 0,
    endx: 0,
    endy: 0,
    currentx: 0,
    currenty: 0,
    currentlength: 0,
    moves: { x: 0, y: 0, xd: 1, yd: 1 },
  };

  constructor(gridX, gridY, x, y, length) {
    this.gridX = gridX; // x position in the grid
    this.gridY = gridY; // y position in the grid
    this.visited = false; // has this cell been visited by the algorithm?

    this.x = x; // x position on canvas
    this.y = y; // y position on canvas
    this.length = length; // length of the cell on canvas
    this.Velocity = 40;
    this.Acceleration = 0;
    this.animation = OUTWARDS;
    
    console.log("this is the this.Velocity = >", this.Velocity);
  
    this.inwardScallingFactor = 0.2; // how much to scale the cell inwards
    this.outwardScallingFactor = 0.2; // how much to scale the cell outwards

    // const moves = [
    //   { x: 0, y: 0, xd: 1, yd: 1 },
    //   { x: length, y: 0, xd: -1, yd: 1 },
    //   { x: length, y: length, xd: -1, yd: -1 },
    //   { x: 0, y: length, xd: 1, yd: -1 },
    // ];

    this.firstCellVector.x = this.x + this.firstCellVector.moves.x;
    this.firstCellVector.y = this.y + this.firstCellVector.moves.y;
    console.log("this is the this.firstCellVector.x= >", this.firstCellVector.x);
    console.log("this is the this.firstCellVector.y = >", this.firstCellVector.y);

    let startLength = this.length * this.inwardScallingFactor * this.firstCellVector.moves.xd;

    this.firstCellVector.startx = this.firstCellVector.x + startLength;

    startLength = this.length * this.inwardScallingFactor * this.firstCellVector.moves.yd;
    this.firstCellVector.starty = this.firstCellVector.y + startLength;
    console.log("this is the this.firstCellVector.startx = >", this.firstCellVector.startx);
    console.log("this is the this.firstCellVector.starty = >", this.firstCellVector.starty);

    let endLength = this.length * this.outwardScallingFactor * -this.firstCellVector.moves.xd;
    this.firstCellVector.endx =this.firstCellVector.x + endLength;
    
    endLength = this.length * this.outwardScallingFactor * -this.firstCellVector.moves.yd;
    this.firstCellVector.endy = this.firstCellVector.y + endLength;
    console.log("this is the this.firstCellVector.endx = >", this.firstCellVector.endx);
    console.log("this is the this.firstCellVector.endy = >", this.firstCellVector.endy);
    console.log("--------------------------------");

    this.firstCellVector.currentx = this.firstCellVector.startx;
    this.firstCellVector.currenty = this.firstCellVector.starty;
    this.firstCellVector.currentlength = this.length - (this.length * this.inwardScallingFactor * 2);
  }

  update(ctx) {
    if (this.animation == STOPPED) {
      // this.draw(ctx);
      return;
    }
    
    if (this.animation == INWARDS) {
      if (this.firstCellVector.currentx >= this.firstCellVector.x) {
        this.animation = STOPPED;
        this.Velocity = -this.Velocity;

        this.firstCellVector.currentx = this.firstCellVector.x;
        this.firstCellVector.currenty = this.firstCellVector.y;
      }
    } else if (this.animation == OUTWARDS) {
      if (this.firstCellVector.currentx <= this.firstCellVector.endx) {
        this.animation = INWARDS;
        this.Velocity = -this.Velocity;
      }
    }

    const FPS = 100; // Frames per second
    const DELTA = 1 / FPS; // Delta time

    let stepx = this.Velocity * -this.firstCellVector.moves.xd * DELTA;
    let stepy = this.Velocity * -this.firstCellVector.moves.yd * DELTA;

    this.firstCellVector.currentx += stepx;
    this.firstCellVector.currenty += stepy;

    this.firstCellVector.currentlength += -stepx * 2;

    console.log("this is the stepx = >", stepx);
    console.log("this is the stepy = >", stepy);
    console.log("this is the x = >", this.firstCellVector.x);
    console.log("this is the y = >", this.firstCellVector.y);
    console.log("this is the currentx = >", this.firstCellVector.currentx);
    console.log("this is the currenty = >", this.firstCellVector.currenty);
    console.log("this is the Velocity = >", this.Velocity);
    console.log("this is the animation = >", this.animation);
    console.log("--------------------------------");
    this.draw(ctx);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(
      this.firstCellVector.currentx,
      this.firstCellVector.currenty,
      this.firstCellVector.currentlength,
      this.firstCellVector.currentlength
    );
    ctx.fillStyle = "skyblue";
    ctx.fill();

    // ctx.beginPath();
    // ctx.moveTo(this.cellVectors[0].startx, this.cellVectors[0].starty);
    // for (let i = 0; i < 4; i++) {
    //   ctx.lineTo(this.firstCellVector.startx, this.firstCellVector.starty);
    // }
    // ctx.closePath();
    // ctx.fillStyle = "yellow";
    // ctx.fill();

    // ctx.beginPath();
    // ctx.moveTo(this.cellVectors[0].endx, this.cellVectors[0].endy);
    // for (let i = 0; i < 4; i++) {
    //   ctx.lineTo(this.firstCellVector.endx, this.firstCellVector.endy);
    // }
    // ctx.closePath();
    // ctx.strokeStyle = "red";
    // ctx.stroke();

    ctx.beginPath();
    ctx.strokeRect(
      this.firstCellVector.x,
      this.firstCellVector.y,
      this.length,
      this.length
    );
    ctx.strokeStyle = "blue";
    ctx.stroke();
  }
}
