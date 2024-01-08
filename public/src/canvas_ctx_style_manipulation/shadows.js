export function setShadowStyle(ctx, shadow) {
    ctx.shadowBlur = shadow?.blur ?? 0;
    ctx.shadowColor = shadow?.color ?? "black";
    ctx.shadowOffsetX = shadow?.offsetX ?? 0;
    ctx.shadowOffsetY = shadow?.offsetY ?? 0;
}
export function resetShadowStyle(ctx) {
    ctx.shadowBlur = 0;
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}
