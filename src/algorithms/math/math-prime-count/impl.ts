// =============================================================================
// 素数计数 π(n) · 纯算法实现（线性筛 + 累加）
// =============================================================================

export interface PrimeCountHooks {
  onSieve?: (primesFound: number) => void;
  onDone?: (count: number) => void;
}

export function primeCount(n: number, hooks: PrimeCountHooks = {}): number {
  if (n < 2) {
    hooks.onDone?.(0);
    return 0;
  }
  const isComp = new Uint8Array(n + 1);
  const primes: number[] = [];
  let count = 0;
  for (let i = 2; i <= n; i++) {
    if (!isComp[i]!) {
      primes.push(i);
      count++;
    }
    for (const p of primes) {
      const ip = i * p;
      if (ip > n) break;
      isComp[ip] = 1;
      if (i % p === 0) break;
    }
  }
  hooks.onSieve?.(count);
  hooks.onDone?.(count);
  return count;
}
