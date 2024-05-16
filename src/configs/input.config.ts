import { t_mouse } from "../types/mouse.type.ts";
import { inputDefaults } from "./defaults.ts";

export let mouse: t_mouse = {
  x: 0,
  y: 0,
  currentx: 0,
  currenty: 0,
  oldx: 0,
  oldy: 0,
  dx: 0,
  dy: 0,
  bx: 0,
  by: 0,
};

export const debugPagesSize = [
  [
    inputDefaults.SUMMARYDEBUGPAGELENGTH,
    inputDefaults.SUMMARYDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.CORNERDEBUGPAGELENGTH,
    inputDefaults.CORNERDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.WALLDEBUGPAGELENGTH,
    inputDefaults.WALLDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.CORNERDEBUGPAGELENGTH,
    inputDefaults.CORNERDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.WALLDEBUGPAGELENGTH,
    inputDefaults.WALLDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.CELLDEBUGPAGELENGTH,
    inputDefaults.CELLDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.WALLDEBUGPAGELENGTH,
    inputDefaults.WALLDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.CORNERDEBUGPAGELENGTH,
    inputDefaults.CORNERDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.WALLDEBUGPAGELENGTH,
    inputDefaults.WALLDEBUGPAGEWIDTH
  ],
  [
    inputDefaults.CORNERDEBUGPAGELENGTH,
    inputDefaults.CORNERDEBUGPAGEWIDTH
  ],
];
