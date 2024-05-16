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

function relax(current: Cell, next: Cell) {
  if (next.distenceFromStart > current.distenceFromStart + next.weight) {
    next.distenceFromStart = current.distenceFromStart + next.weight;
    next.parrent = current;
    return true;
  }
  return false;
}

export function dijkstra(grid: Grid) {
  // console.log("queue before operation: ", globals.minQueue);

  const currentCell = globals.minQueue.dequeue();

  if (currentCell === undefined || typeof currentCell === "number") {
    toast.error("there is no path", {
      position: "top-center",
      autoClose: false,
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
      globals.minQueue.updatePriority(neighbor);
      neighbor.setState(CellStates.inqueue);
      if (neighbor.cellType === CellType.finish) {
        preparePath(grid, neighbor);
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


