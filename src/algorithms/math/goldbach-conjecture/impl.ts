// =============================================================================
// 哥德巴赫猜想验证 · 纯算法实现
// 强哥德巴赫猜想：每个 >2 的偶数可表示为两素数之和。
// 本实现：对给定偶数 n，枚举 p ≤ n/2，若 p 与 n-p 都是素数则返回一组 (p, n-p)。
// 配合筛法生成素数表加速判定。
// =============================================================================

export interface GoldbachHooks {
  onTry?: (p: number, q: number, pPrime: boolean, qPrime: boolean) => void;
  onResult?: (found: boolean, pair: [number, number] | null) => void;
}

export interface GoldbachResult {
  found: boolean;
  pair: [number, number] | null;
}

function sieve(max: number): boolean[] {
  const isP = new Array<boolean>(max + 1).fill(true);
  if (max >= 0) isP[0] = false;
  if (max >= 1) isP[1] = false;
  for (let i = 2; i * i <= max; i++) {
    if (!isP[i]) continue;
    for (let j = i * i; j <= max; j += i) isP[j] = false;
  }
  return isP;
}

export function goldbach(n: number, hooks: GoldbachHooks = {}): GoldbachResult {
  if (n <= 2 || n % 2 !== 0) {
    hooks.onResult?.(false, null);
    return { found: false, pair: null };
  }
  const isP = sieve(n);
  for (let p = 2; p <= n / 2; p++) {
    const q = n - p;
    hooks.onTry?.(p, q, isP[p]!, isP[q]!);
    if (isP[p]! && isP[q]!) {
      hooks.onResult?.(true, [p, q]);
      return { found: true, pair: [p, q] };
    }
  }
  hooks.onResult?.(false, null);
  return { found: false, pair: null };
}

/** 统计 n 的所有哥德巴赫分拆数（验证密集程度）。 */
export function goldbachPartitionCount(n: number): number {
  if (n <= 2 || n % 2 !== 0) return 0;
  const isP = sieve(n);
  let cnt = 0;
  for (let p = 2; p <= n / 2; p++) {
    if (isP[p]! && isP[n - p]!) cnt++;
  }
  return cnt;
}
