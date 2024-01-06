import { mazeGenerationAlgorithms, mazeSolvingAlgorithms } from "../../configs/controlCenter.config.js";
async function setupMaseGenerationAlgorithmSelectElm(mazeGenerationAlgorithmElm) {
    const algorithms = Object.keys(mazeGenerationAlgorithms);
    for (const algorithm of algorithms) {
        const option = document.createElement('option');
        option.value = algorithm;
        option.innerText = mazeGenerationAlgorithms[algorithm];
        mazeGenerationAlgorithmElm.appendChild(option);
    }
}
async function setupMaseSolvingAlgorithmSelectElm(mazeSolvingAlgorithmElm) {
    const algorithms = Object.keys(mazeSolvingAlgorithms);
    for (const algorithm of algorithms) {
        const option = document.createElement('option');
        option.value = algorithm;
        option.innerText = mazeSolvingAlgorithms[algorithm];
        mazeSolvingAlgorithmElm.appendChild(option);
    }
}
export async function setupControlCenterEvents(controlCenter) {
    const launchButton = controlCenter.querySelector('#launch-button');
    const mazeGenerationAlgorithmElm = controlCenter.querySelector('#maze-generation-algorithm');
    const mazeSolvingAlgorithmElm = controlCenter.querySelector('#maze-solving-algorithm');
    await setupMaseGenerationAlgorithmSelectElm(mazeGenerationAlgorithmElm);
    await setupMaseSolvingAlgorithmSelectElm(mazeSolvingAlgorithmElm);
}
