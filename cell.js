
export class Cell {
  
  gridX;
  gridY;
  visited;
  
  x;
  y;
  length;

  inwardScallingFactor;
  outwardScallingFactor;
  cellVectors = [];

  
  constructor (gridX, gridY, x, y, length) {
    this.gridX = gridX; // x position in the grid
    this.gridY = gridY; // y position in the grid
    this.visited = false; // has this cell been visited by the algorithm?

    this.x = x; // x position on canvas
    this.y = y; // y position on canvas
    this.length = length; // length of the cell on canvas

    this.inwardScallingFactor = 0.2; // how much to scale the cell inwards
    this.outwardScallingFactor = 0.1; // how much to scale the cell outwards

    const moves = [
      { x: 0, y: 0, xd: 1, yd: 1 },
      { x: length, y: 0, xd: -1, yd: 1 },
      { x: length, y: length, xd: -1, yd: -1 },
      { x: 0, y: length, xd: 1, yd: -1 },
    ];
                  
    for (let i = 0; i < 4; i++) {
      let vector = {
        x: 0,
        y: 0,
        xVelocity: 0,
        yVelocity: 0,
        xAcceleration: 0,
        yAcceleration: 0,
        startx: 0,
        starty: 0,
        endx: 0,
        endy: 0,
      };

      vector.x = this.x + moves[i].x;
      vector.y = this.y + moves[i].y;
      console.log("this is the vector.x = >", vector.x);
      console.log("this is the vector.y = >", vector.y);
      vector.xVelocity = 10;
      vector.yVelocity = 10;
      vector.xAcceleration = 0;
      vector.yAcceleration = 0;

      vector.startx = vector.x + (this.length * this.inwardScallingFactor * moves[i].xd);
      vector.starty = vector.y + (this.length * this.inwardScallingFactor * moves[i].yd);
      console.log("this is the vector.startx = >", vector.startx);
      console.log("this is the vector.starty = >", vector.starty);

      vector.endx = vector 
      .x + (this.length * this.outwardScallingFactor * -moves[i].xd);
      vector.endy = vector.y + (this.length * this.outwardScallingFactor * -moves[i].yd);
      console.log("this is the vector.endx = >", vector.endx);
      console.log("this is the vector.endy = >", vector.endy);

      this.cellVectors[i] = {...vector};
    }
  }

  draw(ctx) {

    ctx.beginPath();
    ctx.moveTo(this.cellVectors[0].startx, this.cellVectors[0].starty);
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(this.cellVectors[i].startx, this.cellVectors[i].starty);
    }
    ctx.closePath();
    ctx.strokeStyle = "yellow";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.cellVectors[0].endx, this.cellVectors[0].endy);
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(this.cellVectors[i].endx, this.cellVectors[i].endy);
    }
    ctx.closePath();
    ctx.strokeStyle = "red";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.cellVectors[0].x, this.cellVectors[0].y);
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(this.cellVectors[i].x, this.cellVectors[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

}