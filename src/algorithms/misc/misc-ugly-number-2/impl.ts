// =============================================================================
// 丑数判定 · 纯算法实现
// =============================================================================

export interface UglyCheckHooks {
  onDivide?: (factor: number, quotient: number) => void;
}

export function isUglyNumber(num: number, hooks: UglyCheckHooks = {}): boolean {
  if (num <= 0) return false;
  let x = num;
  for (const f of [2, 3, 5]) {
    while (x % f === 0) {
      x /= f;
      hooks.onDivide?.(f, x);
    }
  }
  return x === 1;
}

/** 列出 <= n 的所有丑数。 */
export function listUgly(n: number): number[] {
  const result: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (isUglyNumber(i)) result.push(i);
  }
  return result;
}
