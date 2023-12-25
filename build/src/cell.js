import { Corner } from "./corner.js";
import { debugModeOn } from "./input.js";
import { Wall, WallAnimation, wallState } from "./wall.js";
var cellDefaults;
(function (cellDefaults) {
    cellDefaults[cellDefaults["INWARDSSCALINGFACTOR"] = 0.5] = "INWARDSSCALINGFACTOR";
    cellDefaults[cellDefaults["OUTWARDSSCALINGFACTOR"] = 0.3] = "OUTWARDSSCALINGFACTOR";
    cellDefaults[cellDefaults["VELOCITY"] = 0.4] = "VELOCITY";
    cellDefaults[cellDefaults["ACCELERATION"] = 0] = "ACCELERATION";
})(cellDefaults || (cellDefaults = {}));
const INWARDSSCALINGFACTOR = cellDefaults.INWARDSSCALINGFACTOR;
const OUTWARDSSCALINGFACTOR = cellDefaults.OUTWARDSSCALINGFACTOR;
const VELOCITY = cellDefaults.VELOCITY;
const ACCELERATION = cellDefaults.ACCELERATION;
export var CellAnimation;
(function (CellAnimation) {
    CellAnimation[CellAnimation["OUTWARDS"] = 0] = "OUTWARDS";
    CellAnimation[CellAnimation["INWARDS"] = 1] = "INWARDS";
    CellAnimation[CellAnimation["STOPPED"] = 2] = "STOPPED";
    CellAnimation[CellAnimation["TOORIGINE"] = 3] = "TOORIGINE";
})(CellAnimation || (CellAnimation = {}));
export var Directions;
(function (Directions) {
    Directions[Directions["NORTH"] = 0] = "NORTH";
    Directions[Directions["EAST"] = 1] = "EAST";
    Directions[Directions["SOUTH"] = 2] = "SOUTH";
    Directions[Directions["WEST"] = 3] = "WEST";
})(Directions || (Directions = {}));
export var CornerDirections;
(function (CornerDirections) {
    CornerDirections[CornerDirections["NORTHWEST"] = 0] = "NORTHWEST";
    CornerDirections[CornerDirections["NORTHEAST"] = 1] = "NORTHEAST";
    CornerDirections[CornerDirections["SOUTHEAST"] = 2] = "SOUTHEAST";
    CornerDirections[CornerDirections["SOUTHWEST"] = 3] = "SOUTHWEST";
})(CornerDirections || (CornerDirections = {}));
export var CellStates;
(function (CellStates) {
    CellStates[CellStates["visited"] = 0] = "visited";
    CellStates[CellStates["unvisited"] = 1] = "unvisited";
})(CellStates || (CellStates = {}));
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
    #color = {
        r: 175, //175
        g: 216, //216
        b: 248, //248
        //TODO - implement the interpolation from color to another based on cell state
        a: 0.75,
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
            let color = {
                r: 12,
                g: 53,
                b: 71,
                a: 0,
            };
            this.walls[i].init(i, this.#x, this.#y, this.#cellVector.currentlength, color, wallState);
        }
        for (let i = CornerDirections.NORTHWEST; i <= CornerDirections.SOUTHWEST; i++) {
            let color = {
                r: 12,
                g: 53,
                b: 71,
                a: 0,
            };
            this.corners[i].init(i, this.#x, this.#y, this.#cellVector.currentlength, color, wallState);
        }
    }
    //!SECTION
    //SECTION - setters and getters
    getAnimation() {
        return this.#animation;
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
        if (debugModeOn) {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";
            ctx.font = "15px Arial";
            ctx.fillText(`${this.gridx},${this.gridy}`, this.#cellVector.currentx + (this.#cellVector.currentlength / 2), this.#cellVector.currenty + (this.#cellVector.currentlength / 2));
        }
    }
    drawDebug(ctx, startx, starty, length, textHOffset, textVOffset) {
        const cellAnimation = ["OUTWARDS", "INWARDS", "STOPPED", "TOORIGINE"];
        const cellStates = ["visited", "unvisited"];
        const directions = ["NORTH", "EAST", "SOUTH", "WEST"];
        const cornerDirections = ["NORTHWEST", "NORTHEAST", "SOUTHEAST", "SOUTHWEST"];
        const wallStates = ["ABSENT", "PRESENT"];
        const wallAnimation = ["FADEIN", "FADEOUT", "STOPPED"];
        let x = 0;
        let y = 0;
        ctx.fillText(`x: ${this.#x} y: ${this.#y}`, startx + x + textHOffset, starty + y + textVOffset);
        y += 20;
        ctx.fillText(`still needs work`, startx + x + textHOffset, starty + y + textVOffset);
        y += 20;
    }
}
