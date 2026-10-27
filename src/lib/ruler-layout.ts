export function rulerLetterRotation(rotation: number, index: number, count: number) {
  if (rotation <= -90) return -90;
  if (rotation >= 0) return 0;
  const phase = Math.max(0, Math.min(1, (-rotation / 90) * 1.65 - (1 - index / Math.max(1, count - 1)) * 0.65));
  return (-90 * phase * phase * (3 - 2 * phase)) || 0;
}

export function layoutRulerLabels(tops: number[], current: number, railTop: number, height: number, gap = 36) {
  const currentY = current * 24 + 12;
  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  const positions = tops.map((_, index) => ({ passed: index < current, y: index * 24, rotation: 0, scale: index === current ? 1 : 0.55 }));
  let limit = height - gap;
  for (let index = tops.length - 1; index >= current; index -= 1) {
    const y = index === current ? currentY : Math.max(currentY + (index - current) * gap, Math.min(tops[index] - railTop, limit));
    positions[index].y = y;
    if (index > current) {
      const natural = tops[index] - railTop;
      // Upcoming labels turn sideways only while travelling through the rail.
      positions[index].rotation = (-90 * clamp((height - gap - natural) / 100) * clamp((natural - currentY - 64) / 120)) || 0;
    }
    limit = y - gap;
  }
  return positions;
}
