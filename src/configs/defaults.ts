import { WallState } from "./wall.config";

export enum pageIndexs {
  summary, //NOTE - this is the index of the first page summary page
  SW_corner, //NOTE - this is the index of the south west corner page
  S_wall, //NOTE - this is the index of the south wall page
  SE_corner, //NOTE - this is the index of the south east corner page
  W_wall, //NOTE - this is the index of the west wall page
  cell, //NOTE - this is the index of the cell page
  E_wall, //NOTE - this is the index of the east wall page
  NW_corner, //NOTE - this is the index of the north west corner page
  N_wall, //NOTE - this is the index of the north wall page
  NE_corner, //NOTE - this is the index of the north east corner page
}

export enum inputDefaults {
  NODEWEIGHT = 10,
  TOOLTIPDELAY = 300,
  DISABLETOOLTIP = 1000 * 60 * 60,
  DEFAULTTOOLTIPSTATE = DISABLETOOLTIP,
  DELAY = 8,
  MINDELAY = 8,
  MAXDELAY = 1000,
  ALGOSPEED = 2, // NOTE: the higher this number the slower it is XD
  ISPAUSED = false as unknown as number,
  DEBUGMODEON = false as unknown as number,
  DEBUGBOOKLETISON = false as unknown as number,
  MOUSECELLPOSISLOCKED = false as unknown as number,
  DEPTHNUMBERS = false as unknown as number,

  DEFAULTDEBUGPAGEINDEX = pageIndexs.cell,

  //NOTE - debug booklet pages sizes
  CELLDEBUGPAGELENGTH = 290,
  CELLDEBUGPAGEWIDTH = 420,

  CORNERDEBUGPAGELENGTH = 250,
  CORNERDEBUGPAGEWIDTH = 150,

  WALLDEBUGPAGELENGTH = 250,
  WALLDEBUGPAGEWIDTH = 150,

  SUMMARYDEBUGPAGELENGTH = 250,
  SUMMARYDEBUGPAGEWIDTH = 250,

  DEFAULTWALLSTATE = WallState.ABSENT,
}
