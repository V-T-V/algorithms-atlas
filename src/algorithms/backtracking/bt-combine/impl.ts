// =============================================================================
// 组合 C(n,k) · 纯算法实现
// 从 1..n 中选 k 个数的所有组合。维护 start 避免重复。
// =============================================================================
export interface BtCombineHooks {
  onPick?: (value: number, pos: number) => void;
  onUnpick?: (value: number, pos: number) => void;
  onCombo?: (combo: number[]) => void;
}

export function btCombine(n: number, k: number, hooks: BtCombineHooks = {}): number[][] {
  const result: number[][] = [];
  const combo: number[] = [];

  const backtrack = (start: number): void => {
    if (combo.length === k) {
      const snap = [...combo];
      result.push(snap);
      hooks.onCombo?.(snap);
      return;
    }
    // 剪枝：剩余元素不足以填满 combo
    for (let i = start; i <= n - (k - combo.length) + 1; i++) {
      hooks.onPick?.(i, combo.length);
      combo.push(i);
      backtrack(i + 1);
      combo.pop();
      hooks.onUnpick?.(i, combo.length);
    }
  };

  backtrack(1);
  return result;
}
