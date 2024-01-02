export var wallDefaults;
(function (wallDefaults) {
    wallDefaults[wallDefaults["WALL_PERSENTAGE"] = 0.1] = "WALL_PERSENTAGE";
})(wallDefaults || (wallDefaults = {}));
export const WALL_PERSENTAGE = wallDefaults.WALL_PERSENTAGE;
export const WALL_TARGETEDALPHA = 1;
export var WallAnimation;
(function (WallAnimation) {
    WallAnimation[WallAnimation["FADEOUT"] = 0] = "FADEOUT";
    WallAnimation[WallAnimation["FADEIN"] = 1] = "FADEIN";
    WallAnimation[WallAnimation["STOPPED"] = 2] = "STOPPED";
})(WallAnimation || (WallAnimation = {}));
export var wallState;
(function (wallState) {
    wallState[wallState["ABSENT"] = 0] = "ABSENT";
    wallState[wallState["PRESENT"] = 1] = "PRESENT";
})(wallState || (wallState = {}));
export const WALLCOLOR = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
};
