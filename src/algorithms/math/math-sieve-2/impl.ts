// =============================================================================
// 埃氏筛
// =============================================================================

export interface SieveHooks {
  onMark?: (i: number, isPrime: boolean) => void;
  onPrime?: (p: number) => void;
}

export interface SieveResult {
  isPrime: boolean[];
  primes: number[];
}

export function sieve(n: number, hooks: SieveHooks = {}): SieveResult {
  const size = Math.max(1, Math.floor(n));
  const isPrime = new Array<boolean>(size + 1).fill(true);
  isPrime[0] = false;
  if (size >= 1) isPrime[1] = false;
  for (let i = 2; i * i <= size; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= size; j += i) isPrime[j] = false;
    }
  }
  const primes: number[] = [];
  for (let i = 2; i <= size; i++) {
    hooks.onMark?.(i, isPrime[i]!);
    if (isPrime[i]) {
      primes.push(i);
      hooks.onPrime?.(i);
    }
  }
  return { isPrime, primes };
}
