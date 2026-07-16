// 垂足 · 实现
export interface Pt {
  x: number;
  y: number;
}
export interface Line {
  a: number;
  b: number;
  c: number;
}
export function footOfPerpendicular(p: Pt, line: Line): Pt {
  const d = line.a * line.a + line.b * line.b;
  if (d === 0) throw new RangeError('退化直线');
  const t = (line.a * p.x + line.b * p.y + line.c) / d;
  return { x: p.x - line.a * t, y: p.y - line.b * t };
}
