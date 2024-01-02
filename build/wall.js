import { WALLCOLOR, WALL_PERSENTAGE, WALL_TARGETEDALPHA, WallAnimation, wallState } from "./configs/wall.config.js";
import { Debuger } from "./debugger.js";
let current_line = 0;
const wallMoves = [
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
    static debugPageLength;
    static debugPageWidth;
    #x;
    #y;
    #posInCell;
    #length;
    #width;
    #state = wallState.PRESENT;
    #animation = WallAnimation.FADEIN;
    #targetedAlpha = WALL_TARGETEDALPHA;
    #color = Object.create(WALLCOLOR);
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
    drawTitle(ctx, startx, starty) {
        const title = `-- Wall Info --`;
        const xoffset = Debuger.length / 2 - ctx.measureText(title).width / 2;
        const yoffset = Debuger.textVOffset;
        ctx.fillText(title, startx + xoffset, starty + yoffset);
        current_line++;
    }
    drawDebug(ctx, startx, starty) {
        const directions = ["N", "E", "S", "W"];
        const wallStates = ["A", "P"];
        const wallAnimation = ["FADEOUT", "FADEIN", "STOPPED"];
        let yoffset = Debuger.textVOffset;
        this.drawTitle(ctx, startx, starty);
        let wallInfo = `x: ${this.#x.toFixed(3)}      |   y: ${this.#y.toFixed(3)}`;
        let xoffset = Debuger.textHOffset;
        yoffset += Debuger.textVOffset * (current_line) + Debuger.textSize * current_line;
        ;
        ctx.fillText(wallInfo, startx + xoffset, starty + yoffset);
        current_line++;
        wallInfo = `Length: ${this.#length.toFixed(3)} |   Width: ${this.#width.toFixed(3)}`;
        xoffset = Debuger.textHOffset;
        yoffset += Debuger.textVOffset + Debuger.textSize;
        ctx.fillText(wallInfo, startx + xoffset, starty + yoffset);
        current_line++;
        wallInfo = `Pos: ${directions[this.#posInCell]}           |   State: ${wallStates[this.#state]}`;
        xoffset = Debuger.textHOffset;
        yoffset += Debuger.textVOffset + Debuger.textSize;
        ctx.fillText(wallInfo, startx + xoffset, starty + yoffset);
        current_line++;
        wallInfo = `Animation: ${wallAnimation[this.#animation]} | TAlpha: ${this.#targetedAlpha}`;
        xoffset = Debuger.textHOffset;
        yoffset += Debuger.textVOffset + Debuger.textSize;
        ctx.fillText(wallInfo, startx + xoffset, starty + yoffset);
        current_line++;
        wallInfo = `color: rgba(${this.#color.r.toFixed(2)}, ${this.#color.g.toFixed(2)}, ${this.#color.b.toFixed(2)}, ${this.#color.a.toFixed(2)})`;
        xoffset = Debuger.textHOffset;
        yoffset += Debuger.textVOffset + Debuger.textSize;
        ctx.fillText(wallInfo, startx + xoffset, starty + yoffset);
        current_line = 0;
    }
}
