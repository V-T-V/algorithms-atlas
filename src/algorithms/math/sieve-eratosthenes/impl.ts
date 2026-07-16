// =============================================================================
// 埃拉托斯特尼筛（Sieve of Eratosthenes）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SieveHooks {
  /** 确认 p 是素数，开始用它的倍数筛合数。 */
  onPrime?: (p: number) => void;
  /** 把合数 c 标记为「被筛掉」（由素数 p 筛除）。 */
  onMarkComposite?: (c: number, p: number) => void;
}

/**
 * 埃拉托斯特尼筛：枚举 `[2, n]` 内所有素数。
 *
 * 思路：维护布尔数组 `isComposite[]`，从最小未被筛的数 `p` 开始：\n
 *   - `p` 必为素数（更小的素数都没能筛掉它）\n
 *   - 把 `p` 的所有倍数 `p², p²+p, p²+2p, …` 标记为合数\n
 *   - 直到 `p² > n` 为止\n
 * 每个合数只会被其**最小素因子**筛掉一次（线性筛可严格保证，埃氏筛近似）。\n
 *
 * @param n 上界（含）。返回 `<= n` 的所有素数（升序）。
 * @param hooks 可选事件钩子
 * @returns `[2, n]` 内素数数组。`n < 2` 返回 `[]`。
 */
export function sieveEratosthenes(n: number, hooks: SieveHooks = {}): number[] {
  if (n < 2) return [];

  const isComposite = new Array<boolean>(n + 1).fill(false);
  for (let p = 2; p * p <= n; p++) {
    if (isComposite[p]!) continue; // p 已被更小的素数筛掉
    hooks.onPrime?.(p);
    // 从 p² 开始标记（更小的倍数 k·p (k<p) 已被更小素因子筛过）
    for (let c = p * p; c <= n; c += p) {
      if (!isComposite[c]!) {
        isComposite[c] = true;
        hooks.onMarkComposite?.(c, p);
      }
    }
  }
  // p² > n 之后，所有仍未被筛的数都是素数（无需再用它们筛别人）
  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (!isComposite[i]!) {
      primes.push(i);
      // 上面的循环只对 p*p<=n 的素数触发 onPrime；补齐大素数
      if (i * i > n) hooks.onPrime?.(i);
    }
  }
  return primes;
}
