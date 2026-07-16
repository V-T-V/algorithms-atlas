// =============================================================================
// 欧拉函数（线性筛）
// =============================================================================

export interface EulerSieveHooks {
  onPrime?: (p: number) => void;
  onPhi?: (i: number, phi: number) => void;
  onDone?: (phi: number[]) => void;
}

export function eulerSieve(n: number, hooks: EulerSieveHooks = {}): number[] {
  const phi = new Array<number>(n + 1).fill(0);
  const primes: number[] = [];
  const isComp = new Array<boolean>(n + 1).fill(false);
  phi[1] = 1;
  for (let i = 2; i <= n; i++) {
    if (!isComp[i]!) {
      primes.push(i);
      phi[i] = i - 1;
      hooks.onPrime?.(i);
    }
    for (const p of primes) {
      const ip = i * p;
      if (ip > n) break;
      isComp[ip] = true;
      if (i % p === 0) {
        phi[ip] = phi[i]! * p;
        break;
      } else {
        phi[ip] = phi[i]! * (p - 1);
      }
    }
    hooks.onPhi?.(i, phi[i]!);
  }
  hooks.onDone?.(phi);
  return phi;
}
