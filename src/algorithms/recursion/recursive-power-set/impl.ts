// 递归生成幂集 · 纯算法实现

/** 事件钩子（元素取自 0..n-1 的下标子集）。 */
export interface PowerSetHooks {
  /** 决定是否选取元素 i：taken = true 表示含。 */
  onDecide?: (i: number, taken: boolean, cur: number[], depth: number) => void;
  /** 命中一个完整子集。 */
  onSolution?: (cur: number[]) => void;
}

/**
 * 递归生成 n 个元素的幂集（所有下标子集）。
 * @param n 元素个数（元素编号 0..n-1）
 * @returns 所有子集（每个子集是下标数组）
 */
export function generatePowerSet(n: number, hooks: PowerSetHooks = {}): number[][] {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('n must be a non-negative integer');
  }
  const result: number[][] = [];
  const cur: number[] = [];

  const dfs = (i: number, depth: number): void => {
    if (i === n) {
      hooks.onSolution?.([...cur]);
      result.push([...cur]);
      return;
    }
    // 不选 i
    hooks.onDecide?.(i, false, [...cur], depth);
    dfs(i + 1, depth + 1);
    // 选 i
    cur.push(i);
    hooks.onDecide?.(i, true, [...cur], depth);
    dfs(i + 1, depth + 1);
    cur.pop();
  };

  dfs(0, 0);
  return result;
}
