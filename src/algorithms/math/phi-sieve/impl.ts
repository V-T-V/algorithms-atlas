// =============================================================================
// 欧拉函数筛 Phi Sieve · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/**
 * 事件钩子。任一可选；录制器按需实现，用于在筛法的关键事件处插入帧。
 */
export interface PhiSieveHooks {
  /** 初始化：令 phi[i] = i（恒等初值）。 */
  onInit?: (limit: number) => void;
  /** 发现一个素数 p。 */
  onPrime?: (p: number) => void;
  /** 用素数 p 对其倍数 i 做一次松弛（phi[i] -= phi[i] / p）。 */
  onMark?: (i: number, p: number) => void;
  /** 筛完成。 */
  onDone?: (limit: number, primeCount: number) => void;
}

/**
 * 欧拉函数 φ(n)：1..n 中与 n 互素的整数个数。
 * 使用「埃氏筛式」倍数松弛：
 *   1. 初始化 phi[i] = i；
 *   2. 对每个素数 p，遍历它的所有倍数 j，令 phi[j] -= phi[j] / p
 *      （等价于乘以 (1 − 1/p)，组合所有素因子即得 φ）。
 * 一次扫描即可得到 [0, n] 的全部欧拉函数值。
 *
 * @param n 上界（闭区间），需为非负整数。
 * @param hooks 事件钩子（可选）。
 * @returns 长度 n+1 的数组，下标 i 处为 φ(i)。
 */
export function phiSieve(n: number, hooks: PhiSieveHooks = {}): number[] {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('phiSieve 需要 n 为非负整数');
  }
  const phi = new Array<number>(n + 1);
  for (let i = 0; i <= n; i++) phi[i] = i;
  hooks.onInit?.(n);

  const visited = new Array<boolean>(n + 1).fill(false);
  let count = 0;
  for (let i = 2; i <= n; i++) {
    if (!visited[i]!) {
      // i 是素数
      hooks.onPrime?.(i);
      count++;
      for (let j = i; j <= n; j += i) {
        visited[j] = true;
        phi[j]! -= phi[j]! / i;
        hooks.onMark?.(j, i);
      }
    }
  }
  hooks.onDone?.(n, count);
  return phi;
}

/**
 * 取 [2, n] 内全部素数。
 * 复用 phiSieve 的结果：φ(i) = i − 1 当且仅当 i 是素数。
 */
export function primesUpTo(n: number): number[] {
  const phi = phiSieve(n);
  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (phi[i] === i - 1) primes.push(i);
  }
  return primes;
}
