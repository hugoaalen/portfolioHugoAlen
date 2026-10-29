export function buttonFillOrigin(width: number, height: number, x = width / 2, y = height / 2) {
  const left = Math.max(0, Math.min(width, x));
  const top = Math.max(0, Math.min(height, y));
  return {
    x: left,
    y: top,
    radius: Math.ceil(Math.hypot(Math.max(left, width - left), Math.max(top, height - top))) + 2,
  };
}
