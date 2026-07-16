// 递归生成 C(n,k) 组合 · 纯算法实现

/** 事件钩子（元素取自 0..n-1 的下标组合）。 */
export interface CombinationsHooks {
  /** 把下标 idx 选入当前组合 cur。 */
  onPick?: (cur: number[], idx: number, depth: number) => void;
  /** 弹出当前组合末位（回溯）。 */
  onBacktrack?: (cur: number[], idx: number, depth: number) => void;
  /** 命中一组完整解。 */
  onSolution?: (cur: number[]) => void;
}

/**
 * 递归生成从 n 个元素中选 k 个的所有下标组合（0..n-1）。
 * @returns 所有组合（每个组合是下标数组）
 */
export function generateCombinations(
  n: number,
  k: number,
  hooks: CombinationsHooks = {},
): number[][] {
  if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0) {
    throw new RangeError('n and k must be non-negative integers');
  }
  const result: number[][] = [];
  if (k > n) return result;
  const cur: number[] = [];

  const dfs = (start: number, depth: number): void => {
    if (cur.length === k) {
      hooks.onSolution?.([...cur]);
      result.push([...cur]);
      return;
    }
    // 剪枝：剩余元素不足以填满
    if (start >= n || n - start < k - cur.length) return;
    for (let i = start; i < n; i++) {
      hooks.onPick?.([...cur], i, depth);
      cur.push(i);
      dfs(i + 1, depth + 1);
      const popped = cur.pop()!;
      hooks.onBacktrack?.([...cur], popped, depth);
    }
  };

  dfs(0, 0);
  return result;
}

/** 组合数 C(n, k)。 */
export function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 0; i < k; i++) {
    r = (r * (n - i)) / (i + 1);
  }
  return Math.round(r);
}
