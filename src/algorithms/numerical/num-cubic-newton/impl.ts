// 牛顿法求立方根 · 实现
export function cubeRootNewton(a: number, tol = 1e-10): number {
  if (a === 0) return 0;
  const sign = a < 0 ? -1 : 1;
  let x = sign * Math.abs(a) ** (1 / 3);
  for (let i = 0; i < 100; i++) {
    const x2 = x * x;
    if (x2 === 0) break;
    const nx = (2 * x + a / x2) / 3;
    if (Math.abs(nx - x) < tol) {
      x = nx;
      break;
    }
    x = nx;
  }
  return x;
}
