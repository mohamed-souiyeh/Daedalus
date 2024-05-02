import { CellType, UNVISITED_CELLCOLOR, cellDefaults, stateColors } from "./configs/cell.config.ts";
import { CORNERCOLOR } from "./configs/corner.config.ts";
import { WALLCOLOR, WALL_PERSENTAGE, WallAnimation, wallState } from "./configs/wall.config.ts";
import { Corner } from "./corner.ts";
import { Debuger } from "./debugger.ts";
import { CellAnimation, CellStates, CornerDirections, Directions } from "./configs/cell.config.ts";
import { cellVector } from "./types/cell/cellVector.type.ts";
import { link } from "./types/cell/link.type.ts";
import { color } from "./types/color.type.ts";
import { Wall } from "./wall.ts";
import { globals } from "./configs/globals.ts";
import { setTextStyle } from "./canvas_ctx_style_manipulation/text.ts";
import svgPath from "svgpath";



let current_line = 0;

const INWARDSSCALINGFACTOR = cellDefaults.INWARDSSCALINGFACTOR;
const OUTWARDSSCALINGFACTOR = cellDefaults.OUTWARDSSCALINGFACTOR;

const VELOCITY = cellDefaults.VELOCITY;
const ACCELERATION = cellDefaults.ACCELERATION;

const cornerRelations = [
  {
    first: Directions.NORTH,
    second: Directions.WEST,
  },
  {
    first: Directions.NORTH,
    second: Directions.EAST,
  },
  {
    first: Directions.SOUTH,
    second: Directions.EAST,
  },
  {
    first: Directions.SOUTH,
    second: Directions.WEST,
  },
];

const wallRelations = [
  {
    first: CornerDirections.NORTHWEST,
    second: CornerDirections.NORTHEAST,
  },
  {
    first: CornerDirections.NORTHEAST,
    second: CornerDirections.SOUTHEAST,
  },
  {
    first: CornerDirections.SOUTHEAST,
    second: CornerDirections.SOUTHWEST,
  },
  {
    first: CornerDirections.SOUTHWEST,
    second: CornerDirections.NORTHWEST,
  },
];

export class Cell {

  static debugPageLength: number;
  static debugPageWidth: number;

  static debugPage: number;

  #redraw: boolean = true; // NOTE:: add the enum initialization

  //SECTION - algorithm properties
  gridx: number = -1;
  gridy: number = -1;

  parrent: Cell | null = null;
  distenceFromStart: number = Infinity;
  #state: CellStates = CellStates.unvisited;
  #cellType: CellType = CellType.air;

  walls: Wall[];
  north: Cell | null = null;
  east: Cell | null = null;
  south: Cell | null = null;
  west: Cell | null = null;

  #links: Map<Cell, link> = new Map();

  corners: Corner[];
  //!SECTION

  public link(cell: Cell | null, bidi: boolean = true) {
    if (cell === null || this.islinked(cell)) return;

    let link: link = {
      state: true,
    };

    this.#links.set(cell, link);

    let neighbors = this.neighbors();
    for (let i = Directions.NORTH; i <= Directions.WEST; i++) {
      if (neighbors[i] === cell) {
        this.setWallState(i, wallState.ABSENT);
        break;
      }
    }

    if (bidi) {
      cell.link(this, false);
    }
  }

  public unlink(cell: Cell | null, bidi: boolean = true) {
    if (cell === null || !this.islinked(cell)) return;

    this.#links.delete(cell);

    let neighbors = this.neighbors();
    for (let i = Directions.NORTH; i <= Directions.WEST; i++) {
      if (neighbors[i] === cell) {
        this.setWallState(i, wallState.PRESENT);
        break;
      }
    }

    if (bidi) {
      cell.unlink(this, false);
    }
  }

  public islinked(cell: Cell | null): boolean {
    if (cell === null) return false;

    return this.#links.has(cell);
  }

  public links(): Map<Cell, link> {
    return this.#links;
  }

  public neighbors(): (Cell | null)[] {
    let neighbors: (Cell | null)[] = [];

    neighbors[Directions.NORTH] = this.north;
    neighbors[Directions.EAST] = this.east;
    neighbors[Directions.SOUTH] = this.south;
    neighbors[Directions.WEST] = this.west;

    return neighbors;
  }

