import { Cell } from "./cell.js";
import { PRESENT } from "./wall.js";


//NOTE - needed for calculating the grid length and width outside of the class
export const CELL_SIZE = 50;


export class Grid {
  startx = 0;
  starty = 0;
  length = 0;
  width = 0;
  
  grid = [];


  configureCells() {
    for (let y = 0; y < this.width; y++) {
      for (let x = 0; x < this.length; x++) {
        let cell = this.grid[y][x];

        cell.north = this.at(y - 1, x);
        cell.south = this.at(y + 1, x);
        cell.west = this.at(y, x - 1);
        cell.east = this.at(y, x + 1);
      }
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


  constructor(canvasLength, canvasWidth) {
    this.length = Math.floor(canvasLength / CELL_SIZE);
    this.width  = Math.floor(canvasWidth / CELL_SIZE);

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
        console.log(cellx, celly);
        this.grid[y][x].initialize(x, y, cellx, celly, CELL_SIZE, PRESENT);
      }
    }
    this.configureCells();
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
    for (let y = 0; y < this.width; y++) {
      for (let x = 0; x < this.length; x++) {
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