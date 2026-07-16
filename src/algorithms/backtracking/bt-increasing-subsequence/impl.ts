// =============================================================================
// 递增子序列 · 纯算法实现 (LeetCode 491)
// 保持原序回溯，每层用 set 去重，仅当当前值 ≥ 子序列末尾才选入。
// =============================================================================
export interface BtIncreasingSubsequenceHooks {
  onPick?: (value: number) => void;
  onUnpick?: (value: number) => void;
  onResult?: (seq: number[]) => void;
}

export function btIncreasingSubsequence(
  nums: readonly number[],
  hooks: BtIncreasingSubsequenceHooks = {},
): number[][] {
  const result: number[][] = [];
  const seq: number[] = [];

  const backtrack = (start: number): void => {
    if (seq.length >= 2) {
      const snap = [...seq];
      result.push(snap);
      hooks.onResult?.(snap);
    }
    const used = new Set<number>();
    for (let i = start; i < nums.length; i++) {
      const v = nums[i]!;
      if (used.has(v)) continue; // 本层去重
      if (seq.length > 0 && v < seq[seq.length - 1]!) continue; // 非递减约束
      used.add(v);
      hooks.onPick?.(v);
      seq.push(v);
      backtrack(i + 1);
      seq.pop();
      hooks.onUnpick?.(v);
    }
  };

  backtrack(0);
  return result;
}
