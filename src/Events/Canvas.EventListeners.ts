import { mouse } from "../configs/input.config.ts";
import { globals } from "../configs/globals.ts";
import { CELLSIZE } from "../configs/cell.config.ts";

export async function addCanvasEventListeners(canvas: HTMLCanvasElement) {
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
    if (globals.startAlgo === false && event.button === 0 && (Math.floor(mouse.x / CELLSIZE) !== globals.finish.x || Math.floor(mouse.y / CELLSIZE) !== globals.finish.y)) {
      globals.start.oldx = globals.start.x;
      globals.start.x = Math.floor(mouse.x / CELLSIZE);

      globals.start.oldy = globals.start.y;
      globals.start.y = Math.floor(mouse.y / CELLSIZE);
    }
    if (globals.startAlgo === false && event.button === 2 && (Math.floor(mouse.x / CELLSIZE) !== globals.start.x || Math.floor(mouse.y / CELLSIZE) !== globals.start.y)) {
      globals.finish.oldx = globals.finish.x;
      globals.finish.x = Math.floor(mouse.x / CELLSIZE);

      globals.finish.oldy = globals.finish.y;
      globals.finish.y = Math.floor(mouse.y / CELLSIZE);
    }
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
