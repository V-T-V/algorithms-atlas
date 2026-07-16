// =============================================================================
// Euler-Maclaurin 求和公式 · 纯算法实现
// =============================================================================

// 伯努利数 B_{2k}（k=1..6 足够大多数应用）
const B2K = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730];
// 阶乘 (2k)!（预计算到 12!）
const FACT2K = [2, 24, 720, 40320, 3628800, 479001600];

/** 数值第 n 阶导数（中心差分，h 自适应）。 */
function numDerivative(f: (x: number) => number, x: number, n: number, h: number): number {
  // 用有限差分系数计算 n 阶导数
  // 简化：对 n=1 用 4 阶中心差分；n=3 用 6 点；n=5 用 ...
  // 这里用通用方法：复中心差分 h_n = h^(n) 处理
  // 实际：用 (f(x+ε) - f(x-ε)) / (2ε) 求一阶，递归求高阶
  if (n === 0) return f(x);
  const eps = h / Math.max(1, Math.pow(2, n - 1));
  // 用高精度中心差分递归求 n 阶导数
  return derivativeRec(f, x, n, eps);
}

function derivativeRec(f: (x: number) => number, x: number, n: number, eps: number): number {
  if (n === 0) return f(x);
  const dh = eps;
  return (derivativeRec(f, x + dh, n - 1, dh) - derivativeRec(f, x - dh, n - 1, dh)) / (2 * dh);
}

/** Simpson 复合积分。 */
function simpson(f: (x: number) => number, a: number, b: number, n = 1000): number {
  if (n % 2 !== 0) n++;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    s += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  }
  return (h / 3) * s;
}

/**
 * Euler-Maclaurin 求和：Σ_{k=a}^{b} f(k)，a, b 为整数。
 * 返回积分项 + 端点项 + p 个修正项。
 */
export function eulerMaclaurin(
  f: (x: number) => number,
  a: number,
  b: number,
  p = 3,
  h = 1e-3,
): { integral: number; endpoints: number; corrections: number; total: number } {
  if (a > b) throw new RangeError('需要 a ≤ b');
  if (p < 0 || p > B2K.length) throw new RangeError(`p 范围 0..${B2K.length}`);
  const integral = simpson(f, a, b, 1000);
  const endpoints = (f(a) + f(b)) / 2;
  let corrections = 0;
  for (let k = 1; k <= p; k++) {
    const order = 2 * k - 1;
    const dA = numDerivative(f, a, order, h);
    const dB = numDerivative(f, b, order, h);
    corrections += (B2K[k - 1]! / FACT2K[k - 1]!) * (dB - dA);
  }
  return { integral, endpoints, corrections, total: integral + endpoints + corrections };
}
