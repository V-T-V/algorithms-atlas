// =============================================================================
// 线性筛完整版 · 纯算法实现
// 筛素数 + 同步计算欧拉函数 φ。时间 O(n)。
// =============================================================================

export interface LinearSieveFullResult {
  primes: number[];
  phi: number[]; // phi[i] = φ(i)
  isComp: boolean[]; // isComp[i] = true 表示合数
}

/** 事件钩子。 */
export interface LinearSieveFullHooks {
  /** 发现新素数 p。 */
  onPrime?: (p: number) => void;
  /** 用 (i, p) 标记合数 c = i·p。divides 表示 p 是否整除 i。 */
  onMark?: (c: number, i: number, p: number, divides: boolean) => void;
  /** 完成。 */
  onDone?: (count: number, n: number) => void;
}

/**
 * 线性筛完整版：筛 [2, n]，返回素数列表、φ 表、合数标记。
 * @param n 上界（含）
 */
export function linearSieveFull(
  n: number,
  hooks: LinearSieveFullHooks = {},
): LinearSieveFullResult {
  const phi = new Array<number>(Math.max(1, n + 1)).fill(0);
  const isComp = new Array<boolean>(Math.max(1, n + 1)).fill(false);
  const primes: number[] = [];
  if (n < 2) return { primes, phi, isComp };
  phi[1] = 1;
  for (let i = 2; i <= n; i++) {
    if (!isComp[i]) {
      primes.push(i);
      phi[i] = i - 1;
      hooks.onPrime?.(i);
    }
    for (const p of primes) {
      const c = i * p;
      if (c > n) break;
      isComp[c] = true;
      const divides = i % p === 0;
      if (divides) {
        phi[c] = phi[i]! * p;
      } else {
        phi[c] = phi[i]! * (p - 1);
      }
      hooks.onMark?.(c, i, p, divides);
      if (divides) break;
    }
  }
  hooks.onDone?.(primes.length, n);
  return { primes, phi, isComp };
}
