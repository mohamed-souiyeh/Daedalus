import { Cell } from "./cell.js";
import { PRESENT } from "./wall.js";


//NOTE - needed for calculating the grid length and width outside of the class
export const CELL_SIZE = 30;


export class Grid {
  startx = 0;
  starty = 0;
  length = 0;
  width = 0;
  
  grid = [];


  constructor(canvasLength, canvasWidth) {
    this.length = Math.floor(canvasLength / CELL_SIZE);
    this.width = Math.floor(canvasWidth / CELL_SIZE);

    for (let y = 0; y < this.width; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.length; x++) {
        this.grid[y][x] = new Cell();
      }
    }
  }

  initialize(canvasLength, canvasWidth) {
    this.length = Math.floor(canvasLength / CELL_SIZE);
    this.width = Math.floor(canvasWidth / CELL_SIZE);

    this.startx = Math.floor((canvasLength - (this.length * CELL_SIZE)) / 2);
    this.starty = Math.floor((canvasWidth - (this.width * CELL_SIZE)) / 2);

    console.log("creating grid");
    console.log("this is the length => ", this.length);
    console.log("this is the width => ", this.width);
    console.log("this is the startx => ", this.startx);
    console.log("this is the starty => ", this.starty);
    for (let y = 0; y < this.width; y++) {
      for (let x = 0; x < this.length; x++) {
        let cellx = this.startx + (x * CELL_SIZE);
        let celly = this.starty + (y * CELL_SIZE);
        console.log(cellx, celly);
        this.grid[y][x].initialize(x, y, cellx, celly, CELL_SIZE, PRESENT);
      }
    }
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