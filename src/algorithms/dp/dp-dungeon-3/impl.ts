// =============================================================================
// 地下城游戏 · 纯算法实现
// =============================================================================
export interface DungeonHooks {
  onCell?: (i: number, j: number, need: number) => void;
  onDone?: (initial: number) => void;
}

export function calculateMinimumHP(
  dungeon: readonly (readonly number[])[],
  hooks: DungeonHooks = {},
): number {
  const m = dungeon.length;
  if (m === 0) {
    hooks.onDone?.(1);
    return 1;
  }
  const n = dungeon[0]!.length;
  const dp = new Array<number>(n + 1).fill(Number.POSITIVE_INFINITY);
  dp[n - 1] = 1;
  for (let i = m - 1; i >= 0; i--) {
    const cur = new Array<number>(n + 1).fill(Number.POSITIVE_INFINITY);
    for (let j = n - 1; j >= 0; j--) {
      const need = Math.min(cur[j + 1]!, dp[j]!) - dungeon[i]![j]!;
      cur[j] = Math.max(1, need);
      hooks.onCell?.(i, j, cur[j]!);
    }
    for (let j = 0; j <= n; j++) dp[j] = cur[j]!;
  }
  hooks.onDone?.(dp[0]!);
  return dp[0]!;
}
