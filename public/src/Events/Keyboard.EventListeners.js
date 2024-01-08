import { toggleDebugMode } from "./DebugButton.EventListeners.js";
import { decrementDelay, incrementDelay } from "./Delay.EventListeners.js";
import { togglePause } from "./PauseButton.EventListeners.js";
import { globals } from "./input.js";
export async function addKeyboardEventListners(controlCenterButton, pauseButton, debugButton, numberInput) {
    window.addEventListener('keydown', async (event) => {
        console.log("event => ", event);
        if (event.code === 'KeyC') {
            controlCenterButton.click();
            controlCenterButton.blur();
        }
        if (event.code === 'KeyP') {
            await togglePause(pauseButton);
        }
        if (event.code === 'KeyD') {
            await toggleDebugMode(debugButton);
        }
        if (event.code === 'KeyB') {
            globals.debugBookletIsOn = !globals.debugBookletIsOn;
        }
        if (event.code === 'NumpadSubtract') {
            await decrementDelay(numberInput);
        }
        if (event.code === 'NumpadAdd') {
            await incrementDelay(numberInput);
        }
    });
}
