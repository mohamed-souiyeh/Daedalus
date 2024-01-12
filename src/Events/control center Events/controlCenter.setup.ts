import { mazeGenerationAlgorithms, mazeSolvingAlgorithms } from "../../configs/controlCenter.config.ts";






async function setupMaseGenerationAlgorithmSelectElm(mazeGenerationAlgorithmElm: HTMLSelectElement) {

  const algorithms = Object.keys(mazeGenerationAlgorithms);

  for (const algorithm of algorithms) {
    const option = document.createElement('option');
    option.value = algorithm;
    option.innerText = mazeGenerationAlgorithms[algorithm];
    mazeGenerationAlgorithmElm.appendChild(option);
  }
}


async function setupMaseSolvingAlgorithmSelectElm(mazeSolvingAlgorithmElm: HTMLSelectElement) {
  const algorithms = Object.keys(mazeSolvingAlgorithms);

  for (const algorithm of algorithms) {
    const option = document.createElement('option');
    option.value = algorithm;
    option.innerText = mazeSolvingAlgorithms[algorithm];
    mazeSolvingAlgorithmElm.appendChild(option);
  }
}


export async function setupControlCenterEvents(controlCenter: HTMLDivElement) {
  const launchButton = controlCenter.querySelector('#launch-button') as HTMLButtonElement;

  const mazeGenerationAlgorithmElm = controlCenter.querySelector('#maze-generation-algorithm') as HTMLSelectElement;

  const mazeSolvingAlgorithmElm = controlCenter.querySelector('#maze-solving-algorithm') as HTMLSelectElement;

  await setupMaseGenerationAlgorithmSelectElm(mazeGenerationAlgorithmElm);

  await setupMaseSolvingAlgorithmSelectElm(mazeSolvingAlgorithmElm);

}