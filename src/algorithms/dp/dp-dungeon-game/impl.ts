// =============================================================================
// 地下城游戏 · 纯算法实现
// =============================================================================

export interface DungeonHooks {
  onCell?: (i: number, j: number, need: number) => void;
  onDone?: (initialHp: number) => void;
}

export function dungeonGame(
  dungeon: ReadonlyArray<readonly number[]>,
  hooks: DungeonHooks = {},
): number {
  const m = dungeon.length;
  if (m === 0) {
    hooks.onDone?.(1);
    return 1;
  }
  const n = dungeon[0]!.length;
  const INF = Number.POSITIVE_INFINITY;
  const dp = new Array<number>(n + 1).fill(INF);
  dp[n - 1] = 1; // 右下角右下方虚拟 = 1
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const need = Math.max(1, Math.min(dp[j]!, dp[j + 1]!) - dungeon[i]![j]!);
      dp[j] = need;
      hooks.onCell?.(i, j, need);
    }
  }
  const ans = dp[0]!;
  hooks.onDone?.(ans);
  return ans;
}
