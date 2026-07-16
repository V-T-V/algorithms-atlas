// 位掩码生成组合 · 实现

export interface CombHooks {
  onCombination?: (comb: number[]) => void;
  onPick?: (index: number, value: number) => void;
}

/** 递归回溯生成 C(n,k)。 */
export function combinationsBitmask(nums: number[], k: number, hooks: CombHooks = {}): number[][] {
  const result: number[][] = [];
  const cur: number[] = [];
  const n = nums.length;

  const dfs = (start: number): void => {
    if (cur.length === k) {
      result.push([...cur]);
      hooks.onCombination?.([...cur]);
      return;
    }
    // 剪枝：剩余元素不足时停止
    const need = k - cur.length;
    for (let i = start; i <= n - need; i++) {
      cur.push(nums[i]!);
      hooks.onPick?.(i, nums[i]!);
      dfs(i + 1);
      cur.pop();
    }
  };

  if (k >= 0 && k <= n) dfs(0);
  return result;
}

/** 位掩码迭代版：枚举所有恰好有 k 个 1 的 n 位掩码。 */
export function combinationsBitmaskIter(nums: number[], k: number): number[][] {
  const n = nums.length;
  const result: number[][] = [];
  if (k < 0 || k > n) return result;
  // Gosper's hack 枚举 popcount=k 的掩码
  if (k === 0) return [[]];
  let mask = (1 << k) - 1;
  const limit = 1 << n;
  while (mask < limit) {
    const comb: number[] = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) comb.push(nums[i]!);
    result.push(comb);
    // Gosper: 下一个相同 popcount 的掩码
    const c = mask & -mask;
    const r = mask + c;
    mask = (((r ^ mask) >> 2) / c) | r;
  }
  return result;
}
