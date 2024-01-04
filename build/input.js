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
export let delay = inputDefaults.DELAY; // delay in ms
export let isPaused = inputDefaults.ISPAUSED;
export let debugModeOn = inputDefaults.DEBUGMODEON;
export let debugBookletIsOn = inputDefaults.DEBUGBOOKLETISON;
export let mouseCellPosIsLocked = inputDefaults.MOUSECELLPOSISLOCKED;
export let currentdebugPageIndex = inputDefaults.DEFAULTDEBUGPAGEINDEX;
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
    const canvas = document.getElementById("canvas");
    canvas.setAttribute('tabindex', '0'); // make the canvas focusable
    const numberInput = document.getElementById('number');
    const incrementButton = document.getElementById('increment');
    const decrementButton = document.getElementById('decrement');
    const pauseButton = document.getElementById('pauseButton');
    const debugButton = document.getElementById('debugButton');
    async function initDefaultStates() {
        await updateDelay(inputDefaults.DELAY);
        await setPauseButtonState(inputDefaults.ISPAUSED);
        await setDebugMode(inputDefaults.DEBUGMODEON);
        debugBookletIsOn = inputDefaults.DEBUGBOOKLETISON;
        mouseCellPosIsLocked = inputDefaults.MOUSECELLPOSISLOCKED;
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
        canvas.addEventListener("mousemove", async function (event) {
            if (mouseCellPosIsLocked || !debugModeOn)
                return;
            mouse.x = event.x - canvas.offsetLeft;
            mouse.y = event.y - canvas.offsetTop;
            // console.log("mouse moved", mouse);
        });
        //NOTE - to lock mouse position
        canvas.addEventListener('mousedown', async function (event) {
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
        canvas.addEventListener('contextmenu', async function (event) {
            event.preventDefault();
        });
    }
    async function updateDelay(newValue) {
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
            const value = parseInt(numberInput.value) + DELAYSTEP > inputDefaults.MAXDELAY ? inputDefaults.MAXDELAY : parseInt(numberInput.value) + DELAYSTEP;
            await updateDelay(value);
        });
        decrementButton.addEventListener('click', async () => {
            const value = parseInt(numberInput.value) - DELAYSTEP < inputDefaults.MINDELAY ? inputDefaults.MINDELAY : parseInt(numberInput.value) - DELAYSTEP;
            await updateDelay(value);
        });
        numberInput.addEventListener('input', async () => {
            if (!/^\d*$/.test(numberInput.value)) {
                await updateDelay(inputDefaults.DELAY);
            }
            else {
                await updateDelay(parseInt(numberInput.value));
            }
        });
    }
    async function setPauseButtonState(state) {
        isPaused = state;
        isPaused ? pauseButton.setAttribute('class', 'btn btn-primary') : pauseButton.setAttribute('class', 'btn btn-success');
        isPaused ? pauseButton.querySelector("i")?.setAttribute('class', "fa fa-pause") : pauseButton.querySelector("i")?.setAttribute('class', "fa fa-play");
        // pauseButton.querySelector("span")!.textContent = isPaused ? 'Play' : 'Pause';
    }
    async function togglePause(pauseButton) {
        isPaused = !isPaused;
        isPaused ? pauseButton.setAttribute('class', 'btn btn-primary') : pauseButton.setAttribute('class', 'btn btn-success');
        isPaused ? pauseButton.querySelector("i")?.setAttribute('class', "fa fa-pause") : pauseButton.querySelector("i")?.setAttribute('class', "fa fa-play");
        // pauseButton.querySelector("span")!.textContent = isPaused ? 'Play' : 'Pause';
    }
    async function addPauseButtonEventListeners() {
        pauseButton.addEventListener('click', async () => {
            await togglePause(pauseButton);
        });
    }
    async function setDebugMode(state) {
        debugModeOn = state;
        debugModeOn ? debugButton.querySelector("i").setAttribute('class', "fa-solid fa-bug") : debugButton.querySelector("i").setAttribute('class', "fa-solid fa-bug-slash");
        //<i class="fa-solid fa-bug-slash"></i>
        debugModeOn ? debugButton.setAttribute('class', "btn btn-primary") : debugButton.setAttribute('class', "btn btn-secondary");
    }
    async function toggleDebugMode() {
        debugModeOn = !debugModeOn;
        debugModeOn ? debugButton.querySelector("i").setAttribute('class', "fa-solid fa-bug") : debugButton.querySelector("i").setAttribute('class', "fa-solid fa-bug-slash");
        debugModeOn ? debugButton.setAttribute('class', "btn btn-primary") : debugButton.setAttribute('class', "btn btn-secondary");
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
