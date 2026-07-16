// =============================================================================
// McCarthy 91 函数 · 纯算法实现
// John McCarthy 设计的递归「反直觉」函数：
//   M(n) = n - 10,                   n > 100
//   M(n) = M(M(n + 11)),             n ≤ 100
// 神奇之处：对任意 n ≤ 100，M(n) 恒等于 91。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每次调用与返回。
// =============================================================================

export interface MccarthyStats {
  /** 总调用次数。 */
  calls: number;
  /** 最大递归深度。 */
  maxDepth: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MccarthyHooks {
  /** 进入 M(n)。 */
  onCall?: (n: number, depth: number) => void;
  /** 从 M(n) 返回值 val。 */
  onReturn?: (n: number, val: number, depth: number) => void;
  /** 命中 n > 100 分支（直接返回 n-10）。 */
  onBase?: (n: number, val: number) => void;
}

/**
 * McCarthy 91 函数（朴素递归实现）。
 *
 * @param n 输入整数
 * @param hooks 可选事件钩子
 * @returns M(n)
 */
export function mccarthy91(n: number, hooks: MccarthyHooks = {}): number {
  return mccarthy91WithStats(n, hooks).value;
}

/**
 * McCarthy 91 函数，同时返回结果与统计（调用次数、最大深度）。
 */
export function mccarthy91WithStats(
  n: number,
  hooks: MccarthyHooks = {},
): { value: number; stats: MccarthyStats } {
  if (!Number.isInteger(n)) {
    throw new RangeError(`mccarthy91 要求整数，收到 ${n}`);
  }
  const stats: MccarthyStats = { calls: 0, maxDepth: 0 };
  const solve = (nn: number, depth: number): number => {
    stats.calls++;
    stats.maxDepth = Math.max(stats.maxDepth, depth);
    hooks.onCall?.(nn, depth);
    let v: number;
    if (nn > 100) {
      v = nn - 10;
      hooks.onBase?.(nn, v);
    } else {
      const inner = solve(nn + 11, depth + 1);
      v = solve(inner, depth + 1);
    }
    hooks.onReturn?.(nn, v, depth);
    return v;
  };
  const value = solve(n, 0);
  return { value, stats };
}

/**
 * 「不动点」版（非递归）：直观解释 M(n)=91 的闭式。
 * n > 100 时 M(n) = n-10；n ≤ 100 时 M(n) = 91。
 * 用于验证递归版的正确性。
 */
export function mccarthy91ClosedForm(n: number): number {
  if (!Number.isInteger(n)) {
    throw new RangeError(`mccarthy91ClosedForm 要求整数，收到 ${n}`);
  }
  return n > 100 ? n - 10 : 91;
}
