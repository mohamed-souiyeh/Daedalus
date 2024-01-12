import { Cell } from "../cell.ts";
import { inputDefaults, pageIndexs } from "../configs/defaults.ts";
import { globals } from "../configs/globals.ts";
import { debugPagesSize } from "../configs/input.config.ts";
import { Corner } from "../corner.ts";
import { Debuger } from "../debugger.ts";
import { Wall } from "../wall.ts";
import { addCanvasEventListeners } from "./Canvas.EventListeners.ts";
import { LENGTH, WIDTH, addCanvasShortCutsEventListeners } from "./Canvas.ShortCuts.EventListeners.ts";


export const setupEventListners = async () => {

  const canvas = globals.canvas as unknown as HTMLCanvasElement;

  canvas.setAttribute('tabindex', '0'); // make the canvas focusable

  async function initDefaultStates() {

    Debuger._length = debugPagesSize[globals.currentdebugPageIndex][LENGTH];
    Debuger._width = debugPagesSize[globals.currentdebugPageIndex][WIDTH];


    Cell.debugPage = pageIndexs.cell;
    Cell.debugPageLength = inputDefaults.CELLDEBUGPAGELENGTH;
    Cell.debugPageWidth = inputDefaults.CELLDEBUGPAGEWIDTH;

    Corner.debugPageLength = inputDefaults.CORNERDEBUGPAGELENGTH;
    Corner.debugPageWidth = inputDefaults.CORNERDEBUGPAGEWIDTH;

    Wall.debugPageLength = inputDefaults.WALLDEBUGPAGELENGTH;
    Wall.debugPageWidth = inputDefaults.WALLDEBUGPAGEWIDTH;
  }



  await initDefaultStates();

  await addCanvasEventListeners(canvas); //ANCHOR - DONE

  await addCanvasShortCutsEventListeners(canvas); //ANCHOR - DONE
};