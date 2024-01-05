export const CELLSIZE = 40;
export const UNVISITED_CELLCOLOR = {
    r: 175,
    g: 216,
    b: 248,
    a: 1,
};
export const VISITED_CELLCOLOR = {
    r: 175,
    g: 216,
    b: 248,
    a: 1,
};
// {
//   r: 0,
//   g: 255,
//   b: 0,
//   a: 1,
// };
export var cellDefaults;
(function (cellDefaults) {
    cellDefaults[cellDefaults["INWARDSSCALINGFACTOR"] = 0.5] = "INWARDSSCALINGFACTOR";
    cellDefaults[cellDefaults["OUTWARDSSCALINGFACTOR"] = 0.3] = "OUTWARDSSCALINGFACTOR";
    cellDefaults[cellDefaults["VELOCITY"] = 0.5] = "VELOCITY";
    cellDefaults[cellDefaults["ACCELERATION"] = 0] = "ACCELERATION";
})(cellDefaults || (cellDefaults = {}));
export var CellStates;
(function (CellStates) {
    CellStates[CellStates["visited"] = 0] = "visited";
    CellStates[CellStates["unvisited"] = 1] = "unvisited";
})(CellStates || (CellStates = {}));
export const stateColors = new Map([
    [CellStates.visited, Object.create(VISITED_CELLCOLOR)],
    [CellStates.unvisited, Object.create(UNVISITED_CELLCOLOR)],
]);
export var CellAnimation;
(function (CellAnimation) {
    CellAnimation[CellAnimation["OUTWARDS"] = 0] = "OUTWARDS";
    CellAnimation[CellAnimation["INWARDS"] = 1] = "INWARDS";
    CellAnimation[CellAnimation["STOPPED"] = 2] = "STOPPED";
    CellAnimation[CellAnimation["TOORIGINE"] = 3] = "TOORIGINE";
})(CellAnimation || (CellAnimation = {}));
export var Directions;
(function (Directions) {
    Directions[Directions["NORTH"] = 0] = "NORTH";
    Directions[Directions["EAST"] = 1] = "EAST";
    Directions[Directions["SOUTH"] = 2] = "SOUTH";
    Directions[Directions["WEST"] = 3] = "WEST";
})(Directions || (Directions = {}));
export var CornerDirections;
(function (CornerDirections) {
    CornerDirections[CornerDirections["NORTHWEST"] = 0] = "NORTHWEST";
    CornerDirections[CornerDirections["NORTHEAST"] = 1] = "NORTHEAST";
    CornerDirections[CornerDirections["SOUTHEAST"] = 2] = "SOUTHEAST";
    CornerDirections[CornerDirections["SOUTHWEST"] = 3] = "SOUTHWEST";
})(CornerDirections || (CornerDirections = {}));
