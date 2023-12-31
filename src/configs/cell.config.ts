import { color } from "../types/color.type.js";

export const CELLSIZE = 40;

export enum cellDefaults {
  INWARDSSCALINGFACTOR = 0.5,
  OUTWARDSSCALINGFACTOR = 0.3,
  VELOCITY = 0.5,
  ACCELERATION = 0,
}

export enum CellStates {
  visited,
  unvisited,
}

export const stateColors: Map<CellStates, color> = new Map([
  [CellStates.visited, {
    r: 0,
    g: 255,
    b: 0,
    a: 1
  }],
  [CellStates.unvisited, {
    r: 175,
    g: 216,
    b: 248,
    a: 1,
  }],
])

export enum CellAnimation {
  OUTWARDS,
  INWARDS,
  STOPPED,
  TOORIGINE,
}

export enum Directions {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export enum CornerDirections {
  NORTHWEST,
  NORTHEAST,
  SOUTHEAST,
  SOUTHWEST,
}


