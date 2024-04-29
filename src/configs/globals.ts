import { algoState } from "../types/algos.types";
import { algosKeys } from "./algos.config";
import { inputDefaults } from "./defaults";

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

  // HACK: this is weird i know
  setDisableLaunch: null as any,
  handleResetButton: null as any,
}
