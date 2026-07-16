// =============================================================================
// 组合目标和 · 纯算法实现
// 候选为互不相同的正整数，每个可无限次使用。回溯 + 剪枝。
// =============================================================================
export interface BtCombineTargetHooks {
  onPick?: (value: number) => void;
  onUnpick?: (value: number) => void;
  onCombo?: (combo: number[], remaining: number) => void;
}

export function btCombineTarget(
  candidates: readonly number[],
  target: number,
  hooks: BtCombineTargetHooks = {},
): number[][] {
  const sorted = [...candidates].sort((a, b) => a - b);
  const result: number[][] = [];
  const combo: number[] = [];

  const backtrack = (start: number, remaining: number): void => {
    if (remaining === 0) {
      const snap = [...combo];
      result.push(snap);
      hooks.onCombo?.(snap, 0);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      const v = sorted[i]!;
      if (v > remaining) break; // 剪枝
      hooks.onPick?.(v);
      combo.push(v);
      backtrack(i, remaining - v); // 同一元素可重复使用
      combo.pop();
      hooks.onUnpick?.(v);
    }
  };

  backtrack(0, target);
  return result;
}
