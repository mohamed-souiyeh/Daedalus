import { globals } from "./input.js";


export async function setDebugMode(state: boolean, debugButton: HTMLButtonElement) {
  globals.debugModeOn = state;


  if (globals.debugModeOn) {
    debugButton.classList.remove('btn-secondary');
    debugButton.classList.add('btn-primary');
    debugButton.querySelector("i")?.classList.remove('fa-bug-slash');
    debugButton.querySelector("i")?.classList.add('fa-bug');
  }
  else {
    debugButton.classList.remove('btn-primary');
    debugButton.classList.add('btn-secondary');
    debugButton.querySelector("i")?.classList.remove('fa-bug');
    debugButton.querySelector("i")?.classList.add('fa-bug-slash');
  }
}

export async function toggleDebugMode(debugButton: HTMLButtonElement) {
  setDebugMode(!globals.debugModeOn, debugButton);
}

export async function addDebugButtonEventListeners(debugButton: HTMLButtonElement) {
  debugButton.addEventListener('click', async () => {
    await toggleDebugMode(debugButton);
  });
}