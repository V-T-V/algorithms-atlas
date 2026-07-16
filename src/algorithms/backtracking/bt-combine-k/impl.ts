// =============================================================================
// C(n,k) 组合 · 纯算法实现
// =============================================================================
export interface BtCombineKHooks {
  onPick?: (value: number, path: number[]) => void;
  onEmit?: (combo: number[]) => void;
}

export function btCombineK(n: number, k: number, hooks: BtCombineKHooks = {}): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  const dfs = (start: number): void => {
    if (path.length === k) {
      const snap = [...path];
      result.push(snap);
      hooks.onEmit?.(snap);
      return;
    }
    // 剪枝：剩余不足则停止
    for (let v = start; v <= n - (k - path.length) + 1; v++) {
      path.push(v);
      hooks.onPick?.(v, path);
      dfs(v + 1);
      path.pop();
    }
  };

  dfs(1);
  return result;
}
