import { algosKeys } from "../configs/algos.config";
import { CellStates, Directions } from "../configs/cell.config";
import { globals } from "../configs/globals";
import { Grid } from "../grid";
import { Frame, algoState } from "../types/algos.types";



export function prim(grid: Grid) {

  if (globals.BuildArray.length === 0) {
    return algoState.done;
  }

  while (globals.BuildArray.length) {
    const index = Math.floor(Math.random() * (globals.BuildArray.length - 1));
    const currentFrame = globals.BuildArray[index];
    const currentCell = grid.at(currentFrame!.x, currentFrame!.y);

    if (currentCell === null) {
      return algoState.done;
    }

    const availableNaighbors = currentCell.neighbors().filter((cell) => {
      return (cell !== null && cell.links().size === 0);
    }).sort(() => Math.random() - 0.5);

    if (availableNaighbors.length) {
      const neighbor = availableNaighbors.pop();

      if (neighbor !== undefined) {
        currentCell.link(neighbor);
        globals.BuildArray.push(new Frame(neighbor!.gridx, neighbor!.gridy, algosKeys.prim));
        currentCell.setState(CellStates.visited);
        neighbor?.setState(CellStates.visited);
      }
      break;
    }
    else
      globals.BuildArray.splice(index, 1);
  }

  return algoState.building;
}
