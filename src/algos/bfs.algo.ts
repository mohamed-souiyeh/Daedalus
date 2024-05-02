import { CellStates, Directions } from "../configs/cell.config";
import { globals } from "../configs/globals";
import { Grid } from "../grid";
import { Frame, algoState } from "../types/algos.types";


export function bfs(grid: Grid) {

  if (globals.searchQueue.size() === 0) {
    globals.skipAlgoAnimaiton = false;
    console.log("there is no Path");
    return algoState.noPath;
  }

  const current = globals.searchQueue.dequeue();
  const currentCell = grid.at(current!.x, current!.y);

  if (currentCell === null) {
    globals.skipAlgoAnimaiton = false;
    console.log("there is no cell here bro");
    return algoState.noPath;
  }

  if (currentCell.gridx === globals.finish.x && currentCell.gridy === globals.finish.y) {
    globals.skipAlgoAnimaiton = false;
    console.log("yeeep there is a path");
    return algoState.foundPath;
  }

  let nextDirection: Directions | undefined = undefined;

  while (current!.moves.length) {
    nextDirection = current!.moves.pop();

    if (nextDirection === undefined)
      continue;

    let nextCell = grid.at(current!.x, current!.y)!.neighbor(nextDirection);
    if (nextCell!.state === CellStates.unvisited) {
      nextCell?.setState(CellStates.inqueue);
      nextCell!.parrent = currentCell;
      nextCell!.distenceFromStart = nextCell!.parrent!.distenceFromStart + 1;

      let frame: Frame = new Frame(nextCell!.gridx, nextCell!.gridy, grid.currentAlgo);
      globals.searchQueue.enqueue(frame);
    }
  }
  currentCell.setState(CellStates.visited);
  grid.at(globals.searchQueue.peek()!.x, globals.searchQueue.peek()!.y)?.setState(CellStates.current);

  return algoState.searching;
}
