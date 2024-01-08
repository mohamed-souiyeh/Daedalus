import { globals } from "./input.js";
export async function setPauseButtonState(state, pauseButton) {
    globals.isPaused = state;
    if (globals.isPaused) {
        pauseButton.classList.remove('btn-success');
        pauseButton.classList.add('btn-primary');
        pauseButton.querySelector("i")?.classList.remove('fa-play');
        pauseButton.querySelector("i")?.classList.add('fa-pause');
    }
    else {
        pauseButton.classList.remove('btn-primary');
        pauseButton.classList.add('btn-success');
        pauseButton.querySelector("i")?.classList.remove('fa-pause');
        pauseButton.querySelector("i")?.classList.add('fa-play');
    }
}
export async function togglePause(pauseButton) {
    await setPauseButtonState(!globals.isPaused, pauseButton);
}
export async function addPauseButtonEventListeners(pauseButton) {
    pauseButton.addEventListener('click', async () => {
        await togglePause(pauseButton);
    });
}
