import { shuffleCellDirections } from "../algos/randomWalkDFS.utils";
import { Directions } from "../configs/cell.config";

export enum algoState {
  noState,
  searching,
  foundPath,
  noPath,
  done,

  building,

}

export class Frame {
  x: number;
  y: number;
  moves: Directions[];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.moves = shuffleCellDirections([Directions.NORTH, Directions.EAST, Directions.SOUTH, Directions.WEST]);
  }
}
