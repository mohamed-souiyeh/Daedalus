
import { Bounce, toast } from "react-toastify";
import { Cell } from "../cell";
import { CellStates, CellType, Directions } from "../configs/cell.config";
import { globals } from "../configs/globals";
import { Grid } from "../grid";
import { Frame, algoState } from "../types/algos.types";

function preparePath(grid: Grid, currentCell: Cell) {
  globals.animatePath = true;
  let cell = currentCell;
  while (!(cell.gridx === globals.start.x && cell.gridy === globals.start.y)) {
    grid.path.push(cell);
    cell = cell.parrent as unknown as Cell;
  }
  grid.path.push(cell);
}

function distanceEstimationToEnd(current: Cell, finish: Cell | null): number {

  // NOTE: Manhattan distance
  return Math.abs(current.gridx - finish!.gridx) + Math.abs(current.gridy - finish!.gridy);
}

function relax(current: Cell, next: Cell) {
  const finish = globals.grid.at(globals.finish.x, globals.finish.y);
  if (next.distenceFromStart >= current.distenceFromStart + next.weight) {
    next.distenceFromStart = current.distenceFromStart + next.weight;
    next.priority = current.distenceFromStart + next.weight + distanceEstimationToEnd(next, finish);
    next.parrent = current;
    return true;
  }
  return false;
}

export function A_Star(grid: Grid) {

  const currentCell = globals.minQueue.dequeue();

  if (currentCell === undefined || typeof currentCell === "number") {
    if (globals.hotReload === false)
      toast.error("No Path Found", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

    return algoState.noPath;
  }

  let neighbors: (Cell | null)[] = currentCell.neighbors();

  while (neighbors.length) {
    const neighbor = neighbors.pop();

    if (neighbor === null)
      continue;

    if (neighbor && currentCell.islinked(neighbor) && relax(currentCell, neighbor)) {
      globals.minQueue.enqueue(neighbor);
      neighbor.setState(CellStates.inqueue);
      if (neighbor.cellType === CellType.finish) {
        preparePath(grid, neighbor);
        if (globals.hotReload === false)
          toast.success("Path Found", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
        return algoState.foundPath;
      }
    }
  }
  currentCell.setState(CellStates.visited);
  if (globals.minQueue.size() - 1) {
    const nextCurrent = globals.minQueue.peek();
    if (nextCurrent instanceof Cell)
      nextCurrent.setState(CellStates.current);
  }

  return algoState.searching;
}
