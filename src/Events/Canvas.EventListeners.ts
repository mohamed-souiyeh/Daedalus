import { mouse } from "../configs/input.config.ts";
import { globals } from "../configs/globals.ts";

export async function addCanvasEventListeners(canvas: HTMLDivElement) {
  //NOTE: - to update mouse position if not locked
  canvas.addEventListener("mousemove", async function (event: MouseEvent) {
    mouse.x = event.x - canvas.offsetLeft;
    mouse.y = event.y - canvas.offsetTop;

    if (!globals.debugModeOn) return;

    if (!globals.DebugMouseCellPosIsLocked) {
      mouse.dx = event.x - canvas.offsetLeft;
      mouse.dy = event.y - canvas.offsetTop;
    }

    if (!globals.BookletMouseCellPosIsLocked) {
      mouse.bx = event.x - canvas.offsetLeft;
      mouse.by = event.y - canvas.offsetTop;
    }
    // console.log("mouse moved", mouse);
  });

  //NOTE: - to lock mouse position
  canvas.addEventListener('mousedown', async function (event: MouseEvent) {

    // console.log("mouse down event: ", event);
    if (event.button === 0 && event.shiftKey) {
      globals.BookletMouseCellPosIsLocked = !globals.BookletMouseCellPosIsLocked;
      mouse.bx = event.x - canvas.offsetLeft;
      mouse.by = event.y - canvas.offsetTop;
    }
    if (event.button === 2 && event.shiftKey) {
      globals.DebugMouseCellPosIsLocked = !globals.DebugMouseCellPosIsLocked;
      mouse.dx = event.x - canvas.offsetLeft;
      mouse.dy = event.y - canvas.offsetTop;
    }
  });

  //NOTE: - this to prevent the cotext menu from aprearing when we right click
  canvas.addEventListener('contextmenu', async function (event: MouseEvent) {
    event.preventDefault();
  });
}
