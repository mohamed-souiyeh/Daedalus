import { bfs } from "./algos/bfs.algo.ts";
import { randomWalkDFS } from "./algos/randomWalkDFS.algo.ts";
import { resetShadowStyle, setShadowStyle } from "./canvas_ctx_style_manipulation/shadows.ts";
import { Cell } from "./cell.ts";
import { algosKeys } from "./configs/algos.config.ts";
import { CELLSIZE, CellAnimation, CellStates, CellType, Directions } from "./configs/cell.config.ts";
import { globals } from "./configs/globals.ts";
import { mouse } from "./configs/input.config.ts";
import { wallState } from "./configs/wall.config.ts";
import { Debuger } from "./debugger.ts";
import { Frame, algoState } from "./types/algos.types.ts";
import { gridState } from "./types/grid.types.ts";



export class Grid {
  #startX: number;
  #startY: number;
  #length: number;
  #width: number;
  #offsetLeft: number;
  #offsetTop: number;

  #mousexInGrid: number = 0;
  #mouseyInGrid: number = 0;
  #mouseCellx: number = 0;
  #mouseCelly: number = 0;

  #algos: Map<algosKeys, (grid: Grid) => algoState>;
  gridState: gridState = gridState.IDLE;
  currentAlgo: algosKeys;

  #initialWallState: wallState = wallState.PRESENT;

  grid: Cell[][] = [];

  debuger: Debuger = new Debuger();

  //SECTION - getters and setters

  get startX() {
    return this.#startX;
  }

  get startY() {
    return this.#startY;
  }

  get length() {
    return this.#length;
  }

  get width() {
    return this.#width;
  }

  get offsetLeft() {
    return this.#offsetLeft;
  }

  get offsetTop() {
    return this.#offsetTop;
  }
  //!SECTION 



  //SECTION - initialization methods
  constructor(canvasLength: number, canvasWidth: number, initialWallState: wallState = wallState.PRESENT) {
    //FIXME - this is just for testing
    this.#length = Math.floor(canvasLength / CELLSIZE);
    this.#width = Math.floor(canvasWidth / CELLSIZE);
    // this.#length = 1;
    // this.#width = 1;
    this.#initialWallState = initialWallState;

    this.#algos = new Map<algosKeys, (grid: Grid) => algoState>();
    this.#prepareGrid();
  }

