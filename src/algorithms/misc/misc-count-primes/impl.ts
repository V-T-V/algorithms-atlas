// =============================================================================
// 计数素数 · 纯算法实现
// =============================================================================

export interface CountPrimesHooks {
  onPrime?: (p: number) => void;
  onSieve?: (p: number, marked: number) => void;
}

export function countPrimes(n: number, hooks: CountPrimesHooks = {}): number {
  if (n <= 2) return 0;
  const isPrime = new Array<boolean>(n).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;
  for (let p = 2; p * p < n; p++) {
    if (!isPrime[p]!) continue;
    hooks.onPrime?.(p);
    let marked = 0;
    for (let m = p * p; m < n; m += p) {
      if (isPrime[m]!) {
        isPrime[m] = false;
        marked++;
      }
    }
    hooks.onSieve?.(p, marked);
  }
  let count = 0;
  for (let i = 2; i < n; i++) if (isPrime[i]!) count++;
  return count;
}

/** 暴力判定（验证用）。 */
export function isPrimeSimple(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}
