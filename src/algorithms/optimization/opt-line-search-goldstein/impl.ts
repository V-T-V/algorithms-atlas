// =============================================================================
// Goldstein 条件线搜索（二分收缩）· 纯算法实现
// =============================================================================

export type Vec = number[];

export interface GoldsteinResult {
  alpha: number;
  fnew: number;
  xnew: Vec;
  iterations: number;
  accepted: boolean;
}

export interface GoldsteinHooks {
  onTrial?: (alpha: number, fnew: number, status: 'upper' | 'lower' | 'ok') => void;
  onResult?: (r: GoldsteinResult) => void;
}

const add = (a: Vec, b: Vec): Vec => a.map((v, i) => v + b[i]!);
const scale = (a: Vec, s: number): Vec => a.map((v) => v * s);
const dot = (a: Vec, b: Vec): number => a.reduce((s, v, i) => s + v * b[i]!, 0);

/**
 * Goldstein 线搜索。仅用函数值，不需要 α 处的梯度。
 */
export function goldsteinLineSearch(
  f: (x: Vec) => number,
  x: Vec,
  fx: number,
  gx: Vec,
  p: Vec,
  options: { c?: number; alphaMax?: number; maxIter?: number; alpha0?: number } = {},
  hooks: GoldsteinHooks = {},
): GoldsteinResult {
  const { c = 0.1, alphaMax = 10, maxIter = 50, alpha0 = 1 } = options;
  const dphi0 = dot(gx, p); // 应 < 0
  const upper = (a: number): number => fx + c * a * dphi0;
  const lower = (a: number): number => fx + (1 - c) * a * dphi0;

  let aLo = 0;
  let aHi = alphaMax;
  let alpha = alpha0;
  let iterations = 0;

  for (let i = 0; i < maxIter; i++) {
    iterations = i + 1;
    const xa = add(x, scale(p, alpha));
    const fnew = f(xa);
    let status: 'upper' | 'lower' | 'ok';
    if (fnew > upper(alpha)) {
      // 步长过大
      aHi = alpha;
      status = 'upper';
    } else if (fnew < lower(alpha)) {
      // 步长过小
      aLo = alpha;
      status = 'lower';
    } else {
      // 落入 Goldstein 区间
      status = 'ok';
      hooks.onTrial?.(alpha, fnew, status);
      const xnew = add(x, scale(p, alpha));
      const result: GoldsteinResult = { alpha, fnew, xnew, iterations, accepted: true };
      hooks.onResult?.(result);
      return result;
    }
    hooks.onTrial?.(alpha, fnew, status);
    if (aHi === alphaMax && aLo === 0) {
      // 未夹住，继续按原方向扩张/收缩
      alpha = status === 'lower' ? Math.min(alpha * 2, alphaMax) : 0.5 * alpha;
    } else {
      alpha = 0.5 * (aLo + aHi);
    }
    if (aHi - aLo < 1e-10) break;
  }

  // 兜底
  const xnew = add(x, scale(p, alpha));
  const fnew = f(xnew);
  const result: GoldsteinResult = { alpha, fnew, xnew, iterations, accepted: false };
  hooks.onResult?.(result);
  return result;
}
