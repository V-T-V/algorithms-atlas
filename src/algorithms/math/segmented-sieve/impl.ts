// =============================================================================
// 分段筛 Segmented Sieve · 纯算法实现
// 筛 [L, R] 内的所有素数。R 可达 10^12 量级，但要求 L>=2。
// =============================================================================

/** 事件钩子。 */
export interface SegmentedSieveHooks {
  /** 完成基础素数筛 [2, √R]。给出小素数列表。 */
  onBaseSieve?: (basePrimes: number[]) => void;
  /** 开始处理一段 [segL, segR]。 */
  onSegment?: (segL: number, segR: number) => void;
  /** 在段内用素数 p 标记 start 为合数。 */
  onMark?: (start: number, p: number) => void;
  /** 段内发现素数 x。 */
  onPrime?: (x: number) => void;
  /** 完成。给出素数总数。 */
  onDone?: (count: number) => void;
}

/** 简单埃氏筛筛 [2, n]。 */
function baseSieve(n: number): number[] {
  if (n < 2) return [];
  const comp = new Array<boolean>(n + 1).fill(false);
  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (!comp[i]) {
      primes.push(i);
      for (let j = i * i; j <= n; j += i) comp[j] = true;
    }
  }
  return primes;
}

/** 求大于等于 x 的最小 p 的倍数（且 >= p*p）。返回值可能超出 segR。 */
function firstMultiple(x: number, p: number): number {
  const start = Math.max(p * p, Math.ceil(x / p) * p);
  return start;
}

/**
 * 分段筛：筛出 [L, R] 内的全部素数（R 可很大，2 ≤ L ≤ R）。
 * @returns 升序素数数组
 */
export function segmentedSieve(L: number, R: number, hooks: SegmentedSieveHooks = {}): number[] {
  if (L < 2) L = 2;
  if (R < L) return [];
  const limit = Math.floor(Math.sqrt(R)) + 1;
  const basePrimes = baseSieve(limit);
  hooks.onBaseSieve?.(basePrimes);

  const SEG = Math.max(limit, 1 << 15);
  const result: number[] = [];

  for (let segL = L; segL <= R; segL += SEG) {
    const segR = Math.min(segL + SEG - 1, R);
    const size = segR - segL + 1;
    const comp = new Array<boolean>(size).fill(false);
    hooks.onSegment?.(segL, segR);

    for (const p of basePrimes) {
      let start = firstMultiple(segL, p);
      if (start < segL) start += p;
      for (let j = start; j <= segR; j += p) {
        comp[j - segL] = true;
        hooks.onMark?.(j, p);
      }
    }
    for (let i = 0; i < size; i++) {
      const x = segL + i;
      if (!comp[i] && x >= 2) {
        result.push(x);
        hooks.onPrime?.(x);
      }
    }
  }
  hooks.onDone?.(result.length);
  return result;
}
