// =============================================================================
// 上一个素数 · 纯算法实现
// =============================================================================

export interface PrevPrimeHooks {
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

export function prevPrime(n: number, hooks: PrevPrimeHooks = {}): number {
  if (n <= 2) {
    hooks.onDone?.(-1);
    return -1;
  }
  let cand = Math.floor(n) - 1;
  while (cand >= 2 && !isPrimeTrial(cand)) {
    hooks.onTest?.(cand, false);
    cand--;
  }
  if (cand < 2) {
    hooks.onDone?.(-1);
    return -1;
  }
  hooks.onTest?.(cand, true);
  hooks.onDone?.(cand);
  return cand;
}
