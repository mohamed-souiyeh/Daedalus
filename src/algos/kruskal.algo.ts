import { Cell } from "../cell";
import { CellStates, cellDefaults } from "../configs/cell.config";
import { globals } from "../configs/globals";
import { Grid } from "../grid";
import { algoState } from "../types/algos.types";

const LEFT = 0;
const RIGHT = 1;


function merge(left: Cell, right: Cell) {
  left.link(right);
  left.setState(CellStates.visited);
  right.setState(CellStates.visited);

  const winner = Math.random() > 0.5 ? globals.setForCell.get(right) : globals.setForCell.get(left);
  const loser = winner === globals.setForCell.get(right) ? globals.setForCell.get(left) : globals.setForCell.get(right);
  const loserCell = winner === globals.setForCell.get(right) ? left : right;

  if (loser === undefined || winner === undefined)
    return;

  const losers = globals.cellsInSet.get(loser)?.length ? globals.cellsInSet.get(loser) : [loserCell];

  if (losers === undefined)
    return;

  for (let cell of losers) {
    globals.cellsInSet.get(winner)?.push(cell);
    globals.setForCell.set(cell, winner);
  }

  globals.cellsInSet.delete(loser);
}

export function kruskal(grid: Grid) {

  if (globals.kruskalNeighbors.length === 0) {
    return algoState.done;
  }

  while (globals.kruskalNeighbors.length) {

    const pair = globals.kruskalNeighbors.pop();

    if (pair === undefined)
      return algoState.done;

    const left = pair[LEFT];
    const right = pair[RIGHT];

    if (globals.setForCell.get(left) !== globals.setForCell.get(right)) {
      merge(left, right);
      break;
    }
  }
  return algoState.building;
}
