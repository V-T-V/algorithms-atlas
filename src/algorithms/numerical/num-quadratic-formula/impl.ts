// 求根公式 · 实现
export interface QuadResult {
  roots: number[][];
  discriminant: number;
}
export function quadraticFormula(a: number, b: number, c: number): QuadResult {
  if (a === 0) throw new RangeError('a 不能为 0');
  const d = b * b - 4 * a * c;
  if (d > 0) {
    const s = Math.sqrt(d);
    return { roots: [[(-b + s) / (2 * a)], [(-b - s) / (2 * a)]], discriminant: d };
  }
  if (d === 0) {
    const r = -b / (2 * a);
    return { roots: [[r === 0 ? 0 : r]], discriminant: 0 };
  }
  const re0 = -b / (2 * a),
    re = re0 === 0 ? 0 : re0,
    im = Math.sqrt(-d) / (2 * a);
  return {
    roots: [
      [re, im],
      [re, -im],
    ],
    discriminant: d,
  };
}
