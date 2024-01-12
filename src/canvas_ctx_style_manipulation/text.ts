import { text } from "../types/text.type.ts";

export function setTextStyle(ctx: CanvasRenderingContext2D, textStyle: text) {
  ctx.font = textStyle?.font ?? "10px sans-serif";
  ctx.textAlign = textStyle?.textAlign ?? "start";
  ctx.textBaseline = textStyle?.textBaseline ?? "alphabetic";
  ctx.direction = textStyle?.direction ?? "ltr";
  ctx.fillStyle = textStyle?.fillStyle ?? "black";
}