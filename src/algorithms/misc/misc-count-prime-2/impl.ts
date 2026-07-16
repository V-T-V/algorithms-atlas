// 计数质数 · 实现
export interface CountPrimeHooks {
  onMark?: (p: number) => void;
  onConclude?: (count: number) => void;
}
export function miscCountPrime2(n: number, hooks: CountPrimeHooks = {}): number {
  if (n <= 2) return 0;
  const isPrime: boolean[] = new Array(n).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;
  for (let p = 2; p * p < n; p++) {
    if (isPrime[p]) {
      hooks.onMark?.(p);
      for (let k = p * p; k < n; k += p) isPrime[k] = false;
    }
  }
  let count = 0;
  for (let i = 2; i < n; i++) if (isPrime[i]) count++;
  hooks.onConclude?.(count);
  return count;
}
