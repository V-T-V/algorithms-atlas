// =============================================================================
// 欧拉函数 Euler Totient φ(n) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface EulerTotientHooks {
  /** 单值求 φ(n) 过程中，发现一个质因子 p（已含其指数）。factor = p^k。 */
  onFactor?: (n: number, p: number, pk: number) => void;
  /** 单值求 φ(n) 完成。 */
  onDone?: (n: number, phi: number) => void;
  /** 筛法：当前正在用质数 p 作为因子筛 [1..N]。 */
  onSievePrime?: (p: number) => void;
  /** 筛法：把 i 标记为已处理（φ[i] 已确定）。 */
  onSieveValue?: (i: number, phi: number) => void;
  /** 筛法完成。 */
  onSieveDone?: (phis: number[]) => void;
}

/**
 * 欧拉函数 φ(n)：1..n 中与 n 互素的正整数个数。
 *
 * 公式：对 n 做质因数分解 `n = p1^k1 · p2^k2 · ... · pr^kr`，则
 *   `φ(n) = n · ∏ (1 − 1/pi) = ∏ pi^(ki−1) · (pi − 1)`。
 *
 * 性质：φ(1) = 1；n 为素数时 φ(n) = n − 1。
 *
 * - `eulerTotient(n)`：单值，`O(√n)` 分解。
 * - `eulerTotientSieve(N)`：用线性筛（欧拉筛思想）批量求 `φ[1..N]`，`O(N)`。
 *
 * @param n 正整数（n ≥ 1）
 * @returns φ(n)
 */
export function eulerTotient(n: number, hooks: EulerTotientHooks = {}): number {
  if (n < 1) throw new RangeError('eulerTotient: n must be a positive integer');
  let result = n;
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) {
      // p 是一个质因子：把 p 从 m 中全部除掉，再乘 (1 − 1/p)
      while (m % p === 0) m = Math.trunc(m / p);
      result = result - Math.trunc(result / p);
      hooks.onFactor?.(n, p, p);
    }
  }
  // 剩下的 m > 1 说明它是最后一个大于 √n 的质因子
  if (m > 1) {
    result = result - Math.trunc(result / m);
    hooks.onFactor?.(n, m, m);
  }
  hooks.onDone?.(n, result);
  return result;
}

/**
 * 线性筛（欧拉筛）批量求 φ[1..N]。
 *
 * 核心：每个合数只被其「最小质因子」筛掉一次。设 i 为当前扫描数、p 为某个已记录质数：
 *   - 若 i 被 p 整除，说明 p 是 i 的最小质因子，此时 φ[i·p] = φ[i] · p
 *     （p 的指数比 i 中至少大 1，多了个 p 而非 (p−1)）
 *   - 否则 gcd(i, p)=1，由积性 φ(i·p) = φ(i) · φ(p) = φ(i) · (p−1)
 *
 * @param N 正整数上限（N ≥ 1）
 * @returns 长度 N+1 的数组 phi，phi[i] = φ(i)（phi[0] 无意义，置 0）
 */
export function eulerTotientSieve(N: number, hooks: EulerTotientHooks = {}): number[] {
  if (N < 1) throw new RangeError('eulerTotientSieve: N must be a positive integer');
  const phi = new Array<number>(N + 1).fill(0);
  const primes: number[] = [];
  phi[1] = 1;
  hooks.onSieveValue?.(1, 1);

  for (let i = 2; i <= N; i++) {
    if (phi[i] === 0) {
      // i 是素数
      phi[i] = i - 1;
      primes.push(i);
      hooks.onSievePrime?.(i);
      hooks.onSieveValue?.(i, phi[i]!);
    }
    for (let j = 0; j < primes.length; j++) {
      const p = primes[j]!;
      const ip = i * p;
      if (ip > N) break;
      if (i % p === 0) {
        // p 是 i 的最小质因子：φ(i·p) = φ(i) · p
        phi[ip] = phi[i]! * p;
        hooks.onSieveValue?.(ip, phi[ip]!);
        break;
      } else {
        // 互素：φ(i·p) = φ(i) · (p−1)
        phi[ip] = phi[i]! * (p - 1);
        hooks.onSieveValue?.(ip, phi[ip]!);
      }
    }
  }
  hooks.onSieveDone?.(phi);
  return phi;
}
