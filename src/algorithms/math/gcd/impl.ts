// =============================================================================
// 辗转相除法（欧几里得算法）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface GcdHooks {
  /** 一轮取模：a ÷ b = q 余 r，下一轮用 (b, r)。 */
  onStep?: (a: number, b: number, r: number) => void;
  /** 余数为 0 时，b 即为 GCD，算法终止。 */
  onDone?: (gcd: number) => void;
}

/**
 * 欧几里得算法（辗转相除）求最大公约数 GCD(a, b)。
 *
 * 原理：`gcd(a, b) = gcd(b, a mod b)`，反复取余直到余数为 0，此时除数即 GCD。
 * 本实现先取绝对值，保证非负输入；返回 `gcd(|a|, |b|)`。
 *
 * - 迭代版（默认）：`O(log(min(a,b)))`
 * - 递归版见 `gcdRecursive`
 *
 * @param a 非零整数（可负）
 * @param b 整数（可负、可为 0）
 * @returns gcd(|a|, |b|)。注意 `gcd(0,0)` 定义为 `0`。
 */
export function gcd(a: number, b: number, hooks: GcdHooks = {}): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  if (x === 0 && y === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  // 保证 x >= y > 0 的起步；若 y==0 则直接返回 x
  while (y !== 0) {
    const r = x % y;
    hooks.onStep?.(x, y, r);
    x = y;
    y = r;
  }
  hooks.onDone?.(x);
  return x;
}

/** 递归版辗转相除（便于教学对照）。 */
export function gcdRecursive(a: number, b: number): number {
  const x = Math.abs(a);
  const y = Math.abs(b);
  if (y === 0) return x;
  return gcdRecursive(y, x % y);
}

/**
 * 扩展欧几里得算法：求 Bézout 系数 `(x, y)` 使得 `a·x + b·y = gcd(a, b)`。
 * 返回 `{ g, x, y }`。用于求模逆元 / 求解线性 Diophantine 方程。
 */
export function extGcd(a: number, b: number): { g: number; x: number; y: number } {
  let oldR = a;
  let r = b;
  let oldS = 1;
  let s = 0;
  let oldT = 0;
  let t = 1;
  while (r !== 0) {
    const q = Math.trunc(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];
  }
  return { g: oldR, x: oldS, y: oldT };
}
