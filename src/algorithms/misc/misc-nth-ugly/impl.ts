// =============================================================================
// 第 N 个丑数 · 纯算法实现
// =============================================================================

export interface NthUglyHooks {
  onGenerate?: (index: number, value: number, source: number) => void;
}

export function nthUglyNumber(n: number, hooks: NthUglyHooks = {}): number {
  if (n < 1) throw new Error(`n 必须 >= 1 / must be >= 1, got ${n}`);
  const ugly = new Array<number>(n).fill(0);
  ugly[0] = 1;
  let p2 = 0,
    p3 = 0,
    p5 = 0;
  for (let i = 1; i < n; i++) {
    const next2 = ugly[p2]! * 2;
    const next3 = ugly[p3]! * 3;
    const next5 = ugly[p5]! * 5;
    const next = Math.min(next2, next3, next5);
    ugly[i] = next;
    let source = 0;
    if (next === next2) {
      p2++;
      source = 2;
    }
    if (next === next3) {
      p3++;
      source = source || 3;
    }
    if (next === next5) {
      p5++;
      source = source || 5;
    }
    hooks.onGenerate?.(i, next, source);
  }
  return ugly[n - 1]!;
}

/** 判定一个数是否丑数（用于验证）。 */
export function isUgly(num: number): boolean {
  if (num <= 0) return false;
  let x = num;
  for (const f of [2, 3, 5]) {
    while (x % f === 0) x /= f;
  }
  return x === 1;
}
