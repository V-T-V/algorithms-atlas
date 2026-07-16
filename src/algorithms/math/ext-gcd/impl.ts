// =============================================================================
// 扩展欧几里得（Extended Euclidean）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** Bézout 系数解：`g = gcd(a,b)`，且 `a·x + b·y = g`。 */
export interface ExtGcdResult {
  g: number;
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ExtGcdHooks {
  /** 一轮取模：记录商 q 与 (old_r, r)、(old_s, s)、(old_t, t) 的滚动更新。 */
  onStep?: (
    q: number,
    oldR: number,
    r: number,
    oldS: number,
    s: number,
    oldT: number,
    t: number,
  ) => void;
  /** 余数归零，算法终止，给出最终的 gcd 与 Bézout 系数。 */
  onDone?: (g: number, x: number, y: number) => void;
}

/**
 * 扩展欧几里得算法：求 `gcd(a, b)` 及 Bézout 系数 `(x, y)`，使 `a·x + b·y = gcd(a, b)`。
 *
 * 原理：在辗转相除的每一步 `old_r = q·r + rem` 中，对三组变量 `(r, s, t)` 同步滚动——
 *   - `r` 跟踪余数（终止时 old_r = gcd）
 *   - `s, t` 跟踪「当前 r 可由 a, b 线性表出」的系数，从而最终 `a·oldS + b·oldT = gcd`
 *
 * 迭代实现，时间 `O(log(min(|a|,|b|)))`，空间 `O(1)`。用于求模逆元、解线性 Diophantine 方程。
 *
 * @param a 整数（可负）
 * @param b 整数（可负、可为 0）
 * @returns `{ g, x, y }`，满足 `a·x + b·y = g`。`gcd(0,0)` 返回 `{0,0,0}` 之外的惯例：g=0。
 */
export function extGcd(a: number, b: number, hooks: ExtGcdHooks = {}): ExtGcdResult {
  let oldR = a;
  let r = b;
  let oldS = 1;
  let s = 0;
  let oldT = 0;
  let t = 1;

  while (r !== 0) {
    const q = Math.trunc(oldR / r); // 向零取整，保证与负数一致
    hooks.onStep?.(q, oldR, r, oldS, s, oldT, t);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];
  }

  // gcd 定义非负；若 oldR<0（输入为负且未归一），整体取反 Bézout 系数仍成立
  let g = oldR;
  let bx = oldS;
  let by = oldT;
  if (g < 0) {
    g = -g;
    bx = -bx;
    by = -by;
  }
  hooks.onDone?.(g, bx, by);
  return { g, x: bx, y: by };
}
