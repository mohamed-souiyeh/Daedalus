import { UNVISITED_CELLCOLOR, cellDefaults, stateColors } from "./configs/cell.config.js";
import { CORNERCOLOR } from "./configs/corner.config.js";
import { WALLCOLOR, WallAnimation, wallState } from "./configs/wall.config.js";
import { Corner } from "./corner.js";
import { Debuger } from "./debugger.js";
import { CellAnimation, CellStates, CornerDirections, Directions } from "./configs/cell.config.js";
import { Wall } from "./wall.js";
import { globals } from "./Events/input.js";
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
    static debugPageLength;
    static debugPageWidth;
    static debugPage;
    //SECTION - algorithm properties
    gridx = -1;
    gridy = -1;
    #state = CellStates.unvisited;
    walls;
    north = null;
    east = null;
    south = null;
    west = null;
    #links = new Map();
    corners;
    //!SECTION
    link(cell, bidi = true) {
        if (cell === null || this.islinked(cell))
            return;
        let link = {
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
    unlink(cell, bidi = true) {
        if (cell === null || !this.islinked(cell))
            return;
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
    islinked(cell) {
        if (cell === null)
            return false;
        return this.#links.has(cell);
    }
    links() {
        return this.#links;
    }
    neighbors() {
        let neighbors = [];
        neighbors[Directions.NORTH] = this.north;
        neighbors[Directions.EAST] = this.east;
        neighbors[Directions.SOUTH] = this.south;
        neighbors[Directions.WEST] = this.west;
        return neighbors;
    }
    constructor() {
        this.walls = new Array();
        this.corners = new Array();
        for (let i = Directions.NORTH; i <= Directions.WEST; i++) {
            this.walls.push(new Wall());
            this.corners.push(new Corner());
        }
    }
    //SECTION - animation properties
    #x = -1;
    #y = -1;
    #length = -1;
    #velocity = VELOCITY;
    #acceleration = ACCELERATION;
    #animation = CellAnimation.STOPPED;
    #color = Object.create(UNVISITED_CELLCOLOR);
    #nextColor = Object.create(UNVISITED_CELLCOLOR);
    #colorDists = {
        r: 0,
        g: 0,
        b: 0,
        a: 0,
    };
    #inwardScalingFactor = INWARDSSCALINGFACTOR;
    #outwardScalingFactor = OUTWARDSSCALINGFACTOR;
    #xOutwardWidth = 0;
    #xOutwardSteps = 0;
    #cellVector = {
        startx: 0,
        starty: 0,
        endx: 0,
        endy: 0,
        currentx: 0,
        currenty: 0,
        currentlength: 0,
    };
    //!SECTION
    //SECTION - initialization methods
    init(gridx, gridy, x, y, length, wallState) {
        this.gridx = gridx;
        this.gridy = gridy;
        this.#x = x;
        this.#y = y;
        this.#length = length;
        this.#setOutwardsAnimationRequirements();
        //NOTE - calculate how much is the scaling factor from the length and divide it by 2 to get the offset on one side
        let startlength = (this.#length * this.#inwardScalingFactor) / 2;
        this.#cellVector.startx = this.#x + startlength;
        this.#cellVector.starty = this.#y + startlength;
        //NOTE - calculate how much is the scaling factor from the length and divide it by 2 to get the offset on one side
        let endlength = (this.#length * this.#outwardScalingFactor) / 2;
        this.#cellVector.endx = this.#x - endlength;
        this.#cellVector.endy = this.#y - endlength;
        this.#xOutwardWidth = endlength * 2 + startlength;
        this.#cellVector.currentx = this.#cellVector.startx;
        this.#cellVector.currenty = this.#cellVector.starty;
        this.#cellVector.currentlength = this.#length - this.#length * this.#inwardScalingFactor;
        for (let i = Directions.NORTH; i <= Directions.WEST; i++) {
            let color = Object.create(WALLCOLOR);
            this.walls[i].init(i, this.#x, this.#y, this.#cellVector.currentlength, color, wallState);
        }
        for (let i = CornerDirections.NORTHWEST; i <= CornerDirections.SOUTHWEST; i++) {
            let color = Object.create(CORNERCOLOR);
            this.corners[i].init(i, this.#x, this.#y, this.#cellVector.currentlength, color, wallState);
        }
    }
    //!SECTION
    //SECTION - setters and getters
    setState(state) {
        this.#state = state;
        this.#nextColor = Object.create(stateColors.get(state));
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
    #setOutwardsAnimationRequirements() {
        if (this.#animation === CellAnimation.OUTWARDS)
            return;
        this.#animation = CellAnimation.OUTWARDS;
        this.#velocity = this.#velocity > 0 ? -this.#velocity : this.#velocity;
    }
    #setInwardsAnimationRequirements() {
        if (this.#animation === CellAnimation.INWARDS)
            return;
        this.#animation = CellAnimation.INWARDS;
        this.#velocity = this.#velocity < 0 ? -this.#velocity : this.#velocity;
    }
    #setToOrigineAnimationRequirements() {
        if (this.#animation === CellAnimation.TOORIGINE)
            return;
        this.#animation = CellAnimation.TOORIGINE;
        this.#velocity = this.#velocity < 0 ? -this.#velocity : this.#velocity;
    }
    #setStoppedAnimationRequirements() {
        if (this.#animation === CellAnimation.STOPPED)
            return;
        this.#animation = CellAnimation.STOPPED;
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
            this.walls[i].setStoppedAnimationRequirements();
            this.corners[i].setStoppedAnimationRequirements();
        }
    }
    setWallState(wallpos, state) {
        if (wallpos < Directions.NORTH || wallpos > Directions.WEST)
            return;
        if (this.walls[wallpos].setWallState(state)) {
            this.#setOutwardsAnimationRequirements();
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
    #decideCornerState(cornerPos, state) {
        const firstWallState = this.walls[cornerRelations[cornerPos].first].getState();
        const secondWallState = this.walls[cornerRelations[cornerPos].second].getState();
        if (state === wallState.PRESENT) {
            return (firstWallState === state ||
                secondWallState === state);
        }
        else if (state === wallState.ABSENT) {
            return (firstWallState === state &&
                secondWallState === state);
        }
        else {
            console.log("ERROR - invalid state");
            throw new Error("invalid state");
        }
    }
    #checkifcellVectorIsPastStart(step) {
        if (this.#cellVector.currentx + step >= this.#cellVector.startx)
            return true;
        if (this.#cellVector.currenty + step >= this.#cellVector.starty)
            return true;
        return false;
    }
    #checkifcellVectorIsPastEnd(step) {
        if (this.#cellVector.currentx + step <= this.#cellVector.endx)
            return true;
        if (this.#cellVector.currenty + step <= this.#cellVector.endy)
            return true;
        return false;
    }
    #checkifcellVectorIsPastOrigine(step) {
        if (Math.floor(this.#cellVector.currentx + step) >= this.#x)
            return true;
        if (Math.floor(this.#cellVector.currenty + step) >= this.#y)
            return true;
        return false;
    }
    update() {
        if (this.#animation === CellAnimation.STOPPED)
            return;
        let step = this.#velocity;
        if (this.#animation === CellAnimation.INWARDS &&
            this.#checkifcellVectorIsPastStart(step)) {
            this.#setOutwardsAnimationRequirements();
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
            this.#setStoppedAnimationRequirements();
            this.#cellVector.currentx = this.#x;
            this.#cellVector.currenty = this.#y;
        }
        else {
            //NOTE - update the cell vector position
            this.#cellVector.currentx += step;
            this.#cellVector.currenty += step;
            this.#cellVector.currentlength -= step * 2;
            this.#xOutwardSteps += step < 0 ? -step : step;
        }
        //NOTE - update the color
        this.#color.r = Math.abs(this.#nextColor.r - (this.#colorDists.r * ((this.#xOutwardWidth - this.#xOutwardSteps) / this.#xOutwardWidth)));
        this.#color.g = Math.abs(this.#nextColor.g - (this.#colorDists.g * ((this.#xOutwardWidth - this.#xOutwardSteps) / this.#xOutwardWidth)));
        this.#color.b = Math.abs(this.#nextColor.b - (this.#colorDists.b * ((this.#xOutwardWidth - this.#xOutwardSteps) / this.#xOutwardWidth)));
        this.#color.a = Math.abs(this.#nextColor.a - (this.#colorDists.a * ((this.#xOutwardWidth - this.#xOutwardSteps) / this.#xOutwardWidth)));
        //NOTE - update the walls and corners
        for (let i = Directions.NORTH; i <= Directions.WEST; i++) {
            let currentAlpha = 0;
            if (this.walls[i].getAnimation() === WallAnimation.STOPPED)
                currentAlpha = this.walls[i].getTargetedAlpha();
            if (this.walls[i].getAnimation() === WallAnimation.FADEIN)
                currentAlpha = this.#xOutwardSteps / this.#xOutwardWidth;
            if (this.walls[i].getAnimation() === WallAnimation.FADEOUT)
                currentAlpha = 1 - this.#xOutwardSteps / this.#xOutwardWidth;
            this.walls[i].update(this.#cellVector.currentx, this.#cellVector.currenty, this.#cellVector.currentlength, currentAlpha);
        }
        //NOTE - update the corners
        for (let i = CornerDirections.NORTHWEST; i <= CornerDirections.SOUTHWEST; i++) {
            let currentAlpha = 0;
            if (this.corners[i].getAnimation() === WallAnimation.STOPPED)
                currentAlpha = this.corners[i].getTargetedAlpha();
            if (this.corners[i].getAnimation() === WallAnimation.FADEIN)
                currentAlpha = this.#xOutwardSteps / this.#xOutwardWidth;
            if (this.corners[i].getAnimation() === WallAnimation.FADEOUT)
                currentAlpha = 1 - this.#xOutwardSteps / this.#xOutwardWidth;
            this.corners[i].update(this.#cellVector.currentx, this.#cellVector.currenty, this.#cellVector.currentlength, currentAlpha);
        }
    }
    draw(ctx) {
        //NOTE - draw the cell
        ctx.fillStyle = `rgba(${this.#color.r}, ${this.#color.g}, ${this.#color.b}, ${this.#color.a})`;
        ctx.fillRect(this.#cellVector.currentx, this.#cellVector.currenty, this.#cellVector.currentlength, this.#cellVector.currentlength);
        //NOTE - draw the walls
        for (let i = Directions.NORTH; i <= Directions.WEST; i++) {
            this.walls[i].draw(ctx);
        }
        //NOTE - draw the corners
        for (let i = CornerDirections.NORTHWEST; i <= CornerDirections.SOUTHWEST; i++) {
            this.corners[i].draw(ctx);
        }
        if (globals.debugModeOn) {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";
            ctx.font = "15px Arial";
            ctx.fillText(`${this.gridx},${this.gridy}`, this.#cellVector.currentx + (this.#cellVector.currentlength / 2), this.#cellVector.currenty + (this.#cellVector.currentlength / 2));
        }
    }
    drawTitle(ctx, startx, starty) {
        const title = "-- Cell Info --";
        let xoffset = Debuger.length / 2 - ctx.measureText(title).width / 2;
        let yoffset = Debuger.textVOffset;
        ctx.fillText(title, startx + xoffset, starty + yoffset);
        current_line++;
    }
    drawInfo(ctx, startx, starty) {
        const cellAnimation = ["OUTWARDS", "INWARDS", "STOPPED", "TOORIGINE"];
        const cellStates = ["visited", "unvisited"];
        let yoffset = Debuger.textVOffset;
        let xoffset;
        let cellInfo = `-- Animation properties --`;
        {
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `x: ${this.#x.toFixed(3)} | y: ${this.#y.toFixed(3)} | Length: ${this.#length.toFixed(3)}`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `Velocity: ${this.#velocity.toFixed(3)}   |   Acceleration: ${this.#acceleration.toFixed(3)}`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `Animation: ${cellAnimation[this.#animation]}`;
            //` | color: rgba(${this.#color.r}, ${this.#color.g}, ${this.#color.b}, ${this.#color.a.toFixed(3)})`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `Color: rgba(${this.#color.r}, ${this.#color.g}, ${this.#color.b}, ${this.#color.a.toFixed(3)})`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `nextColor: rgba(${this.#nextColor.r}, ${this.#nextColor.g}, ${this.#nextColor.b}, ${this.#nextColor.a.toFixed(3)})`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `colorDists: rgba(${this.#colorDists.r}, ${this.#colorDists.g}, ${this.#colorDists.b}, ${this.#colorDists.a.toFixed(3)})`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `xOSteps: ${this.#xOutwardSteps.toFixed(3)} | xOWidth: ${this.#xOutwardWidth.toFixed(3)}`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `animation percentage: ${((this.#xOutwardSteps / this.#xOutwardWidth) * 100).toFixed(3)}%`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `ISFactor: ${this.#inwardScalingFactor.toFixed(3)} | OSFactor: ${this.#outwardScalingFactor.toFixed(3)}`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
        }
        cellInfo = `-- Cell Vector properties --`;
        {
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `sx: ${this.#cellVector.startx.toFixed(3)} | sy: ${this.#cellVector.starty.toFixed(3)}`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `ex: ${this.#cellVector.endx.toFixed(3)} | ey: ${this.#cellVector.endy.toFixed(3)}`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `cx: ${this.#cellVector.currentx.toFixed(3)} | cy: ${this.#cellVector.currenty.toFixed(3)}`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `clength: ${this.#cellVector.currentlength.toFixed(3)}`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
        }
        // setTextStyle(ctx, { textAlign: Debuger.textalign, textBaseline: Debuger.textBaseline, font: Debuger.textSize + "px " + Debuger.textFont, fillStyle: "red" })
        cellInfo = '-- Algorithm properties --';
        {
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            // setTextStyle(ctx, { textAlign: Debuger.textalign, textBaseline: Debuger.textBaseline, font: Debuger.textSize + "px " + Debuger.textFont, fillStyle: Debuger.textColor })
            cellInfo = `Gridx: ${this.gridx} | Gridy: ${this.gridy} | State: ${cellStates[this.#state]}`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `Links: ${this.#links.size}`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
            cellInfo = `No: ${this.north === null ? "null" : this.north.gridx + "," + this.north.gridy} | E: ${this.east === null ? "null" : this.east.gridx + "," + this.east.gridy} | S: ${this.south === null ? "null" : this.south.gridx + "," + this.south.gridy} | W: ${this.west === null ? "null" : this.west.gridx + "," + this.west.gridy}`;
            xoffset = Debuger.length / 2 - ctx.measureText(cellInfo).width / 2;
            yoffset += Debuger.textVOffset + Debuger.textSize;
            ctx.fillText(cellInfo, startx + xoffset, starty + yoffset);
            current_line++;
        }
    }
    drawDebug(ctx, startx, starty, index) {
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
}
