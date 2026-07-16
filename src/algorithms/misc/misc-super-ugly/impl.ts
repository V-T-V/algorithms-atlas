// =============================================================================
// 超级丑数 · 纯算法实现
// =============================================================================

export interface SuperUglyHooks {
  onGenerate?: (index: number, value: number, prime: number) => void;
}

export function nthSuperUglyNumber(
  n: number,
  primes: readonly number[],
  hooks: SuperUglyHooks = {},
): number {
  if (n < 1) throw new Error(`n 必须 >= 1 / must be >= 1, got ${n}`);
  if (primes.length === 0) throw new Error(`princes 不能为空 / primes must be non-empty`);
  const ugly = new Array<number>(n).fill(0);
  ugly[0] = 1;
  const pointers = new Array<number>(primes.length).fill(0);
  for (let i = 1; i < n; i++) {
    let next = Infinity;
    for (let p = 0; p < primes.length; p++) {
      next = Math.min(next, ugly[pointers[p]!]! * primes[p]!);
    }
    ugly[i] = next;
    for (let p = 0; p < primes.length; p++) {
      if (ugly[pointers[p]!]! * primes[p]! === next) {
        hooks.onGenerate?.(i, next, primes[p]!);
        pointers[p]!++;
      }
    }
  }
  return ugly[n - 1]!;
}
