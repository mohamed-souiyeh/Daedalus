import { Cell } from "./cell.js";
import { inputDefaults, pageIndexs } from "./configs/defaults.js";
import { mouse } from "./configs/input.config.js";
import { Corner } from "./corner.js";
import { Debuger } from "./debugger.js";
import { Wall } from "./wall.js";



const LENGTH = 0;
const WIDTH = 1;
const debugPagesSize = [
  [
    inputDefaults.SUMMARYDEBUGPAGELENGTH,
    inputDefaults.SUMMARYDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.CORNERDEBUGPAGELENGTH,
    inputDefaults.CORNERDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.WALLDEBUGPAGELENGTH,
    inputDefaults.WALLDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.CORNERDEBUGPAGELENGTH,
    inputDefaults.CORNERDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.WALLDEBUGPAGELENGTH,
    inputDefaults.WALLDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.CELLDEBUGPAGELENGTH,
    inputDefaults.CELLDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.WALLDEBUGPAGELENGTH,
    inputDefaults.WALLDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.CORNERDEBUGPAGELENGTH,
    inputDefaults.CORNERDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.WALLDEBUGPAGELENGTH,
    inputDefaults.WALLDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.CORNERDEBUGPAGELENGTH,
    inputDefaults.CORNERDEBUGPAGEWIDTH
  ],
];

const DELAYSTEP = 10;


export let delay: number = inputDefaults.DELAY;  // delay in ms

export let isPaused: boolean = inputDefaults.ISPAUSED as unknown as boolean;

export let debugModeOn: boolean = inputDefaults.DEBUGMODEON as unknown as boolean;

export let debugBookletIsOn: boolean = inputDefaults.DEBUGBOOKLETISON as unknown as boolean;

export let mouseCellPosIsLocked: boolean = inputDefaults.MOUSECELLPOSISLOCKED as unknown as boolean;

export let currentdebugPageIndex: number = inputDefaults.DEFAULTDEBUGPAGEINDEX;


