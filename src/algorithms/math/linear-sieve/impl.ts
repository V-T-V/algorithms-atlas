// =============================================================================
// 线性筛 Linear Sieve（Euler Sieve）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/**
 * 线性筛结果。
 */
export interface LinearSieveResult {
  /** 是否为合数标记数组，长度 n+1；isComposite[i]=false 当 i 为素数（含 i=0,1 的边界）。 */
  isComposite: boolean[];
  /** 升序素数列表。 */
  primes: number[];
  /** 每个数的最小素因子（ SPF ），长度 n+1；spf[0]=spf[1]=0。 */
  spf: number[];
}

/**
 * 事件钩子。任一可选；录制器按需实现。
 */
export interface LinearSieveHooks {
  /** 扫描到外层 i（无论是否素数）。 */
  onScan?: (i: number) => void;
  /** i 为素数时被发现。 */
  onPrime?: (p: number) => void;
  /** 用素数 p 标记合数 i*p（关键：每个合数恰好被最小素因子标记一次）。 */
  onMark?: (composite: number, p: number, i: number) => void;
  /** 因 i % p === 0 而提前结束内层循环（保证线性）。 */
  onBreak?: (i: number, p: number) => void;
  /** 筛完成。 */
  onDone?: (n: number, primeCount: number) => void;
}

/**
 * 线性筛（欧拉筛）：在严格 O(n) 时间内筛出 [0, n] 的全部素数，并给出每个数的最小素因子。
 *
 * 核心思想：扫描每个 i，用已有素数表 primes 中的 p 去标记合数 i·p；
 * 当 `i % p === 0` 时立即停止（保证每个合数仅被它的最小素因子筛掉一次）。
 *
 * @param n 上界（闭区间），非负整数。
 * @param hooks 事件钩子（可选）。
 */
export function linearSieve(n: number, hooks: LinearSieveHooks = {}): LinearSieveResult {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('linearSieve 需要 n 为非负整数');
  }
  const isComposite = new Array<boolean>(n + 1).fill(false);
  const spf = new Array<number>(n + 1).fill(0);
  const primes: number[] = [];

  for (let i = 2; i <= n; i++) {
    hooks.onScan?.(i);
    if (!isComposite[i]!) {
      primes.push(i);
      spf[i] = i;
      hooks.onPrime?.(i);
    }
    for (const p of primes) {
      const c = i * p;
      if (c > n) break;
      isComposite[c] = true;
      spf[c] = p;
      hooks.onMark?.(c, p, i);
      if (i % p === 0) {
        hooks.onBreak?.(i, p);
        break;
      }
    }
  }
  hooks.onDone?.(n, primes.length);
  return { isComposite, primes, spf };
}

/**
 * 利用最小素因子对 n 做质因数分解。
 * 返回升序的素因子（含重复），例如 60 → [2,2,3,5]。
 */
export function factorize(spf: number[], n: number): number[] {
  const factors: number[] = [];
  let x = n;
  while (x > 1) {
    const p = spf[x]!;
    factors.push(p);
    x = x / p;
  }
  return factors;
}
