import { Cell } from "../cell.ts";
import { inputDefaults, pageIndexs } from "../configs/defaults.ts";
import { debugPagesSize } from "../configs/input.config.ts";
import { Corner } from "../corner.ts";
import { Debuger } from "../debugger.ts";
import { Wall } from "../wall.ts";
import { addCanvasEventListeners } from "./Canvas.EventListeners.ts";
import { LENGTH, WIDTH, addCanvasShortCutsEventListeners } from "./Canvas.ShortCuts.EventListeners.ts";

export const globals = {
  canvas: null as HTMLCanvasElement | null,
  ctx: null as CanvasRenderingContext2D | null,

  delay: inputDefaults.DELAY as unknown as number,  // globals.delay in ms

  isPaused: inputDefaults.ISPAUSED as unknown as boolean,

  debugModeOn: inputDefaults.DEBUGMODEON as unknown as boolean,

  debugBookletIsOn: inputDefaults.DEBUGBOOKLETISON as unknown as boolean,

  mouseCellPosIsLocked: inputDefaults.MOUSECELLPOSISLOCKED as unknown as boolean,

  currentdebugPageIndex: inputDefaults.DEFAULTDEBUGPAGEINDEX as unknown as number,

  // mazeGenerationAlgorithm: 
}

export const setupEventListners = async () => {

  const canvas = globals.canvas as unknown as HTMLCanvasElement;

  canvas.setAttribute('tabindex', '0'); // make the canvas focusable

  async function initDefaultStates() {
    globals.delay = inputDefaults.DELAY as unknown as number;

    globals.isPaused = inputDefaults.ISPAUSED as unknown as boolean;

    globals.debugModeOn = inputDefaults.DEBUGMODEON as unknown as boolean;

    globals.debugBookletIsOn = inputDefaults.DEBUGBOOKLETISON as unknown as boolean;

    globals.mouseCellPosIsLocked = inputDefaults.MOUSECELLPOSISLOCKED as unknown as boolean;

    globals.currentdebugPageIndex = inputDefaults.DEFAULTDEBUGPAGEINDEX;



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