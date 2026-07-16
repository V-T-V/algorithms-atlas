// =============================================================================
// 地下城游戏 · 逆向 DP
// =============================================================================

export interface DungeonHooks {
  onCell?: (i: number, j: number, need: number) => void;
  onDone?: (initialHp: number) => void;
}

export function calculateMinimumHP(
  dungeon: readonly (readonly number[])[],
  hooks: DungeonHooks = {},
): number {
  const m = dungeon.length;
  const n = dungeon[0]!.length;
  const INF = Number.POSITIVE_INFINITY;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(INF));
  dp[m]![n - 1] = 1;
  dp[m - 1]![n] = 1;
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const need = Math.min(dp[i + 1]![j]!, dp[i]![j + 1]!) - dungeon[i]![j]!;
      dp[i]![j] = Math.max(1, need);
      hooks.onCell?.(i, j, dp[i]![j]!);
    }
  }
  hooks.onDone?.(dp[0]![0]!);
  return dp[0]![0]!;
}
