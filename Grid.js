import { Cell, EAST, NORTH, SOUTH, WEST } from "./cell.js";
import { PRESENT, STOPPED } from "./wall.js";


//NOTE - needed for calculating the grid length and width outside of the class
export const CELL_SIZE = 50;


export class Grid {
  startx = 0;
  starty = 0;
  length = 0;
  width = 0;
  initialWallState = PRESENT;
  
  grid = [];


  configureCells() {
    for (let cell of this.eachCell()) {
      let x = cell.gridX;
      let y = cell.gridY;
      
      // cons
      cell.north = this.at(x, y - 1);
      cell.south = this.at(x, y + 1);
      cell.west = this.at(x - 1, y);
      cell.east = this.at(x + 1, y);

      //FIXME - this is still not working properly
      if (x == 0) cell.walls[WEST].state = PRESENT;
      if (y == 0) cell.walls[NORTH].state = PRESENT;
      if (x == this.length - 1) cell.walls[EAST].state = PRESENT;
      if (y == this.width - 1) cell.walls[SOUTH].state = PRESENT;
    }
  }

  prepareGrid() {
    for (let y = 0; y < this.width; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.length; x++) {
        this.grid[y][x] = new Cell();
      }
    }
  }

  randomCell() {
    let x = Math.floor(Math.random() * this.length);
    let y = Math.floor(Math.random() * this.width);
    return this.grid[y][x];
  }

  size() {
    return this.length * this.width;
  }

  // an iterator function to loop over each row of the grid
  *eachRow() {
    for (let y = 0; y < this.width; y++) {
      yield this.grid[y];
    }
  }

  // an iterator function to loop over each cell of the grid
  *eachCell() {
    for (let row of this.eachRow()) {
      for (let cell of row) {
        yield cell;
      }
    }
  }


  at(x, y) {
    if (x < 0 || x >= this.length) return null;
    if (y < 0 || y >= this.width) return null;
  
    return this.grid[y][x];
  }


  constructor(canvasLength, canvasWidth, initialWallState = PRESENT) {
    this.length = Math.floor(canvasLength / CELL_SIZE);
    this.width  = Math.floor(canvasWidth / CELL_SIZE);
    this.initialWallState = initialWallState;

    this.prepareGrid();
    this.initialize(canvasLength, canvasWidth);
  }

  initialize(canvasLength, canvasWidth) {
    this.length = Math.floor(canvasLength / CELL_SIZE);
    this.width = Math.floor(canvasWidth / CELL_SIZE);

    this.startx = Math.floor((canvasLength - (this.length * CELL_SIZE)) / 2);
    this.starty = Math.floor((canvasWidth - (this.width * CELL_SIZE)) / 2);

    for (let y = 0; y < this.width; y++) {
      for (let x = 0; x < this.length; x++) {
        let cellx = this.startx + (x * CELL_SIZE);
        let celly = this.starty + (y * CELL_SIZE);

        this.grid[y][x].initialize(x, y, cellx, celly, CELL_SIZE, this.initialWallState);
      }
    }
    this.configureCells();
    // console.log("grid initialized");
    // console.log('the grid => ', this);
  }

  update(ctx, ctx2) {
    // console.log("updating grid");
    for (let y = 0; y < this.width; y++) {
      for (let x = 0; x < this.length; x++) {
        this.grid[y][x].update(ctx, ctx2);
      }
    }
    this.draw(ctx, ctx2);
  }

  draw(ctx, ctx2) {
    // console.log("drawing grid");
    //NOTE - drawing the grid in two parts, first the stopped cells and then the moving cells
    for (let y = 0; y < this.width; y++) {
      for (let x = 0; x < this.length; x++) {
        if (this.grid[y][x].animation == STOPPED)
          this.grid[y][x].draw(ctx, ctx2);
      }
    }

    for (let y = 0; y < this.width; y++) {
      for (let x = 0; x < this.length; x++) {
        if (this.grid[y][x].animation != STOPPED)
          this.grid[y][x].draw(ctx, ctx2);
      }
    }
  }

  reset() {
    for (let y = 0; y < this.width; y++) {
      for (let x = 0; x < this.length; x++) {
        this.grid[y][x].reset();
      }
    }
  }
}