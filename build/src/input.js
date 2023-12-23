export let mouse = {
    x: 0,
    y: 0
};
export let delay = 16; // delay in ms
export let isPaused = false;
export let debugModeOn = false;
export let debugRect = false;
export let mouseCellPossIsLocked = false;
document.addEventListener("DOMContentLoaded", function () {
    // Get the select elements and the button
    let mazeAlgorithmSelect = document.getElementById("build");
    let solveAlgorithmSelect = document.getElementById("solve");
    let launchButton = document.getElementById("launch");
    let canvas = document.getElementById("canvas");
    //? window.addEventListener("resize", resizeCanvas);
    //add event listener to the mouse move event
    canvas.addEventListener("mousemove", function (event) {
        if (mouseCellPossIsLocked || !debugModeOn)
            return;
        mouse.x = event.x - canvas.offsetLeft;
        mouse.y = event.y - canvas.offsetTop;
        // console.log("mouse moved", mouse);
    });
    canvas.addEventListener('mousedown', function (event) {
        if (event.button === 0) {
            mouseCellPossIsLocked = true;
            mouse.x = event.x - canvas.offsetLeft;
            mouse.y = event.y - canvas.offsetTop;
        }
        else if (event.button === 2) {
            mouseCellPossIsLocked = false;
            mouse.x = event.x - canvas.offsetLeft;
            mouse.y = event.y - canvas.offsetTop;
        }
    });
    canvas.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    });
    // Add an event listener to the mazeAlgorithm select
    mazeAlgorithmSelect.addEventListener("change", function () {
        // Enable the solveAlgorithm select when a maze algorithm is selected
        solveAlgorithmSelect.disabled = false;
        checkSelections();
    });
    // Add an event listener to the solveAlgorithm select
    solveAlgorithmSelect.addEventListener("change", function () {
        checkSelections();
    });
    function checkSelections() {
        // If both selects have a value, enable the button
        if (mazeAlgorithmSelect.value && solveAlgorithmSelect.value) {
            launchButton.disabled = false;
        }
    }
    let numberInput = document.getElementById('number');
    let incrementButton = document.getElementById('increment');
    let decrementButton = document.getElementById('decrement');
    delay = parseInt(numberInput.value);
    function updateDelay(newValue) {
        // Do whatever else you need to do when the value changes
        // For example, update the delay variable:
        delay = newValue;
        if (delay < 1) {
            console.log("delay < 16");
            delay = 16;
            numberInput.value = String(delay);
        }
    }
    incrementButton.addEventListener('click', function () {
        numberInput.value = String(parseInt(numberInput.value) + 10);
        updateDelay(parseInt(numberInput.value));
    });
    decrementButton.addEventListener('click', function () {
        numberInput.value = String(parseInt(numberInput.value) - 10 < 10 ? 10 : parseInt(numberInput.value) - 10);
        updateDelay(parseInt(numberInput.value));
    });
    numberInput.addEventListener('input', function () {
        if (!/^\d*$/.test(numberInput.value)) {
            numberInput.value = "16";
            updateDelay(16);
        }
        else {
            updateDelay(parseInt(numberInput.value));
        }
    });
    const pauseButton = document.getElementById('pauseButton');
    function togglePause(pauseButton) {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    }
    pauseButton.addEventListener('click', function () {
        togglePause(pauseButton);
    });
    window.addEventListener('keydown', function (event) {
        if (event.code === 'Space') {
            togglePause(pauseButton);
        }
        if (event.code === 'KeyD') {
            toggleDebugMode();
        }
        if (event.code === 'KeyR') {
            debugRect = !debugRect;
        }
    });
    const debugButton = document.getElementById('debugButton');
    function toggleDebugMode() {
        debugModeOn = !debugModeOn;
        debugButton.textContent = debugModeOn ? 'Debug On' : 'Debug Off';
        debugButton.style.backgroundColor = debugModeOn ? 'green' : 'red';
    }
    debugButton.addEventListener('click', function () {
        toggleDebugMode();
    });
});
