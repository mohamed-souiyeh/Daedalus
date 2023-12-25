export let mouse = {
    x: 0,
    y: 0
};
var inputDefaults;
(function (inputDefaults) {
    inputDefaults[inputDefaults["DELAY"] = 16] = "DELAY";
    inputDefaults[inputDefaults["MINDELAY"] = 16] = "MINDELAY";
    inputDefaults[inputDefaults["MAXDELAY"] = 1000] = "MAXDELAY";
    inputDefaults[inputDefaults["ISPAUSED"] = 0] = "ISPAUSED";
    inputDefaults[inputDefaults["DEBUGMODEON"] = 1] = "DEBUGMODEON";
    inputDefaults[inputDefaults["DEBUGBOOKLETISON"] = 0] = "DEBUGBOOKLETISON";
    inputDefaults[inputDefaults["MOUSECELLPOSISLOCKED"] = 0] = "MOUSECELLPOSISLOCKED";
    inputDefaults[inputDefaults["CURRENTDEBUGPAGEINDEX"] = 0] = "CURRENTDEBUGPAGEINDEX";
})(inputDefaults || (inputDefaults = {}));
const DELAYSTEP = 10;
export let delay; // delay in ms
export let isPaused;
export let debugModeOn;
export let debugBookletIsOn;
export let mouseCellPosIsLocked;
export let currentdebugPageIndex;
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
const numberInput = document.getElementById('number');
const incrementButton = document.getElementById('increment');
const decrementButton = document.getElementById('decrement');
const pauseButton = document.getElementById('pauseButton');
const debugButton = document.getElementById('debugButton');
async function initDefaultStates() {
    await updateDelay(inputDefaults.DELAY);
    isPaused = inputDefaults.ISPAUSED;
    debugModeOn = inputDefaults.DEBUGMODEON;
    debugBookletIsOn = inputDefaults.DEBUGBOOKLETISON;
    mouseCellPosIsLocked = inputDefaults.MOUSECELLPOSISLOCKED;
    currentdebugPageIndex = inputDefaults.CURRENTDEBUGPAGEINDEX;
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
    if (delay < 1) {
        delay = inputDefaults.DELAY;
        numberInput.value = String(delay);
    }
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
async function togglePause(pauseButton) {
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
export var pageIndexs;
(function (pageIndexs) {
    pageIndexs[pageIndexs["zero"] = 0] = "zero";
    pageIndexs[pageIndexs["one"] = 1] = "one";
    pageIndexs[pageIndexs["two"] = 2] = "two";
    pageIndexs[pageIndexs["three"] = 3] = "three";
    pageIndexs[pageIndexs["four"] = 4] = "four";
    pageIndexs[pageIndexs["five"] = 5] = "five";
    pageIndexs[pageIndexs["six"] = 6] = "six";
    pageIndexs[pageIndexs["seven"] = 7] = "seven";
    pageIndexs[pageIndexs["eight"] = 8] = "eight";
    pageIndexs[pageIndexs["nine"] = 9] = "nine";
})(pageIndexs || (pageIndexs = {}));
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
