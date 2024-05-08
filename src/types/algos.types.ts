import { shuffleCellDirections } from "../algos/randomWalkDFS.utils";
import { algosKeys } from "../configs/algos.config";
import { Directions } from "../configs/cell.config";

export enum algoState {
  noState,
  searching,
  building,
  foundPath,
  noPath,
  done,
}

export class Frame {
  x: number;
  y: number;
  moves: Directions[];

  constructor(x: number, y: number, algo: algosKeys) {
    this.x = x;
    this.y = y;

    // console.log(algo);
    if (algo === algosKeys.RandomWalkDFS)
      this.moves = shuffleCellDirections(shuffleCellDirections([Directions.NORTH, Directions.EAST, Directions.SOUTH, Directions.WEST]));
    else if (algo === algosKeys.BFS)
      this.moves = [Directions.EAST, Directions.SOUTH, Directions.WEST, Directions.NORTH];
  }
}