document.addEventListener("DOMContentLoaded", async () => {

  //TODO - needs to be reworked
  {
    // let mazeAlgorithmSelect = document.getElementById("build") as HTMLSelectElement;
    // let solveAlgorithmSelect = document.getElementById("solve") as HTMLSelectElement;
    // let launchButton = document.getElementById("launch") as HTMLButtonElement;
    // mazeAlgorithmSelect.addEventListener("change", function () {
    //   // Enable the solveAlgorithm select when a maze algorithm is selected
    //   solveAlgorithmSelect.disabled = false;
    //   checkSelections();
    // });

    // // Add an event listener to the solveAlgorithm select
    // solveAlgorithmSelect.addEventListener("change", function () {
    //   checkSelections();
    // });

    // function checkSelections() {
    //   // If both selects have a value, enable the button
    //   if (mazeAlgorithmSelect.value && solveAlgorithmSelect.value) {
    //     launchButton.disabled = false;
    //   }
    // }
  }

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.setAttribute('tabindex', '0'); // make the canvas focusable
  
  const numberInput = document.getElementById('number') as HTMLInputElement;
  const incrementButton = document.getElementById('increment') as HTMLButtonElement;
  const decrementButton = document.getElementById('decrement') as HTMLButtonElement;
  const pauseButton = document.getElementById('pauseButton') as HTMLButtonElement;
  const debugButton = document.getElementById('debugButton') as HTMLButtonElement;

  async function initDefaultStates() {
    await updateDelay(inputDefaults.DELAY);

    isPaused = inputDefaults.ISPAUSED as unknown as boolean;

    debugModeOn = inputDefaults.DEBUGMODEON as unknown as boolean;

    debugBookletIsOn = inputDefaults.DEBUGBOOKLETISON as unknown as boolean;

    mouseCellPosIsLocked = inputDefaults.MOUSECELLPOSISLOCKED as unknown as boolean;

    currentdebugPageIndex = inputDefaults.DEFAULTDEBUGPAGEINDEX;



    Debuger.length = debugPagesSize[currentdebugPageIndex][LENGTH];
    Debuger.width = debugPagesSize[currentdebugPageIndex][WIDTH];


    Cell.debugPage = pageIndexs.cell;
    Cell.debugPageLength = inputDefaults.CELLDEBUGPAGELENGTH;
    Cell.debugPageWidth = inputDefaults.CELLDEBUGPAGEWIDTH;

    Corner.debugPageLength = inputDefaults.CORNERDEBUGPAGELENGTH;
    Corner.debugPageWidth = inputDefaults.CORNERDEBUGPAGEWIDTH;

    Wall.debugPageLength = inputDefaults.WALLDEBUGPAGELENGTH;
    Wall.debugPageWidth = inputDefaults.WALLDEBUGPAGEWIDTH;
  }

  async function addCanvasEventListeners() {
    //NOTE - to update mouse position if not locked
    canvas.addEventListener("mousemove", async function (event: MouseEvent) {
      if (mouseCellPosIsLocked || !debugModeOn) return;
      mouse.x = event.x - canvas.offsetLeft;
      mouse.y = event.y - canvas.offsetTop;
      // console.log("mouse moved", mouse);
    });

    //NOTE - to lock mouse position
    canvas.addEventListener('mousedown', async function (event: MouseEvent) {
      if (event.button === 0) {
        mouseCellPosIsLocked = true;
        mouse.x = event.x - canvas.offsetLeft;
        mouse.y = event.y - canvas.offsetTop;
      }
      else if (event.button === 2) {
        mouseCellPosIsLocked = false;
        mouse.x = event.x - canvas.offsetLeft;
        mouse.y = event.y - canvas.offsetTop;
      }
    });

    //NOTE - this to prevent the cotext menu from aprearing when we right click
    canvas.addEventListener('contextmenu', async function (event: MouseEvent) {
      event.preventDefault();
    });
  }

  async function updateDelay(newValue: number) {
    // Do whatever else you need to do when the value changes
    // For example, update the delay variable:
    delay = newValue;
    console.log("delay => ", delay);
    if (delay < 1) {
      delay = inputDefaults.DELAY;
      numberInput.value = String(delay);
      return;
    }
    else if (delay > inputDefaults.MAXDELAY) {
      delay = inputDefaults.MAXDELAY;
      numberInput.value = String(delay);
      return;
    }
    else
      numberInput.value = String(delay);
  }

  async function addDelayInputEventListeners() {

    incrementButton.addEventListener('click', async () => {
      const value: number = parseInt(numberInput.value) + DELAYSTEP > inputDefaults.MAXDELAY ? inputDefaults.MAXDELAY : parseInt(numberInput.value) + DELAYSTEP;

      await updateDelay(value);
    });

    decrementButton.addEventListener('click', async () => {
      const value: number = parseInt(numberInput.value) - DELAYSTEP < inputDefaults.MINDELAY ? inputDefaults.MINDELAY : parseInt(numberInput.value) - DELAYSTEP;

      await updateDelay(value);
    });

    numberInput.addEventListener('input', async () => {
      if (!/^\d*$/.test(numberInput.value)) {
        await updateDelay(inputDefaults.DELAY);
      } else {
        await updateDelay(parseInt(numberInput.value));
      }
    });
  }


  async function togglePause(pauseButton: HTMLButtonElement) {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
  }

  async function addPauseButtonEventListeners() {

    pauseButton.addEventListener('click', async () => {
      await togglePause(pauseButton);
    });
  }


  async function toggleDebugMode() {
    debugModeOn = !debugModeOn;
    debugButton.textContent = debugModeOn ? 'Debug On' : 'Debug Off';
    debugButton.style.backgroundColor = debugModeOn ? 'green' : 'red';
  }

  async function addDebugButtonEventListeners() {
    debugButton.addEventListener('click', async () => {
      await toggleDebugMode();
    });
  }



  async function addCanvasShortCutsEventListeners() {
    canvas.addEventListener('keydown', async (event) => {
      if (parseInt(event.key) >= pageIndexs.summary && parseInt(event.key) <= pageIndexs.NE_corner) {
        currentdebugPageIndex = parseInt(event.key);

        //NOTE - to set the debugger window size
        Debuger.length = debugPagesSize[currentdebugPageIndex][LENGTH];
        Debuger.width = debugPagesSize[currentdebugPageIndex][WIDTH];

        console.log("event => ", event);
      }
    });
  }


  async function addKeyboardEventListners() {
    window.addEventListener('keydown', async (event) => {
      if (event.code === 'Space') {
        await togglePause(pauseButton);
      }
      if (event.code === 'KeyD') {
        await toggleDebugMode();
      }
      if (event.code === 'KeyB') {
        debugBookletIsOn = !debugBookletIsOn;
      }
    });
  }

  await initDefaultStates();

  await addCanvasEventListeners();

  await addDelayInputEventListeners();

  await addPauseButtonEventListeners();

  await addDebugButtonEventListeners();

  await addCanvasShortCutsEventListeners();

  await addKeyboardEventListners();
});