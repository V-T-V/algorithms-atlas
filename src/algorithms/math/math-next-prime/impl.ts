// =============================================================================
// 下一个素数 · 纯算法实现
// =============================================================================

export interface NextPrimeHooks {
  onTest?: (candidate: number, isPrime: boolean) => void;
  onDone?: (prime: number) => void;
}

export function isPrimeTrial(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0) return false;
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return false;
  }
  return true;
}

export function nextPrime(n: number, hooks: NextPrimeHooks = {}): number {
  let cand = Math.floor(n) + 1;
  if (cand <= 2) cand = 2;
  while (!isPrimeTrial(cand)) {
    hooks.onTest?.(cand, false);
    cand++;
  }
  hooks.onTest?.(cand, true);
  hooks.onDone?.(cand);
  return cand;
}
