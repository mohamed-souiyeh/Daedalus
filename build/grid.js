import { Cell, CellAnimation, Directions } from "./cell.js";
import { wallState } from "./wall.js";
export const CELLSIZE = 50;
export class Grid {
    #startX;
    #startY;
    #length;
    #width;
    #initialWallState = wallState.PRESENT;
    grid = [];
    //SECTION - initialization methods
    constructor(canvasLength, canvasWidth, initialWallState = wallState.PRESENT) {
        this.#length = Math.floor(canvasLength / CELLSIZE);
        this.#width = Math.floor(canvasWidth / CELLSIZE);
        this.#initialWallState = initialWallState;
        this.#prepareGrid();
        this.#initialize(canvasLength, canvasWidth, initialWallState);
    }
    #prepareGrid() {
        for (let y = 0; y < this.#width; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.#length; x++) {
                this.grid[y][x] = new Cell();
            }
        }
    }
    #initialize(canvasLength, canvasWidth, wallState) {
        this.#startX = Math.floor((canvasLength - (this.#length * CELLSIZE)) / 2);
        this.#startY = Math.floor((canvasWidth - (this.#width * CELLSIZE)) / 2);
        for (let y = 0; y < this.#width; y++) {
            for (let x = 0; x < this.#length; x++) {
                let cellx = this.#startX + x * CELLSIZE;
                let celly = this.#startY + y * CELLSIZE;
                this.grid[y][x].init(x, y, cellx, celly, CELLSIZE, wallState);
            }
        }
        this.#configureCells();
    }
    #configureCells() {
        for (let cell of this.eachCell()) {
            let x = cell.gridx;
            let y = cell.gridy;
            cell.north = this.at(x, y - 1);
            cell.south = this.at(x, y + 1);
            cell.east = this.at(x + 1, y);
            cell.west = this.at(x - 1, y);
            if (cell.north === null) {
                cell.walls[Directions.NORTH].setWallState(wallState.PRESENT);
            }
            if (cell.south === null) {
                cell.walls[Directions.SOUTH].setWallState(wallState.PRESENT);
            }
            if (cell.east === null) {
                cell.walls[Directions.EAST].setWallState(wallState.PRESENT);
            }
            if (cell.west === null) {
                cell.walls[Directions.WEST].setWallState(wallState.PRESENT);
            }
        }
    }
    //!SECTION
    //SECTION - uncategorized methods
    *eachCell() {
        for (let row of this.eachRow()) {
            for (let cell of row) {
                yield cell;
            }
        }
    }
    *eachRow() {
        for (let y = 0; y < this.#width; y++) {
            yield this.grid[y];
        }
    }
    at(x, y) {
        if (x < 0 || x >= this.#length)
            return null;
        if (y < 0 || y >= this.#width)
            return null;
        return this.grid[y][x];
    }
    size() {
        return (this.#length * this.#width);
    }
    randomCell() {
        let x = Math.floor(Math.random() * this.#length);
        let y = Math.floor(Math.random() * this.#width);
        return this.at(x, y);
    }
    //!SECTION
    //SECTION - animation methods
    update(ctx, deltaTime) {
        const FPS = 60;
        deltaTime = 1 / FPS;
        for (let cell of this.eachCell()) {
            cell.update(deltaTime);
        }
        this.draw(ctx);
    }
    draw(ctx) {
        for (let cell of this.eachCell()) {
            if (cell.getAnimation() === CellAnimation.STOPPED)
                cell.draw(ctx);
        }
        for (let cell of this.eachCell()) {
            if (cell.getAnimation() !== CellAnimation.STOPPED)
                cell.draw(ctx);
        }
    }
}
