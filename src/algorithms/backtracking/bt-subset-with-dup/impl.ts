// =============================================================================
// Subsets II · 纯算法实现
// 含重复元素的子集枚举。先排序，回溯时同一层跳过相邻重复元素去重。
// =============================================================================

/** 事件钩子。 */
export interface BtSubsetWithDupHooks {
  onDecide?: (index: number, include: boolean) => void;
  onBacktrack?: (index: number, include: boolean) => void;
  onSubset?: (subset: number[]) => void;
  onSkipDup?: (index: number) => void;
}

/**
 * 枚举含重复元素数组的所有去重子集。
 * @param arr 源数组（会被克隆排序）
 */
export function btSubsetWithDup(
  arr: readonly number[],
  hooks: BtSubsetWithDupHooks = {},
): number[][] {
  const sorted = [...arr].sort((a, b) => a - b);
  const result: number[][] = [];
  const chosen: number[] = [];

  const backtrack = (index: number): void => {
    if (index === sorted.length) {
      const snap = [...chosen];
      result.push(snap);
      hooks.onSubset?.(snap);
      return;
    }
    // 选 index
    hooks.onDecide?.(index, true);
    chosen.push(sorted[index]!);
    backtrack(index + 1);
    chosen.pop();
    hooks.onBacktrack?.(index, true);

    // 不选 index：跳过所有与 sorted[index] 相同的后续元素（去重）
    const skipVal = sorted[index]!;
    let skip = index + 1;
    while (skip < sorted.length && sorted[skip] === skipVal) {
      hooks.onSkipDup?.(skip);
      skip++;
    }
    if (skip > index + 1) {
      hooks.onBacktrack?.(skip - 1, false);
    }
    backtrack(skip);
  };

  backtrack(0);
  return result;
}
