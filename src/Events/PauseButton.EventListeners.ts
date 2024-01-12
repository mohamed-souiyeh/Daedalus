import { globals } from "../configs/globals";



export async function setPauseButtonState(state: boolean, pauseButton: HTMLButtonElement) {
  globals.isPaused = state;

  if (globals.isPaused) {
    pauseButton.classList.remove('btn-success');
    pauseButton.classList.add('btn-primary');
    pauseButton.querySelector("i")?.classList.remove('fa-play');
    pauseButton.querySelector("i")?.classList.add('fa-pause');
  } else {
    pauseButton.classList.remove('btn-primary');
    pauseButton.classList.add('btn-success');
    pauseButton.querySelector("i")?.classList.remove('fa-pause');
    pauseButton.querySelector("i")?.classList.add('fa-play');
  }
}

export async function togglePause(pauseButton: HTMLButtonElement) {
  await setPauseButtonState(!globals.isPaused, pauseButton);
}

export async function addPauseButtonEventListeners(pauseButton: HTMLButtonElement) {

  pauseButton.addEventListener('click', async () => {
    await togglePause(pauseButton);
  });
}