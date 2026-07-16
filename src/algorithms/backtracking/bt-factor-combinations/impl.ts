// =============================================================================
// 因数组合 · 纯算法实现 (LeetCode 254)
// 列出 n 的所有「≥2 因数升序乘积分解」组合（不含 [n] 本身）。
// =============================================================================
export interface BtFactorCombinationsHooks {
  onPick?: (factor: number) => void;
  onUnpick?: (factor: number) => void;
  onCombo?: (combo: number[]) => void;
}

export function btFactorCombinations(n: number, hooks: BtFactorCombinationsHooks = {}): number[][] {
  const result: number[][] = [];
  const combo: number[] = [];

  const backtrack = (remaining: number, start: number): void => {
    // i*i <= remaining 保证因数升序，避免重复
    for (let i = start; i * i <= remaining; i++) {
      if (remaining % i === 0) {
        const other = remaining / i;
        // i 是当前最小因数
        hooks.onPick?.(i);
        combo.push(i);
        // 收集：[i, remaining/i]
        const snap1 = [...combo, other];
        result.push(snap1);
        hooks.onCombo?.(snap1);
        // 继续分解 other（要求 other 的最小因数 ≥ i）
        backtrack(other, i);
        combo.pop();
        hooks.onUnpick?.(i);
      }
    }
  };

  backtrack(n, 2);
  return result;
}
