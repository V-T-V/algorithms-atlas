// =============================================================================
// Möbius 函数（线性筛）
// =============================================================================

export interface MobiusHooks {
  onValue?: (i: number, mu: number) => void;
  onDone?: (mu: number[]) => void;
}

export function mobiusSieve(n: number, hooks: MobiusHooks = {}): number[] {
  const mu = new Array<number>(n + 1).fill(0);
  const primes: number[] = [];
  const isComp = new Array<boolean>(n + 1).fill(false);
  mu[1] = 1;
  for (let i = 2; i <= n; i++) {
    if (!isComp[i]!) {
      primes.push(i);
      mu[i] = -1;
    }
    for (const p of primes) {
      const ip = i * p;
      if (ip > n) break;
      isComp[ip] = true;
      if (i % p === 0) {
        mu[ip] = 0;
        break;
      } else {
        mu[ip] = -mu[i]!;
      }
    }
    hooks.onValue?.(i, mu[i]!);
  }
  hooks.onDone?.(mu);
  return mu;
}
