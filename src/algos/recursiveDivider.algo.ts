import { split } from "postcss/lib/list";
import { algosKeys } from "../configs/algos.config";
import { Directions } from "../configs/cell.config";
import { globals } from "../configs/globals";
import { Grid } from "../grid";
import { Frame, SplitDirection, algoState } from "../types/algos.types";

function skipDoor(frame: Frame) {
  if (frame.buildingWall.dx)
    return (frame.buildingWall.x - frame.x === frame.buildingWall.doorIndex);
  else
    return (frame.buildingWall.y - frame.y === frame.buildingWall.doorIndex);
}

// NOTE: this function is a tribute to Elcy my dear friend. 😂
function bobaTheBuilder(grid: Grid, frame: Frame) {

  let x = frame.buildingWall.x;
  let y = frame.buildingWall.y;

  if (x - frame.x >= frame.length || y - frame.y >= frame.width) {
    frame.buildingWall.state = algoState.done;
    return;
  }

  if (skipDoor(frame)) {
    frame.buildingWall.x += frame.buildingWall.dx;
    frame.buildingWall.y += frame.buildingWall.dy;
    x = frame.buildingWall.x;
    y = frame.buildingWall.y;
    return;
  }

  // console.log("in boba the builder");
  const currentCell = grid.at(x, y);
  let neighbor = currentCell!.neighbor(frame.buildingWall.direction);


  if (currentCell!.islinked(neighbor) === false)
    return;

  currentCell!.unlink(neighbor);
  frame.buildingWall.x += frame.buildingWall.dx;
  frame.buildingWall.y += frame.buildingWall.dy;
}

export function recursiveDivider(grid: Grid) {


  let currentFrame: Frame | undefined = globals.BuildStack.peek();

  if (currentFrame === undefined)
    return algoState.done;

  while (currentFrame.width <= 1 || currentFrame.length <= 1) {
    globals.BuildStack.pop();
    currentFrame = globals.BuildStack.peek();
    if (currentFrame === undefined)
      return algoState.done;
  }

  if (currentFrame.buildingWall.state === algoState.building) {
    bobaTheBuilder(grid, currentFrame);
    return algoState.building;
  }
  else if (currentFrame.buildingWall.state === algoState.done) {

    globals.BuildStack.pop();

    // NOTE: push the new two other fields
    let _length: number = currentFrame.buildingWall.splitDirection === SplitDirection.V ? currentFrame.buildingWall.splitPos + ((currentFrame.buildingWall.direction === Directions.EAST) as unknown as number) : currentFrame.length;
    let _width: number = currentFrame.buildingWall.splitDirection === SplitDirection.V ? currentFrame.width : currentFrame.buildingWall.splitPos + ((currentFrame.buildingWall.direction === Directions.SOUTH) as unknown as number);

    globals.BuildStack.push(new Frame(currentFrame.x, currentFrame.y, algosKeys.recursiveDivider, grid.at(currentFrame.x, currentFrame.y), _length, _width));


    _length = currentFrame.buildingWall.splitDirection === SplitDirection.V ? currentFrame.length - _length : currentFrame.length;
    _width = currentFrame.buildingWall.splitDirection === SplitDirection.V ? currentFrame.width : currentFrame.width - _width;

    let x: number = currentFrame.buildingWall.splitDirection === SplitDirection.V ? currentFrame.x + currentFrame.buildingWall.splitPos + ((currentFrame.buildingWall.direction === Directions.EAST) as unknown as number) : currentFrame.x;
    let y: number = currentFrame.buildingWall.splitDirection === SplitDirection.V ? currentFrame.y : currentFrame.y + currentFrame.buildingWall.splitPos + ((currentFrame.buildingWall.direction === Directions.SOUTH) as unknown as number);


    globals.BuildStack.push(new Frame(x, y, algosKeys.recursiveDivider, grid.at(x, y), _length, _width));
    return algoState.building;
  }

  let splitDirection: SplitDirection = currentFrame.length > currentFrame.width ? SplitDirection.V : SplitDirection.H;

  if (currentFrame.length === currentFrame.width)
    splitDirection = Math.random() >= 0.5 ? SplitDirection.H : SplitDirection.V;

  let wallDirection: Directions = splitDirection === SplitDirection.H ? Directions.SOUTH : Directions.EAST;

  const doorPos: number = splitDirection === SplitDirection.H ? Math.round(Math.random() * (currentFrame.length - 1)) : Math.round(Math.random() * (currentFrame.width - 1));

  const splitPos: number = splitDirection === SplitDirection.H ? Math.floor(Math.random() * (currentFrame.width - 1)) : Math.floor(Math.random() * (currentFrame.length - 1));
  // const splitPos: number = splitDirection === SplitDirection.H ? Math.floor(0.5 * (currentFrame.width - 1)) : Math.floor(0.5 * (currentFrame.length - 1));

  const x: number = splitDirection === SplitDirection.V ? currentFrame.x + splitPos : currentFrame.x;
  const y: number = splitDirection === SplitDirection.V ? currentFrame.y : currentFrame.y + splitPos;

  const dx: number = splitDirection === SplitDirection.V ? 0 : 1;
  const dy: number = splitDirection === SplitDirection.V ? 1 : 0;

  currentFrame.buildingWall = Object.create({
    state: algoState.building,
    direction: wallDirection,
    splitPos: splitPos,
    splitDirection: splitDirection,
    doorIndex: doorPos,
    x: x,
    y: y,
    dx: dx,
    dy: dy,
  });

  return algoState.building;
}
