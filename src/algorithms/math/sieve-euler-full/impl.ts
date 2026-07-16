// =============================================================================
// 欧拉筛完整版 · 纯算法实现
// 线性时间筛素数 + 最小质因子 lpf 表。
// =============================================================================

export interface EulerSieveFullResult {
  primes: number[];
  lpf: number[]; // lpf[i] = i 的最小质因子（i>=2）；lpf[0]=lpf[1]=0 表示未定义
}

/** 事件钩子。 */
export interface EulerSieveFullHooks {
  /** 发现新素数 p。 */
  onPrime?: (p: number) => void;
  /** 用 (i, p) 标记合数 c = i·p，并记录 lpf[c] = p。 */
  onMark?: (c: number, i: number, p: number) => void;
  /** 完成。给出素数个数。 */
  onDone?: (count: number, n: number) => void;
}

/**
 * 欧拉筛完整版：筛 [2, n]，返回素数列表与 lpf 数组。
 * @param n 上界（含）
 */
export function eulerSieveFull(n: number, hooks: EulerSieveFullHooks = {}): EulerSieveFullResult {
  if (n < 2) return { primes: [], lpf: new Array(Math.max(0, n + 1)).fill(0) };
  const lpf = new Array<number>(n + 1).fill(0);
  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (lpf[i] === 0) {
      lpf[i] = i;
      primes.push(i);
      hooks.onPrime?.(i);
    }
    for (const p of primes) {
      const c = i * p;
      if (c > n) break;
      lpf[c] = p;
      hooks.onMark?.(c, i, p);
      if (p === lpf[i]) break; // p 是 i 的最小质因子，保证线性
    }
  }
  hooks.onDone?.(primes.length, n);
  return { primes, lpf };
}
