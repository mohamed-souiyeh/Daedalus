import { inputDefaults } from "../configs/defaults.js";
import { globals } from "./input.js";
const DELAYSTEP = 10;
export async function updateDelay(newValue, numberInput) {
    // Do whatever else you need to do when the value changes
    // For example, update the globals.delay variable:
    globals.delay = newValue;
    console.log("globals.delay => ", globals.delay);
    if (globals.delay < 1) {
        globals.delay = inputDefaults.DELAY;
        numberInput.value = String(globals.delay);
        return;
    }
    else if (globals.delay > inputDefaults.MAXDELAY) {
        globals.delay = inputDefaults.MAXDELAY;
        numberInput.value = String(globals.delay);
        return;
    }
    else
        numberInput.value = String(globals.delay);
}
export async function incrementDelay(numberInput) {
    const value = parseInt(numberInput.value) + DELAYSTEP > inputDefaults.MAXDELAY ? inputDefaults.MAXDELAY : parseInt(numberInput.value) + DELAYSTEP;
    await updateDelay(value, numberInput);
}
export async function decrementDelay(numberInput) {
    const value = parseInt(numberInput.value) - DELAYSTEP < inputDefaults.MINDELAY ? inputDefaults.MINDELAY : parseInt(numberInput.value) - DELAYSTEP;
    await updateDelay(value, numberInput);
}
export async function addDelayInputEventListeners(numberInput, incrementButton, decrementButton) {
    incrementButton.addEventListener('click', async () => {
        await incrementDelay(numberInput);
    });
    decrementButton.addEventListener('click', async () => {
        await decrementDelay(numberInput);
    });
    numberInput.addEventListener('input', async () => {
        if (!/^\d*$/.test(numberInput.value)) {
            await updateDelay(inputDefaults.DELAY, numberInput);
        }
        else {
            await updateDelay(parseInt(numberInput.value), numberInput);
        }
    });
}
