// =============================================================================
// 去重子集 · 纯算法实现
// 排序 + 回溯 + 同层去重。
// =============================================================================
export interface BtSubsetsUniqueHooks {
  onPick?: (index: number, current: number[]) => void;
  onSkip?: (index: number) => void;
  onEmit?: (subset: number[]) => void;
}

export function btSubsetsUnique(nums: number[], hooks: BtSubsetsUniqueHooks = {}): number[][] {
  const sorted = [...nums].sort((a, b) => a - b);
  const result: number[][] = [];
  const path: number[] = [];

  const dfs = (start: number): void => {
    const snapshot = [...path];
    result.push(snapshot);
    hooks.onEmit?.(snapshot);
    for (let i = start; i < sorted.length; i++) {
      if (i > start && sorted[i] === sorted[i - 1]) {
        hooks.onSkip?.(i);
        continue;
      }
      path.push(sorted[i]!);
      hooks.onPick?.(i, path);
      dfs(i + 1);
      path.pop();
    }
  };

  dfs(0);
  return result;
}
