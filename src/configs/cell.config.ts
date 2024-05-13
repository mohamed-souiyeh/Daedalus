import { color } from "../types/color.type.ts";

export const CELLSIZE = 30;

// NOTE: the states i have in mind are:
// inQueue
// visited
// unvisited
// current

// rgba(147, 83, 211, 1)
// rgba(174, 126, 222, 1)
// rgba(69, 212, 131, 1)
// rgba(0, 111, 238, 1)
// rgba(247, 183, 80, 1)
// rgba(243, 18, 96, 1)
// rgba(201, 169, 233, 1)
// rgba(234, 227, 36, 1)
export const PATH_CELLCOLOR = {
  r: 234,
  g: 227,
  b: 36,
  a: 1,
}

// rgba(161, 161, 170, 1)
// rgba(251, 219, 167, 1)
// rgba(82, 82, 91, 1)
export const INQUEUE = {
  r: 102,
  g: 102,
  b: 111,
  a: 1,
}

//rgba(0, 68, 147, 1)
//rgba(0, 111, 238, 1)
export const CURRENT_CELLCOLOR = {
  r: 0,
  g: 111,
  b: 238,
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
  weighted,
  filter,
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


