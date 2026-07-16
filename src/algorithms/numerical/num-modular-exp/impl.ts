// 快速模幂 · 实现
export function modPow(base: number, exp: number, m: number): number {
  if (m <= 0) throw new RangeError('模数必须为正');
  if (exp < 0) throw new RangeError('指数必须非负');
  base = ((base % m) + m) % m;
  let result = 1;
  while (exp > 0) {
    if (exp & 1) result = (result * base) % m;
    base = (base * base) % m;
    exp = Math.floor(exp / 2);
  }
  return result;
}
