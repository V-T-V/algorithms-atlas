// =============================================================================
// 杜教筛 Du Sieve · 纯算法实现
// 在约 O(n^{2/3}) 时间内求积性函数 f 的前缀和 S(n) = Σ_{i=1}^{n} f(i)。
// 这里以两个经典可验证的积性函数为例：μ（Möbius）与 φ（Euler totient）。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/**
 * 事件钩子。任一可选。
 */
export interface DuSieveHooks {
  /** 预筛 [0, N] 区间（N = n^{2/3} 量级）。 */
  onPreSieve?: (limit: number) => void;
  /** 在数论分块处理中遇到新区间 [l, r]（d = ⌊n/l⌋）。 */
  onBlock?: (l: number, r: number, d: number) => void;
  /** 递归求解一个大于预筛上界的前缀和 S(d)。 */
  onRecurse?: (d: number) => void;
  /** 最终结果。 */
  onDone?: (n: number, sumMu: bigint, sumPhi: bigint) => void;
}

/** 内部递归 + 记忆化的工作器。 */
class DuWorker {
  private readonly muMap = new Map<bigint, bigint>();
  private readonly phiMap = new Map<bigint, bigint>();
  constructor(
    private readonly preMu: number[],
    private readonly prePhi: number[],
    private readonly limit: number,
    private readonly hooks: DuSieveHooks,
  ) {}

  /** Σ_{i=1}^{n} μ(i)。利用 μ * 1 = ε（恒等），故 g(n)=Σ_{d|n} 1·μ(d)=[n==1]，即 G(n)=1。 */
  sumMu(n: bigint): bigint {
    if (n <= 0n) return 0n;
    if (n <= this.limit) {
      let s = 0;
      for (let i = 1; i <= Number(n); i++) s += this.preMu[i]!;
      return BigInt(s);
    }
    const cached = this.muMap.get(n);
    if (cached !== undefined) return cached;

    this.hooks.onRecurse?.(Number(n));
    // S(n) = 1 - Σ_{d=2}^{n} S(⌊n/d⌋)，用数论分块
    let sum = 1n;
    let l = 2n;
    while (l <= n) {
      const d = n / l;
      const r = n / d;
      this.hooks.onBlock?.(Number(l), Number(r), Number(d));
      const len = r - l + 1n;
      sum -= len * this.sumMu(d);
      l = r + 1n;
    }
    this.muMap.set(n, sum);
    return sum;
  }

  /** Σ_{i=1}^{n} φ(i)。利用 φ * 1 = id，故 g(n)=Σ_{d|n} φ(d)=n，即 G(n)=n(n+1)/2。 */
  sumPhi(n: bigint): bigint {
    if (n <= 0n) return 0n;
    if (n <= this.limit) {
      let s = 0;
      for (let i = 1; i <= Number(n); i++) s += this.prePhi[i]!;
      return BigInt(s);
    }
    const cached = this.phiMap.get(n);
    if (cached !== undefined) return cached;

    this.hooks.onRecurse?.(Number(n));
    // G(n) = n(n+1)/2 = Σ S(⌊n/d⌋) over d=1..n
    // → S(n) = G(n) - Σ_{d=2}^{n} S(⌊n/d⌋)
    const Gn = (n * (n + 1n)) / 2n;
    let sum = Gn;
    let l = 2n;
    while (l <= n) {
      const d = n / l;
      const r = n / d;
      this.hooks.onBlock?.(Number(l), Number(r), Number(d));
      const len = r - l + 1n;
      sum -= len * this.sumPhi(d);
      l = r + 1n;
    }
    this.phiMap.set(n, sum);
    return sum;
  }
}

/**
 * 杜教筛：给定上界 n，返回 { sumMu, sumPhi }：
 *   - sumMu = Σ_{i=1}^{n} μ(i)
 *   - sumPhi = Σ_{i=1}^{n} φ(i)
 * 对 n 较大时（>10^7）尤其高效；这里实现完整的「线性筛预处理 + 数论分块递归 + 记忆化」。
 *
 * @param n 上界（正整数）。
 * @param hooks 事件钩子（可选）。
 */
export function duSieve(n: number, hooks: DuSieveHooks = {}): { sumMu: bigint; sumPhi: bigint } {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('duSieve 需要 n 为非负整数');
  }
  // 预筛上界：取 ⌈n^{2/3}⌉（同时至少 1）。
  const limit = Math.max(1, Math.ceil(Math.pow(n, 2 / 3)));
  hooks.onPreSieve?.(limit);

  // 线性筛求 μ 与 φ 的预表
  const preMu = new Array<number>(limit + 1).fill(0);
  const prePhi = new Array<number>(limit + 1).fill(0);
  preMu[0] = 0;
  preMu[1] = 1;
  prePhi[1] = 1;
  const isComp = new Array<boolean>(limit + 1).fill(false);
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    if (!isComp[i]!) {
      primes.push(i);
      preMu[i] = -1;
      prePhi[i] = i - 1;
    }
    for (const p of primes) {
      const c = i * p;
      if (c > limit) break;
      isComp[c] = true;
      if (i % p === 0) {
        preMu[c] = 0;
        prePhi[c] = prePhi[i]! * p;
        break;
      } else {
        preMu[c] = -preMu[i]!;
        prePhi[c] = prePhi[i]! * (p - 1);
      }
    }
  }

  const worker = new DuWorker(preMu, prePhi, limit, hooks);
  const N = BigInt(n);
  const sumMu = worker.sumMu(N);
  const sumPhi = worker.sumPhi(N);
  hooks.onDone?.(n, sumMu, sumPhi);
  return { sumMu, sumPhi };
}
