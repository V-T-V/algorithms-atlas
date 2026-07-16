// =============================================================================
// 阿克曼函数（Ackermann）· 纯算法实现
// 经典双递归（nested recursion），增长极快，是「可计算但非原始递归」的标志函数。
//   A(0, n)   = n + 1
//   A(m, 0)   = A(m-1, 1)            （m > 0）
//   A(m, n)   = A(m-1, A(m, n-1))    （m, n > 0，注意内层递归嵌套在参数里）
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每次调用与返回。
// =============================================================================

export interface AckermannStats {
  /** 总调用次数。 */
  calls: number;
  /** 最大递归深度。 */
  maxDepth: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface AckermannHooks {
  /** 进入 A(m, n)。 */
  onCall?: (m: number, n: number, depth: number) => void;
  /** 从 A(m, n) 返回值 val。 */
  onReturn?: (m: number, n: number, val: number, depth: number) => void;
}

/**
 * 阿克曼函数（朴素递归实现），同时返回结果与统计。
 *
 * 注意：A(m,n) 增长远快于指数。A(4,2) 已是 19729 位十进制数；
 * A(4,3) 以上实际上无法在合理时间内算出。请对 m ≤ 3 使用。
 *
 * @param m 第一参数（非负整数）
 * @param n 第二参数（非负整数）
 * @param hooks 可选事件钩子
 * @returns { value, stats }
 */
export function ackermannWithStats(
  m: number,
  n: number,
  hooks: AckermannHooks = {},
): { value: number; stats: AckermannStats } {
  if (!Number.isInteger(m) || m < 0 || !Number.isInteger(n) || n < 0) {
    throw new RangeError(`ackermann 要求非负整数参数，收到 (${m}, ${n})`);
  }
  const stats: AckermannStats = { calls: 0, maxDepth: 0 };
  const solve = (mm: number, nn: number, depth: number): number => {
    stats.calls++;
    stats.maxDepth = Math.max(stats.maxDepth, depth);
    hooks.onCall?.(mm, nn, depth);
    let v: number;
    if (mm === 0) {
      v = nn + 1;
    } else if (nn === 0) {
      v = solve(mm - 1, 1, depth + 1);
    } else {
      const inner = solve(mm, nn - 1, depth + 1);
      v = solve(mm - 1, inner, depth + 1);
    }
    hooks.onReturn?.(mm, nn, v, depth);
    return v;
  };
  const value = solve(m, n, 0);
  return { value, stats };
}

/**
 * 阿克曼函数（朴素递归），仅返回结果。
 * @param m 第一参数（非负整数）
 * @param n 第二参数（非负整数）
 * @param hooks 可选事件钩子
 */
export function ackermann(m: number, n: number, hooks: AckermannHooks = {}): number {
  return ackermannWithStats(m, n, hooks).value;
}
