import { wallState } from "./wall.config";

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
  TOOLTIPDELAY = 300,
  DISABLETOOLTIP = 1000 * 60 * 60,
  DEFAULTTOOLTIPSTATE = DISABLETOOLTIP,
  DELAY = 800,
  MINDELAY = 8,
  MAXDELAY = 1000,
  ISPAUSED = false as unknown as number,
  DEBUGMODEON = true as unknown as number,
  DEBUGBOOKLETISON = inputDefaults.DEBUGMODEON as unknown as number,
  MOUSECELLPOSISLOCKED = false as unknown as number,

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

  DEFAULTWALLSTATE = wallState.PRESENT,
}
