// =============================================================================
// 分段筛（Segmented Sieve）· 纯算法实现
// 求 [L, R] 内的素数：先用基础筛得到 √R 以内的素数，再用这些素数在长度 Δ=R-L+1 的
// 布尔块上划去合数。空间 O(√R + Δ)，适合大区间。
// =============================================================================

export interface SegmentedHooks {
  onBasePrime?: (p: number) => void;
  onMark?: (composite: number, p: number) => void;
  onResult?: (primes: number[]) => void;
}

export function sieveSegmented(L: number, R: number, hooks: SegmentedHooks = {}): number[] {
  if (L > R || R < 2) {
    hooks.onResult?.([]);
    return [];
  }
  const lo = Math.max(L, 2);
  const hi = R;
  // 基础筛：sqrt(hi) 以内素数
  const baseLimit = Math.floor(Math.sqrt(hi)) + 1;
  const baseSieve = new Array<boolean>(baseLimit + 1).fill(true);
  baseSieve[0] = false;
  if (baseLimit >= 1) baseSieve[1] = false;
  const basePrimes: number[] = [];
  for (let i = 2; i <= baseLimit; i++) {
    if (baseSieve[i]!) {
      basePrimes.push(i);
      hooks.onBasePrime?.(i);
      for (let j = i * i; j <= baseLimit; j += i) baseSieve[j] = false;
    }
  }

  const segSize = hi - lo + 1;
  const seg = new Array<boolean>(segSize).fill(true); // seg[k] = lo+k 是否为素
  for (const p of basePrimes) {
    // 第一个 ≥ lo 且为 p 倍数的数
    let start = Math.ceil(lo / p) * p;
    if (start < p * p) start = p * p; // 小于 p² 的合数已被更小素数处理
    for (let c = start; c <= hi; c += p) {
      seg[c - lo] = false;
      hooks.onMark?.(c, p);
    }
  }

  const primes: number[] = [];
  for (let k = 0; k < segSize; k++) {
    if (seg[k]!) primes.push(lo + k);
  }
  hooks.onResult?.(primes);
  return primes;
}
