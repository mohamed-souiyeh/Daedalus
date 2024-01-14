import { color } from "../types/color.type.ts";

export const CELLSIZE = 40;

const colore = "rgba(006FEE)"

export const UNVISITED_CELLCOLOR = {
  r: 153,
  g: 199,
  b: 251,
  a: 1,
};


export const VISITED_CELLCOLOR = {
  r: 153,
  g: 199,
  b: 251,
  a: 1,
};


// {
//   r: 0,
//   g: 255,
//   b: 0,
//   a: 1,
// };

export enum cellDefaults {
  INWARDSSCALINGFACTOR = 0.3,
  OUTWARDSSCALINGFACTOR = 0.3,
  VELOCITY = 0.5,
  ACCELERATION = 0,
}

export enum CellStates {
  visited,
  unvisited,
}

export const stateColors: Map<CellStates, color> = new Map([
  [CellStates.visited, Object.create(VISITED_CELLCOLOR)],
  [CellStates.unvisited, Object.create(UNVISITED_CELLCOLOR)],
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


