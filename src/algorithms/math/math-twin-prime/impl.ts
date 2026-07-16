// =============================================================================
// 孪生素数 · 埃氏筛 + 配对
// =============================================================================

export interface TwinPrimeHooks {
  onSieve?: (idx: number, isPrime: boolean) => void;
  onPair?: (p: number) => void;
}

export interface TwinPrimeResult {
  pairs: Array<[number, number]>;
}

export function twinPrimes(n: number, hooks: TwinPrimeHooks = {}): TwinPrimeResult {
  const size = Math.max(2, Math.floor(n));
  const sieve = new Array<boolean>(size + 1).fill(true);
  sieve[0] = false;
  sieve[1] = false;
  for (let i = 2; i * i <= size; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= size; j += i) sieve[j] = false;
    }
  }
  for (let i = 0; i <= size; i++) hooks.onSieve?.(i, sieve[i]!);

  const pairs: Array<[number, number]> = [];
  for (let p = 2; p + 2 <= size; p++) {
    if (sieve[p] && sieve[p + 2]) {
      pairs.push([p, p + 2]);
      hooks.onPair?.(p);
    }
  }
  return { pairs };
}
