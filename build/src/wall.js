export const WALL_PERSENTAGE = 0.1;
const WALL_TARGETEDALPHA = 1;
export var WallAnimation;
(function (WallAnimation) {
    WallAnimation[WallAnimation["FADEOUT"] = 0] = "FADEOUT";
    WallAnimation[WallAnimation["FADEIN"] = 1] = "FADEIN";
    WallAnimation[WallAnimation["STOPPED"] = 2] = "STOPPED";
})(WallAnimation || (WallAnimation = {}));
export var wallState;
(function (wallState) {
    wallState[wallState["PRESENT"] = 1] = "PRESENT";
    wallState[wallState["ABSENT"] = -1] = "ABSENT";
})(wallState || (wallState = {}));
export const wallMoves = [
    {
        xd: 0,
        yd: 0,
        cl: (currentlength) => {
            return currentlength - currentlength * (WALL_PERSENTAGE * 2);
        },
        cw: (currentlength) => {
            return currentlength * WALL_PERSENTAGE;
        },
        xcornerOffset: 1,
        ycornerOffset: 0,
    },
    {
        xd: 1,
        yd: 0,
        cl: (currentlength) => {
            return currentlength * WALL_PERSENTAGE;
        },
        cw: (currentlength) => {
            return currentlength - currentlength * (WALL_PERSENTAGE * 2);
        },
        xcornerOffset: 0,
        ycornerOffset: 1,
    },
    {
        xd: 0,
        yd: 1,
        cl: (currentlength) => {
            return currentlength - currentlength * (WALL_PERSENTAGE * 2);
        },
        cw: (currentlength) => {
            return currentlength * WALL_PERSENTAGE;
        },
        xcornerOffset: 1,
        ycornerOffset: 0,
    },
    {
        xd: 0,
        yd: 0,
        cl: (currentlength) => {
            return currentlength * WALL_PERSENTAGE;
        },
        cw: (currentlength) => {
            return currentlength - currentlength * (WALL_PERSENTAGE * 2);
        },
        xcornerOffset: 0,
        ycornerOffset: 1,
    },
];
export class Wall {
    #posInCell;
    #x;
    #y;
    #length;
    #width;
    #state = wallState.PRESENT;
    #animation = WallAnimation.FADEIN;
    #targetedAlpha = WALL_TARGETEDALPHA;
    #color = {
        r: 0,
        g: 0,
        b: 0,
        a: 0,
    };
    #calculateLength;
    #calculateWidth;
    //SECTION - initialization methods
    constructor() { }
    #initState = (state) => {
        this.#state = state;
        this.#color.a = state === wallState.PRESENT ? 0 : WALL_TARGETEDALPHA;
        this.#setAnimationAndTAlpha(state);
    };
    init(pos, cellx, celly, currentCellLength, color, state) {
        this.#posInCell = pos;
        this.#calculateLength = wallMoves[pos].cl;
        this.#calculateWidth = wallMoves[pos].cw;
        this.#length = this.#calculateLength(currentCellLength);
        this.#width = this.#calculateWidth(currentCellLength);
        let offsetWidth = this.#length < this.#width ? this.#length : this.#width;
        this.#x =
            cellx +
                offsetWidth * wallMoves[pos].xcornerOffset +
                wallMoves[pos].xd * (currentCellLength * (1 - WALL_PERSENTAGE));
        this.#y =
            celly +
                offsetWidth * wallMoves[pos].ycornerOffset +
                wallMoves[pos].yd * (currentCellLength * (1 - WALL_PERSENTAGE));
        this.#color = color;
        this.#initState(state);
    }
    //!SECTION
    //SECTION - getters and setters
    getState() {
        return this.#state;
    }
    getAnimation() {
        return this.#animation;
    }
    getTargetedAlpha() {
        return this.#targetedAlpha;
    }
    #setAnimationAndTAlpha = (state) => {
        this.#targetedAlpha = state === wallState.PRESENT ? WALL_TARGETEDALPHA : 0;
        this.#animation =
            state === wallState.PRESENT
                ? WallAnimation.FADEIN
                : WallAnimation.FADEOUT;
    };
    setWallState(state) {
        if (state === this.#state)
            return false;
        this.#state = state;
        this.#setAnimationAndTAlpha(state);
        return true;
    }
    setStoppedAnimationRequirements() {
        this.#animation = WallAnimation.STOPPED;
        this.#color.a = this.#targetedAlpha;
    }
    //!SECTION
    //SECTION - animation methods
    update(cellCurrentx, cellCurrenty, currentCellLength, alpha) {
        this.#length = this.#calculateLength(currentCellLength);
        this.#width = this.#calculateWidth(currentCellLength);
        let offsetWidth = this.#length < this.#width ? this.#length : this.#width;
        this.#x =
            cellCurrentx +
                offsetWidth * wallMoves[this.#posInCell].xcornerOffset +
                wallMoves[this.#posInCell].xd * (currentCellLength * (1 - WALL_PERSENTAGE));
        this.#y =
            cellCurrenty +
                offsetWidth * wallMoves[this.#posInCell].ycornerOffset +
                wallMoves[this.#posInCell].yd * (currentCellLength * (1 - WALL_PERSENTAGE));
        this.#color.a = alpha;
    }
    draw(ctx) {
        ctx.fillStyle = `rgba(${this.#color.r},${this.#color.g},${this.#color.b},${this.#color.a})`;
        ctx.fillRect(this.#x, this.#y, this.#length, this.#width);
    }
    //!SECTION
    //SECTION - debug methods
    // write a debug function that will print all the wall information
    // to the console line by line in an organized manner
    debug() {
        console.log(`pos: ${this.#posInCell}`);
        console.log(`x: ${this.#x}`);
        console.log(`y: ${this.#y}`);
        console.log(`length: ${this.#length}`);
        console.log(`width: ${this.#width}`);
        console.log(`state: ${this.#state}`);
        console.log(`animation: ${this.#animation}`);
        console.log(`targetedAlpha: ${this.#targetedAlpha}`);
        console.log(`color: `, this.#color);
    }
}