  #prepareGrid() {
    for (let y = 0; y < this.#width; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.#length; x++) {
        this.grid[y][x] = new Cell();
      }
    }
  }

  public initialize(canvasLength: number, canvasWidth: number, wallState: wallState) {

    this.#startX = Math.floor((canvasLength - (this.#length * CELLSIZE)) / 2);
    this.#startY = Math.floor((canvasWidth - (this.#width * CELLSIZE)) * 0.5);

    // globals.canvas!.width = this.#length * CELLSIZE;
    // globals.canvas!.height = this.#width * CELLSIZE;

    this.#currentResetColumn = 0;
    this.#resetPatternDirection = 1;

    this.#offsetLeft = this.#startX;
    this.#offsetTop = this.#startY;

    for (let y = 0; y < this.#width; y++) {
      for (let x = 0; x < this.#length; x++) {
        let cellx = this.startX + x * CELLSIZE;
        let celly = this.startY + y * CELLSIZE;
        let type: CellType = CellType.air;
        if (x === globals.start.x && y === globals.start.y) {
          type = CellType.start;
        }
        else if (x === globals.finish.x && y === globals.finish.y) {
          type = CellType.finish;
        }

        this.grid[y][x].init(x, y, cellx, celly, CELLSIZE, wallState, type);
      }
    }

    this.#configureCells();
    this.#initAlgos();
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

  #initAlgos() {
    this.#algos.set(algosKeys.RandomWalkDFS, randomWalkDFS);
    this.#algos.set(algosKeys.BFS, bfs);
  }
  //!SECTION

  //SECTION - uncategorized methods
  public *eachCell() {
    for (let row of this.eachRow()) {
      for (let cell of row) {
        yield cell;
      }
    }
  }

  public *eachRow() {
    for (let y = 0; y < this.#width; y++) {
      yield this.grid[y];
    }
  }

  public at(x: number, y: number) {
    if (x < 0 || x >= this.#length) return null;
    if (y < 0 || y >= this.#width) return null;

    return this.grid[y][x];
  }

  public size() {
    return (this.#length * this.#width);
  }

  public randomCell() {
    let x = Math.floor(Math.random() * this.#length);
    let y = Math.floor(Math.random() * this.#width);

    return this.at(x, y);
  }
  //!SECTION

  // NOTE: algos section

  public launchAlgo() {
    if (this.gridState === gridState.IDLE) {
      this.prepAlgo();
      console.log("finished preparing for search");
      // if (this.gridState === gridState.SEARCHING)
      // globals.startAlgo = false;
      return;
    }
    if (!this.#algos.has(this.currentAlgo)) {
      console.log("ma guy we aint have an algo for what u chose");
      globals.setDisableLaunch(false);
      globals.startAlgo = false;
      return;
    }

    let howMany: number = globals.skipAlgoAnimaiton ? 18 : 1;
    let state: algoState = algoState.noState;

    while (howMany && (state === algoState.noState || state === algoState.building || state === algoState.searching)) {
      state = this.#algos.get(this.currentAlgo)!(this);
      console.log("wa3");
      howMany--;
    }
    if (state === algoState.done) {
      console.log("done building");
      globals.skipAlgoAnimaiton = false;
      if (!globals.mazeSolvingAlgorithm) {
        globals.startAlgo = false;
        globals.setDisableLaunch(false);
      }
      this.gridState = gridState.IDLE;
    }
    else if (state === algoState.foundPath || state === algoState.noPath) {
      globals.skipAlgoAnimaiton = false;
      globals.startAlgo = false;
      this.gridState = gridState.IDLE;
      globals.setDisableLaunch(false);
    }
  }

  #currentResetColumn: number = 0;
  #resetPatternDirection: number = 1;

  public resetPatternMKI() {
    if (this.#currentResetColumn < 0) {
      this.#currentResetColumn = 0;
      this.#resetPatternDirection = this.#resetPatternDirection * -1;
      globals.reset = false;
      return;
    }
    else if (this.#currentResetColumn >= this.length) {
      this.#currentResetColumn = this.length - 1;
      globals.reset = false;
      return;
    }
    // if (this.#currentResetColumn + -this.#resetPatternDirection >= 0 && this.#currentResetColumn + -this.#resetPatternDirection <= this.length) {
    // }

    // console.log("  animationPercentage: ", this.at(this.#currentResetColumn, 0)!.animationPercentage)
    // console.log("currentResetColumn: ", this.#currentResetColumn);
    if (this.at(this.#currentResetColumn, 0)!.animationPercentage <= 0) {
      let x = this.#currentResetColumn;
      for (let y = 0; y < this.width; y++) {
        // console.log("x: ", x);
        // console.log("y: ", y);
        this.at(x, y)!.setState(CellStates.unvisited);
      }
    }

    if (this.at(this.#currentResetColumn, 0)!.animationPercentage >= 5.0)
      this.#currentResetColumn += this.#resetPatternDirection;
  }

  public resetForSearchAlgo() {
    for (let cell of this.eachCell()) {
      cell.parrent = null;
      cell.distenceFromStart = Infinity;
    }
  }

  public prepAlgo() {
    if (globals.mazeBuildingAlgorithm && this.gridState === gridState.IDLE) {
      this.gridState = gridState.BUILDING;
      this.currentAlgo = globals.mazeBuildingAlgorithm;
      globals.mazeBuildingAlgorithm = null;
      globals.BuildStack.clear();

      let x: number = Math.floor(Math.random() * this.length);
      let y: number = Math.floor(Math.random() * this.width);
      console.log("current algo: ", this.currentAlgo);
      const frame = new Frame(x, y, this.currentAlgo);

      this.at(frame.x, frame.y)?.setState(CellStates.current);
      globals.BuildStack.push(frame);
    }
    else if (globals.mazeSolvingAlgorithm && this.gridState === gridState.IDLE) {
      this.gridState = gridState.SEARCHING;
      this.currentAlgo = globals.mazeSolvingAlgorithm;
      globals.mazeSolvingAlgorithm = null;
      globals.searchQueue.clear();
      globals.reset = true;
      this.resetForSearchAlgo();

      const frame = new Frame(globals.start.x, globals.start.y, this.currentAlgo);


      this.at(frame.x, frame.y)!.setState(CellStates.current);
      this.at(frame.x, frame.y)!.parrent = null;
      this.at(frame.x, frame.y)!.distenceFromStart = 0;
      globals.searchQueue.enqueue(frame);
    }
    else {
      globals.skipAlgoAnimaiton = false;
      globals.startAlgo = false;
      this.gridState = gridState.IDLE;
      globals.setDisableLaunch(false);
    }
  }
  //

  //SECTION - animation methods

  public update(ctx: CanvasRenderingContext2D) {

    // console.log("start: ", globals.start);
    // console.log("finish: ", globals.finish);
    if (globals.replaceStart) {
      this.grid[globals.start.oldy][globals.start.oldx].setCellType(CellType.air);
      this.grid[globals.start.y][globals.start.x].setCellType(CellType.start);
      globals.replaceStart = false;
    }
    if (globals.replaceFinish) {
      this.grid[globals.finish.oldy][globals.finish.oldx].setCellType(CellType.air);
      this.grid[globals.finish.y][globals.finish.x].setCellType(CellType.finish);
      globals.replaceFinish = false;
    }


    if (globals.reset) {
      this.resetPatternMKI();
    }

    for (let cell of this.eachCell()) {
      cell.update();
    }
  }

  public writeMousePosition(ctx: CanvasRenderingContext2D) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "15px Arial";
    ctx.fillStyle = "black";


    ctx.fillText("x: " + this.#mouseCellx + " y: " + this.#mouseCelly, 200, this.#offsetTop - 10);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, globals.canvas!.width, this.#offsetTop);
    // ctx.clearRect(this.startX, this.startY, this.#length * CELLSIZE, this.#width * CELLSIZE);

    for (let cell of this.eachCell()) {
      if (cell.animation === CellAnimation.STOPPED || cell.animation === CellAnimation.STOPPING) {
        if (cell.gridx !== this.#mouseCellx || cell.gridy !== this.#mouseCelly || !globals.debugModeOn)
          cell.draw(ctx);
      }
    }


    for (let cell of this.eachCell()) {
      if (cell.animation !== CellAnimation.STOPPED) {
        if (cell.gridx !== this.#mouseCellx || cell.gridy !== this.#mouseCelly || !globals.debugModeOn) {
          cell.draw(ctx);
        }
      }
    }

    if (globals.debugModeOn) {
      setShadowStyle(ctx, { blur: 5, color: "gold" })
      this.at(this.#mouseCellx, this.#mouseCelly)?.draw(ctx);
      resetShadowStyle(ctx);
    }
  }



  public updateDebuger(ctx: CanvasRenderingContext2D) {
    if (!globals.debugModeOn) return;

    this.#mousexInGrid = mouse.dx - this.#offsetLeft;
    this.#mouseyInGrid = mouse.dy - this.#offsetTop;


    this.#mouseCellx = Math.floor(this.#mousexInGrid / CELLSIZE);
    this.#mouseCelly = Math.floor(this.#mouseyInGrid / CELLSIZE);

    this.debuger.update();
  }

  public drawDebuger(ctx: CanvasRenderingContext2D) {

    if (!globals.debugModeOn) {
      return;
    }
    // this.writeMousePosition(ctx);
    this.debuger.draw(ctx, this.at(this.#mouseCellx, this.#mouseCelly), this);
  }

  //!SECTION
}
