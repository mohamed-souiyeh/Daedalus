import { globals } from "./Events/input.js";
import { resetShadowStyle, setShadowStyle } from "./canvas_ctx_style_manipulation/shadows.js";
import { setTextStyle } from "./canvas_ctx_style_manipulation/text.js";
import { CornerDirections, Directions } from "./configs/cell.config.js";
import { pageIndexs } from "./configs/defaults.js";
import { mouse } from "./configs/input.config.js";
const DEBUGGERCOLOR = "gray";
const SHADOWCOLOR = "gold";
let current_line = 0;
const CordAndPags = new Map([
    [8, Directions.NORTH],
    [2, Directions.SOUTH],
    [6, Directions.EAST],
    [4, Directions.WEST],
    [9, CornerDirections.NORTHEAST],
    [7, CornerDirections.NORTHWEST],
    [3, CornerDirections.SOUTHEAST],
    [1, CornerDirections.SOUTHWEST],
]);
var directions;
(function (directions) {
    directions[directions["UP"] = -1] = "UP";
    directions[directions["DOWN"] = 1] = "DOWN";
    directions[directions["LEFT"] = -1] = "LEFT";
    directions[directions["RIGHT"] = 1] = "RIGHT";
})(directions || (directions = {}));
export class Debuger {
    #x = 0;
    #y = 0;
    static length = 0;
    static width = 0;
    static textHOffset = 5;
    static textVOffset = 5;
    static textSize = 15;
    static textFont = "Arial";
    static textColor = "black";
    static textalign = "left";
    static textBaseline = "top";
    #offsetLeftFromMouse = 5;
    #offsetTopFromMouse = 5;
    constructor() { }
    update() {
        const horizontalDirection = mouse.x >= this.#offsetLeftFromMouse * 2 + Debuger.length ? directions.LEFT : directions.RIGHT;
        const verticalDirection = mouse.y >= this.#offsetTopFromMouse * 2 + Debuger.width ? directions.UP : directions.DOWN;
        let offset = horizontalDirection === directions.LEFT ? this.#offsetLeftFromMouse + Debuger.length : this.#offsetLeftFromMouse;
        this.#x = mouse.x + (offset * horizontalDirection);
        offset = verticalDirection === directions.UP ? this.#offsetTopFromMouse + Debuger.width : this.#offsetTopFromMouse;
        this.#y = mouse.y + (offset * verticalDirection);
    }
    drawline(ctx, x1, y1, xl, yl) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(xl, yl);
        ctx.stroke();
        ctx.closePath();
    }
    gridInfo(ctx, grid) {
        const title = "-- Grid Info --";
        let xoffset = Debuger.length / 2 - ctx.measureText(title).width / 2;
        let yoffset = Debuger.textVOffset;
        ctx.fillText(title, this.#x + xoffset, this.#y + yoffset);
        current_line++;
        let gridInfo = `Length: ${grid.length} | Width: ${grid.width} | Size: ${grid.size()}`;
        xoffset = (Debuger.length - ctx.measureText(gridInfo).width) / 2;
        yoffset += Debuger.textVOffset + Debuger.textSize;
        ctx.fillText(gridInfo, this.#x + xoffset, this.#y + yoffset);
        current_line++;
        gridInfo = `Start: x ${grid.startX}, y ${grid.startY} | Offsets: h ${grid.offsetLeft}, v ${grid.offsetTop}`;
        xoffset = (Debuger.length - ctx.measureText(gridInfo).width) / 2;
        yoffset += Debuger.textVOffset + Debuger.textSize;
        ctx.fillText(gridInfo, this.#x + xoffset, this.#y + yoffset);
        current_line++;
    }
    drawNumberInCenterOfRect(ctx, x, y, width, height, number) {
        const xoffset = width / 2 - ctx.measureText(number.toString()).width / 2;
        const yoffset = height / 2 - Debuger.textSize / 2;
        ctx.fillText(number.toString(), x + xoffset, y + yoffset);
    }
    drawCellDiagram(ctx) {
        const title = "-- Cell Diagram --";
        let xoffset = Debuger.length / 2 - ctx.measureText(title).width / 2;
        let yoffset = Debuger.textVOffset;
        //NOTE - stupid calibration
        yoffset += (Debuger.textVOffset * (current_line) + Debuger.textSize * current_line);
        ctx.fillText(title, this.#x + xoffset, this.#y + yoffset);
        current_line++;
        const size = Debuger.width;
        const cellSize = (size - ((yoffset + Debuger.textSize + Debuger.textVOffset) + (Debuger.textSize + Debuger.textVOffset * 2))) - 10; // - 10 is for the padding
        xoffset = (Debuger.length - cellSize) / 2;
        const cellx = this.#x + xoffset;
        const celly = (this.#y + (yoffset + Debuger.textSize + Debuger.textVOffset)) + 5;
        current_line = 0;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.strokeRect(cellx, celly, cellSize, cellSize);
        const wallPercentage = 0.25;
        this.drawNumberInCenterOfRect(ctx, cellx, celly, cellSize * wallPercentage, cellSize * wallPercentage, 7);
        this.drawNumberInCenterOfRect(ctx, cellx, celly + cellSize * wallPercentage, cellSize * wallPercentage, cellSize * (wallPercentage * 2), 4);
        let x = cellx + cellSize * wallPercentage;
        let y = celly;
        this.drawNumberInCenterOfRect(ctx, x, y, cellSize * (wallPercentage * 2), cellSize * wallPercentage, 8);
        this.drawNumberInCenterOfRect(ctx, x, y + cellSize * wallPercentage, cellSize * (wallPercentage * 2), cellSize * (wallPercentage * 2), 5);
        this.drawline(ctx, x, y, x, y + cellSize);
        x = cellx + cellSize * (1 - wallPercentage);
        y = celly;
        this.drawNumberInCenterOfRect(ctx, x, y, cellSize * wallPercentage, cellSize * wallPercentage, 9);
        this.drawNumberInCenterOfRect(ctx, x, y + cellSize * wallPercentage, cellSize * wallPercentage, cellSize * (wallPercentage * 2), 6);
        this.drawline(ctx, x, y, x, y + cellSize);
        x = cellx;
        y = celly + cellSize * wallPercentage;
        this.drawline(ctx, x, y, x + cellSize, y);
        x = cellx;
        y = celly + cellSize * (1 - wallPercentage);
        this.drawNumberInCenterOfRect(ctx, x, y, cellSize * wallPercentage, cellSize * wallPercentage, 1);
        this.drawNumberInCenterOfRect(ctx, x + cellSize * wallPercentage, y, cellSize * (wallPercentage * 2), cellSize * wallPercentage, 2);
        this.drawNumberInCenterOfRect(ctx, x + cellSize * (1 - wallPercentage), y, cellSize * wallPercentage, cellSize * wallPercentage, 3);
        this.drawline(ctx, x, y, x + cellSize, y);
    }
    draw(ctx, cell, grid) {
        if (!globals.debugBookletIsOn || cell === null)
            return;
        ctx.fillStyle = DEBUGGERCOLOR;
        setShadowStyle(ctx, { blur: 10, color: SHADOWCOLOR });
        ctx.fillRect(this.#x, this.#y, Debuger.length, Debuger.width);
        resetShadowStyle(ctx);
        setTextStyle(ctx, { textAlign: Debuger.textalign, textBaseline: Debuger.textBaseline, font: Debuger.textSize + "px " + Debuger.textFont, fillStyle: Debuger.textColor });
        // NOTE - writing the page index on debugger page
        const xoffset = Debuger.length / 2 - ctx.measureText(`-- x --`).width / 2;
        const yoffset = Debuger.width - Debuger.textSize - Debuger.textVOffset;
        ctx.fillText(`-- ${globals.currentdebugPageIndex} --`, this.#x + xoffset, this.#y + yoffset);
        if (globals.currentdebugPageIndex === pageIndexs.summary) {
            this.gridInfo(ctx, grid);
            this.drawCellDiagram(ctx);
            current_line = 0;
        }
        else {
            cell.drawDebug(ctx, this.#x, this.#y, CordAndPags.get(globals.currentdebugPageIndex));
        }
    }
}
