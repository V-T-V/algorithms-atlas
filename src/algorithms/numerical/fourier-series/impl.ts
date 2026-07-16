// =============================================================================
// 傅里叶级数（Fourier Series）· 纯算法实现
// 数值积分（梯形法）求系数，再合成。
// =============================================================================

export interface FourierCoeffs {
  a0: number;
  a: number[]; // a[1..N]
  b: number[]; // b[1..N]
}

export interface FourierHooks {
  /** 求出第 n 个系数对。 */
  onCoeff?: (n: number, an: number, bn: number) => void;
  /** 完成。 */
  onDone?: (coeffs: FourierCoeffs) => void;
}

/** 复合梯形积分。 */
function trapezoid(g: (x: number) => number, lo: number, hi: number, m: number): number {
  const h = (hi - lo) / m;
  let sum = 0.5 * (g(lo) + g(hi));
  for (let i = 1; i < m; i++) sum += g(lo + i * h);
  return sum * h;
}

/**
 * 求 f（周期 2L）的前 N 项傅里叶系数。
 * @param f 被展开函数
 * @param L 半周期
 * @param N 谐波数
 * @param m 积分采样数（默认 1000）
 */
export function fourierCoeffs(
  f: (x: number) => number,
  L: number,
  N: number,
  m = 1000,
  hooks: FourierHooks = {},
): FourierCoeffs {
  if (L <= 0) throw new RangeError(`L 须 > 0，收到 ${L}`);
  if (N < 0) throw new RangeError(`N 须 >= 0，收到 ${N}`);
  if (m < 1) throw new RangeError(`m 须 >= 1，收到 ${m}`);
  const a0 = (1 / L) * trapezoid(f, -L, L, m);
  const a: number[] = [0]; // 占位 a[0]
  const b: number[] = [0]; // 占位 b[0]
  for (let n = 1; n <= N; n++) {
    const cosArg = (Math.PI * n) / L;
    const an = (1 / L) * trapezoid((x) => f(x) * Math.cos(cosArg * x), -L, L, m);
    const bn = (1 / L) * trapezoid((x) => f(x) * Math.sin(cosArg * x), -L, L, m);
    a.push(an);
    b.push(bn);
    hooks.onCoeff?.(n, an, bn);
  }
  const coeffs = { a0, a, b };
  hooks.onDone?.(coeffs);
  return coeffs;
}

/** 用傅里叶系数在 x 处求值。 */
export function fourierEvaluate(coeffs: FourierCoeffs, L: number, x: number): number {
  let y = coeffs.a0 / 2;
  for (let n = 1; n < coeffs.a.length; n++) {
    y +=
      coeffs.a[n]! * Math.cos((Math.PI * n * x) / L) +
      coeffs.b[n]! * Math.sin((Math.PI * n * x) / L);
  }
  return y;
}
