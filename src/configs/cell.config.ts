import { color } from "../types/color.type.ts";

export const CELLSIZE = 30;

// NOTE: the states i have in mind are:
// inQueue
// visited
// unvisited
// current

export const PATH_CELLCOLOR = {
  r: 200,
  g: 0,
  b: 250,
  a: 1,
}

export const INQUEUE = {
  r: 200,
  g: 200,
  b: 0,
  a: 1,
}

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

export enum CellType {
  start,
  finish,
  air,
  whater,
}

export enum CellStates {
  current,
  inqueue,
  visited,
  unvisited,
  path,
}

export const stateColors: Map<CellStates, color> = new Map([
  [CellStates.current, Object.create(CURRENT_CELLCOLOR)],
  [CellStates.inqueue, Object.create(INQUEUE)],
  [CellStates.visited, Object.create(VISITED_CELLCOLOR)],
  [CellStates.unvisited, Object.create(UNVISITED_CELLCOLOR)],
  [CellStates.path, Object.create(PATH_CELLCOLOR)],
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


