// =============================================================================
// 莫比乌斯反演 Mobius Inversion · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/**
 * 事件钩子。任一可选。
 */
export interface MobiusHooks {
  /** 初始化 mu 数组。 */
  onInit?: (n: number) => void;
  /** 在线性筛中发现素数 p。 */
  onPrime?: (p: number) => void;
  /** 由最小素因子 p 计算出 mu[c]（c 为合数）。 */
  onMark?: (c: number, p: number, mu: number) => void;
  /** 完成 mu 表。 */
  onDone?: (n: number) => void;
}

/**
 * 莫比乌斯函数 μ(n)：
 *   - μ(1) = 1；
 *   - 若 n 含平方因子，μ(n) = 0；
 *   - 否则 μ(n) = (−1)^k，k 为 n 的不同素因子个数。
 *
 * 用线性筛一次性求出 [0, n] 的全部 μ 值。
 */
export function mobiusSieve(n: number, hooks: MobiusHooks = {}): number[] {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('mobiusSieve 需要 n 为非负整数');
  }
  const mu = new Array<number>(n + 1).fill(0);
  mu[0] = 0;
  if (n >= 1) mu[1] = 1;
  hooks.onInit?.(n);

  const isComposite = new Array<boolean>(n + 1).fill(false);
  const primes: number[] = [];

  for (let i = 2; i <= n; i++) {
    if (!isComposite[i]!) {
      primes.push(i);
      mu[i] = -1; // 素数：恰好一个素因子
      hooks.onPrime?.(i);
    }
    for (const p of primes) {
      const c = i * p;
      if (c > n) break;
      isComposite[c] = true;
      if (i % p === 0) {
        // c 含平方因子 p²
        mu[c] = 0;
        hooks.onMark?.(c, p, 0);
        break;
      } else {
        // 增加一个新的素因子 → 符号取反。
        // 注意：若 i 自身含平方因子（mu[i] === 0），c 也含平方因子，应保持 0。
        // 用 -0 || 0 规范化，避免出现 -0。
        mu[c] = -mu[i]! || 0;
        hooks.onMark?.(c, p, mu[c]!);
      }
    }
  }
  hooks.onDone?.(n);
  return mu;
}

/**
 * 莫比乌斯反演：若 g(n) = Σ_{d | n} f(d)，则 f(n) = Σ_{d | n} μ(d) · g(n / d)。
 *
 * 这里实现「给定 g 数组（g[m] 对所有 m=1..n），求 f(n)」的反演。
 *
 * @param g 长度 n+1 的数组，g[m] = Σ_{d|m} f(d)。
 * @param n 要反演的目标下标。
 * @param mu 可选的预计算 μ 表；不传则在内部按 n 重新筛一次。
 */
export function mobiusInvert(g: number[], n: number, mu?: number[]): number {
  if (!Number.isInteger(n) || n < 1) {
    throw new RangeError('mobiusInvert 需要 n 为正整数');
  }
  if (g.length <= n) {
    throw new RangeError('g 数组长度需 ≥ n+1');
  }
  const table = mu ?? mobiusSieve(n);
  let sum = 0;
  // 枚举 n 的所有因子 d
  for (let d = 1; d * d <= n; d++) {
    if (n % d === 0) {
      sum += table[d]! * g[n / d]!;
      const other = n / d;
      if (other !== d) sum += table[other]! * g[n / other]!;
    }
  }
  return sum;
}
