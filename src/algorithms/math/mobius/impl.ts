// =============================================================================
// 莫比乌斯函数 Mobius Function μ(n) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MobiusHooks {
  /** 单值求 μ(n) 时发现一个质因子 p。 */
  onFactor?: (n: number, p: number) => void;
  /** 单值求 μ(n) 发现某个质因子的指数 ≥ 2 → μ=0。 */
  onSquareFactor?: (n: number, p: number) => void;
  /** 单值求 μ(n) 完成。 */
  onDone?: (n: number, mu: number) => void;
  /** 筛法：把 i 标记为已处理（μ[i] 已确定）。 */
  onSieveValue?: (i: number, mu: number) => void;
  /** 筛法：发现素数 p。 */
  onSievePrime?: (p: number) => void;
  /** 筛法完成。 */
  onSieveDone?: (mus: number[]) => void;
}

/**
 * 莫比乌斯函数 μ(n)：
 *   - μ(1) = 1
 *   - 若 n 含平方因子（某质因子指数 ≥ 2），μ(n) = 0
 *   - 否则设 n 为 k 个不同素数之积，μ(n) = (−1)^k
 *
 * 单值实现：对 n 做 `O(√n)` 分解，统计不同质因子个数 k，遇平方因子直接返回 0。
 *
 * @param n 正整数（n ≥ 1）
 * @returns μ(n) ∈ {−1, 0, 1}
 */
export function mobius(n: number, hooks: MobiusHooks = {}): number {
  if (n < 1) throw new RangeError('mobius: n must be a positive integer');
  if (n === 1) {
    hooks.onDone?.(1, 1);
    return 1;
  }
  let result = 1;
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) {
      let cnt = 0;
      while (m % p === 0) {
        m = Math.trunc(m / p);
        cnt++;
      }
      hooks.onFactor?.(n, p);
      if (cnt >= 2) {
        hooks.onSquareFactor?.(n, p);
        hooks.onDone?.(n, 0);
        return 0;
      }
      result = -result; // 翻转符号
    }
  }
  if (m > 1) {
    hooks.onFactor?.(n, m);
    result = -result; // 剩下的是最后一个质因子
  }
  hooks.onDone?.(n, result);
  return result;
}

/**
 * 线性筛批量求 μ[1..N]。
 *
 * 思想（同欧拉筛）：每个合数只被其最小质因子筛一次。
 *   - i 为素数：μ(i) = −1
 *   - i·p 且 p ∤ i：μ(i·p) = −μ(i)（积性，gcd=1）
 *   - i·p 且 p | i：i·p 含平方因子 p² → μ(i·p) = 0
 *
 * @param N 正整数上限
 * @returns 长度 N+1 的数组 mu，mu[i] = μ(i)（mu[0] 占位为 0）
 */
export function mobiusSieve(N: number, hooks: MobiusHooks = {}): number[] {
  if (N < 1) throw new RangeError('mobiusSieve: N must be a positive integer');
  const mu = new Array<number>(N + 1).fill(0);
  const primes: number[] = [];
  const isComp = new Array<boolean>(N + 1).fill(false);
  mu[1] = 1;
  hooks.onSieveValue?.(1, 1);

  for (let i = 2; i <= N; i++) {
    if (!isComp[i]) {
      // i 是素数
      primes.push(i);
      mu[i] = -1;
      hooks.onSievePrime?.(i);
      hooks.onSieveValue?.(i, -1);
    }
    for (let j = 0; j < primes.length; j++) {
      const p = primes[j]!;
      const ip = i * p;
      if (ip > N) break;
      isComp[ip] = true;
      if (i % p === 0) {
        // p | i → ip 含 p² → μ=0
        mu[ip] = 0;
        hooks.onSieveValue?.(ip, 0);
        break;
      } else {
        // 注意 -0 需规范化为 0
        const v = -mu[i]!;
        mu[ip] = v === 0 ? 0 : v;
        hooks.onSieveValue?.(ip, mu[ip]!);
      }
    }
  }
  hooks.onSieveDone?.(mu);
  return mu;
}