  public neighbor(direction: Directions) {
    if (direction === Directions.NORTH)
      return this.north;
    if (direction === Directions.EAST)
      return this.east;
    if (direction === Directions.SOUTH)
      return this.south;
    if (direction === Directions.WEST)
      return this.west;
    return null;
  }

  constructor() {
    this.walls = new Array<Wall>();
    this.corners = new Array<Corner>();
    for (let i = Directions.NORTH; i <= Directions.WEST; i++) {
      this.walls.push(new Wall());
      this.corners.push(new Corner());
    }
  }

  //SECTION - animation properties
  #x: number = -1;
  #y: number = -1;
  #length: number = -1;

  #velocity: number = VELOCITY;
  #acceleration: number = ACCELERATION;
  #animation: CellAnimation = CellAnimation.STOPPING;
  #color: color;
  #nextColor: color;
  #colorDists: color = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  };


  #inwardScalingFactor: number = INWARDSSCALINGFACTOR;
  #outwardScalingFactor: number = OUTWARDSSCALINGFACTOR;

  #xOutwardWidth: number = 0;
  #xOutwardSteps: number = 0;

  #cellVector: cellVector = {
    startx: 0,
    starty: 0,
    endx: 0,
    endy: 0,
    currentx: 0,
    currenty: 0,
    currentlength: 0,
  };
  //!SECTION

  get xOutwardWidth() {
    return this.#xOutwardWidth;
  }

  get xOutwardSteps() {
    return this.#xOutwardSteps;
  }


  //SECTION - initialization methods
  public init(gridx: number, gridy: number, x: number, y: number, length: number, wallState: wallState, type: CellType) {
    this.gridx = gridx;
    this.gridy = gridy;

    this.parrent = null;
    this.distenceFromStart = Infinity;
    this.#state = CellStates.unvisited;
    this.#cellType = type;
    this.#links.clear();

    this.#color = Object.create(UNVISITED_CELLCOLOR);
    this.#nextColor = Object.create(UNVISITED_CELLCOLOR);
    this.#x = x;
    this.#y = y;
    this.#length = length;
    // this.#setInwardsAnimationRequirements();
    // this.#setOutwardsAnimationRequirements();
    this.#setToOrigineAnimationRequirementsFromInside();

    // NOTE: - calculate how much is the scaling factor from the length and divide it by 2 to get the offset on one side
    let startlength = (this.#length * this.#inwardScalingFactor) / 2;

    this.#cellVector.startx = this.#x + startlength;
    this.#cellVector.starty = this.#y + startlength;

    // NOTE: - calculate how much is the scaling factor from the length and divide it by 2 to get the offset on one side
    let endlength = (this.#length * this.#outwardScalingFactor) / 2;

    this.#cellVector.endx = this.#x - endlength;
    this.#cellVector.endy = this.#y - endlength;

    this.#xOutwardWidth = endlength * 2 + startlength;
    this.#xOutwardSteps = 0;

    this.#cellVector.currentx = this.#x; // WARN: mods for debug
    this.#cellVector.currenty = this.#y;
    this.#cellVector.currentlength = this.#length;

    for (let i = Directions.NORTH; i <= Directions.WEST; i++) {
      let color: color = Object.create(WALLCOLOR);

      this.walls[i].init(
        i,
        this.#x,
        this.#y,
        this.#cellVector.currentlength,
        color,
        wallState
      );
    }

    for (let i = CornerDirections.NORTHWEST; i <= CornerDirections.SOUTHWEST; i++) {

      let color: color = Object.create(CORNERCOLOR);

      this.corners[i].init(
        i,
        this.#x,
        this.#y,
        this.#cellVector.currentlength,
        color,
        wallState
      );
    }
  }
  //!SECTION

  //SECTION - setters and getters

  setCellType(type: CellType) {
    this.#cellType = type;
    this.#setToOrigineAnimationRequirementsFromInside();
  }

  setState(state: CellStates) {
    this.#state = state;
    this.#color = Object.create(stateColors.get(state) as color);
    this.#colorDists = {
      r: this.#nextColor.r - this.#color.r,
      g: this.#nextColor.g - this.#color.g,
      b: this.#nextColor.b - this.#color.b,
      a: this.#nextColor.a - this.#color.a,
    };
  }


  get animation() {
    return this.#animation;
  }

  get state() {
    return this.#state;
  }

  setOutwardAnimation() {
    this.#setOutwardsAnimationRequirements();
  }

  setInwardsAnimation() {
    this.#setInwardsAnimationRequirements();
  }

  #setOutwardsAnimationRequirements() {
    if (this.#animation === CellAnimation.OUTWARDS) return;

    this.#animation = CellAnimation.OUTWARDS;
    this.#velocity = this.#velocity > 0 ? -this.#velocity : this.#velocity;
  }

  #setInwardsAnimationRequirements() {
    if (this.#animation === CellAnimation.INWARDS) return;

    this.#animation = CellAnimation.INWARDS;
    this.#velocity = this.#velocity < 0 ? -this.#velocity : this.#velocity;
  }

  #setToOrigineAnimationRequirements() {
    if (this.#animation === CellAnimation.TOORIGINE) return;

    this.#animation = CellAnimation.TOORIGINE;
    this.#velocity = this.#velocity < 0 ? -this.#velocity : this.#velocity;
  }

  #setToOrigineAnimationRequirementsFromInside() {
    if (this.#animation === CellAnimation.ITOORIGINE) return;

    this.#animation = CellAnimation.ITOORIGINE;
    this.#velocity = this.#velocity < 0 ? this.#velocity : -this.#velocity;
  }

  #setStoppedAnimationRequirements() {
    if (this.#animation === CellAnimation.STOPPED) return;

    this.#animation = CellAnimation.STOPPED;


    //NOTE - set the walls and corners to their targeted alpha
    for (let i = Directions.NORTH; i <= Directions.WEST; i++) {
      this.walls[i].setStoppedAnimationRequirements();
      this.corners[i].setStoppedAnimationRequirements();
    }
  }


  #setStoppingAnimationRequirements() {
    if (this.#animation === CellAnimation.STOPPING) return;

    this.#animation = CellAnimation.STOPPING;

    this.#colorDists = {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    };

    this.#cellVector.currentlength = this.#length;

    let endlength = (this.#length * this.#outwardScalingFactor) / 2;

    this.#xOutwardSteps = 0;
    this.#xOutwardWidth = endlength * 2;

    //NOTE - set the walls and corners to their targeted alpha
    for (let i = Directions.NORTH; i <= Directions.WEST; i++) {
      this.walls[i].setStoppingAnimationRequirements();
      this.corners[i].setStoppingAnimationRequirements();
    }
  }

  public setWallState(wallpos: Directions, state: wallState) {
    if (wallpos < Directions.NORTH || wallpos > Directions.WEST) return;

    if (this.walls[wallpos].setWallState(state)) {
      // this.#setOutwardsAnimationRequirements();
      this.#setInwardsAnimationRequirements();
      // if (this.#decideCornerState(wallRelations[wallpos].first, state)) {
      //   this.corners[wallRelations[wallpos].first].setcornerState(state);
      // }
      // if (this.#decideCornerState(wallRelations[wallpos].second, state)) {
      //   this.corners[wallRelations[wallpos].second].setcornerState(state);
      // }
    }
  }
  //!SECTION

  //SECTION - animation methods

  #decideCornerState(cornerPos: CornerDirections, state: wallState): boolean {
    const firstWallState = this.walls[cornerRelations[cornerPos].first].getState();
    const secondWallState = this.walls[cornerRelations[cornerPos].second].getState();

    if (state === wallState.PRESENT) {
      return (
        firstWallState === state ||
        secondWallState === state
      );
    }
    else if (state === wallState.ABSENT) {
      return (
        firstWallState === state &&
        secondWallState === state
      );
    }
    else {
      console.log("ERROR - invalid state");
      throw new Error("invalid state");
    }
  }

  #checkifcellVectorIsPastStart(step: number): boolean {
    if (this.#cellVector.currentx + step >= this.#cellVector.startx)
      return true;
    if (this.#cellVector.currenty + step >= this.#cellVector.starty)
      return true;
    return false;
  }

  #checkifcellVectorIsPastEnd(step: number): boolean {
    if (this.#cellVector.currentx + step <= this.#cellVector.endx) return true;
    if (this.#cellVector.currenty + step <= this.#cellVector.endy) return true;
    return false;
  }

  #checkifcellVectorIsPastOrigine(step: number): boolean {
    if (Math.floor(this.#cellVector.currentx + step) >= this.#x) return true;
    if (Math.floor(this.#cellVector.currenty + step) >= this.#y) return true;
    if (Math.floor(this.#cellVector.currentlength - (step * 2)) <= this.#length) return true;
    return false;
  }

  #checkifcellVectorIsPastIOrigine(step: number): boolean {
    if (Math.floor(this.#cellVector.currentx + step) <= this.#x) return true;
    if (Math.floor(this.#cellVector.currenty + step) <= this.#y) return true;
    if (Math.floor(this.#cellVector.currentlength - (step * 2)) >= this.#length) return true;

    return false;
  }

  public update() {
    if (this.#animation === CellAnimation.STOPPED) return;

    let step = this.#velocity;

    if (this.#animation === CellAnimation.STOPPING) {

      this.#setStoppedAnimationRequirements();
      return;
    }
    else if (this.#animation === CellAnimation.INWARDS &&
      this.#checkifcellVectorIsPastStart(step)) {

      this.#setToOrigineAnimationRequirementsFromInside();
      this.#cellVector.currentx = this.#cellVector.startx;
      this.#cellVector.currenty = this.#cellVector.starty;
    }
    else if (this.#animation === CellAnimation.OUTWARDS &&
      this.#checkifcellVectorIsPastEnd(step)) {

      this.#setToOrigineAnimationRequirements();
      this.#cellVector.currentx = this.#cellVector.endx;
      this.#cellVector.currenty = this.#cellVector.endy;
    }
    else if (this.#animation === CellAnimation.TOORIGINE &&
      this.#checkifcellVectorIsPastOrigine(step)) {

      this.#setStoppingAnimationRequirements();
      this.#cellVector.currentx = this.#x;
      this.#cellVector.currenty = this.#y;
    }
    else if (this.#animation === CellAnimation.ITOORIGINE &&
      this.#checkifcellVectorIsPastIOrigine(step)) {

      this.#setStoppingAnimationRequirements();
      this.#cellVector.currentx = this.#x;
      this.#cellVector.currenty = this.#y;
    }
    else {
      // NOTE: - update the cell vector position
      this.#cellVector.currentx += step;
      this.#cellVector.currenty += step;

      this.#cellVector.currentlength -= step * 2;

      this.#xOutwardSteps += step < 0 ? -step : step;
    }

    //NOTE - update the color
    // this.#color.g = Math.abs(this.#nextColor.g - (this.#colorDists.g * ((this.#xOutwardWidth - this.#xOutwardSteps) / this.#xOutwardWidth)));
    // this.#color.r = Math.abs(this.#nextColor.r - (this.#colorDists.r * ((this.#xOutwardWidth - this.#xOutwardSteps) / this.#xOutwardWidth)));
    // this.#color.b = Math.abs(this.#nextColor.b - (this.#colorDists.b * ((this.#xOutwardWidth - this.#xOutwardSteps) / this.#xOutwardWidth)));
    // this.#color.a = Math.abs(this.#nextColor.a - (this.#colorDists.a * ((this.#xOutwardWidth - this.#xOutwardSteps) / this.#xOutwardWidth)));

    // NOTE: - update the walls and corners
    for (let i = Directions.NORTH; i <= Directions.WEST; i++) {
      let currentAlpha: number = 0;
      if (this.walls[i].getAnimation() === WallAnimation.STOPPING || this.walls[i].getAnimation() === WallAnimation.STOPPED)
        currentAlpha = this.walls[i].getTargetedAlpha();
      if (this.walls[i].getAnimation() === WallAnimation.FADEIN)
        currentAlpha = this.#xOutwardSteps / this.#xOutwardWidth;
      if (this.walls[i].getAnimation() === WallAnimation.FADEOUT)
        currentAlpha = 1 - this.#xOutwardSteps / this.#xOutwardWidth;

      this.walls[i].update(this.#cellVector.currentx, this.#cellVector.currenty, this.#cellVector.currentlength, currentAlpha);
    }

    // NOTE: - update the corners
    for (let i = CornerDirections.NORTHWEST; i <= CornerDirections.SOUTHWEST; i++) {
      let currentAlpha: number = 0;
      if (this.corners[i].getAnimation() === WallAnimation.STOPPING || this.corners[i].getAnimation() === WallAnimation.STOPPED)
        currentAlpha = this.corners[i].getTargetedAlpha();
      if (this.corners[i].getAnimation() === WallAnimation.FADEIN)
        currentAlpha = this.#xOutwardSteps / this.#xOutwardWidth;
      if (this.corners[i].getAnimation() === WallAnimation.FADEOUT)
        currentAlpha = 1 - this.#xOutwardSteps / this.#xOutwardWidth;

      this.corners[i].update(this.#cellVector.currentx, this.#cellVector.currenty, this.#cellVector.currentlength, currentAlpha);
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.#animation === CellAnimation.STOPPED && globals.debugModeOn !== true) return;

    // NOTE: clear the cell
    ctx.clearRect(
      this.#x,
      this.#y,
      this.#length,
      this.#length
    )
    //NOTE - draw the cell
    ctx.fillStyle = `rgba(${this.#color.r}, ${this.#color.g}, ${this.#color.b}, ${this.#color.a})`;
    ctx.fillRect(
      this.#cellVector.currentx,
      this.#cellVector.currenty,
      this.#cellVector.currentlength,
      this.#cellVector.currentlength
    );

    //NOTE - draw the walls
    for (let i = Directions.NORTH; i <= Directions.WEST; i++) {
      this.walls[i].draw(ctx);
    }

    //NOTE - draw the corners
    for (let i = CornerDirections.NORTHWEST; i <= CornerDirections.SOUTHWEST; i++) {
      this.corners[i].draw(ctx);
    }

    if (this.#cellType === CellType.start) {
      const path = new Path2D(svgPath.from(globals.homePath).translate(this.#x + this.#length * (WALL_PERSENTAGE * 1.2), this.#y + this.#length * (WALL_PERSENTAGE * 1.6)).toString());
      ctx.fillStyle = "blue";
      ctx.fill(path)
    }
    else if (this.#cellType === CellType.finish) {
      const path = new Path2D(svgPath.from(globals.finishPath).translate(this.#x + this.#length * (WALL_PERSENTAGE * 1.8), this.#y + this.#length * (WALL_PERSENTAGE * 1.2)).toString());
      ctx.fillStyle = "blue";
      ctx.fill(path)
    }


    if (globals.debugModeOn) {
      //FIXME - replace this with the set style method
      setTextStyle(ctx, {
        textAlign: "center",
        textBaseline: "middle",
        font: "13px Arial",
        fillStyle: "black"
      })

      ctx.fillText(
        `${this.gridx},${this.gridy}`,
        this.#cellVector.currentx + (this.#cellVector.currentlength / 2),
        this.#cellVector.currenty + (this.#cellVector.currentlength / 2)
      );
    }
  }

  drawTitle(ctx: CanvasRenderingContext2D, startx: number, starty: number) {
    const title = "-- Cell Info --";

    let xoffset = Debuger.d_length / 2 - ctx.measureText(title).width / 2;
    let yoffset = Debuger.textVOffset;

    ctx.fillText(title, startx + xoffset, starty + yoffset);
    current_line++;
  }


  drawInfo(ctx: CanvasRenderingContext2D, startx: number, starty: number) {
    const cellAnimation = ["OUTWARDS", "INWARDS", "STOPPED", "TOORIGINE"];
    const cellStates = ["visited", "unvisited"];

    let yoffset = Debuger.textVOffset;
    let xoffset;

    let cellInfo = `-- Animation properties --`;
    {
      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;

      cellInfo = `x: ${this.#x.toFixed(3)} | y: ${this.#y.toFixed(3)} | Length: ${this.#length.toFixed(3)}`;

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;

      cellInfo = `Velocity: ${this.#velocity.toFixed(3)}   |   Acceleration: ${this.#acceleration.toFixed(3)}`;

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;

      cellInfo = `Animation: ${cellAnimation[this.#animation]}`
      //` | color: rgba(${this.#color.r}, ${this.#color.g}, ${this.#color.b}, ${this.#color.a.toFixed(3)})`;

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;

      cellInfo = `Color: rgba(${this.#color.r.toFixed(1)}, ${this.#color.g.toFixed(1)}, ${this.#color.b.toFixed(1)}, ${this.#color.a.toFixed(3)})`;

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;

      cellInfo = `nextColor: rgba(${this.#nextColor.r.toFixed(1)}, ${this.#nextColor.g.toFixed(1)}, ${this.#nextColor.b.toFixed(1)}, ${this.#nextColor.a.toFixed(3)})`;

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;

      cellInfo = `colorDists: rgba(${this.#colorDists.r.toFixed(1)}, ${this.#colorDists.g.toFixed(1)}, ${this.#colorDists.b.toFixed(1)}, ${this.#colorDists.a.toFixed(3)})`;

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;

      cellInfo = `xOSteps: ${this.#xOutwardSteps.toFixed(3)} | xOWidth: ${this.#xOutwardWidth.toFixed(3)}`;

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;

      cellInfo = `animation percentage: ${((this.#xOutwardSteps / this.#xOutwardWidth) * 100).toFixed(3)}%`;

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;

      cellInfo = `ISFactor: ${this.#inwardScalingFactor.toFixed(3)} | OSFactor: ${this.#outwardScalingFactor.toFixed(3)}`;

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;
    }

    cellInfo = `-- Cell Vector properties --`;
    {

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;

      cellInfo = `sx: ${this.#cellVector.startx.toFixed(3)} | sy: ${this.#cellVector.starty.toFixed(3)}`

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;


      cellInfo = `ex: ${this.#cellVector.endx.toFixed(3)} | ey: ${this.#cellVector.endy.toFixed(3)}`

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;


      cellInfo = `cx: ${this.#cellVector.currentx.toFixed(3)} | cy: ${this.#cellVector.currenty.toFixed(3)}`

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;

      cellInfo = `clength: ${this.#cellVector.currentlength.toFixed(3)}`;

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;
    }

    // setTextStyle(ctx, { textAlign: Debuger.textalign, textBaseline: Debuger.textBaseline, font: Debuger.textSize + "px " + Debuger.textFont, fillStyle: "red" })
    cellInfo = '-- Algorithm properties --';
    {
      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;

      // setTextStyle(ctx, { textAlign: Debuger.textalign, textBaseline: Debuger.textBaseline, font: Debuger.textSize + "px " + Debuger.textFont, fillStyle: Debuger.textColor })

      cellInfo = `Gridx: ${this.gridx} | Gridy: ${this.gridy} | State: ${cellStates[this.#state]}`;

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;

      cellInfo = `Links: ${this.#links.size}`;

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;

      cellInfo = `No: ${this.north === null ? "null" : this.north.gridx + "," + this.north.gridy} | E: ${this.east === null ? "null" : this.east.gridx + "," + this.east.gridy} | S: ${this.south === null ? "null" : this.south.gridx + "," + this.south.gridy} | W: ${this.west === null ? "null" : this.west.gridx + "," + this.west.gridy}`

      xoffset = Debuger.d_length / 2 - ctx.measureText(cellInfo).width / 2;
      yoffset += Debuger.textVOffset + Debuger.textSize;

      ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
      current_line++;
    }

  }

  public drawDebug(ctx: CanvasRenderingContext2D, startx: number, starty: number, index: number) {

    if (globals.currentdebugPageIndex === 5) {
      this.drawTitle(ctx, startx, starty);

      this.drawInfo(ctx, startx, starty);

      current_line = 0;
    }
    else if (globals.currentdebugPageIndex === 1 || globals.currentdebugPageIndex === 3 || globals.currentdebugPageIndex === 7 || globals.currentdebugPageIndex === 9) {
      this.corners[index].drawDebug(ctx, startx, starty);
    }
    else if (globals.currentdebugPageIndex === 2 || globals.currentdebugPageIndex === 4 || globals.currentdebugPageIndex === 6 || globals.currentdebugPageIndex === 8) {
      this.walls[index].drawDebug(ctx, startx, starty);
    }
  }

  //!SECTION
}
