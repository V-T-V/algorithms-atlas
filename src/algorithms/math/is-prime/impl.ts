// =============================================================================
// 素数判定 Is Prime · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface IsPrimeHooks {
  /** 试除一个候选因子 d（从 2 到 √n 的整数）。 */
  onTrial?: (d: number) => void;
  /** 发现因子 d（n 为合数）。 */
  onFactor?: (d: number) => void;
  /** 判定结束。 */
  onResult?: (isPrime: boolean) => void;
}

/**
 * 素数判定（试除法，6k±1 优化）。
 *
 * 原理：若 `n` 有因子 `d` 满足 `1 < d ≤ √n`，则 `n` 是合数；否则为素数。
 * 优化：先排除 2、3，再只检查形如 `6k±1` 的候选因子（所有 >3 的素数都落在这些位置）。
 *
 * - 时间 `O(√n)`
 * - 空间 `O(1)`
 *
 * @param n 非负整数
 * @param hooks 可选的事件钩子
 * @returns `n` 是否为素数
 */
export function isPrime(n: number, hooks: IsPrimeHooks = {}): boolean {
  if (!Number.isInteger(n) || n < 2) {
    hooks.onResult?.(false);
    return false;
  }
  if (n === 2 || n === 3) {
    hooks.onResult?.(true);
    return true;
  }
  if (n % 2 === 0 || n % 3 === 0) {
    hooks.onFactor?.(n % 2 === 0 ? 2 : 3);
    hooks.onResult?.(false);
    return false;
  }
  const limit = Math.floor(Math.sqrt(n));
  for (let d = 5; d <= limit; d += 6) {
    hooks.onTrial?.(d);
    if (n % d === 0) {
      hooks.onFactor?.(d);
      hooks.onResult?.(false);
      return false;
    }
    hooks.onTrial?.(d + 2);
    if (n % (d + 2) === 0) {
      hooks.onFactor?.(d + 2);
      hooks.onResult?.(false);
      return false;
    }
  }
  hooks.onResult?.(true);
  return true;
}
