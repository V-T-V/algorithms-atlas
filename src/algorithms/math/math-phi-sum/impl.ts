// =============================================================================
// 欧拉函数前缀和 · 线性筛
// =============================================================================

export interface PhiSumHooks {
  onValue?: (k: number, phiK: number, prefixSum: number) => void;
}

export function phiSum(n: number, hooks: PhiSumHooks = {}): number {
  const size = Math.max(0, Math.floor(n));
  if (size === 0) return 0;
  const phi = new Array<number>(size + 1);
  const primes: number[] = [];
  const isComp = new Array<boolean>(size + 1).fill(false);
  phi[0] = 0;
  phi[1] = 1;
  for (let i = 2; i <= size; i++) phi[i] = i;

  for (let i = 2; i <= size; i++) {
    if (!isComp[i]) {
      primes.push(i);
      phi[i] = i - 1;
    }
    for (const p of primes) {
      if (i * p > size) break;
      isComp[i * p] = true;
      if (i % p === 0) {
        phi[i * p] = phi[i]! * p;
        break;
      } else {
        phi[i * p] = phi[i]! * (p - 1);
      }
    }
  }

  let sum = 0;
  for (let k = 1; k <= size; k++) {
    sum += phi[k]!;
    hooks.onValue?.(k, phi[k]!, sum);
  }
  return sum;
}

export function phiSingle(n: number): number {
  // 单点 φ
  let result = n;
  let x = n;
  for (let p = 2; p * p <= x; p++) {
    if (x % p === 0) {
      while (x % p === 0) x = Math.floor(x / p);
      result -= Math.floor(result / p);
    }
  }
  if (x > 1) result -= Math.floor(result / x);
  return result;
}
