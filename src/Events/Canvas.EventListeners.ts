import { mouse } from "../configs/input.config.ts";
import { globals } from "../configs/globals.ts";
import { CELLSIZE, CellStates, CellType } from "../configs/cell.config.ts";



export async function addCanvasEventListeners(canvas: HTMLCanvasElement) {
  let mouseDown: boolean;
  //NOTE: - to update mouse position if not locked
  canvas.addEventListener("mousemove", async function (event: MouseEvent) {
    mouse.x = event.x - canvas.offsetLeft;
    mouse.y = event.y - canvas.offsetTop;

    const x = Math.floor((mouse.x - globals.gridOffsetLeft) / CELLSIZE);
    const y = Math.floor((mouse.y - globals.gridOffsetTop) / CELLSIZE);


    if (mouseDown && globals.mouseUpdating === false) {

      if (globals.depthFilterOn && globals.updateDepthFilter === false) {
        if (globals.depthFilterOn && event.button === 0 &&
          !(x === globals.depthFilterPos.x && y === globals.depthFilterPos.y) &&
          (x >= 0 && x < globals.grid.length && y >= 0 && y < globals.grid.width)) {

          console.log("updating depth filter pos and all");
          globals.depthFilterPos.oldx = globals.depthFilterPos.x;
          globals.depthFilterPos.x = x;

          globals.depthFilterPos.oldy = globals.depthFilterPos.y;
          globals.depthFilterPos.y = y;

          globals.replaceDepthFilterPos = true;
          globals.updateDepthFilter = true;
          globals.mouseUpdating = true;
        }
      }
      else {
        if (globals.addWeights && globals.startAlgo === false && globals.animatePath === false &&
          globals.reset === false && event.button === 0 && !globals.replaceStart && !globals.replaceFinish &&
          !(x === globals.finish.x && y === globals.finish.y) &&
          !(x === globals.start.x && y === globals.start.y) &&
          !(x === mouse.currentx && y === mouse.currenty)) {

          const cell = globals.grid.at(x, y);


          if (cell && cell.cellType === CellType.weighted) {
            cell.setCellType(CellType.air)
          }
          else if (cell && cell.cellType !== CellType.weighted) {
            cell.setCellType(CellType.weighted);
          }
        }
        else if (globals.addWalls && globals.startAlgo === false && globals.animatePath === false &&
          globals.reset === false && event.button === 0 &&
          !(x === mouse.currentx && y === mouse.currenty)) {


          const cell = globals.grid.at(x, y);
          const prevCell = globals.grid.at(mouse.currentx, mouse.currenty);

          // console.log("cell: ", cell);
          // console.log("prevcell: ", prevCell);

          if (cell && cell.isNeighbor(prevCell) && cell.islinked(prevCell)) {
            cell.unlink(prevCell);
          }
          else if (cell && cell.isNeighbor(prevCell) && !cell.islinked(prevCell)) {
            cell.link(prevCell);
          }
        }

        // console.log(globals.replaceStart)
        // console.log(globals.startAlgo === false)
        // console.log(globals.animatePath === false)
        // console.log(globals.reset === false)
        // console.log(!(Math.floor((mouse.x - globals.gridOffsetLeft) / CELLSIZE) === globals.finish.x && Math.floor((mouse.y - globals.gridOffsetTop) / CELLSIZE) === globals.finish.y))

        if (globals.replaceStart && globals.startAlgo === false && globals.animatePath === false && globals.reset === false &&
          !(x === globals.finish.x && y === globals.finish.y) && !(x === globals.start.x && y === globals.start.y) &&
          (x >= 0 && x < globals.grid.length && y >= 0 && y < globals.grid.width)) {
          console.log("updating start pos");
          globals.start.oldx = globals.start.x;
          globals.start.x = Math.floor((mouse.x - globals.gridOffsetLeft) / CELLSIZE);

          globals.start.oldy = globals.start.y;
          globals.start.y = Math.floor((mouse.y - globals.gridOffsetTop) / CELLSIZE);

          globals.mouseUpdating = true;
          if (globals.hotReload) {
            globals.startAlgo = true;
            globals.gridRedraw = true;
          }
        }
        if (globals.replaceFinish && globals.startAlgo === false && globals.animatePath === false && globals.reset === false &&
          !(x === globals.start.x && y === globals.start.y) && !(x === globals.finish.x && y === globals.finish.y) &&
          (x >= 0 && x < globals.grid.length && y >= 0 && y < globals.grid.width)) {
          console.log("updating finish pos");
          globals.finish.oldx = globals.finish.x;
          globals.finish.x = Math.floor((mouse.x - globals.gridOffsetLeft) / CELLSIZE);

          globals.finish.oldy = globals.finish.y;
          globals.finish.y = Math.floor((mouse.y - globals.gridOffsetTop) / CELLSIZE);

          globals.mouseUpdating = true;
          if (globals.hotReload) {
            globals.startAlgo = true;
            globals.gridRedraw = true;
          }
        }
      }
    }

    if (!(x === mouse.currentx && y === mouse.currenty)) {
      mouse.oldx = mouse.currentx;
      mouse.currentx = x;

      mouse.oldy = mouse.currenty;
      mouse.currenty = y;
    }

    // console.log("mouse moved", mouse);
    if (!globals.debugModeOn) return;

    if (!globals.DebugMouseCellPosIsLocked) {
      mouse.dx = event.x - canvas.offsetLeft;
      mouse.dy = event.y - canvas.offsetTop;
    }

    if (!globals.BookletMouseCellPosIsLocked) {
      mouse.bx = event.x - canvas.offsetLeft;
      mouse.by = event.y - canvas.offsetTop;
    }
  });

  canvas.addEventListener('mouseup', async function (event: MouseEvent) {


    // globals.canvas!.width = this.#length * CELLSIZE;
    // globals.canvas!.height = this.#width * CELLSIZE;
    mouseDown = false;
    if (globals.depthFilterOn && globals.updateDepthFilter === false) {
      if (globals.depthFilterOn && event.button === 0) {
        globals.replaceDepthFilterPos = false;
      }
    }
    else {
      if (globals.startAlgo === false && globals.animatePath === false && globals.reset === false && event.button === 0) {
        globals.replaceStart = false;
      }
      if (globals.startAlgo === false && globals.animatePath === false && globals.reset === false && event.button === 0) {
        globals.replaceFinish = false;
      }
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



  // NOTE: - to lock mouse position
  canvas.addEventListener('mousedown', async function (event: MouseEvent) {
    // globals.canvas!.width = this.#length * CELLSIZE;
    // globals.canvas!.height = this.#width * CELLSIZE;

    const x = Math.floor((mouse.x - globals.gridOffsetLeft) / CELLSIZE);
    const y = Math.floor((mouse.y - globals.gridOffsetTop) / CELLSIZE);

    if (globals.depthFilterOn && globals.updateDepthFilter === false) {
      if (globals.depthFilterOn && event.button === 0 &&
        (x === globals.depthFilterPos.x && y === globals.depthFilterPos.y)) {
        globals.depthFilterPos.oldx = globals.depthFilterPos.x;
        globals.depthFilterPos.x = x;

        globals.depthFilterPos.oldy = globals.depthFilterPos.y;
        globals.depthFilterPos.y = y;

        globals.replaceDepthFilterPos = true;
        globals.updateDepthFilter = true;
        mouseDown = true;
      }
    }
    else {
      const cell = globals.grid.at(x, y);

      if (globals.addWeights && globals.startAlgo === false && globals.animatePath === false &&
        globals.reset === false && event.button === 0 &&
        !(x === globals.finish.x && y === globals.finish.y) &&
        !(x === globals.start.x && y === globals.start.y)) {



        if (cell && cell.cellType === CellType.weighted) {
          cell.setCellType(CellType.air)
          mouseDown = true;
        }
        else if (cell && cell.cellType !== CellType.weighted) {
          cell?.setCellType(CellType.weighted);
          mouseDown = true;
        }

      }
      if (globals.addWalls && globals.startAlgo === false && globals.animatePath === false &&
        globals.reset === false && event.button === 0) {
        mouseDown = true;
      }
      if (globals.startAlgo === false && globals.animatePath === false &&
        globals.reset === false && event.button === 0 &&
        (x === globals.start.x && y === globals.start.y)) {
        console.log("mouse down event: ", event);
        globals.start.oldx = globals.start.x;
        globals.start.x = x;

        globals.start.oldy = globals.start.y;
        globals.start.y = y;

        globals.replaceStart = true;
        mouseDown = true;
      }
      else if (globals.startAlgo === false && globals.animatePath === false &&
        globals.reset === false && event.button === 0 &&
        (x === globals.finish.x && y === globals.finish.y)) {
        globals.finish.oldx = globals.finish.x;
        globals.finish.x = x;

        globals.finish.oldy = globals.finish.y;
        globals.finish.y = y;

        globals.replaceFinish = true;
        mouseDown = true;
      }
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
