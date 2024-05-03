import svgPath from "svgpath";
import { Stack } from "../types/DataStructures/stack.type";
import { Frame } from "../types/algos.types";
import { algosKeys } from "./algos.config";
import { inputDefaults } from "./defaults";
import { Pos } from "../types/pos.type";
import { Queue } from "../types/DataStructures/queue.type";

export const globals = {
  canvas: null as HTMLCanvasElement | null,

  ctx: null as CanvasRenderingContext2D | null,

  setup: false as boolean,

  currentAnimation: 0 as number,

  delay: inputDefaults.DELAY as unknown as number,  // globals.delay in ms

  isPaused: inputDefaults.ISPAUSED as unknown as boolean,

  debugModeOn: inputDefaults.DEBUGMODEON as unknown as boolean,

  debugBookletIsOn: inputDefaults.DEBUGBOOKLETISON as unknown as boolean,

  mouseCellPosIsLocked: inputDefaults.MOUSECELLPOSISLOCKED as unknown as boolean,
  BookletMouseCellPosIsLocked: inputDefaults.MOUSECELLPOSISLOCKED as unknown as boolean,
  DebugMouseCellPosIsLocked: inputDefaults.MOUSECELLPOSISLOCKED as unknown as boolean,

  currentdebugPageIndex: inputDefaults.DEFAULTDEBUGPAGEINDEX as unknown as number,

  mazeBuildingAlgorithm: null as algosKeys | null,
  mazeSolvingAlgorithm: null as algosKeys | null,
  startAlgo: false as boolean,

  reset: false as boolean,

  // HACK: this is weird i know
  setDisableLaunch: null as any,
  handleResetButton: null as any,
  handleAlgoLaunch: null as any,

  // NOTE: i will put them here untill further notice (aka maybe until next refactor XD)
  skipAlgoAnimaiton: false as boolean,
  BuildStack: new Stack<Frame>(),
  searchQueue: new Queue<Frame>(),

  // NOTE: SVGs
  gridOffsetLeft: 0,
  gridOffsetTop: 0,
  start: { x: 0, y: 0, oldx: 0, oldy: 0 } as Pos,
  finish: { x: 1, y: 1, oldx: 1, oldy: 1 } as Pos,
  replaceStart: false,
  replaceFinish: false,
  homePath: svgPath,
  finishPath: svgPath,
}
