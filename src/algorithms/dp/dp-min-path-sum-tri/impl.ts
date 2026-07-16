// =============================================================================
// 三角形最小路径和 · 纯算法实现
// =============================================================================

export interface TriPathHooks {
  onRow?: (rowIdx: number, dp: number[]) => void;
  onDone?: (minSum: number) => void;
}

export function triangleMinPath(
  triangle: ReadonlyArray<readonly number[]>,
  hooks: TriPathHooks = {},
): number {
  if (triangle.length === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  const dp = [...triangle[triangle.length - 1]!];
  for (let i = triangle.length - 2; i >= 0; i--) {
    const row = triangle[i]!;
    for (let j = 0; j < row.length; j++) {
      dp[j] = row[j]! + Math.min(dp[j]!, dp[j + 1]!);
    }
    hooks.onRow?.(i, [...dp]);
  }
  const ans = dp[0]!;
  hooks.onDone?.(ans);
  return ans;
}
