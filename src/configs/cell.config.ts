import { color } from "../types/color.type.ts";

export const CELLSIZE = 40;

// NOTE: the states i have in mind are:
// in queue
// visited
// unvisited
// current

export const CURRENT_CELLCOLOR = {
  r: 0,
  g: 150,
  b: 0,
  a: 1,
}

// rgba(153, 199, 251, 1)
export const UNVISITED_CELLCOLOR = {
  r: 255, // 153
  g: 255, // 199
  b: 255, // 251
  a: 1,
};

// rgba(153, 199, 251, 1)
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
  INWARDSSCALINGFACTOR = 0.2, // NOTE: make this and the outwards one the same just trust me bro it is a long story about bad programing
  OUTWARDSSCALINGFACTOR = 0.2,
  VELOCITY = 0.2,
  ACCELERATION = 0,
}

export enum CellStates {
  current,
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
  STOPPING,
  STOPPED,
  TOORIGINE,
  ITOORIGINE,
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


