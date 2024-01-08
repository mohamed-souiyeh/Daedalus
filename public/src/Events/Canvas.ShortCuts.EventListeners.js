import { pageIndexs } from "../configs/defaults.js";
import { debugPagesSize } from "../configs/input.config.js";
import { Debuger } from "../debugger.js";
import { globals } from "./input.js";
export const LENGTH = 0;
export const WIDTH = 1;
export async function addCanvasShortCutsEventListeners(canvas) {
    canvas.addEventListener('keydown', async (event) => {
        if (parseInt(event.key) >= pageIndexs.summary && parseInt(event.key) <= pageIndexs.NE_corner) {
            globals.currentdebugPageIndex = parseInt(event.key);
            //NOTE - to set the debugger window size
            Debuger._length = debugPagesSize[globals.currentdebugPageIndex][LENGTH];
            Debuger._width = debugPagesSize[globals.currentdebugPageIndex][WIDTH];
        }
    });
}
