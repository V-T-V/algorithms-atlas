// 埃氏筛法 · 实现
export function sievePrimes(n: number): number[] {
  if (n < 2) return [];
  const sieve = new Array<boolean>(n + 1).fill(true);
  sieve[0] = false;
  sieve[1] = false;
  for (let p = 2; p * p <= n; p++)
    if (sieve[p]) for (let m = p * p; m <= n; m += p) sieve[m] = false;
  const primes: number[] = [];
  for (let i = 2; i <= n; i++) if (sieve[i]) primes.push(i);
  return primes;
}
