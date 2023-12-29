import { Cell } from "./cell.js";
import { Corner } from "./corner.js";
import { Debuger } from "./debugger.js";
import { Wall } from "./wall.js";

export type t_mouse = {
  x: number;
  y: number;
};

export let mouse: t_mouse = {
  x: 0,
  y: 0
};

export enum inputDefaults {
  DELAY = 16,
  MINDELAY = 16,
  MAXDELAY = 1000,
  ISPAUSED = 0,
  DEBUGMODEON = 1,
  DEBUGBOOKLETISON = 0,
  MOUSECELLPOSISLOCKED = 0,
  DEFAULTDEBUGPAGEINDEX = 0,
  CELLDEBUGPAGESIZE = 250,
  CORNERDEBUGPAGESIZE = 250,
  WALLDEBUGPAGESIZE = 250,
  SUMMARYDEBUGPAGESIZE = 250,
}

const DELAYSTEP = 10;


export let delay: number = inputDefaults.DELAY;  // delay in ms

export let isPaused: boolean = inputDefaults.ISPAUSED as unknown as boolean;

export let debugModeOn: boolean = inputDefaults.DEBUGMODEON as unknown as boolean;

export let debugBookletIsOn: boolean = inputDefaults.DEBUGBOOKLETISON as unknown as boolean;

export let mouseCellPosIsLocked: boolean = inputDefaults.MOUSECELLPOSISLOCKED as unknown as boolean;

export let currentdebugPageIndex: number = inputDefaults.DEFAULTDEBUGPAGEINDEX;



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

  Debuger.size = inputDefaults.SUMMARYDEBUGPAGESIZE;

  Cell.debugPageSize = inputDefaults.CELLDEBUGPAGESIZE;

  Corner.debugPageSize = inputDefaults.CORNERDEBUGPAGESIZE;

  Wall.debugPageSize = inputDefaults.WALLDEBUGPAGESIZE;
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
  if (delay < 1) {
    delay = inputDefaults.DELAY;
    numberInput.value = String(delay);
  }
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

export enum pageIndexs {
  zero, //NOTE - this is the index of the first page summary page
  one, //NOTE - this is the index of the south west corner page
  two, //NOTE - this is the index of the south wall page
  three, //NOTE - this is the index of the south east corner page
  four, //NOTE - this is the index of the west wall page
  five, //NOTE - this is the index of the cell page
  six, //NOTE - this is the index of the east wall page
  seven, //NOTE - this is the index of the north west corner page
  eight, //NOTE - this is the index of the north wall page
  nine, //NOTE - this is the index of the north east corner page
}

export const debugPagesSize = [
  inputDefaults.SUMMARYDEBUGPAGESIZE,
  inputDefaults.CORNERDEBUGPAGESIZE,
  inputDefaults.WALLDEBUGPAGESIZE,
  inputDefaults.CORNERDEBUGPAGESIZE,
  inputDefaults.WALLDEBUGPAGESIZE,
  inputDefaults.CELLDEBUGPAGESIZE,
  inputDefaults.WALLDEBUGPAGESIZE,
  inputDefaults.CORNERDEBUGPAGESIZE,
  inputDefaults.WALLDEBUGPAGESIZE,
  inputDefaults.CORNERDEBUGPAGESIZE,
];

async function addKeyboardShortCutsEventListeners() {
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
    if (parseInt(event.key) >= pageIndexs.zero && parseInt(event.key) <= pageIndexs.nine) {
      currentdebugPageIndex = parseInt(event.key);

      //NOTE - to set the debugger window size
      Debuger.size = debugPagesSize[currentdebugPageIndex];

      console.log("currentdebugPageIndex => ", currentdebugPageIndex);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {

  await initDefaultStates();

  await addCanvasEventListeners();

  await addDelayInputEventListeners();

  await addPauseButtonEventListeners();

  await addDebugButtonEventListeners();

  await addKeyboardShortCutsEventListeners();
});