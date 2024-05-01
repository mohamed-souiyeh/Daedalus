import { Directions } from "../configs/cell.config";

export const shuffleCellDirections = (array: Directions[]) => {
  // console.log("moves before shuffle: ", array);
  array.sort(() => Math.random() - 0.5);
  // console.log("moves after shuffle: ", array);
  return array;
};
