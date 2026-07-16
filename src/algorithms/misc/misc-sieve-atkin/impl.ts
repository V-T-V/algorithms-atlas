// Atkin 筛 · 实现
export interface SaHooks {
  onFlip?: (n: number) => void;
  onPrime?: (p: number) => void;
  onConclude?: (count: number) => void;
}
export function sieveAtkin(limit: number, hooks: SaHooks = {}): number[] {
  const sieve = new Uint8Array(limit + 1);
  if (limit >= 2) sieve[2] = 1;
  if (limit >= 3) sieve[3] = 1;
  for (let x = 1; x * x <= limit; x++) {
    for (let y = 1; y * y <= limit; y++) {
      let n = 4 * x * x + y * y;
      if ((n <= limit && n % 12 === 1) || n % 12 === 5) {
        sieve[n]! ^= 1;
        hooks.onFlip?.(n);
      }
      n = 3 * x * x + y * y;
      if (n <= limit && n % 12 === 7) {
        sieve[n]! ^= 1;
        hooks.onFlip?.(n);
      }
      n = 3 * x * x - y * y;
      if (x > y && n <= limit && n % 12 === 11) {
        sieve[n]! ^= 1;
        hooks.onFlip?.(n);
      }
    }
  }
  for (let r = 5; r * r <= limit; r++) {
    if (sieve[r]) for (let i = r * r; i <= limit; i += r * r) sieve[i] = 0;
  }
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++)
    if (sieve[i]) {
      primes.push(i);
      hooks.onPrime?.(i);
    }
  hooks.onConclude?.(primes.length);
  return primes;
}
