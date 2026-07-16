// =============================================================================
// 扩展欧几里得 · 纯算法实现
// 返回 {gcd, x, y} 使 a*x + b*y = gcd。迭代版。零 DOM 依赖，可独立单测。
// =============================================================================

/** 扩展欧几里得结果。 */
export interface ExtGcdResult {
  gcd: number;
  x: number; // Bézout 系数 for a
  y: number; // Bézout 系数 for b
}

/** 事件钩子。 */
export interface ExtGcdHooks {
  /** 每步迭代后（当前 a, b, x1, y1, x2, y2）。 */
  onStep?: (
    step: number,
    a: number,
    b: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) => void;
  /** 最终结果。 */
  onResult?: (r: ExtGcdResult) => void;
}

/**
 * 扩展欧几里得算法（迭代版）。
 * 返回 {gcd, x, y}，满足 a*x + b*y = gcd。
 * 输入可为负数；结果 x,y 对应原始（含符号）a,b。
 */
export function extGcd(a: number, b: number, hooks: ExtGcdHooks = {}): ExtGcdResult {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new RangeError('a and b must be integers');
  }
  let oldR = a;
  let r = b;
  let oldS = 1;
  let s = 0;
  let oldT = 0;
  let t = 1;
  let step = 0;
  hooks.onStep?.(step, oldR, r, oldS, oldT, s, t);

  while (r !== 0) {
    const quotient = Math.trunc(oldR / r);
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
    [oldT, t] = [t, oldT - quotient * t];
    step++;
    hooks.onStep?.(step, oldR, r, oldS, oldT, s, t);
  }

  const result: ExtGcdResult = { gcd: oldR, x: oldS, y: oldT };
  hooks.onResult?.(result);
  return result;
}

/**
 * 求解线性丢番图方程 a*x + b*y = c。
 * 若 c 不是 GCD(a,b) 的倍数则无解，返回 null；否则返回一组特解 {x, y}。
 */
export function solveDiophantine(
  a: number,
  b: number,
  c: number,
): { x: number; y: number; gcd: number } | null {
  if (!Number.isInteger(a) || !Number.isInteger(b) || !Number.isInteger(c)) {
    throw new RangeError('a, b, c must be integers');
  }
  const { gcd: g, x, y } = extGcd(a, b);
  if (c % g !== 0) return null;
  const factor = c / g;
  return { x: x * factor, y: y * factor, gcd: g };
}
