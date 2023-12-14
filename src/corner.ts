import { WALL_PERSENTAGE, WallAnimation, color } from "./wall";

const calculateWidth = (currentlength: number) => {
  return currentlength * WALL_PERSENTAGE;
};

const cornerMoves = [
  {
    xd: 0,
    yd: 0,
    xcornerOffset: 0,
    ycornerOffset: 0,
  },
  {
    xd: 1,
    yd: 0,
    xcornerOffset: 0,
    ycornerOffset: 0,
  },
  {
    xd: 1,
    yd: 1,
    xcornerOffset: 0,
    ycornerOffset: 0,
  },
  {
    xd: 0,
    yd: 1,
    xcornerOffset: 0,
    ycornerOffset: 0,
  },
];

export class Corner {
  #x: number;
  #y: number;
  #posInCell: number;

  #length: number;
  #width: number;

  #color: color = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  };

  #animation: number = WallAnimation.FADEIN;

  constructor() {}

  public init(
    pos: number,
    cellx: number,
    celly: number,
    currentCellLength: number,
    color: color
  ) {
    this.#posInCell = pos;
    this.#length = calculateWidth(currentCellLength);
    this.#width = calculateWidth(currentCellLength);

    this.#x =
      cellx + cornerMoves[pos].xd * (currentCellLength * (1 - WALL_PERSENTAGE));
    this.#y =
      celly + cornerMoves[pos].yd * (currentCellLength * (1 - WALL_PERSENTAGE));

    this.#color = color;
  }

  public update(
    cellCurrentx: number,
    cellCurrenty: number,
    cellCurrentLength: number,
    alpha: number
  ) {
    this.#length = calculateWidth(cellCurrentLength);
    this.#width = calculateWidth(cellCurrentLength);

    this.#x =
      cellCurrentx +
      cornerMoves[this.#posInCell].xd *
        (cellCurrentLength * (1 - WALL_PERSENTAGE));
    this.#y =
      cellCurrenty +
      cornerMoves[this.#posInCell].yd *
        (cellCurrentLength * (1 - WALL_PERSENTAGE));

    this.#color.a = alpha;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(${this.#color.r},${this.#color.g},${this.#color.b},${
      this.#color.a
    })`;
    ctx.fillRect(this.#x, this.#y, this.#length, this.#width);
  }
}
