import { WALL_PERSENTAGE, WallAnimation, wallState } from "./wall.js";
const CELLTARGETEDALPHA = 1;
const calculateWidth = (currentlength) => {
    return currentlength * WALL_PERSENTAGE;
};
const cornerMoves = [
    {
        xd: 0,
        yd: 0,
        xcornerOffset: 0,
        ycornerOffset: 0,
    },
    {
        xd: 1,
        yd: 0,
        xcornerOffset: 0,
        ycornerOffset: 0,
    },
    {
        xd: 1,
        yd: 1,
        xcornerOffset: 0,
        ycornerOffset: 0,
    },
    {
        xd: 0,
        yd: 1,
        xcornerOffset: 0,
        ycornerOffset: 0,
    },
];
export const CORNERCOLOR = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
};
export class Corner {
    static debugPageSize;
    #x;
    #y;
    #posInCell;
    #length;
    #width;
    #state = wallState.PRESENT;
    #animation = WallAnimation.FADEIN;
    #targetedAlpha = CELLTARGETEDALPHA;
    #color = CORNERCOLOR;
    //SECTION - initialization methods
    constructor() { }
    #initState = (state) => {
        this.#state = state;
        this.#targetedAlpha = state === wallState.PRESENT ? 0 : 1;
        this.#setAnimationAndTAlpha(state);
    };
    init(pos, cellx, celly, currentCellLength, color, state) {
        this.#posInCell = pos;
        this.#length = calculateWidth(currentCellLength);
        this.#width = calculateWidth(currentCellLength);
        this.#x =
            cellx + cornerMoves[pos].xd * (currentCellLength * (1 - WALL_PERSENTAGE));
        this.#y =
            celly + cornerMoves[pos].yd * (currentCellLength * (1 - WALL_PERSENTAGE));
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
        this.#targetedAlpha = state === wallState.PRESENT ? CELLTARGETEDALPHA : 0;
        this.#animation =
            state === wallState.PRESENT
                ? WallAnimation.FADEIN
                : WallAnimation.FADEOUT;
    };
    setcornerState(state) {
        if (this.#state === state)
            return;
        this.#state = state;
        this.#setAnimationAndTAlpha(state);
    }
    setStoppedAnimationRequirements() {
        this.#animation = WallAnimation.STOPPED;
        this.#color.a = this.#targetedAlpha;
    }
    //!SECTION
    //SECTION - animation methods
    update(cellCurrentx, cellCurrenty, cellCurrentLength, alpha) {
        this.#length = calculateWidth(cellCurrentLength);
        this.#width = calculateWidth(cellCurrentLength);
        this.#x =
            cellCurrentx +
                cornerMoves[this.#posInCell].xd *
                    (cellCurrentLength * (1 - WALL_PERSENTAGE));
        this.#y =
            cellCurrenty +
                cornerMoves[this.#posInCell].yd *
                    (cellCurrentLength * (1 - WALL_PERSENTAGE));
        this.#color.a = alpha;
    }
    draw(ctx) {
        ctx.fillStyle = `rgba(${this.#color.r},${this.#color.g},${this.#color.b},${this.#color.a})`;
        ctx.fillRect(this.#x, this.#y, this.#length, this.#width);
    }
    drawDebug(ctx, startx, starty, length, textHOffset, textVOffset) {
        const title = `-- Corner Info --`;
        const xoffset = length / 2 - ctx.measureText(title).width / 2;
        ctx.fillText(title, startx + xoffset, starty + textVOffset);
    }
}
