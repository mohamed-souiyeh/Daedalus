import { t_mouse } from "../types/mouse.type.ts";
import { inputDefaults } from "./defaults.ts";

export let mouse: t_mouse = {
  x: 0,
  y: 0
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