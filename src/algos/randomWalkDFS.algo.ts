import { Cell } from "../cell";
import { CellStates, Directions } from "../configs/cell.config";
import { globals } from "../configs/globals";
import { Grid } from "../grid";
import { Frame, algoState } from "../types/algos.types";


export function randomWalkDFS(grid: Grid): algoState {

  let currentFrame: Frame | undefined = undefined;
  let nextCell: Cell | null = null;
  let currentCell: Cell | null = null;

  while (nextCell === null) {
    currentFrame = globals.BuildStack.peek();
    console.log("currentFrame: ", currentFrame);
    if (!currentFrame)
      break;

    currentCell = grid.at(currentFrame.x, currentFrame.y)

    let nextDirection: Directions | undefined = undefined;

    while (currentFrame.moves.length) {

      nextDirection = currentFrame.moves.pop();
      if (!nextDirection)
        break;

      nextCell = currentCell!.neighbor(nextDirection);
      if (nextCell === null || nextCell.state === CellStates.visited)
        continue;
      else
        break;
    }

    if (nextDirection === undefined)
      globals.BuildStack.pop();
    if (nextCell)
      break;
  }

  if (currentFrame === undefined)
    return algoState.done;

  currentCell!.setState(CellStates.visited);

  const toPush = new Frame(nextCell!.gridx, nextCell!.gridy);

  currentCell!.link(nextCell, true);

  globals.BuildStack.push(toPush);
  return algoState.building;
}
