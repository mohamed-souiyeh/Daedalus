import svgPath from "svgpath";
import { Stack } from "../types/DataStructures/stack.type";
import { Frame } from "../types/algos.types";
import { algosKeys } from "./algos.config";
import { inputDefaults } from "./defaults";
import { Pos } from "../types/pos.type";
import { Queue } from "../types/DataStructures/queue.type";
import { WallState } from "./wall.config";
import { Grid } from "../grid";
import { PriorityQueue } from "../types/DataStructures/priorityQueue.types";
import { Cell } from "../cell";


export enum iconsState {
  nostate,
  replacing,
  replaced,
};

export const globals = {
  grid: new Grid(0, 0),

  canvas: null as HTMLCanvasElement | null,

  ctx: null as CanvasRenderingContext2D | null,

  setup: false,

  currentAnimation: 0,

  delay: inputDefaults.DELAY as unknown as number,  // globals.delay in ms

  isPaused: inputDefaults.ISPAUSED as unknown as boolean,

  debugModeOn: inputDefaults.DEBUGMODEON as unknown as boolean,

  debugBookletIsOn: inputDefaults.DEBUGBOOKLETISON as unknown as boolean,

  WallsOn: inputDefaults.DEFAULTWALLSTATE as unknown as WallState,

  mouseCellPosIsLocked: inputDefaults.MOUSECELLPOSISLOCKED as unknown as boolean,
  BookletMouseCellPosIsLocked: inputDefaults.MOUSECELLPOSISLOCKED as unknown as boolean,
  DebugMouseCellPosIsLocked: inputDefaults.MOUSECELLPOSISLOCKED as unknown as boolean,

  currentdebugPageIndex: inputDefaults.DEFAULTDEBUGPAGEINDEX as unknown as number,

  mazeBuildingAlgorithm: null as algosKeys | null,
  mazeSolvingAlgorithm: null as algosKeys | null,

  algoSpeed: 1,
  algoSkipSpeed: 1,

  braid: false,
  braidingChance: 0.5,
  activateBraiding: false,
  setBraidingAnimation: null as any,

  startAlgo: false,
  animatePath: false,
  needclear: false,

  searchDistance: false,


  resetAnimation: true,
  algoAnimation: true,

  depthFilterOn: false,
  depthNumbers: inputDefaults.DEPTHNUMBERS as unknown as boolean,
  depthFilterPos: { x: 0, y: 0, oldx: 0, oldy: 0 } as Pos,
  replaceDepthFilterPos: false,
  updateDepthFilter: true,
  gridRedraw: false,
  colorComposition: {
    r: false,
    g: false,
    b: true,
  },


  addWeights: false,
  addWalls: false,


  placeholders: { startx: -1, starty: -1, finishx: -1, finishy: -1, filterx: -1, filtery: -1 },

  reset: false,
  hotReload: false,

  // HACK: this is weird i know
  setDisableLaunch: null as any,
  setDisableDepthFilter: null as any,
  stopAddingWeightedAnimation: null as any,
  handleResetButton: null as any,
  handleAlgoLaunch: null as any,
  maxDepth: -1 as number,

  // NOTE: i will put them here untill further notice (aka maybe until next refactor XD)
  skipAlgoAnimation: false,
  BuildStack: new Stack<Frame>(),
  BuildArray: [] as Frame[],
  searchQueue: new Queue<Frame>(),
  minQueue: new PriorityQueue<Cell>((rhs: Cell | number, lhs: Cell | number) => {
    if (typeof rhs === "number" || typeof lhs === "number")
      return false;
    return rhs.priority <= lhs.priority;
  }),
  kruskalNeighbors: [] as (Cell[])[],
  setForCell: new Map<Cell, number>,
  cellsInSet: new Map<number, Cell[]>,

  // NOTE: SVGs
  gridOffsetLeft: 0,
  gridOffsetTop: 0,
  start: { x: 0, y: 0, oldx: 0, oldy: 0 } as Pos,
  finish: { x: 1, y: 1, oldx: 1, oldy: 1 } as Pos,
  replaceStart: iconsState.nostate,
  replaceFinish: iconsState.nostate,
  homePath: svgPath,
  finishPath: svgPath,
  depthFilterPath: svgPath,
  weightedNodePath: svgPath,
  mouseUpdating: false,
}
