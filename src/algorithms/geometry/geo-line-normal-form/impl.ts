// 直线一般式转法线式 · 实现
export interface Line {
  a: number;
  b: number;
  c: number;
}
export function toNormalForm(line: Line): Line {
  const n = Math.hypot(line.a, line.b);
  if (n === 0) throw new RangeError('退化直线');
  const sign = line.c > 0 ? -1 : 1;
  return { a: (sign * line.a) / n, b: (sign * line.b) / n, c: (sign * line.c) / n };
}
