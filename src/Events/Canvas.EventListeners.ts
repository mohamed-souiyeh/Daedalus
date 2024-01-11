import { mouse } from "../configs/input.config.ts";
import { globals } from "./input.ts";


export async function addCanvasEventListeners(canvas: HTMLCanvasElement) {
  //NOTE - to update mouse position if not locked
  canvas.addEventListener("mousemove", async function (event: MouseEvent) {
    if (globals.mouseCellPosIsLocked || !globals.debugModeOn) return;
    mouse.x = event.x - canvas.offsetLeft;
    mouse.y = event.y - canvas.offsetTop;
    // console.log("mouse moved", mouse);
  });

  //NOTE - to lock mouse position
  canvas.addEventListener('mousedown', async function (event: MouseEvent) {
    if (event.button === 0) {
      globals.mouseCellPosIsLocked = true;
      mouse.x = event.x - canvas.offsetLeft;
      mouse.y = event.y - canvas.offsetTop;
    }
    else if (event.button === 2) {
      globals.mouseCellPosIsLocked = false;
      mouse.x = event.x - canvas.offsetLeft;
      mouse.y = event.y - canvas.offsetTop;
    }
  });

  //NOTE - this to prevent the cotext menu from aprearing when we right click
  canvas.addEventListener('contextmenu', async function (event: MouseEvent) {
    event.preventDefault();
  });
}
