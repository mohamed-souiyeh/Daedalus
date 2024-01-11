import { Cell } from "../cell.js";
import { inputDefaults, pageIndexs } from "../configs/defaults.js";
import { debugPagesSize } from "../configs/input.config.js";
import { Corner } from "../corner.js";
import { Debuger } from "../debugger.js";
import { Wall } from "../wall.js";
import { addCanvasEventListeners } from "./Canvas.EventListeners.js";
import { LENGTH, WIDTH, addCanvasShortCutsEventListeners } from "./Canvas.ShortCuts.EventListeners.js";
import { addDebugButtonEventListeners, setDebugMode } from "./DebugButton.EventListeners.js";
import { addDelayInputEventListeners, updateDelay } from "./Delay.EventListeners.js";
import { addKeyboardEventListners } from "./Keyboard.EventListeners.js";
import { addPauseButtonEventListeners, setPauseButtonState } from "./PauseButton.EventListeners.js";
import { setupControlCenterEvents } from "./control center Events/controlCenter.setup.js";

export const globals = {
  delay: inputDefaults.DELAY as unknown as number,  // globals.delay in ms

  isPaused: inputDefaults.ISPAUSED as unknown as boolean,

  debugModeOn: inputDefaults.DEBUGMODEON as unknown as boolean,

  debugBookletIsOn: inputDefaults.DEBUGBOOKLETISON as unknown as boolean,

  mouseCellPosIsLocked: inputDefaults.MOUSECELLPOSISLOCKED as unknown as boolean,

  currentdebugPageIndex: inputDefaults.DEFAULTDEBUGPAGEINDEX as unknown as number,

  // mazeGenerationAlgorithm: 
}

export const setupEventListners = async () => {

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  console.log("canvas => ", canvas);
  canvas.setAttribute('tabindex', '0'); // make the canvas focusable

  const numberInput = document.getElementById('number-input') as HTMLInputElement;
  const incrementButton = document.getElementById('increment') as HTMLButtonElement;
  const decrementButton = document.getElementById('decrement') as HTMLButtonElement;
  const pauseButton = document.getElementById('pauseButton') as HTMLButtonElement;
  const debugButton = document.getElementById('debugButton') as HTMLButtonElement;
  const resetButton = document.getElementById('resetButton') as HTMLButtonElement;
  const controlCenterButton = document.getElementById('controleCenterButton') as HTMLButtonElement;

  // const controlCenter = document.getElementById('control-center') as HTMLDivElement;

  async function initDefaultStates() {
    await updateDelay(inputDefaults.DELAY, numberInput);

    await setPauseButtonState(inputDefaults.ISPAUSED as unknown as boolean, pauseButton);

    await setDebugMode(inputDefaults.DEBUGMODEON as unknown as boolean, debugButton);

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

  await addCanvasEventListeners(canvas);

  await addDelayInputEventListeners(numberInput, incrementButton, decrementButton);

  await addDebugButtonEventListeners(debugButton);

  await addPauseButtonEventListeners(pauseButton);

  await addCanvasShortCutsEventListeners(canvas);

  await addKeyboardEventListners(controlCenterButton, pauseButton, debugButton, numberInput);

  // await setupControlCenterEvents(controlCenter);

});