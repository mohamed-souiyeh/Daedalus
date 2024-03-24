import { pageIndexs } from "../configs/defaults.ts";
import { debugPagesSize } from "../configs/input.config.ts";
import { Debuger } from "../debugger.ts";
import { globals } from "../configs/globals.ts";

//NOTE: - to index the debugPagesSize array
export const LENGTH = 0;
export const WIDTH = 1;

export async function addCanvasShortCutsEventListeners(canvas: HTMLCanvasElement) {
  canvas.addEventListener('keydown', async (event) => {
    if (parseInt(event.key) >= pageIndexs.summary && parseInt(event.key) <= pageIndexs.NE_corner) {
      globals.currentdebugPageIndex = parseInt(event.key);


      //NOTE: - to set the debugger window size
      Debuger.d_length = debugPagesSize[globals.currentdebugPageIndex][LENGTH];
      Debuger.d_width = debugPagesSize[globals.currentdebugPageIndex][WIDTH];
    }
  });
}
