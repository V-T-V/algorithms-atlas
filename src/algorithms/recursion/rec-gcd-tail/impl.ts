// 尾递归最大公约数 · 实现

export interface GcdHooks {
  onCall?: (a: number, b: number, depth: number) => void;
}

/** 尾递归欧几里得（取模版）。 */
export function gcdTail(a: number, b: number, depth = 0, hooks: GcdHooks = {}): number {
  hooks.onCall?.(a, b, depth);
  if (b === 0) return a;
  return gcdTail(b, a % b, depth + 1, hooks);
}

/** 减法版（更相减损术，对照用）。 */
export function gcdSubtract(a: number, b: number, depth = 0, hooks: GcdHooks = {}): number {
  hooks.onCall?.(a, b, depth);
  if (a === b) return a;
  if (a > b) return gcdSubtract(a - b, b, depth + 1, hooks);
  return gcdSubtract(a, b - a, depth + 1, hooks);
}

/** 迭代版（等价 TCO）。 */
export function gcdIter(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

/** 最小公倍数。 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcdTail(a, b);
}
