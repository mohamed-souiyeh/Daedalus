

const INWARDSSCALINGFACTOR = 0.4;
const OUTWARDSSCALINGFACTOR = 0.6;

const VELOCITY = 40;
const ACCELERATION = 0;

enum CellAnimation {
  OUTWARDS,
  INWARDS,
  STOPPED,
  TOORIGINE,
}

enum WallDirections {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
}

enum CornerDirections {
  TOPLEFT,
  TOPRIGHT,
  BOTTOMRIGHT,
  BOTTOMLEFT,
}

